// Copyright 2026 SpinalCom - www.spinalcom.com
// Domaine Drive : lecture d'un dossier et opérations sur les fichiers (DR-02 à DR-12, DR-VER).
// TypeScript pur, sans Svelte : utilisé par l'application et par les tests de graphe (Node).
// Les classes du connecteur sont injectées (`Classes`) pour fonctionner dans les deux environnements.
//
// Corrections voulues par rapport au Drive historique (déclarées dans tests/graphe) :
// - collision de nom : « Nom (2) », « Nom (3) »… pour tous les points d'entrée (l'historique : « Nom(0) » ou rien) ;
// - noms Unicode acceptés (l'historique refusait les accents au renommage) ;
// - déplacement : ajout dans la cible AVANT le retrait de la source, refus des cycles ;
// - suppression multiple : chaque élément est traité (l'historique ne supprimait que le premier).

export interface Classes {
  Directory: new () => any;
  Path: new (file?: unknown, mimeType?: string) => any;
  Lst: new () => any;
  Ptr: new (m?: unknown) => any;
  Model: new () => any;
}

/** Types lisibles (02-ux §2.5). */
export type GenreFichier = 'dossier' | 'dossier-sync' | 'jumeau' | 'maquette' | 'document' | 'image' | 'lien' | 'config' | 'autre';

const EXT_MAQUETTE = /\.(rvt|ifc|nwd|nwc|dwg|dxf|rfa|fbx|obj|stp|step|skp|3ds|svf\.zip|zip)$/i;
const EXT_IMAGE = /\.(png|jpe?g|gif|webp|svg|bmp|tiff?)$/i;

export function genreDe(nom: string, modelType: string): GenreFichier {
  switch (modelType) {
    case 'Directory': return 'dossier';
    case 'Synchronized Directory': return 'dossier-sync';
    case 'Digital twin': return 'jumeau';
    case 'BIM Project': return 'maquette';
    case 'HttpPath': return 'lien';
    case 'SpinalBOSConfig': return 'config';
    case 'Path':
      if (EXT_MAQUETTE.test(nom)) return 'maquette';
      if (EXT_IMAGE.test(nom)) return 'image';
      return 'document';
    default: return 'autre';
  }
}

export const LIBELLE_GENRE: Record<GenreFichier, string> = {
  dossier: 'Dossier', 'dossier-sync': 'Dossier synchronisé', jumeau: 'Jumeau', maquette: 'Maquette', document: 'Document',
  image: 'Image', lien: 'Lien HTTP', config: 'Configuration BOS', autre: 'Autre',
};

/** États de conversion écrits par l'organ forge (organ/spinal-organ-forge/src/utils/fileVersionState.ts). */
export const ETATS_CONVERSION = [
  'Initialisation', 'Commande envoyée', 'Téléchargement par l’organ', 'Téléchargement terminé', 'Envoi à Forge', 'Envoi terminé',
  'En file d’attente', 'Conversion', 'Conversion terminée', 'Récupération', 'Prête', 'Échec', 'Archive svf.zip détectée', 'Décompression',
] as const;
/** Étape (0-5) affichée dans la frise : Envoi, Téléchargement, Forge, Conversion, Récupération, Prête. */
export function etapeConversion(etat: number): number {
  if (etat <= 1) return 0;
  if (etat <= 3 || etat === 12 || etat === 13) return 1;
  if (etat <= 6) return 2;
  if (etat <= 8) return 3;
  if (etat === 9) return 4;
  return 5;
}

/** Ligne du tableau : valeurs simples, recopiées du modèle (jamais de modèle dans $state). */
export interface Ligne {
  id: number;            // _server_id du File
  cible: number;         // _server_id pointé par _ptr (0 si pas encore attribué)
  nom: string;
  modelType: string;
  genre: GenreFichier;
  taille: number | null; // octets, pour un Path
  transfert: number | null; // 0..1 tant que le binaire n'est pas entièrement reçu par le hub
  creeLe: number | null;
  activite: { date: number; qui: string; action: string } | null;
  versions: boolean;
  supprimable: boolean;  // faux : dossier synchronisé, lien HTTP
}

const val = (m: any) => (m && typeof m.get === 'function' ? m.get() : undefined);

