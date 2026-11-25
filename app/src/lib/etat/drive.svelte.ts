// Copyright 2026 SpinalCom - www.spinalcom.com
// État du Drive : dossier courant (modèle hub) → lignes simples dans $state. Un seul abonnement au dossier ouvert,
// libéré au changement de dossier et à la fermeture (01-architecture §4).
import { charger, chargerPtr, session } from '$lib/hub/session.svelte';
import { connecteur, type Modele } from '$lib/hub/connecteur';
import { compteurs } from '$lib/hub/suivre.svelte';
import { lignesDe, lireJournal, type Ligne, type Classes } from '$lib/domaines/drive/fichiers';

export interface Segment { nom: string; id: number }

export class EtatDrive {
  /** Dossier ouvert (modèle Directory) : hors $state. */
  dossier: Modele | null = null;
  racine: Modele | null = null;
  chemin = $state<Segment[]>([]);
  lignes = $state.raw<Ligne[]>([]);
  charge = $state(true);
  erreur = $state<string | null>(null);
  selection = $state<number[]>([]);
  private lien: unknown = null;
  private prevu = 0;
  private visite = 0;
  C: Classes | null = null;

  /** Ouvre la racine de l'utilisateur, puis le chemin de noms donné (depuis l'URL). */
  async ouvrirChemin(noms: string[]) {
    this.charge = true;
    this.erreur = null;
    try {
      this.C ??= (await connecteur()) as unknown as Classes;
      const u = session.identite!.utilisateur;
      this.racine ??= await charger<Modele>(`/__users__/${u}`);
      let d = this.racine;
      const chemin: Segment[] = [{ nom: u, id: d._server_id }];
      for (const n of noms) {
        let f: Modele | null = null;
        for (let i = 0; i < d.length; i++) if (d[i].name.get() === n) { f = d[i]; break; }
        if (!f) throw new Error(`Le dossier « ${n} » n’existe plus dans « ${chemin[chemin.length - 1].nom} ».`);
        d = await chargerPtr(f);
        chemin.push({ nom: n, id: d._server_id });
      }
      this.brancher(d);
      this.chemin = chemin;
    } catch (e) {
      this.erreur = (e as Error).message;
      this.lignes = [];
    } finally {
      this.charge = false;
    }
  }

  private brancher(d: Modele) {
    this.debrancher();
    this.dossier = d;
    this.selection = [];
    this.visite++;
    const v = this.visite;
    const lire = () => { if (v === this.visite) { this.lignes = lignesDe(d); this.enrichir(v); } };
    lire();
    this.lien = d.bind(() => {
      if (this.prevu) return;
      this.prevu = requestAnimationFrame(() => { this.prevu = 0; lire(); });
    }, false);
    compteurs.liensActifs++;
  }

  /** Dernière activité de chaque ligne, lue dans son journal (chargé en arrière-plan, sans le créer). */
  private async enrichir(v: number) {
    const d = this.dossier;
    if (!d) return;
    const maj = new Map<number, Ligne['activite']>();
    const promesses: Promise<void>[] = [];
    for (let i = 0; i < d.length; i++) {
      const f = d[i];
      const log = f._info?.log;
      if (!log || !log.data?.value) continue;
      promesses.push(chargerPtr(log).then((logs) => {
        const j = lireJournal(logs);
        if (j[0]) maj.set(f._server_id, { date: j[0].date, qui: j[0].qui, action: j[0].action });
      }).catch(() => {}));
    }
    await Promise.all(promesses);
    if (v !== this.visite || !maj.size) return;
    this.lignes = this.lignes.map((l) => (maj.has(l.id) ? { ...l, activite: maj.get(l.id)! } : l));
  }

  debrancher() {
    if (this.dossier && this.lien) { this.dossier.unbind(this.lien); compteurs.liensActifs--; }
    cancelAnimationFrame(this.prevu);
    this.prevu = 0;
    this.lien = null;
    this.dossier = null;
  }

  fichier(id: number): Modele | null {
    const d = this.dossier;
    if (!d) return null;
    for (let i = 0; i < d.length; i++) if (d[i]._server_id === id) return d[i];
    return null;
  }
}
