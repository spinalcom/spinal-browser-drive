<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# Base de tests — mode d'emploi

```sh
cd app
bun install                      # une fois (vitest)
./scripts/lier-spinal.sh         # une fois : liens vers les paquets Spinal installés (même code que le Studio livré)
./node_modules/.bin/vitest run   # tout
./node_modules/.bin/vitest run tests/graphe   # tests de graphe seulement
./node_modules/.bin/vitest run tests/ui       # design system : T1 (logique pure) et T3 (navigateur)
```

Design system : `bun run check` (svelte-check), `bun run test:contraste` (couples AA des jetons). Le test
`tests/ui/navigateur.test.ts` demande la page servie : `bun run build`, puis
`./node_modules/.bin/vite preview --host 127.0.0.1 --port 5186` ; il est ignoré si la page ne répond pas.
Navigateur headless uniquement ; bancs sous `systemd-run --user --scope -p MemoryMax=8G`.

Aucun Docker : chaque exécution lance un **hub jetable** (binaire `nerve-center/spinalhub`) dans un dossier temporaire,
sur des ports libres, avec sa propre base. La pile de dev et `nerve-center/memory` ne sont jamais touchées.

## Écrire un test de graphe (ancien contre nouveau)

1. `tests/graphe/legacy/<domaine>.mjs` : le code historique **recopié sans changer sa logique** (source et commit cités).
2. `tests/graphe/scenarios/<domaine>.mjs` : des fonctions `({ dir, conn, hub, args }) => …` exécutées dans un hub :
   un jeu de données (`jeuBase`), l'opération ancienne, l'opération nouvelle.
3. `tests/graphe/operations/<CAPACITÉ>-<nom>.test.mjs` :

```js
const F = await jeu('nom-du-jeu', S, 'jeuBase');          // jeu gelé une fois
const r = await ancienContreNouveau({ memoryJeu: F, acceptes: ACCEPTES,
  ancien: [S, 'ancienX', args], nouveau: [S, 'nouveauX', args] });
expect(r.ecarts, r.texte()).toEqual([]);
```

`acceptes` : les écarts **voulus** (correction d'un bug de l'ancien), chacun avec l'identifiant de la banque de cas.

## Outils

| Fichier | Rôle |
|---|---|
| `outils/hub.mjs` | hub jetable ; dump chaque seconde (le hub n'écrit sa base que sur calendrier, pas à l'arrêt) ; gel d'une base |
| `outils/session.mjs` | connexion connectorjs, attente de synchronisation complète |
| `outils/isole.mjs`, `outils/enfant.mjs` | une exécution = un processus Node (connectorjs a un état global) |
| `outils/instantane.mjs` | instantané canonique : chemins stables, identité des nœuds préexistants, valeurs volatiles normalisées |
| `outils/diff.mjs` | écarts lisibles (`+`, `-`, `~`) et filtre des écarts acceptés |
| `outils/harnais.mjs` | `jeu`, `executer`, `ancienContreNouveau` |

## Vérifier qu'un test sert à quelque chose

Avant de considérer un test comme fiable, le casser volontairement (mutation du nouveau code) et vérifier qu'il échoue.
Exemple : `graphe/MUTATIONS.md`.
