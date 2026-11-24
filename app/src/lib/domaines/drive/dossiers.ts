// Copyright 2026 SpinalCom - www.spinalcom.com
// Drive : création de dossier (DR-05). Nouveau code de l'application.
// Correction voulue : nom de collision « Nom (2) », « Nom (3) »… (l'historique produit « Nom(0) », « Nom(1) »),
// mêmes règles pour tous les points d'entrée. Déclarée dans tests/graphe/ecarts-acceptes.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { Directory } = require('spinal-core-connectorjs');

/** Caractères refusés dans un nom : séparateur de chemin et caractères de contrôle. */
const INTERDIT = /[\/\u0000-\u001f\u007f]/;

export function validerNom(nom: string): string | null {
  const n = nom.trim();
  if (!n) return 'Le nom ne peut pas être vide.';
  if (INTERDIT.test(n)) return 'Le nom ne peut pas contenir « / » ni de caractère de contrôle.';
  return null;
}

/** Premier nom libre : « Nom », puis « Nom (2) », « Nom (3) »… */
export function nomLibre(parent: { has(n: string): boolean }, nom: string): string {
  const base = nom.trim();
  if (!parent.has(base)) return base;
  for (let i = 2; ; i++) if (!parent.has(`${base} (${i})`)) return `${base} (${i})`;
}

/** Crée un dossier dans `parent` et renvoie le nom réellement utilisé. */
export function creerDossier(parent: any, nom: string): string {
  const err = validerNom(nom);
  if (err) throw new Error(err);
  const final = nomLibre(parent, nom);
  parent.add_file(final, new Directory());
  return final;
}
