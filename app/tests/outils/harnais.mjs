// Copyright 2026 SpinalCom - www.spinalcom.com
// Harnais « ancien contre nouveau ». Chaque exécution = un hub à lui (copie du jeu gelé) + un processus Node à lui.
//
//   const F = await jeu('nom', './fixtures/x.mjs', 'preparer')          // gèle un jeu de données (une fois)
//   const r = await ancienContreNouveau({ memoryJeu: F, ancien: [mod, 'fn', args], nouveau: [mod, 'fn', args] })
//   expect(r.ecarts, r.texte()).toEqual([])
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { dansHub } from './isole.mjs';
import { comparer, filtrerAcceptes, texte } from './diff.mjs';

const absolu = (m) => (m.startsWith('file:') ? m : pathToFileURL(resolve(m)).href);
const jeux = new Map();

/** Gèle un jeu de données : `fonction` du `module` remplit un hub vierge, la base est copiée. */
export async function jeu(nom, module, fonction, args) {
  if (jeux.has(nom)) return jeux.get(nom);
  const dest = join(mkdtempSync(join(tmpdir(), `spinal-jeu-${nom}-`)), 'memory');
  await dansHub({ memoryJeu: undefined, module: absolu(module), fonction, args, instantane: false, garderMemoryDans: dest });
  jeux.set(nom, dest);
  return dest;
}

/** Une exécution : [module, fonction, args] sur une copie du jeu ; renvoie { resultat, instantane }. */
export function executer(memoryJeu, [module, fonction, args], opts = {}) {
  return dansHub({ memoryJeu, module: absolu(module), fonction, args, ...opts });
}

export async function ancienContreNouveau({ memoryJeu, ancien, nouveau, acceptes = [], ...opts }) {
  const [A, N] = await Promise.all([executer(memoryJeu, ancien, opts), nouveau ? executer(memoryJeu, nouveau, opts) : null]);
  if (!N) return { ancien: A, ecarts: [], ecartsBruts: [], texte: () => '' };
  const ecartsBruts = comparer(A.instantane, N.instantane);
  const ecarts = filtrerAcceptes(ecartsBruts, acceptes);
  return { ancien: A, nouveau: N, ecartsBruts, ecarts, texte: () => texte(ecarts) };
}
