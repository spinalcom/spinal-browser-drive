// Copyright 2026 SpinalCom - www.spinalcom.com
// Scénarios Drive exécutés dans le processus enfant (ancien et nouveau code côte à côte).
import { createRequire } from 'node:module';
import * as legacy from '../legacy/drive.mjs';
import { creerDossier } from '../../../src/lib/domaines/drive/dossiers.ts';
const require = createRequire(import.meta.url);
const { Directory } = require('spinal-core-connectorjs');

export function jeuBase({ dir }) {
  dir.add_file('Projets', new Directory());
  dir.add_file('Existant', new Directory());
}
export const rien = () => {};
export const ancienNouveauDossier = ({ dir, args }) => legacy.newFolder(dir, args.nom);
export const nouveauNouveauDossier = ({ dir, args }) => creerDossier(dir, args.nom);
export const nouveauNomInterdit = ({ dir, args }) => {
  try { creerDossier(dir, args.nom); } catch (e) { return String(e.message); }
  throw new Error('nom accepté à tort');
};
