<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# 01 — Architecture technique

## 1. Stack

| Besoin | Choix | Raison |
|---|---|---|
| Framework | **Svelte 5** (runes `$state`, `$derived`, `$effect`, `$props`) | Choix utilisateur. Pas de DOM virtuel, réactivité fine, bundles petits. |
| Application | **SvelteKit**, `ssr = false`, `@sveltejs/adapter-static` avec page de repli (SPA), `paths.base = '/studio'` | Routage par fichiers, découpage du code par route, chargement à la demande des ateliers. |
| Langage | TypeScript strict | Les services Spinal sont typés. |
| Build | Vite (fourni par SvelteKit) | Même outil que le portail. |
| Primitives accessibles | **bits-ui** (Svelte 5, sans style) : Dialog, DropdownMenu, ContextMenu, Popover, Tooltip, Select, Combobox, Tabs, Checkbox, Switch, Slider | Accessibilité clavier et lecteurs d'écran déjà résolue. Le style vient entièrement de notre design system. |
| Icônes | `@lucide/svelte` (tracé, grille 24) | Même famille de trait que les icônes de viewer-rs. Import par icône, donc rien d'inutile dans le bundle. |
| Courbes temporelles | **uPlot** | ~50 Ko, des centaines de milliers de points sans ralentir. Remplace Plotly (ST-MES-06 à 08). |
| Graphe (inspecteur) | `@xyflow/svelte` + `elkjs` (mise en page DAG) + `d3-force` (mode forces) | GI-03 : vues DAG et forces. |
| Calendrier | `@event-calendar/core` (écrit en Svelte) | ST-EVT : vues jour, semaine, mois et liste. |
| Éditeur de code | CodeMirror 6 | Fonctions personnalisées (ST-IOT-04/05, ST-ANA), expressions régulières. |
| Excel | `exceljs`, chargé à la demande | Exports et imports XLSX (ST-ATT-03/04, ST-IOT-07, ST-MES-05, ST-BAC-03…). |
| Cron | `cron-parser` | Validation et aperçu des prochaines exécutions (ST-ANA-06). |
| Dates | `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat` natifs | Pas de moment ni de luxon. Fuseau du navigateur, affiché quand il compte. |
| Tests | **Vitest** (logique métier extraite, parseurs, registre de calculs) + **Playwright** headless (parcours) | Voir §11. |

Versions : dernière version stable de chaque paquet au moment de l'initialisation, **figée exactement** dans `package.json` (pas de `^`). Tout ajout de dépendance hors de cette liste doit être justifié dans le lot concerné.

Exclus : Vuetify, Angular Material, jQuery, GoldenLayout, Plotly, moment, et toute bibliothèque de composants stylés. Le design system est le nôtre ([05-design-system.md](05-design-system.md)).

## 2. Structure du code

```
app/
├── package.json · svelte.config.js · vite.config.ts · tsconfig.json
├── static/
│   ├── fonts/                    Geist, Geist Mono (OFL, embarquées)
│   └── viewer-rs/                build de viewer-rs, copié par scripts/sync-viewer.sh, version notée dans VERSION
├── scripts/sync-viewer.sh
├── src/
│   ├── app.html · app.css        tokens et styles globaux (05-design-system.md)
│   ├── lib/
│   │   ├── ui/                   design system : composants génériques, sans logique Spinal
│   │   ├── hub/                  connexion, session, chargement de modèles, adaptateur de réactivité (§4)
│   │   ├── spinal/               accès graphe : nœuds, relations, contextes, BIM ; façade des services Spinal
│   │   ├── domaines/<domaine>/   logique métier extraite (géographie, réseaux, tickets, analyses…), une source citée par fichier
│   │   ├── viewer/               hôte viewer-rs, façade typée, sélection 3D, couleurs, sprites (§5)
│   │   ├── actions/              registre des actions et conditions (§6)
│   │   ├── taches/               plateau des tâches asynchrones (§7)
│   │   └── etat/                 état global : session, jumeau ouvert, sélection courante, préférences
│   └── routes/
│       ├── +layout.svelte        barre supérieure, palette de commandes, plateau des tâches, toasts
│       ├── connexion/
│       ├── drive/[...chemin]/
│       ├── jumeau/[id]/          Studio (id = identifiant serveur du fichier jumeau)
│       │   └── atelier/[nom]/    ateliers chargés à la demande
│       ├── inspecteur/[id]/
│       └── admin/
└── tests/                        parcours Playwright
```

Règles :
- `lib/ui` ne connaît pas Spinal. Un composant qui a besoin d'un nœud reçoit des données simples.
- `lib/domaines` ne connaît pas Svelte. C'est du TypeScript pur, testable par Vitest et réutilisable ailleurs (portail, organs).
- Un fichier extrait d'un plugin historique commence par un commentaire qui cite son origine : paquet, chemin dans la sourcemap, version.

