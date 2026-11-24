<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# Refonte du Drive et du Studio en Svelte — spécifications

État : **v2, 24/11/2026**, à valider. Avancement : socle de tests de graphe (lot 0, début), maquettes du Drive (`maquettes/drive/`), **design system réalisé** (`app/src/lib/ui/`, page `/studio/_ds`). Branche `refonte-svelte` du dépôt `spinal-browser-drive`. Rien n'est fusionné sur `dev` ni `master`.

## 1. Objet

Remplacer les interfaces historiques du **Drive** (AngularJS 1.6 + Angular Material + GoldenLayout) et du **Spinal Studio** (Vue 2 + vue-material + Vuetify 1 + ~60 plugins, livré sans dépôt source) par **une seule application Svelte 5**, écrite de zéro, avec une UX et une UI repensées.

Le **viewer 3D n'est pas concerné** : viewer-rs est conservé tel quel (moteur Rust/WASM et interface). La nouvelle application l'intègre au moyen de son API `Autodesk.Viewing`, sans le modifier.

Critère de réussite :
1. les **tests de graphe** montrent que chaque opération écrit la même chose que l'ancien Studio, à l'exception des corrections déclarées ;
2. les **benchmarks** sont meilleurs que l'ancien ;
3. les **parcours** sont validés par l'utilisateur.

Les 183 capacités de [`capacites-studio-drive.md`](../../../../docs/capacites-studio-drive.md) (copie de travail : `/home/vitrix/dev/spinalcore/docs/capacites-studio-drive.md`) servent de liste de contrôle : rien ne doit être oublié, mais l'interface n'a pas à les reproduire écran par écran.

## 2. Décisions de cadrage

| # | Décision | Statut |
|---|---|---|
| D1 | Framework : **Svelte 5** (runes) + **SvelteKit** en mode SPA (adaptateur statique, sans SSR). | Choix de l'utilisateur (24/11) |
| D2 | Viewer : **viewer-rs inchangé**, chargé tel quel, piloté par son API `Autodesk.Viewing`. | Choix de l'utilisateur (24/11) |
| D3 | Périmètre : **Drive + Studio + Admin du hub + inspecteurs** (DB Inspector, Graph Inspector). L'ancien **SpinalTwin** (« ST App list ») est hors périmètre : ses usages relèvent du portail BOS. | **À valider** |
| D4 | **Une seule application**, servie par le serveur `web` sous `/studio/`. Le Drive en est une section. Une seule session hub pour tout, donc ouvrir un jumeau ne recharge rien. | **À valider** |
| D5 | Identité visuelle **commune avec le portail et viewer-rs** : marine `#14202c`, orange de signalisation `#ff7a00`, fonds bleu-gris, Geist / Geist Mono. Le viewer et l'application forment un seul produit. | **À valider** |
| D6 | Accès aux données : **connecteur hub** (`spinal-core-connectorjs`) et services Spinal existants, comme aujourd'hui. L'API BOS n'est pas requise, car elle ne sert que le jumeau actif (voir [architecture §3](01-architecture.md#3-données)). | Proposé |
| D7 | La logique métier existante est **extraite, pas réécrite** : les services Spinal sans interface sont réutilisés comme dépendances, et la logique enfouie dans les plugins est extraite depuis les sourcemaps, avec sa source citée. Seules les interfaces sont refaites. | Proposé |
| D8 | Hébergement du code : dossier `app/` sur la branche `refonte-svelte` du dépôt Drive, **provisoirement**. À déplacer vers un dépôt dédié (`spinal-browser-studio`) si le projet est validé. | **À valider** |
| D9 | Coexistence : les anciennes interfaces restent servies à leurs URL jusqu'à la bascule (lot 9). Aucun ancien lien n'est cassé. | Proposé |

## 3. Sommaire

