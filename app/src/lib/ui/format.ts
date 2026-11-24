// Copyright 2026 SpinalCom - www.spinalcom.com
// Écriture des dates, nombres et tailles (02-ux §11). Natif Intl, sans dépendance.

const rel = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
const absolu = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const exact = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'medium' });
const nombreFr = new Intl.NumberFormat('fr-FR');

const UNITES: [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60], ['minute', 60], ['hour', 24], ['day', 7],
];

/** « il y a 3 h » si moins de 7 jours, sinon « 12 nov. 2026, 14:32 ». */
export function dateLisible(d: Date | number, maintenant: number = Date.now()): string {
  const t = typeof d === 'number' ? d : d.getTime();
  let ecart = (t - maintenant) / 1000;
  if (Math.abs(ecart) >= 7 * 86400) return absolu.format(t);
  for (const [unite, pas] of UNITES) {
    if (Math.abs(ecart) < pas) {
      if (unite === 'second' && Math.abs(ecart) < 45) return 'à l’instant';
      return rel.format(Math.round(ecart), unite);
    }
    ecart /= pas;
  }
  return absolu.format(t);
}

/** Forme exacte, pour l'infobulle. */
export function dateExacte(d: Date | number): string {
  return exact.format(typeof d === 'number' ? d : d.getTime());
}

/** Séparateur de milliers fin (U+202F en fr-FR). */
export function nombre(n: number, decimales?: number): string {
  if (decimales === undefined) return nombreFr.format(n);
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(n);
}

/** Taille lisible : 412 Mo, 1,8 Go. L'unité suit une espace insécable. */
export function taille(octets: number): string {
  const u = ['o', 'Ko', 'Mo', 'Go', 'To'];
  let i = 0;
  let v = octets;
  while (v >= 1000 && i < u.length - 1) { v /= 1000; i++; }
  return `${nombre(v, v < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}

/** Initiales d'un nom (« Marie Durand » → « MD », « m.durand » → « MD »). */
export function initiales(nom: string): string {
  const mots = nom.trim().split(/[\s._-]+/).filter(Boolean);
  if (!mots.length) return '?';
  const a = mots[0][0] ?? '';
  const b = mots.length > 1 ? mots[mots.length - 1][0] : (mots[0][1] ?? '');
  return (a + b).toUpperCase();
}

/** Indice stable 1..12 dans la palette de données, dérivé d'un texte. */
export function teinteDe(texte: string): number {
  let h = 0;
  for (const c of texte) h = (h * 31 + c.codePointAt(0)!) >>> 0;
  return (h % 12) + 1;
}