## 3. Données

### 3.1 Pourquoi le connecteur hub et pas l'API BOS

L'API BOS ne sert que le **jumeau actif** (`GET /get_actual_digitaltwin`) et ne couvre pas toutes les mutations du Studio (inventaire §9.5). Le Drive et le Studio travaillent sur **n'importe quel** fichier du hub. L'application parle donc au hub comme aujourd'hui, avec `spinal-core-connectorjs`, à travers le proxy du serveur `web` (`/sceen`, `/get_user_id`…). La sémantique des écritures reste celle des services historiques.

### 3.2 Session

- Connexion par compte **hub** : identifiant + mot de passe → `/get_user_id` (ou `/get_admin_id` pour l'administration) → connexion `spinalCore.connect`.
- Les identifiants sont gardés en **mémoire** et dans `sessionStorage` (onglet courant), **jamais** dans `localStorage`. C'est une rupture volontaire avec `spinalhome_cfg` : l'inventaire (DR-01) précise que ce stockage n'est pas à reproduire. Conséquence : un nouvel onglet redemande la connexion, sauf ouverture depuis l'application (le jeton de session passe par `BroadcastChannel`, pas par l'URL).
- Déconnexion : fermeture du connecteur, arrêt de toutes les tâches et abonnements, purge de `sessionStorage`, retour à `/studio/connexion`. Corrige l'anomalie ST-SOC-05 (méthode `signOut` absente).
- Expiration ou perte du hub : bandeau permanent « Connexion au hub perdue », écritures bloquées, reprise automatique avec backoff. Aucune écriture n'est rejouée en silence.
- Profil Studio : lecture de `/etc/UserProfileDir/<utilisateur>` au démarrage, utilisé par les conditions d'actions (§6). Les bits historiques sont traduits en noms lisibles dans `lib/actions/profils.ts`. Un bit inconnu est conservé et affiché tel quel.

### 3.3 Chargement des modèles

- `lib/hub/charger.ts` : `chargerChemin(chemin)`, `chargerParId(serverId)` (`load_ptr`), `chargerPointeur(ptr)`. Chaque fonction met en cache par `_server_id` et accepte un `AbortSignal` (navigation, fermeture du jumeau).
- **Par lots.** Les listes d'enfants sont chargées par paquets de 100, en parallèle limité à 8.
- **À la demande.** Un arbre ne charge que les branches dépliées. Aucun parcours complet du graphe à l'ouverture d'un jumeau.
- **Graphe actif.** `SpinalGraphService` n'accepte qu'un graphe actif. L'ouverture d'un autre jumeau ferme proprement le précédent (abonnements, couleurs, sprites, tâches liées) avant de changer le graphe (ST-SOC-01, invariant 9.3-10).

### 3.4 Services Spinal réutilisés

Les paquets **sans interface** sont des dépendances directes, dans la version utilisée par le Studio livré (relevée dans ses sourcemaps) : `spinal-core-connectorjs`, `spinal-model-graph`, `spinal-env-viewer-graph-service`, `spinal-env-viewer-context-geographic-service`, `spinal-env-viewer-bim-manager-service`, `spinal-env-viewer-plugin-group-manager-service`, `spinal-env-viewer-plugin-documentation-service`, `spinal-env-viewer-plugin-network-tree-service`, `spinal-env-viewer-plugin-control-endpoint-service`, `spinal-env-viewer-plugin-excel-manager-service`, `spinal-env-viewer-plugin-nomenclature-service`, `spinal-env-viewer-task-service`, `spinal-service-ticket`, `spinal-spatial-referential`, `spinal-model-*` (bmsnetwork, bacnet, opcua, snmp, timeseries, analysis, documentation, ticket, bimobject, building-elements).

La logique **enfouie dans les plugins à interface** (bacnet-manager, opcua-manager, snmp-manager, device_profile, analysis, generate_geographic_context, scene, offset-calcul, version, item_model_selector, link_endpoint_timeseries…) est extraite dans `lib/domaines/<domaine>/` depuis `.tools/studio-sources/` ou les sourcemaps de `.browser_organs/viewer`. Elle est ensuite isolée de Vue 2, typée et couverte par des tests Vitest qui fixent le comportement historique **avant** toute correction d'anomalie.

Avant de coder chaque capacité, on compare la version du service extrait avec celle du build livré. Un écart est signalé dans le lot.

## 4. Réactivité et performance des modèles

Le piège n°1 : rendre réactifs les modèles spinalcore. Ce sont de très gros objets vivants, synchronisés par le hub. Règles impératives :

1. **Jamais de modèle spinalcore dans `$state`** (qui crée des proxies profonds). Utiliser `$state.raw`, ou des objets simples.
2. **Adaptateur unique** `lib/hub/reactif.svelte.ts` :
   ```ts
   // Instantané simple d'un modèle, mis à jour quand le hub le modifie.
   export function suivre<M, T>(modele: M, lire: (m: M) => T): { readonly valeur: T }
   ```
   Il fait `modele.bind(cb)`, recalcule `lire(modele)` en **une seule fois par image** (`requestAnimationFrame`), stocke le résultat en `$state.raw`, et appelle `unbind` à la destruction du composant (`$effect` avec nettoyage). C'est le seul endroit où un `bind` est autorisé, ce qui rend les fuites d'abonnements impossibles par construction (ST-SOC-05, 9.3-10).
3. Les composants reçoivent des **instantanés** : `{ id, nom, type, couleur, nbEnfants }`, jamais le nœud.
4. **Listes virtualisées partout** au-delà de 100 lignes : arbre, tableaux, fichiers, journaux.
5. Les traitements lourds (diff d'architecture, projection, comparaison de versions, parseurs XML/BOG/XLSX) tournent dans un **Web Worker** dès qu'ils dépassent 50 ms sur le jeu de test, avec progression dans le plateau des tâches.

### Budgets mesurés

Mesures Playwright headless, profil CPU Chromium ×4, sous `systemd-run --user --scope -p MemoryMax=8G` :

| Mesure | Budget | Référence actuelle à relever au lot 0 |
|---|---|---|
| JS initial (gz), hors viewer-rs | ≤ 150 Ko | Drive AngularJS, Studio |
| Drive : dossier de 2 000 fichiers affiché | ≤ 300 ms | Drive actuel |
| Studio : jumeau ouvert → navigateur interactif | ≤ 1,5 s (hors maquette) | Studio actuel |
| Arbre de 100 000 nœuds dépliés : défilement | 60 i/s, aucune tâche > 50 ms | — |
| Sélection 3D → fiche affichée | ≤ 150 ms | Studio actuel |
| Ouverture d'un atelier (code chargé à la demande) | ≤ 400 ms | — |
| Mémoire JS après 30 min d'usage type | stable (± 10 %) | — |

## 5. Viewer

- `static/viewer-rs/` contient le build de viewer-rs (`viewer3D.min.js` et ses bundles à la demande). Il est copié par `scripts/sync-viewer.sh` depuis `spinal-viewer-rs/dist`, avec la version notée. **Aucune modification** de ces fichiers.
- `lib/viewer/Viewer.svelte` crée un `Autodesk.Viewing.GuiViewer3D` dans son conteneur, une seule fois par session Studio. La barre, le cube de vue, la mesure, la coupe et les feuilles de viewer-rs restent les siennes.
- `lib/viewer/facade.ts` expose une API typée minimale aux écrans : `charger(scène|maquette)`, `selection` (lecture), `selectionner`, `isoler`, `masquer`, `cadrer`, `colorer(ensembles, couleur)`, `restaurerCouleurs(jeton)`, `capturer()`, `pointDeVue()` / `restaurerPointDeVue()`, `sprites`, `boiteDeSelection()`. Chaque ensemble d'objets est `{ modele, dbIds[] }[]`, donc multi-maquettes par construction (invariant 9.3-5).
- **Couleurs et sprites appartiennent à leur écran** : `colorer` renvoie un jeton, et l'écran qui l'a obtenu le libère à sa destruction. Fermer un atelier restaure toujours les couleurs.
- Les événements du viewer (`AGGREGATE_SELECTION_CHANGED`…) alimentent l'état `selection3D` en `$state.raw`, mis à jour une fois par image.
- Résolution objet 3D → nœud : `bimFileId` + `dbId`, sinon `externalId`, par le service BIM. Un objet sans nœud reste sélectionnable : les actions qui en ont besoin créent le `BIMObject` à la demande et le signalent (ST-BIM-08).
- Formats : SVF et **SBIM** (corrige le filtre historique `svf`, voir ST-BIM-10).

## 6. Registre des actions

Remplace l'enregistrement de boutons par les plugins (`GraphManagerTopBar`, `GraphManagerSideBar`, menu circulaire). Une action est déclarée une fois et apparaît partout où elle s'applique : menu contextuel de l'arbre, barre d'actions de la fiche, palette de commandes, menu de la sélection 3D.

```ts
interface Action {
  id: string;                     // 'geo.ajouter-piece'
  libelle: string;                // 'Ajouter une pièce'
  icone: Component;
  groupe: 'creer' | 'modifier' | 'relier' | 'voir' | 'exporter' | 'retirer' | 'supprimer';
  capacites: string[];            // ['ST-GEO-01'] : traçabilité
  quand(c: ContexteAction): boolean;          // type de nœud, contexte, sélection, profil
  executer(c: ContexteAction): Promise<void> | void;
  raccourci?: string;
  danger?: 'retrait' | 'suppression';         // impose une confirmation de portée (02-ux §5)
}
```

- `quand` décide de la **visibilité** uniquement. L'autorisation réelle reste celle du hub : un refus du hub est affiché comme erreur, jamais masqué (ST-SOC-02).
- Un test vérifie que chaque capacité de [06-tracabilite.md](06-tracabilite.md) est portée par au moins une action ou un écran.
- **Registre statique, pas de plugins (D10).** Chaque domaine exporte ses actions depuis `lib/domaines/<domaine>/actions.ts` ; `lib/actions/registre.ts` les importe explicitement. Ajouter un domaine = un dossier + une ligne dans le registre. Aucun chargement dynamique de paquets, aucune API d'extension publique : le code des ateliers est découpé par route (SvelteKit), et une fonction se masque par profil ou réglage, pas par désinstallation. Un domaine qui échoue au chargement est signalé comme indisponible, jamais ignoré en silence (contrairement à `safeImport`).

## 7. Tâches asynchrones

`lib/taches` : file observable de tâches `{ id, titre, cible, etat: 'attente'|'en-cours'|'succes'|'partiel'|'erreur'|'annulee', progression?, detail[], annuler? }`.

- Couvre les transferts (DR-06, DR-VER-02), les conversions (DR-DT-04), les découvertes réseau (ST-BAC-03/04, ST-OPC-02, ST-SNMP-01/02), les commandes de génération (ST-GEO-07), les imports et exports, et les pilotages d'organ (ST-MIS-02, ST-BAC-07).
- **Une demande n'est pas un succès.** Pour un organ, l'état affiché est celui que l'organ écrit, pas celui que l'interface a demandé (invariant 9.3-8).
- Les tâches survivent à la navigation dans l'application. Fermer l'onglet pendant une tâche demande confirmation (`beforeunload`).
- Résultat par élément pour les lots : réussis, ignorés (avec raison), en erreur. Relancer ne traite que les échecs.

## 8. État global et URL

- `lib/etat` : `session`, `jumeau` (fichier ouvert, graphe), `selection` (nœud courant + contexte de sélection + sélection 3D), `preferences` (dans `localStorage` : largeur des panneaux, colonnes, thème). Tout en runes, sans store externe.
- **L'URL porte la navigation** : section, dossier du Drive, jumeau, nœud sélectionné (`?noeud=<server_id>&contexte=<server_id>`), atelier ouvert. Recharger la page ou partager le lien restaure la vue (hors objets 3D sélectionnés).
- Anciens liens : `/html/viewer/?path=…` et les liens Drive historiques restent servis par les anciennes interfaces jusqu'à la bascule. Ensuite, une redirection décode `path` vers `/studio/jumeau/<id>` (lot 9).

## 9. Sécurité

- Pas d'identifiants dans l'URL ni dans `localStorage` (§3.2).
- Le chemin chiffré historique n'est pas une autorisation : l'application vérifie l'accès par le chargement hub lui-même et affiche « Jumeau inaccessible » en cas de refus (ST-SOC-01).
- Les **fonctions personnalisées** saisies par l'utilisateur (ST-IOT-04/05, ST-ANA) restent exécutées comme aujourd'hui, dans le navigateur, avec un avertissement explicite. Elles tournent dans un Worker sans accès au DOM ni au connecteur.
- Le contenu provenant du hub (noms, notes, valeurs) est toujours affiché comme texte, jamais comme HTML.

## 10. Build et déploiement

- `npm run build` dans `app/` produit `app/build/` (statique). Pas de build commité dans un premier temps : on le génère dans l'image Docker.
- Intégration à la pile SpinalCore (couche Docker de la racine, hors de ce dépôt) : copie de `app/build` dans `.browser_organs/studio` par `docker/patch.cjs`, et repli SPA dans `browser/http/index.js` (`/studio/*` → `/studio/index.html`). Ces deux changements seront proposés au lot 0. Ils ne cassent aucune route existante.
- Développement : `npm run dev` sur l'hôte, avec un proxy Vite vers le `web` de la pile de dev (`http://localhost:17504` pour `/sceen` et `/get_*`).

## 11. Qualité

- `svelte-check` et `tsc` sans erreur à chaque lot.
- Vitest sur `lib/domaines` : comportement historique figé avant correction, puis correction testée. Le registre des 41 opérations de calcul (ST-ANA-08) a un test par identifiant.
- Playwright headless (jamais d'affichage à l'écran) : un parcours par lot, rejoué à chaque lot suivant. Jeux de données dédiés, jamais la base de démonstration sans sauvegarde préalable.
- En-tête de licence SpinalCom sur chaque fichier.
