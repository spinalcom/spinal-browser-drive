// Copyright 2026 SpinalCom - www.spinalcom.com
// Aplatissement d'un arbre chargé à la demande, et navigation clavier APG (motif « Tree View »). Pur, testé par Vitest.

export interface NoeudArbre {
  id: string;
  label: string;
  /** undefined = enfants pas encore chargés ; [] = feuille. */
  enfants?: NoeudArbre[];
  aEnfants?: boolean;
}
export interface LigneArbre { noeud: NoeudArbre; niveau: number; parent: string | null; ouvert: boolean; feuille: boolean; position: number; taille: number }

export function aplatir(racines: NoeudArbre[], ouverts: Set<string>, filtre?: (n: NoeudArbre) => boolean): LigneArbre[] {
  const out: LigneArbre[] = [];
  const garder = new Map<string, boolean>();
  // Avec un filtre : un nœud est gardé s'il correspond ou si un descendant chargé correspond ; ses ancêtres sont ouverts.
  const correspond = (n: NoeudArbre): boolean => {
    if (!filtre) return true;
    const c = garder.get(n.id);
    if (c !== undefined) return c;
    const r = filtre(n) || (n.enfants ?? []).some(correspond);
    garder.set(n.id, r);
    return r;
  };
  const visiter = (liste: NoeudArbre[], niveau: number, parent: string | null) => {
    const vus = liste.filter(correspond);
    vus.forEach((n, i) => {
      const feuille = n.enfants ? n.enfants.length === 0 : !n.aEnfants;
      const ouvert = !feuille && (ouverts.has(n.id) || (!!filtre && (n.enfants ?? []).some(correspond)));
      out.push({ noeud: n, niveau, parent, ouvert, feuille, position: i + 1, taille: vus.length });
      if (ouvert && n.enfants) visiter(n.enfants, niveau + 1, n.id);
    });
  };
  visiter(racines, 1, null);
  return out;
}

export type Commande = { type: 'focus'; index: number } | { type: 'ouvrir'; id: string } | { type: 'fermer'; id: string } | { type: 'activer'; id: string } | null;

/** Touche → commande (APG) : ↑ ↓ début fin, → ouvre puis descend, ← ferme puis remonte au parent, Entrée active. */
export function touche(lignes: LigneArbre[], courant: number, cle: string): Commande {
  const l = lignes[courant];
  if (!l) return lignes.length ? { type: 'focus', index: 0 } : null;
  switch (cle) {
    case 'ArrowDown': return courant < lignes.length - 1 ? { type: 'focus', index: courant + 1 } : null;
    case 'ArrowUp': return courant > 0 ? { type: 'focus', index: courant - 1 } : null;
    case 'Home': return { type: 'focus', index: 0 };
    case 'End': return { type: 'focus', index: lignes.length - 1 };
    case 'ArrowRight':
      if (l.feuille) return null;
      return l.ouvert ? (lignes[courant + 1]?.parent === l.noeud.id ? { type: 'focus', index: courant + 1 } : null) : { type: 'ouvrir', id: l.noeud.id };
    case 'ArrowLeft':
      if (l.ouvert) return { type: 'fermer', id: l.noeud.id };
      if (l.parent) { const p = lignes.findIndex((x) => x.noeud.id === l.parent); return p >= 0 ? { type: 'focus', index: p } : null; }
      return null;
    case 'Enter': case ' ': return { type: 'activer', id: l.noeud.id };
    default: return null;
  }
}
