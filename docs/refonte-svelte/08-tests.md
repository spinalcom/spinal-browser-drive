<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# 08 — Base de tests : avancer vite sans régression

Objectif : une base de tests **assez grosse et assez rapide** pour que chaque changement soit vérifié en quelques minutes, sur le **graphe réel** et sur les **performances**, en comparant l'ancien Studio et la nouvelle application.

Règle de base : **une fonction n'est pas faite tant que son test de graphe et son test de parcours ne passent pas.** La banque de cas sert de liste de contrôle : chaque point `[recette]` et `[!]` est couvert par au moins un test, et un script vérifie cette couverture.

## 1. Les cinq étages

| Étage | Ce qu'il vérifie | Outil | Durée cible | Quand |
|---|---|---|---|---|
| **T1 — Unitaires** | Logique pure : parseurs (XML, BOG, MIB, XLSX), règles d'association et de nommage, registre des 41 opérations, calcul des diffs, conversion des dates et périodes | Vitest | < 20 s | à chaque sauvegarde |
| **T2 — Graphe** | Ce que chaque opération écrit dans le hub, comparé à l'ancien code (§3) | Vitest + hub jetable | < 5 min (sélection), < 30 min (complet) | à chaque commit (sélection), chaque nuit (complet) |
| **T3 — Composants** | Design system : états, clavier, accessibilité, contraste | Vitest navigateur + axe-core | < 1 min | à chaque commit |
| **T4 — Parcours** | P1 à P12 de bout en bout dans l'application, avec la 3D, puis vérification du graphe à la fin | Playwright headless | < 15 min | à chaque lot, chaque nuit |
| **T5 — Performance** | Benchmarks ancien contre nouveau (§5) | Playwright + CDP, bridé | < 30 min | chaque nuit, à chaque lot |

Volume visé à la fin : **≥ 2 000 tests T1 et T2** (environ un par point `[recette]` et `[!]` de la banque de cas, plus les 41 opérations × leurs cas limites), **≥ 150 tests T4**, **≥ 40 scénarios T5**.

## 2. Jeux de données

Toujours des **copies**, jamais la base de travail. Chaque jeu est un instantané `memory/` versionné (archive + empreinte) dans `.tools/refonte-svelte-fixtures/`, hors git, avec un script pour le régénérer.

| Jeu | Contenu | Usage |
|---|---|---|
| **F0 — vide** | Hub vierge, comptes de test (admin, intégrateur, utilisateur restreint, destinataire de partage) | droits, Drive, création |
| **F1 — mini** | Jumeau synthétique généré par script : 1 bâtiment, 3 étages, 30 pièces, 300 équipements, 2 maquettes SBIM légères, groupes, attributs (Unicode, `0`, `false`, vides), documents partagés entre objets, notes, 1 contexte de tickets, une série d'événements, endpoints avec séries irrégulières, 1 profil de points de contrôle, 3 analyses (dont une multi-algorithmes ancienne) | T2 et T4, rapide |
| **F2 — DEI** | Copie du jumeau de démonstration DEI | T4 et T5 réalistes |
| **F3 — gros** | Madeleine (46 M triangles) ou CAAV, avec une géographie générée par `twin-gen/gen.js` | T5 seulement |
| **F4 — révision** | F1 + une seconde version de maquette (objets ajoutés, supprimés, renommés) | P5 |
| **F5 — GTB simulée** | F1 + contexte `Network` avec des modèles de découverte écrits comme le ferait un organ (BACnet, OPC UA, SNMP) et un faux organ qui répond aux demandes | P8 sans matériel |

Le générateur de F1 et de F5 est un script Node qui utilise les mêmes services Spinal que l'application (`spinal-env-viewer-graph-service`…). On le réutilise depuis `twin-gen/gen.js` de la copie.

Hub de test : un conteneur `hub` **dédié aux tests** (projet Compose `spinalcore-test`, ports distincts), démarré sur une copie du jeu et arrêté par `SIGINT`. Jamais deux hubs sur la même `memory`.

## 3. Tests de graphe (T2) : ancien contre nouveau

C'est le cœur de la non-régression.

### 3.1 Principe

Pour chaque opération qui écrit :
1. Restaurer le jeu de données.
2. Exécuter l'opération avec **l'ancien code** : logique extraite des sourcemaps du Studio livré, lancée **sans interface** en Node, avec les mêmes services Spinal. Prendre un **instantané du graphe**.
3. Restaurer le jeu, exécuter l'opération avec le **nouveau code** (`lib/domaines`), prendre un instantané.
4. **Comparer les deux instantanés.**

### 3.2 Instantané du graphe

Un outil `graph-snapshot` parcourt le jumeau (ou le sous-arbre concerné) et produit un JSON canonique, trié :
- les nœuds : type, nom, `info` utiles, éléments (attributs, valeurs, unités, couleurs) ;
- les relations : nom, type (`Ref`, `PtrLst`, `LstPtr`), parent → enfant, contexte ;
- pour les endpoints : valeur courante et extrait des séries ;
- pour les fichiers : nom, type, version courante, empreinte du binaire.

