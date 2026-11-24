// Copyright 2026 SpinalCom - www.spinalcom.com
// DR-05 — Créer et nommer un dossier. Ancien (spinalFilesystem.newFolder) contre nouveau (domaines/drive).
import { describe, it, expect, beforeAll } from 'vitest';
import { jeu, ancienContreNouveau, executer } from '../../outils/harnais.mjs';
import * as legacy from '../legacy/drive.mjs';
import { validerNom } from '../../../src/lib/domaines/drive/dossiers.ts';

const S = 'tests/graphe/scenarios/drive.mjs';
const ACCEPTES = [{ cas: 'DR-05 nommage des collisions', chemin: /^\$\.items\[\d+\]\.name$/ }];
let F;
beforeAll(async () => { F = await jeu('drive-base', S, 'jeuBase'); });

describe('DR-05 créer un dossier', () => {
  it('nom simple : même écriture que l’ancien Drive', async () => {
    const r = await ancienContreNouveau({ memoryJeu: F,
      ancien: [S, 'ancienNouveauDossier', { nom: 'Plans' }], nouveau: [S, 'nouveauNouveauDossier', { nom: 'Plans' }] });
    expect(r.ecarts, r.texte()).toEqual([]);
    expect(JSON.stringify(r.ancien.instantane)).toContain('Plans');
  });

  it('collision : ancien « Existant(0) », nouveau « Existant (2) » — seul écart, déclaré', async () => {
    const r = await ancienContreNouveau({ memoryJeu: F, acceptes: ACCEPTES,
      ancien: [S, 'ancienNouveauDossier', { nom: 'Existant' }], nouveau: [S, 'nouveauNouveauDossier', { nom: 'Existant' }] });
    expect(JSON.stringify(r.ancien.instantane)).toContain('Existant(0)');
    expect(JSON.stringify(r.nouveau.instantane)).toContain('Existant (2)');
    expect(r.ecartsBruts.length).toBe(1);
    expect(r.ecarts, r.texte()).toEqual([]);
  });

  it('accents et espaces : refusés par l’ancien, acceptés par le nouveau [+]', async () => {
    expect(legacy.nomDossierValide('Pièces étage 2')).toBe(false);
    expect(validerNom('Pièces étage 2')).toBeNull();
    const n = await executer(F, [S, 'nouveauNouveauDossier', { nom: 'Pièces étage 2' }]);
    expect(JSON.stringify(n.instantane)).toContain('Pièces étage 2');
  });

  it('nom interdit : message clair et graphe inchangé', async () => {
    const [avant, apres] = await Promise.all([executer(F, [S, 'rien']), executer(F, [S, 'nouveauNomInterdit', { nom: 'a/b' }])]);
    expect(apres.resultat).toMatch(/«\s*\/\s*»/);
    expect(apres.instantane).toEqual(avant.instantane);
  });
});
