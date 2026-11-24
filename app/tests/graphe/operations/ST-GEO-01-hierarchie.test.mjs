// Copyright 2026 SpinalCom - www.spinalcom.com
// ST-GEO-01 — Construire manuellement la hiérarchie géographique. Ancien (Studio) contre nouveau.
import { describe, it, expect, beforeAll } from 'vitest';
import { jeu, ancienContreNouveau, executer } from '../../outils/harnais.mjs';

const S = 'tests/graphe/scenarios/geographie.mjs';
let F;
beforeAll(async () => { F = await jeu('jumeau-vide', S, 'jeuJumeau'); });

describe('ST-GEO-01 hiérarchie géographique', () => {
  it('contexte, bâtiment, étages, pièces : même graphe que le Studio', async () => {
    const r = await ancienContreNouveau({ memoryJeu: F, cible: 'graphe',
      ancien: [S, 'ancienCreerHierarchie'], nouveau: [S, 'nouveauCreerHierarchie'] });
    const t = JSON.stringify(r.ancien.instantane);
    for (const n of ['Spatial', 'Tour A', 'R+1', 'R+2', '101', '102', '201', 'hasGeographicBuilding', 'hasGeographicFloor', 'hasGeographicRoom', '.BuildingContext', '.FloorContext', '.RoomContext'])
      expect(t, n).toContain(n);
    expect(r.ecarts, r.texte()).toEqual([]);
  });

  it('l’instantané est reproductible (deux exécutions de l’ancien code identiques)', async () => {
    const [a, b] = await Promise.all([executer(F, [S, 'ancienCreerHierarchie'], { cible: 'graphe' }), executer(F, [S, 'ancienCreerHierarchie'], { cible: 'graphe' })]);
    expect(b.instantane).toEqual(a.instantane);
  });
});
