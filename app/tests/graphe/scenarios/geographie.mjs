// Copyright 2026 SpinalCom - www.spinalcom.com
// Scénarios géographie (ST-GEO-01). Jeu : un jumeau vide (fichier « Digital twin » → SpinalGraph).
import { createRequire } from 'node:module';
import { chargerPtr } from '../../outils/session.mjs';
import * as nouveau from '../../../src/lib/domaines/geographie/hierarchie.ts';
const require = createRequire(import.meta.url);
const { SpinalGraph } = require('spinal-model-graph');
const { SpinalGraphService } = require('spinal-env-viewer-graph-service');
const geo = require('spinal-env-viewer-context-geographic-service').default;

export async function jeuJumeau({ dir }) {
  const g = new SpinalGraph('Jumeau test');
  dir.add_file('Jumeau test', g, { model_type: 'Digital twin' });
}

/** Racine de l'instantané : le graphe du jumeau. */
export async function graphe({ dir }) {
  for (let i = 0; i < dir.length; i++) if (dir[i].name.get() === 'Jumeau test') return chargerPtr(dir[i]._ptr);
  throw new Error('jumeau absent');
}

const HIERARCHIE = { contexte: 'Spatial', batiments: [{ nom: 'Tour A', etages: [{ nom: 'R+1', pieces: ['101', '102'] }, { nom: 'R+2', pieces: ['201'] }] }] };

/** ANCIEN : exactement les appels du Studio (dialogue de création → service géographique, ids des nœuds). */
export async function ancienCreerHierarchie(s) {
  const g = await graphe(s);
  await SpinalGraphService.setGraph(g);
  const ctx = await geo.createContext(HIERARCHIE.contexte);
  const ctxId = ctx.info.id.get();
  for (const b of HIERARCHIE.batiments) {
    const bn = await geo.addBuilding(ctxId, ctxId, b.nom);
    for (const f of b.etages) {
      const fn = await geo.addFloor(ctxId, bn.info.id.get(), f.nom);
      for (const r of f.pieces) await geo.addRoom(ctxId, fn.info.id.get(), r);
    }
  }
}

/** NOUVEAU : domaine géographie de l'application. */
export async function nouveauCreerHierarchie(s) {
  await nouveau.creerHierarchie(await graphe(s), HIERARCHIE);
}
