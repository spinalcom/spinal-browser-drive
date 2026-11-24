// Copyright 2026 SpinalCom - www.spinalcom.com
// Géographie : construction manuelle (ST-GEO-01). S'appuie sur le service géographique historique (même écriture :
// nœud créé dans le référentiel `.BuildingContext`… puis rattaché au parent dans le contexte).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { SpinalGraphService } = require('spinal-env-viewer-graph-service');
const geo = require('spinal-env-viewer-context-geographic-service').default;

export interface Hierarchie {
  contexte: string;
  batiments: { nom: string; etages: { nom: string; pieces: string[] }[] }[];
}

export async function creerHierarchie(graphe: any, h: Hierarchie) {
  await SpinalGraphService.setGraph(graphe);
  const ctx = await geo.createContext(h.contexte);
  const ctxId = ctx.info.id.get();
  for (const b of h.batiments) {
    const bn = await geo.addBuilding(ctxId, ctxId, b.nom);
    for (const f of b.etages) {
      const fn = await geo.addFloor(ctxId, bn.info.id.get(), f.nom);
      for (const r of f.pieces) await geo.addRoom(ctxId, fn.info.id.get(), r);
    }
  }
  return ctx;
}