export function ligneDe(f: any): Ligne {
  const info = f._info ?? {};
  const modelType = String(val(info.model_type) ?? 'Inconnu');
  const nom = String(val(f.name) ?? '');
  const toUpload = Number(val(info.to_upload) ?? NaN);
  const remaining = Number(val(info.remaining) ?? NaN);
  const taille = Number.isFinite(toUpload) && toUpload > 0 ? toUpload : null;
  const transfert = taille && Number.isFinite(remaining) && remaining > 0 ? (toUpload - remaining) / toUpload : null;
  const creeLe = Number(val(f._created_at));
  return {
    id: f._server_id, cible: f._ptr?.data?.value ?? 0, nom, modelType, genre: genreDe(nom, modelType), taille, transfert,
    creeLe: Number.isFinite(creeLe) && creeLe > 0 ? creeLe : null, activite: null, versions: !!info.version,
    supprimable: modelType !== 'Synchronized Directory' && modelType !== 'HttpPath',
  };
}

export function lignesDe(dossier: any): Ligne[] {
  const out: Ligne[] = [];
  for (let i = 0; i < dossier.length; i++) out.push(ligneDe(dossier[i]));
  return out;
}

/** Caractères refusés dans un nom : séparateur de chemin et caractères de contrôle. */
const INTERDIT = /[\/\u0000-\u001f\u007f]/;

export function validerNom(nom: string): string | null {
  const n = nom.trim();
  if (!n) return 'Le nom ne peut pas être vide.';
  if (n.length > 255) return 'Le nom ne peut pas dépasser 255 caractères.';
  if (INTERDIT.test(n)) return 'Le nom ne peut pas contenir « / » ni de caractère de contrôle.';
  return null;
}

/** Premier nom libre : « Nom », puis « Nom (2) », « Nom (3) »… L'extension est conservée : « plan (2).pdf ». */
export function nomLibre(parent: { has(n: string): boolean }, nom: string): string {
  const base = nom.trim();
  if (!parent.has(base)) return base;
  const m = /^(.*?)(\.[^.\s]{1,8})?$/.exec(base)!;
  const racine = m[1] || base, ext = m[1] ? (m[2] ?? '') : '';
  for (let i = 2; ; i++) {
    const n = `${racine} (${i})${ext}`;
    if (!parent.has(n)) return n;
  }
}

/** Crée un dossier dans `parent` et renvoie le nom réellement utilisé (DR-05). */
export function creerDossier(C: Classes, parent: any, nom: string): string {
  const err = validerNom(nom);
  if (err) throw new Error(err);
  const final = nomLibre(parent, nom);
  parent.add_file(final, new C.Directory());
  return final;
}

/** Renomme (DR-07). Aucun changement : aucune écriture. Collision : refus. Renvoie l'ancien nom (pour « Annuler »). */
export function renommer(parent: any, fichier: any, nom: string): string | null {
  const err = validerNom(nom);
  if (err) throw new Error(err);
  const n = nom.trim();
  const ancien = String(val(fichier.name));
  if (n === ancien) return null;
  for (let i = 0; i < parent.length; i++)
    if (parent[i] !== fichier && val(parent[i].name) === n) throw new Error(`« ${n} » existe déjà dans ce dossier.`);
  fichier.name.set(n);
  return ancien;
}

/** Retire des fichiers d'un dossier (DR-09). Ignore (avec raison) les éléments non supprimables. */
export function supprimer(parent: any, fichiers: any[]): { retires: string[]; ignores: { nom: string; raison: string }[] } {
  const retires: string[] = [], ignores: { nom: string; raison: string }[] = [];
  for (const f of fichiers) {
    const l = ligneDe(f);
    if (!l.supprimable) { ignores.push({ nom: l.nom, raison: l.modelType === 'HttpPath' ? 'lien HTTP' : 'dossier synchronisé' }); continue; }
    const i = indexDe(parent, f);
    if (i < 0) { ignores.push({ nom: l.nom, raison: 'déjà retiré' }); continue; }
    parent.splice(i, 1);
    retires.push(l.nom);
  }
  return { retires, ignores };
}

function indexDe(parent: any, f: any): number {
  for (let i = 0; i < parent.length; i++) if (parent[i] === f || parent[i]._server_id === f._server_id) return i;
  return -1;
}

/**
 * Déplace des fichiers de `source` vers `cible` (DR-08). `cheminCible` : identifiants serveur des dossiers de la racine
 * jusqu'à la cible (inclus), pour refuser les cycles. L'ajout précède le retrait. Collision : « Nom (2) ».
 */