| Fichier | Contenu |
|---|---|
| [01-architecture.md](01-architecture.md) | Stack, structure du code, couche de données hub, réactivité, viewer, actions, tâches asynchrones, sécurité, performance, build et déploiement |
| [02-ux.md](02-ux.md) | Principes UX, structure de l'application, modèles d'interaction transverses (sélection, actions, confirmations, lots, asynchrone, erreurs), clavier, accessibilité, responsive |
| [03-parcours.md](03-parcours.md) | **Référence de conception** : 12 parcours (but, problème actuel, cible, ce qui est écrit dans le graphe, mesure) |
| [05-design-system.md](05-design-system.md) | Tokens, typographie, icônes, inventaire et contrat de chaque composant réutilisable |
| [06-tracabilite.md](06-tracabilite.md) | Matrice des 183 capacités → écran, lot et décision ; décisions ouvertes |
| [07-lots-recette.md](07-lots-recette.md) | Découpage en lots, cible mesurable et critère d'arrêt de chaque lot, bascule |
| [08-tests.md](08-tests.md) | **Référence de recette** : base de tests (unitaires, graphe ancien contre nouveau, composants, parcours, benchmarks), jeux de données |
| [annexes/banque-de-cas.md](annexes/banque-de-cas.md) | Détail des 183 capacités en 3 000 points : sert de liste de contrôle pour les tests, pas de cahier des charges |
| [annexes/ecrans-drive-admin.md](annexes/ecrans-drive-admin.md), [annexes/ecrans-studio.md](annexes/ecrans-studio.md) | v1 écran par écran, provisoire, à refondre avec les maquettes |

Principe : **on conçoit à partir des parcours, on prouve avec les tests.** Une fonction est faite quand son test de graphe (ancien contre nouveau) et son test de parcours passent, et que ses benchmarks respectent les budgets.

Étapes suivantes : vos remarques → mise à jour des specs → **design system** → **maquettes** → lot 0 (socle et outillage de tests).

## 4. Glossaire

| Terme | Sens dans ces specs |
|---|---|
| **Application** | La nouvelle SPA Svelte servie sous `/studio/`. |
| **Drive** | Section de l'application qui explore le système de fichiers d'objets du hub (`/__users__/<utilisateur>`). |
| **Studio** | Section de l'application qui travaille sur **un** jumeau ouvert (graphe + viewer). |
| **Jumeau** | Fichier Drive de type `Digital twin` pointant vers un `SpinalGraph`. |
| **Nœud** | `SpinalNode` du graphe. Identité technique = `_server_id` (identifiant serveur), identité métier = `info.id` (staticId). |
| **Contexte** | `SpinalContext`, racine d'un domaine (géographie, groupes, réseaux, tickets…). |
| **Objet 3D** | Élément d'une maquette chargée, identifié par `(modèle, dbId)` et résolu en `BIMObject` par `bimFileId` + `dbId` (ou `externalId`). |
| **Fiche** | Panneau de droite du Studio qui présente l'objet courant : attributs, documents, notes, points, tickets, événements, relations. |
| **Atelier** | Espace de travail plein cadre pour une tâche lourde ou en plusieurs étapes (génération géographique, réseaux, analyses…). |
| **Ensemble de sélection** | Collection nommée d'objets 3D ou de nœuds, construite par ajouts successifs et réutilisée par un atelier. |
| **Tâche** | Opération asynchrone suivie dans le plateau des tâches : transfert, conversion, découverte réseau, génération, export. |
| **Organ** | Processus serveur externe (forge, BACnet, OPC UA, SNMP, Mission, analyse) piloté par des écritures dans le graphe. |
| **Capacité** | Identifiant `DR-*`, `ST-*`, `GI-*`, `ADM-*` de l'inventaire. |

## 5. Hors périmètre

- Modifier viewer-rs (moteur ou interface).
- Modifier le hub, l'API BOS, les organs ou les modèles de données. Si une capacité l'exige, c'est signalé comme décision ouverte dans [06-tracabilite.md](06-tracabilite.md).
- Le portail BOS (SpinalWall) et ses micro-apps.
- L'ancien SpinalTwin (voir D3).
- La traduction : interface en français seulement.