Les identifiants serveur et les staticId des **nouveaux** nœuds diffèrent forcément d'une exécution à l'autre. Les nœuds sont donc identifiés par un **chemin canonique** (contexte › type:nom › …, avec un indice en cas d'homonymes) ; les nœuds préexistants gardent leur identité réelle. Les dates d'écriture sont normalisées.

### 3.3 Écarts

Chaque comparaison donne : identique, ou une liste d'écarts lisible (« + relation `hasGeographicRoom` Étage 2 › Bureau 2.14 », « ~ attribut Spatial/area : 18.4 → 18.40 »). Un écart est :
- un **bug** du nouveau code, donc le test échoue ;
- ou une **correction voulue** d'un bug de l'ancien. Elle est déclarée dans `tests/graphe/ecarts-acceptes.yaml` avec l'identifiant de la banque de cas (`ST-PROF-10.x`), et seul cet écart précis est toléré.

### 3.4 Quand l'ancien code ne peut pas tourner sans interface

Certaines opérations dépendent d'un organ (découvertes réseau, conversion, Mission, exécution des analyses) ou du viewer (positions 3D, sélection par rectangle). Pour celles-là :
- on compare les **modèles de demande** écrits dans le graphe (ce que l'organ recevra), pas le résultat final ;
- le **faux organ** du jeu F5 simule la réponse, pour tester la suite du parcours ;
- les calculs qui ont besoin de la géométrie s'appuient sur des boîtes englobantes enregistrées une fois depuis viewer-rs.

### 3.5 Couverture visée

Toutes les opérations d'écriture des 183 capacités, notamment :
- Drive : dossiers, dépôts, renommages, déplacements, suppressions, versions, partages ;
- jumeaux, scènes, décalages, réconciliation ;
- géographie : manuelle, génération, import, fusion, projection, recalculs ;
- attributs, classements, import Excel, documents, notes ;
- arborescence technique, profils, items, supervision, correspondances, surveillance ;
- points de contrôle et propagation, liens de séries ;
- tickets, événements, dashboards ;
- analyses : enregistrement, relecture et réenregistrement sans perte ;
- **les 41 opérations de calcul**, sur des entrées identiques, avec la même sortie exigée.

Plus un test de **lecture-réécriture** pour chaque configuration existante (profils, analyses, profils de colonnes, règles de génération) : ouvrir puis enregistrer sans rien changer doit laisser le graphe **strictement identique**.

## 4. Tests de parcours (T4)

- Un fichier Playwright par parcours (P1 à P12), plus un par scénario transverse de la banque de cas (R-25 à R-36).
- Chaque test se termine par un **instantané du graphe** comparé à une référence validée (`tests/parcours/<nom>.attendu.json`). On vérifie ainsi ce que l'écran a vraiment écrit, pas seulement ce qu'il affiche.
- On vérifie aussi :
  - qu'il ne reste **aucune ressource** (compteur de `bind` actifs, couleurs, sprites) après fermeture de l'écran ;
  - l'**URL** (rechargement et retour arrière) ;
  - l'**accessibilité clavier** du parcours.
- Navigateur headless uniquement, une page à la fois, `systemd-run --user --scope -p MemoryMax=8G`.

## 5. Benchmarks (T5) : ancien contre nouveau

Mêmes scénarios exécutés sur **l'ancien** (Drive AngularJS, Studio Vue 2) et sur **le nouveau**, sur F2 et F3, Chromium headless, `taskset` sur les cœurs performants, mémoire bridée, 5 répétitions, médiane et écart.

| Scénario | Mesure |
|---|---|
| Connexion → page utilisable | ms |
| Dossier de 2 000 fichiers | ms d'affichage, plus longue tâche |
| Ouverture d'un jumeau → arbre interactif | ms |
| Ouverture → première image 3D | ms (viewer-rs dans les deux cas) |
| Dépliage d'un étage de 500 pièces | ms |
| Défilement d'un arbre de 100 000 nœuds | images/s, tâches > 50 ms |
| Clic 3D → fiche affichée | ms |
| Tableau de 20 000 lignes : ouverture, défilement, enregistrement de 1 000 modifications | ms, images/s |
| Courbe de 500 000 points | ms |
| Heatmap de 1 000 pièces | ms |
| Aperçu de génération (géographie 5 000 pièces, réseau 5 000 objets) | ms, plus longue tâche |
| Ouverture d'une analyse multi-algorithmes | ms |
| Poids JS téléchargé, au démarrage et au total | Ko gz |
| Mémoire JS et processus après 30 min de parcours enchaînés | Mo, dérive |

Résultats bruts en JSON et rapport HTML comparatif (ancien / nouveau / budget) à chaque nuit. **Une régression de plus de 10 % sur une mesure fait échouer la nuit.**

## 6. Organisation et outils

```
app/tests/
├── unit/            T1
├── graphe/          T2 : operations/<capacité>.test.ts, legacy/ (adaptateurs de l'ancien code), ecarts-acceptes.yaml
├── composants/      T3
├── parcours/        T4 : p01-…p12-, transverses/
├── perf/            T5 : scenarios/, rapport/
├── fixtures/        scripts de génération F0–F5, faux organ
└── outils/          graph-snapshot, graph-diff, couverture-banque (relie tests et points de la banque de cas)
```

- `npm test` : T1 + T3 + sélection T2 (opérations touchées par le changement), < 5 min.
- `npm run test:nuit` : tout, avec rapport.
- Chaque test porte le ou les identifiants de la banque de cas qu'il couvre (`@cas ST-GEO-04.7`). `couverture-banque` liste les points `[recette]` et `[!]` sans test : cette liste doit être vide pour finir un lot.

## 7. Ordre de construction

La base de tests se construit **avant** le code des écrans, lot par lot :

1. **Lot 0** : `graph-snapshot`, `graph-diff`, hub de test, jeux F0 et F1, harnais pour lancer l'ancien code sans interface. Premier test T2 : création d'un dossier dans le Drive, ancien contre nouveau.
2. **Au début de chaque lot** : écrire les tests T2 des opérations du lot sur l'ancien code seul (ils fixent le comportement de référence), puis coder le nouveau jusqu'à ce qu'ils passent.
3. **Benchmarks de référence de l'ancien** relevés une fois au lot 0, sur F2 et F3. Ce sont eux qui fixent les budgets réels.