export function deplacer(source: any, cible: any, fichiers: any[], cheminCible: number[]):
  { deplaces: string[]; ignores: { nom: string; raison: string }[] } {
  const deplaces: string[] = [], ignores: { nom: string; raison: string }[] = [];
  if (source === cible || source._server_id === cible._server_id) {
    for (const f of fichiers) ignores.push({ nom: String(val(f.name)), raison: 'déjà dans ce dossier' });
    return { deplaces, ignores };
  }
  for (const f of fichiers) {
    const nom = String(val(f.name));
    const pointe = f._ptr?.data?.value;
    if (pointe && cheminCible.includes(pointe)) { ignores.push({ nom, raison: 'un dossier ne peut pas aller dans lui-même' }); continue; }
    if (!ligneDe(f).supprimable) { ignores.push({ nom, raison: 'dossier synchronisé ou lien : non déplaçable' }); continue; }
    const libre = nomLibre(cible, nom);
    if (libre !== nom) f.name.set(libre);
    cible.push(f);
    const i = indexDe(source, f);
    if (i >= 0) source.splice(i, 1);
    deplaces.push(libre);
  }
  return { deplaces, ignores };
}

/** Dépôt d'un fichier binaire (DR-06) : un Path dans un File. Renvoie le nom utilisé. */
export function deposer(C: Classes, parent: any, fichier: { name: string; size: number; type?: string }, nom = fichier.name): string {
  const final = nomLibre(parent, nom);
  const p = new C.Path(fichier, fichier.type || undefined);
  parent.add_file(final, p, { model_type: 'Path' });
  return final;
}

/** Ajoute une entrée au journal d'un fichier (même format que SpinalDrive_App._pushLog ; purge > 2 ans). */
export function journaliser(C: Classes, fichier: any, qui: string, action: string, maintenant = Date.now()) {
  const info = fichier._info;
  if (!info) return;
  const pousser = (logs: any) => {
    const limite = new Date(maintenant); limite.setFullYear(limite.getFullYear() - 2);
    for (let i = logs.length - 1; i >= 0; i--) if (val(logs[i].date) < limite.getTime()) logs.splice(i, 1);
    logs.push({ date: maintenant, name: qui, action });
  };
  if (!info.log) { const logs = new C.Lst(); info.add_attr({ log: new C.Ptr(logs) }); pousser(logs); return; }
  const cible = info.log.data?.model;
  if (cible) pousser(cible); else info.log.load((m: any) => m && pousser(m));
}

export interface EntreeJournal { date: number; qui: string; action: string }
export function lireJournal(logs: any): EntreeJournal[] {
  const out: EntreeJournal[] = [];
  for (let i = 0; i < (logs?.length ?? 0); i++) out.push({ date: Number(val(logs[i].date)), qui: String(val(logs[i].name) ?? ''), action: String(val(logs[i].action) ?? '') });
  return out.sort((a, b) => b.date - a.date);
}

/** Libellés français des actions historiques du journal. */
export function actionLisible(a: string): string {
  const t: Record<string, string> = { '1st visit': 'Première visite', upload: 'Dépôt', rename: 'Renommage', download: 'Téléchargement', share: 'Partage', move: 'Déplacement', delete: 'Suppression', 'new version': 'Nouvelle version' };
  return t[a] ?? a;
}

export interface Version { numero: number; date: number; description: string; nomFichier: string; etat: number; courante: boolean; cible: number }
export function lireVersions(conteneur: any): Version[] {
  const out: Version[] = [];
  const lst = conteneur?.versionLst;
  const courante = Number(val(conteneur?.currentID));
  for (let i = 0; i < (lst?.length ?? 0); i++) {
    const v = lst[i];
    const n = Number(val(v.versionId));
    out.push({ numero: n, date: Number(val(v.date)), description: String(val(v.description) ?? ''), nomFichier: String(val(v.filename) ?? ''),
      etat: Number(val(v.state) ?? -1), courante: n === courante, cible: v.ptr?.data?.value ?? 0 });
  }
  return out.sort((a, b) => b.numero - a.numero);
}

/** Drapeaux de droits du hub (spinalCore.right_flag). */
export const DROITS = { lecture: 4, ecriture: 2, partage: 1 } as const;
export function drapeau(d: { lecture: boolean; ecriture: boolean; partage: boolean }): number {
  return (d.lecture ? DROITS.lecture : 0) | (d.ecriture ? DROITS.ecriture : 0) | (d.partage ? DROITS.partage : 0);
}
