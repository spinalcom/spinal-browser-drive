// Copyright 2026 SpinalCom - www.spinalcom.com
// Compatibilité des tests de graphe (DR-05) : la logique vit dans fichiers.ts ; ici, la version Node avec les classes injectées.
// Correction voulue : nom de collision « Nom (2) », « Nom (3) »… (l'historique produit « Nom(0) », « Nom(1) »).
import { createRequire } from 'node:module';
import { creerDossier as creer, nomLibre, validerNom, type Classes } from './fichiers.ts';
const require = createRequire(import.meta.url);
const C = require('spinal-core-connectorjs') as Classes;

export { nomLibre, validerNom };
export function creerDossier(parent: any, nom: string): string { return creer(C, parent, nom); }
