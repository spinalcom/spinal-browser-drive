// Copyright 2026 SpinalCom - www.spinalcom.com
// DR-07 renommer, DR-08 déplacer, DR-09 supprimer, DR-12 journal : ancien Drive contre domaines/drive/fichiers.ts.
import { describe, it, expect, beforeAll } from 'vitest';
import { jeu, ancienContreNouveau, executer } from '../../outils/harnais.mjs';

const S = 'tests/graphe/scenarios/drive.mjs';
let J;
beforeAll(async () => { J = await jeu('drive-fichiers', S, 'jeuFichiers'); });

describe('DR-07 renommer', () => {
  it('nom ASCII : même écriture', async () => {
    const r = await ancienContreNouveau({ memoryJeu: J,
      ancien: [S, 'ancienRenommer', { de: 'Archives', vers: 'Archives 2025' }], nouveau: [S, 'nouveauRenommer', { de: 'Archives', vers: 'Archives 2025' }] });
    expect(r.ecarts, r.texte()).toEqual([]);
  });
  it('même nom : aucune écriture dans les deux', async () => {
    const [rien, n] = await Promise.all([executer(J, [S, 'rien']), executer(J, [S, 'nouveauRenommer', { de: 'Archives', vers: 'Archives' }])]);
    expect(n.instantane).toEqual(rien.instantane);
  });
  it('collision : refus dans les deux, graphe inchangé', async () => {
    const [rien, a, n] = await Promise.all([executer(J, [S, 'rien']),
      executer(J, [S, 'ancienRenommer', { de: 'Archives', vers: 'Projets' }]), executer(J, [S, 'nouveauRenommer', { de: 'Archives', vers: 'Projets' }])]);
    expect(a.resultat).toMatch(/already exist/);
    expect(n.resultat).toMatch(/existe déjà/);
    expect(a.instantane).toEqual(rien.instantane);
    expect(n.instantane).toEqual(rien.instantane);
  });
  it('accents : refusés par l’ancien, acceptés par le nouveau [+]', async () => {
    const [a, n] = await Promise.all([executer(J, [S, 'ancienRenommer', { de: 'Archives', vers: 'Archivés' }]), executer(J, [S, 'nouveauRenommer', { de: 'Archives', vers: 'Archivés' }])]);
    expect(a.resultat).toMatch(/not a valid name/);
    expect(JSON.stringify(n.instantane)).toContain('Archivés');
  });
});

describe('DR-09 supprimer', () => {
  it('un élément : même écriture', async () => {
    const r = await ancienContreNouveau({ memoryJeu: J,
      ancien: [S, 'ancienSupprimer', { noms: ['Archives'] }], nouveau: [S, 'nouveauSupprimer', { noms: ['Archives'] }] });
    expect(r.ecarts, r.texte()).toEqual([]);
  });
  it('sélection multiple : le nouveau retire tout (l’ancien « Delete Selected » ne retirait que le premier) [+]', async () => {
    const [a, n, attendu] = await Promise.all([
      executer(J, [S, 'ancienSupprimerSelection', { noms: ['Archives', 'notes.txt'] }]),
      executer(J, [S, 'nouveauSupprimer', { noms: ['Archives', 'notes.txt'] }]),
      executer(J, [S, 'ancienSupprimer', { noms: ['Archives', 'notes.txt'] }]),
    ]);
    expect(JSON.stringify(a.instantane)).toContain('notes.txt');
    expect(n.instantane).toEqual(attendu.instantane);
  });
  it('dossier synchronisé : ignoré avec sa raison, graphe inchangé', async () => {
    const [rien, n] = await Promise.all([executer(J, [S, 'rien']), executer(J, [S, 'nouveauSupprimer', { noms: ['GED'] }])]);
    expect(n.resultat).toEqual({ retires: [], ignores: [{ nom: 'GED', raison: 'dossier synchronisé' }] });
    expect(n.instantane).toEqual(rien.instantane);
  });
});

describe('DR-08 déplacer', () => {
  it('vers un dossier : même graphe final', async () => {
    const r = await ancienContreNouveau({ memoryJeu: J,
      ancien: [S, 'ancienDeplacer', { noms: ['notes.txt'], vers: 'Archives' }], nouveau: [S, 'nouveauDeplacer', { noms: ['notes.txt'], vers: 'Archives' }] });
    expect(r.ecarts, r.texte()).toEqual([]);
  });
  it('cycle : refusé avec message, graphe inchangé', async () => {
    const [rien, n] = await Promise.all([executer(J, [S, 'rien']), executer(J, [S, 'nouveauDeplacerCycle'])]);
    expect(n.resultat.ignores[0].raison).toMatch(/lui-même/);
    expect(n.instantane).toEqual(rien.instantane);
  });
});

describe('DR-12 journal', () => {
  it('crée le journal au format historique (Ptr → Lst de {date, name, action})', async () => {
    const n = await executer(J, [S, 'nouveauJournal', { nom: 'Archives', action: 'rename' }]);
    const s = JSON.stringify(n.instantane);
    expect(s).toContain('"action":"rename"');
    expect(s).toContain('"name":"admin"');
  });
});
