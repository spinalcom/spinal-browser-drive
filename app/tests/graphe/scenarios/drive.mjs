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

// ---- Renommer, supprimer, déplacer (DR-07, DR-08, DR-09) ----
import * as F from '../../../src/lib/domaines/drive/fichiers.ts';
const { Lst, Ptr, Path, Model } = require('spinal-core-connectorjs');
const C = { Directory, Lst, Ptr, Path, Model };
const trouver = (dir, nom) => { for (let i = 0; i < dir.length; i++) if (dir[i].name.get() === nom) return dir[i]; throw new Error('absent : ' + nom); };
const charger = (f) => new Promise((ok) => f._ptr.load(ok));

/** Jeu : Projets/{Tour A/, Plans/}, Archives/, notes.txt (Path sans binaire). */
export async function jeuFichiers({ dir }) {
  const projets = new Directory();
  projets.add_file('Tour A', new Directory());
  projets.add_file('Plans', new Directory());
  dir.add_file('Projets', projets);
  dir.add_file('Archives', new Directory());
  dir.add_file('notes.txt', new Directory(), { model_type: 'Path' }); // marqueur de type sans binaire
  dir.add_file('GED', new Directory(), { model_type: 'Synchronized Directory' });
}

export const ancienRenommer = ({ dir, args }) => legacy.renameFile(dir, trouver(dir, args.de), args.vers);
export const nouveauRenommer = ({ dir, args }) => { try { F.renommer(dir, trouver(dir, args.de), args.vers); return null; } catch (e) { return e.message; } };

export const ancienSupprimer = ({ dir, args }) => { for (const n of args.noms) legacy.deleteFile(dir, trouver(dir, n)); };
/** Historique « Delete Selected » : seul le premier élément était retiré (anomalie). */
export const ancienSupprimerSelection = ({ dir, args }) => legacy.deleteFile(dir, trouver(dir, args.noms[0]));
export const nouveauSupprimer = ({ dir, args }) => F.supprimer(dir, args.noms.map((n) => trouver(dir, n)));

export const ancienDeplacer = async ({ dir, args }) => {
  const cible = await charger(trouver(dir, args.vers));
  legacy.moveFiles(dir, cible, args.noms.map((n) => trouver(dir, n)));
};
export const nouveauDeplacer = async ({ dir, args }) => {
  const cible = await charger(trouver(dir, args.vers));
  return F.deplacer(dir, cible, args.noms.map((n) => trouver(dir, n)), [cible._server_id]);
};
/** Cycle : déplacer « Projets » dans « Projets/Tour A ». */
export const nouveauDeplacerCycle = async ({ dir }) => {
  const projetsF = trouver(dir, 'Projets');
  const projets = await charger(projetsF);
  const tourA = await charger(trouver(projets, 'Tour A'));
  return F.deplacer(dir, tourA, [projetsF], [projets._server_id, tourA._server_id]);
};

export const nouveauJournal = ({ dir, args }) => {
  const f = trouver(dir, args.nom);
  F.journaliser(C, f, 'admin', args.action, 1_790_000_000_000);
};
