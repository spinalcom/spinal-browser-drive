// Copyright 2026 SpinalCom - www.spinalcom.com
// Session hub (01-architecture §3.2). Identifiants en mémoire et dans sessionStorage (onglet courant),
// jamais dans localStorage (rupture voulue avec spinalhome_cfg). Erreurs distinguées (DR-01).
import { connecteur, type Modele } from './connecteur';

export type ErreurConnexion = 'identifiants' | 'pas-admin' | 'hub-injoignable' | 'vide';

export class EchecConnexion extends Error {
  constructor(public code: ErreurConnexion, message: string) { super(message); }
}

interface Identite { utilisateur: string; id: number; admin: boolean; version: string | null }

const CLE = 'sc-session';

export const session = $state<{ etat: 'deconnecte' | 'connexion' | 'connecte'; identite: Identite | null; perdue: boolean }>({
  etat: 'deconnecte', identite: null, perdue: false,
});

let conn: any = null;
let motDePasse = '';

async function demanderId(route: 'get_user_id' | 'get_admin_id', u: string, p: string): Promise<{ id: number; version: string | null }> {
  let r: Response;
  try {
    r = await fetch(`/${route}?u=${encodeURIComponent(u)}&p=${encodeURIComponent(p)}`);
  } catch {
    throw new EchecConnexion('hub-injoignable', 'Le hub ne répond pas. Vérifiez qu’il est démarré, puis réessayez.');
  }
  // Hub 4.1+ : 401/403 = identifiants refusés (les versions plus anciennes renvoient « -1 » en 200).
  if (r.status === 401 || r.status === 403) return { id: -1, version: null };
  if (!r.ok) throw new EchecConnexion('hub-injoignable', `Le hub a répondu ${r.status}. Réessayez dans un instant.`);
  const id = parseInt(await r.text(), 10);
  const v = /v(\d+\.\d+\.\d+)/i.exec(r.headers.get('powerby') ?? '');
  return { id, version: v ? v[1] : null };
}

/** Connexion. admin=true demande les droits d'administration du hub (Admin), sinon accès utilisateur (Drive). */
export async function connecter(utilisateur: string, mdp: string, admin: boolean): Promise<void> {
  const u = utilisateur.trim();
  if (!u || !mdp) throw new EchecConnexion('vide', 'Saisissez votre identifiant et votre mot de passe.');
  session.etat = 'connexion';
  try {
    const user = await demanderId('get_user_id', u, mdp);
    if (user.id === -1 || Number.isNaN(user.id)) throw new EchecConnexion('identifiants', 'Identifiant ou mot de passe incorrect.');
    let estAdmin = false;
    const a = await demanderId('get_admin_id', u, mdp).catch(() => ({ id: -1, version: null }));
    estAdmin = a.id !== -1 && !Number.isNaN(a.id);
    if (admin && !estAdmin)
      throw new EchecConnexion('pas-admin', 'Ce compte n’est pas administrateur du hub. Le mot de passe est correct : décochez « Administration » pour ouvrir le Drive.');
    const { spinalCore, FileSystem } = await connecteur();
    // Remplace la fenêtre anglaise du connecteur par notre bandeau (02-ux §7).
    (FileSystem as any).onConnectionError = (code: number) => { session.perdue = code !== 0; };
    conn = spinalCore.connect(`${location.protocol}//${user.id}:${encodeURIComponent(mdp)}@${location.host}/`);
    motDePasse = mdp;
    session.identite = { utilisateur: u, id: user.id, admin: estAdmin, version: user.version };
    session.etat = 'connecte';
    try { sessionStorage.setItem(CLE, JSON.stringify({ u, p: mdp, admin })); } catch {}
  } catch (e) {
    session.etat = 'deconnecte';
    throw e;
  }
}

/** Reprise après rechargement (sessionStorage de l'onglet). */
export async function reprendre(): Promise<boolean> {
  if (session.etat === 'connecte') return true;
  let s: { u: string; p: string; admin: boolean } | null = null;
  try { s = JSON.parse(sessionStorage.getItem(CLE) ?? 'null'); } catch {}
  if (!s) return false;
  try { await connecter(s.u, s.p, s.admin); return true; } catch { return false; }
}

export function deconnecter() {
  try { sessionStorage.removeItem(CLE); } catch {}
  // Le connecteur n'a pas de fermeture propre : on recharge pour vider son état global (ST-SOC-05).
  location.href = `${location.pathname.replace(/\/studio\/.*/, '/studio/connexion')}`;
}

export function fs(): any {
  if (!conn) throw new Error('Non connecté au hub');
  return conn;
}

export function estAdmin(): boolean { return !!session.identite?.admin; }

/** Charge un chemin du hub. */
export async function charger<T = Modele>(chemin: string): Promise<T> {
  const { spinalCore } = await connecteur();
  return new Promise((ok, ko) => spinalCore.load(fs(), chemin, (m: unknown) => ok(m as T), () => ko(new Error(`Impossible de charger ${chemin}`))));
}

const cachePtr = new Map<number, Promise<Modele>>();
/** Charge la cible d'un Ptr (ou d'un File). Mis en cache par identifiant serveur. */
export async function chargerPtr(ptrOuFichier: Modele): Promise<Modele> {
  const { FileSystem } = await connecteur();
  const ptr = ptrOuFichier.constructor.name === 'File' ? ptrOuFichier._ptr : ptrOuFichier;
  const id: number = ptr.data.value;
  if (!id && ptr.data.model) return ptr.data.model;
  if (!id) throw new Error('Pointeur vide');
  const deja = (FileSystem as any)._objects[id];
  if (deja) return deja;
  let p = cachePtr.get(id);
  if (!p) {
    p = new Promise((ok, ko) => ptr.load((m: Modele) => (m ? ok(m) : ko(new Error(`Objet ${id} introuvable`)))));
    p.catch(() => cachePtr.delete(id));
    cachePtr.set(id, p);
  }
  return p;
}

/** Objet déjà chargé, par identifiant serveur. */
export async function objet(id: number): Promise<Modele | undefined> {
  const { FileSystem } = await connecteur();
  return (FileSystem as any)._objects[id];
}

/** Changement de mot de passe (route historique du hub). */
export async function changerMotDePasse(ancien: string, nouveau: string): Promise<void> {
  const u = session.identite?.utilisateur;
  if (!u) throw new Error('Non connecté');
  const r = await fetch(`/get_change_user_password?e=${encodeURIComponent(u)}&op=${encodeURIComponent(ancien)}&np=${encodeURIComponent(nouveau)}`);
  const t = (await r.text()).trim();
  if (!r.ok || t === '-1' || /error/i.test(t)) throw new Error('Le hub a refusé le changement : ancien mot de passe incorrect ?');
  motDePasse = nouveau;
  try { const s = JSON.parse(sessionStorage.getItem(CLE) ?? 'null'); if (s) sessionStorage.setItem(CLE, JSON.stringify({ ...s, p: nouveau })); } catch {}
}
