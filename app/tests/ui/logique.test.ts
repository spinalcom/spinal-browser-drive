// Copyright 2026 SpinalCom - www.spinalcom.com
// T1 — logique pure du design system : virtualisation, arbre (APG), tri, formats, contrastes.
import { describe, it, expect } from 'vitest';
import { fenetre, defilementPour } from '../../src/lib/ui/virtualisation';
import { aplatir, touche, type NoeudArbre } from '../../src/lib/ui/arbre';
import { trier, comparer } from '../../src/lib/ui/tableau';
import { dateLisible, taille, initiales, teinteDe, nombre } from '../../src/lib/ui/format';
import { verifier } from '../../scripts/contraste.mjs';

describe('virtualisation', () => {
  it('liste vide', () => expect(fenetre(0, 36, 0, 400)).toEqual({ debut: 0, fin: 0, avant: 0, apres: 0 }));
  it('début de liste : rend l’écran et une marge, espaceurs cohérents', () => {
    const f = fenetre(10000, 36, 0, 360);
    expect(f.debut).toBe(0);
    expect(f.fin).toBe(15);
    expect(f.avant + (f.fin - f.debut) * 36 + f.apres).toBe(10000 * 36);
  });
  it('milieu de liste : nombre de lignes rendues borné (≈ 2 écrans)', () => {
    const f = fenetre(100000, 36, 36 * 50000, 720);
    expect(f.fin - f.debut).toBeLessThanOrEqual(40);
    expect(f.debut).toBeLessThanOrEqual(50000);
    expect(f.fin).toBeGreaterThan(50000 + 20);
  });
  it('fin de liste : ne dépasse pas le total', () => {
    const f = fenetre(100, 36, 36 * 100, 360);
    expect(f.fin).toBe(100);
    expect(f.apres).toBe(0);
  });
  it('defilementPour : null si visible, sinon aligne haut ou bas', () => {
    expect(defilementPour(3, 36, 0, 360)).toBeNull();
    expect(defilementPour(20, 36, 0, 360)).toBe(21 * 36 - 360);
    expect(defilementPour(2, 36, 500, 360)).toBe(72);
  });
});

const arbre = (): NoeudArbre[] => [
  { id: 'a', label: 'Bâtiment A', enfants: [
    { id: 'a1', label: 'Étage 1', enfants: [{ id: 'p1', label: 'Pièce 101', enfants: [] }, { id: 'p2', label: 'Bureau 102', enfants: [] }] },
    { id: 'a2', label: 'Étage 2', aEnfants: true },
  ] },
  { id: 'b', label: 'Bâtiment B', enfants: [] },
];

describe('arbre', () => {
  it('aplatit seulement les nœuds ouverts, avec niveau, position et taille', () => {
    const l = aplatir(arbre(), new Set(['a']));
    expect(l.map((x) => x.noeud.id)).toEqual(['a', 'a1', 'a2', 'b']);
    expect(l[1]).toMatchObject({ niveau: 2, parent: 'a', position: 1, taille: 2, feuille: false, ouvert: false });
    expect(l[3]).toMatchObject({ feuille: true });
  });
  it('enfants non chargés : pas une feuille si aEnfants', () => {
    const l = aplatir(arbre(), new Set(['a']));
    expect(l.find((x) => x.noeud.id === 'a2')!.feuille).toBe(false);
  });
  it('recherche : garde les ancêtres et les ouvre', () => {
    const l = aplatir(arbre(), new Set(), (n) => n.label.toLowerCase().includes('bureau'));
    expect(l.map((x) => x.noeud.id)).toEqual(['a', 'a1', 'p2']);
    expect(l[0].ouvert && l[1].ouvert).toBe(true);
  });
  it('clavier APG : → ouvre, puis descend ; ← ferme, puis remonte', () => {
    let l = aplatir(arbre(), new Set());
    expect(touche(l, 0, 'ArrowRight')).toEqual({ type: 'ouvrir', id: 'a' });
    l = aplatir(arbre(), new Set(['a']));
    expect(touche(l, 0, 'ArrowRight')).toEqual({ type: 'focus', index: 1 });
    expect(touche(l, 1, 'ArrowLeft')).toEqual({ type: 'focus', index: 0 });
    expect(touche(l, 0, 'ArrowLeft')).toEqual({ type: 'fermer', id: 'a' });
    expect(touche(l, 3, 'ArrowRight')).toBeNull();
    expect(touche(l, 0, 'End')).toEqual({ type: 'focus', index: 3 });
    expect(touche(l, 2, 'Enter')).toEqual({ type: 'activer', id: 'a2' });
  });
});

describe('tri', () => {
  const l = [{ n: 'Pièce 10', v: 3 }, { n: 'pièce 2', v: null }, { n: 'Pièce 1', v: 0 }, { n: 'Écluse', v: -1 }, { n: '', v: 5 }];
  it('texte naturel français, accents et casse ignorés, vides en fin', () => {
    expect(trier(l, (x) => x.n, 'asc').map((x) => x.n)).toEqual(['Écluse', 'Pièce 1', 'pièce 2', 'Pièce 10', '']);
  });
  it('nombres : 0 n’est pas vide, null reste en fin dans les deux sens', () => {
    expect(trier(l, (x) => x.v, 'asc').map((x) => x.v)).toEqual([-1, 0, 3, 5, null]);
    expect(trier(l, (x) => x.v, 'desc').map((x) => x.v)).toEqual([5, 3, 0, -1, null]);
  });
  it('stable', () => {
    const e = [{ k: 1, i: 'a' }, { k: 1, i: 'b' }, { k: 0, i: 'c' }];
    expect(trier(e, (x) => x.k, 'asc').map((x) => x.i)).toEqual(['c', 'a', 'b']);
  });
  it('dates', () => expect(comparer(new Date(2), new Date(1))).toBeGreaterThan(0));
});

describe('format', () => {
  const t0 = Date.UTC(2026, 10, 24, 12);
  it('dates relatives puis absolues après 7 jours', () => {
    expect(dateLisible(t0 - 10_000, t0)).toBe('à l’instant');
    expect(dateLisible(t0 - 3 * 3600_000, t0)).toBe('il y a 3 heures');
    expect(dateLisible(t0 - 86400_000, t0)).toBe('hier');
    expect(dateLisible(t0 - 8 * 86400_000, t0)).toMatch(/16 nov\. 2026/);
  });
  it('tailles et nombres', () => {
    expect(taille(412_000_000)).toBe('412 Mo');
    expect(taille(1_800_000_000)).toBe('1,8 Go');
    expect(taille(0)).toBe('0 o');
    expect(nombre(41238)).toBe('41 238');
  });
  it('initiales et teinte stable', () => {
    expect(initiales('m.durand')).toBe('MD');
    expect(initiales('admin')).toBe('AD');
    expect(teinteDe('admin')).toBe(teinteDe('admin'));
    expect(teinteDe('x')).toBeGreaterThanOrEqual(1);
  });
});

describe('contrastes', () => {
  it('tous les couples texte/fond des jetons sont AA (clair et sombre)', () => {
    const { echecs } = verifier();
    expect(echecs).toEqual([]);
  });
});
