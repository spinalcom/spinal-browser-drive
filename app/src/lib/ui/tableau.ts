// Copyright 2026 SpinalCom - www.spinalcom.com
// Tri des tableaux : stable, nombres et dates comparés comme tels, vides toujours en fin, texte français naturel.
const coll = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });

import type { Valeur } from './types';
export type { Valeur };
export function comparer(a: Valeur, b: Valeur): number {
  const vide = (v: Valeur) => v === null || v === undefined || v === '';
  if (vide(a) || vide(b)) return vide(a) === vide(b) ? 0 : vide(a) ? 1 : -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  return coll.compare(String(a), String(b));
}

export function trier<T>(lignes: T[], valeur: (t: T) => Valeur, sens: 'asc' | 'desc'): T[] {
  const s = sens === 'asc' ? 1 : -1;
  return lignes.map((t, i) => [t, i] as const)
    .sort(([a, i], [b, j]) => {
      const va = valeur(a), vb = valeur(b);
      const vide = (v: Valeur) => v === null || v === undefined || v === '';
      if (vide(va) || vide(vb)) return comparer(va, vb) || i - j; // les vides restent en fin dans les deux sens
      return s * comparer(va, vb) || i - j;
    })
    .map(([t]) => t);
}
