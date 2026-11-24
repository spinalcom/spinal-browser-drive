// Copyright 2026 SpinalCom - www.spinalcom.com
// Vérifie les contrastes WCAG des couples texte/fond du design system, en thème clair et sombre.
// Lit les jetons entre les marqueurs « @clair »/« @sombre » et « @fin » de src/lib/ui/jetons.css.
// Usage : node scripts/contraste.mjs   (code de sortie 1 si un couple échoue)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(fileURLToPath(new URL('../src/lib/ui/jetons.css', import.meta.url)), 'utf8');

export function lireTheme(source, marque) {
  const debut = source.indexOf(`/* @${marque} */`);
  if (debut < 0) throw new Error(`marqueur @${marque} absent`);
  const fin = source.indexOf('/* @fin */', debut);
  const jetons = {};
  for (const m of source.slice(debut, fin).matchAll(/--sc-([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/gi)) jetons[m[1]] = m[2].toLowerCase();
  return jetons;
}

function luminance(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// [texte, fond, minimum]. focus = anneau de focus ; line-field = bord des champs (WCAG 1.4.11).
// — 4,5 pour du texte, 3 pour des éléments d'interface (icônes, bordures porteuses de sens).
export const COUPLES = [
  ['text', 'sheet', 4.5], ['text', 'ground', 4.5], ['text', 'sheet-hover', 4.5], ['text', 'ground-2', 4.5],
  ['text-2', 'sheet', 4.5], ['text-2', 'ground', 4.5], ['text-2', 'ground-2', 4.5],
  ['muted', 'sheet', 4.5], ['muted', 'ground', 4.5], ['muted', 'sheet-hover', 4.5],
  ['on-ink', 'ink', 4.5], ['on-ink', 'ink-2', 4.5], ['on-ink', 'ink-3', 4.5], ['on-ink-2', 'ink', 4.5], ['on-ink-2', 'ink-2', 4.5],
  ['on-accent', 'accent', 4.5], ['on-accent', 'accent-hover', 4.5],
  ['on-danger', 'danger', 4.5],
  ['accent-ink', 'sheet', 4.5], ['accent-ink', 'accent-soft', 4.5],
  ['danger', 'sheet', 4.5], ['danger', 'danger-soft', 4.5],
  ['ok', 'sheet', 4.5], ['ok', 'ok-soft', 4.5], ['ok', 'ground', 4.5],
  ['warn', 'sheet', 4.5], ['warn', 'warn-soft', 4.5], ['warn', 'ground', 4.5],
  ['info', 'sheet', 4.5], ['info', 'info-soft', 4.5],
  ['toast-ok', 'ink', 4.5], ['toast-err', 'ink', 4.5], ['accent', 'ink', 4.5],
  ['focus', 'sheet', 3], ['focus', 'ground', 3], ['line-field', 'sheet', 3], ['line-field', 'ground', 2.8], ['text', 'selection-text', 4.5],
];

export function verifier(source = css) {
  const echecs = [];
  const lignes = [];
  for (const theme of ['clair', 'sombre']) {
    const j = lireTheme(source, theme);
    for (const [t, f, min] of COUPLES) {
      if (!j[t] || !j[f]) { echecs.push(`${theme} : jeton manquant ${!j[t] ? t : f}`); continue; }
      const r = ratio(j[t], j[f]);
      const ok = r >= min;
      lignes.push(`${ok ? 'ok ' : 'NON'} ${theme.padEnd(6)} ${t.padEnd(12)} sur ${f.padEnd(14)} ${r.toFixed(2)} (min ${min})`);
      if (!ok) echecs.push(`${theme} : ${t} sur ${f} = ${r.toFixed(2)} < ${min}`);
    }
  }
  return { echecs, lignes };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { echecs, lignes } = verifier();
  if (process.argv.includes('-v')) console.log(lignes.join('\n'));
  console.log(echecs.length ? `${echecs.length} couple(s) sous le seuil :\n  ${echecs.join('\n  ')}` : `${lignes.length} couples conformes`);
  process.exit(echecs.length ? 1 : 0);
}
