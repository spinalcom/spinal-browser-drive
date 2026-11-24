<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# 03 — Parcours : ce que l'utilisateur veut obtenir

Ce document remplace la description écran par écran comme référence de conception. On part de **ce que l'utilisateur veut obtenir**, puis on cherche **le chemin le plus court et le plus sûr**, sans reproduire les anciens écrans. Le détail fonctionnel (paramètres, cas limites) reste dans la [banque de cas](annexes/banque-de-cas.md). La preuve que rien n'est cassé vient de la [base de tests](08-tests.md).

Format de chaque parcours :
- **But** : ce que l'utilisateur veut obtenir.
- **Aujourd'hui** : ce qui coince dans l'existant.
- **Cible** : le déroulé idéal.
- **Écrit dans le graphe** : ce que les tests de graphe vérifient.
- **Mesure** : la mesure de performance associée.

## Trois idées transverses

1. **Tableau de bord du jumeau.** C'est la page d'accueil du Studio. Elle donne l'état de préparation du jumeau : maquettes converties, scène par défaut, géographie (pièces, objets rattachés, objets orphelins), classements, réseaux et surveillance, points de contrôle, analyses actives, organs joignables. Chaque ligne mène à l'action qui la complète. Aujourd'hui, rien ne dit à un intégrateur ce qui reste à faire.
2. **Aperçu avant écriture, partout.** Tout ce qui génère ou modifie en masse (génération géographique, projection, classement automatique, import Excel, profils, propagation, réconciliation, dashboards en lot) suit le même schéma : réglages → **aperçu des changements** (créations, modifications, suppressions, exclusions, avec « montrer dans la 3D ») → écriture → bilan. C'est le même composant (`DiffList`) et le même vocabulaire partout.
3. **Journal de session.** Chaque écriture faite dans l'application est listée dans un journal : quoi, sur quoi, quand, résultat, lien vers l'objet. Les écritures simples peuvent être annulées depuis ce journal. Il sert aussi au support : on peut l'exporter.

## P1 — Retrouver son travail
- **But** : se connecter et reprendre là où on en était.
- **Aujourd'hui** : déconnexion à chaque ouverture de la page de connexion, mot de passe stocké en clair, pas de « récents ».
- **Cible** : connexion → Drive ou jumeau rouvert à la dernière position. Liste des jumeaux récents dans la barre. Recherche globale (`Ctrl K`) de fichiers, jumeaux et objets.
- **Écrit dans le graphe** : rien (une connexion n'écrit pas, contrairement au « 1st visit » historique, qui reste une décision à prendre).
- **Mesure** : connexion → page utilisable ≤ 1 s.

## P2 — Ranger des fichiers
- **But** : déposer, nommer, déplacer, versionner, partager.
- **Aujourd'hui** : panneaux à disposer à la main, collisions de noms mal gérées, déplacements et suppressions multiples cassés.
- **Cible** : un explorateur classique (arbre, liste, détails), avec glisser-déposer partout, choix explicite en cas de collision, déplacement par « Déplacer vers… », annulation immédiate, versions et partage dans le panneau de détails.
- **Écrit dans le graphe** : structure des dossiers (références), `File.name`, conteneurs de versions, droits de partage.
- **Mesure** : dossier de 2 000 fichiers ≤ 300 ms ; 10 dépôts sans gel.

## P3 — Créer un jumeau à partir de maquettes
- **But** : passer de fichiers Revit/IFC à un jumeau visible en 3D.
- **Aujourd'hui** : créer le jumeau dans le Drive, ouvrir un gestionnaire, ajouter les assets, lancer chaque conversion, surveiller sans savoir quand c'est fini, ouvrir le Studio, composer une scène.
- **Cible** : **un seul assistant** : nom → déposer ou choisir les maquettes → conversion lancée automatiquement, avec suivi en tâche → scène par défaut créée avec toutes les maquettes prêtes → « Ouvrir le jumeau ». On peut quitter l'assistant : la suite se fait seule et le tableau de bord du jumeau montre où on en est.
- **Écrit dans le graphe** : fichier `Digital twin`, `SpinalGraph`, `BimFileContext`, nœuds `BimFile`, états de conversion des versions, scène par défaut.
- **Mesure** : temps de l'interface seulement (la conversion dépend de l'organ).

## P4 — Construire la géographie
- **But** : obtenir bâtiment, étages, pièces et équipements rattachés.
- **Aujourd'hui** : plusieurs assistants séparés (création manuelle, génération, import d'architecture, fusion, projection), chacun avec ses propres écrans et un vocabulaire technique.
- **Cible** : **un atelier Géographie unique** avec une seule question de départ (« À partir de quoi ? » : la maquette, des propriétés, à la main) et le même schéma pour tout : réglages → aperçu des différences par étage, avec la 3D synchronisée → corrections manuelles dans l'aperçu → exécution en tâche → bilan. La projection des équipements devient l'étape suivante proposée naturellement (« 1 240 objets ne sont rattachés à aucune pièce : les projeter ? »).
- **Écrit dans le graphe** : contexte géographique, nœuds et relations `hasGeographic*`, références, `BIMObject`, attributs spatiaux, lots de commandes.
- **Mesure** : aperçu de 5 000 pièces sans gel (Worker) ; exécution suivie.

## P5 — Intégrer une nouvelle version de maquette
- **But** : remplacer une maquette sans casser les données attachées aux objets.
- **Aujourd'hui** : outils éparpillés (comparaison, réconciliation des identifiants, mise à jour de l'architecture), qu'il faut connaître et enchaîner dans le bon ordre.
- **Cible** : **un parcours « Révision de maquette »** déclenché par l'ajout d'une version : comparaison automatique (ajoutés, supprimés, déplacés) → impact sur les données (objets supprimés qui portaient des attributs, tickets, points, documents) → réconciliation des identifiants → mise à jour de la géographie → bilan. Rien n'est écrit avant la validation de l'aperçu.
- **Écrit dans le graphe** : version courante, `dbId` des nœuds, géographie, nœuds orphelins signalés.
- **Mesure** : comparaison de deux versions de 100 000 objets ≤ 5 s (Worker).

## P6 — Consulter et documenter un objet
- **But** : tout savoir sur une pièce ou un équipement, et y ajouter de l'information.
- **Aujourd'hui** : six panneaux différents selon le plugin, menu circulaire, actions dispersées.
- **Cible** : clic dans l'arbre ou dans la 3D → **une fiche** : résumé, attributs, documents, notes (avec capture de la vue), mesures en direct, tickets, événements, relations. Tout s'ajoute depuis la fiche. Un objet 3D pas encore dans le graphe est créé à la première écriture.
- **Écrit dans le graphe** : catégories et attributs, liens de documents, notes, `BIMObject` créé à la demande.
- **Mesure** : clic → fiche ≤ 150 ms.

## P7 — Enrichir et classer en masse
- **But** : remplir des attributs et des classements sur des centaines d'objets.
- **Aujourd'hui** : tableau paginé, import Excel sans aperçu, génération de groupes sans aperçu.
- **Cible** : tableau plein écran, virtualisé, éditable comme un tableur, avec modifications en attente puis « Enregistrer ». Aller-retour Excel avec aperçu des différences. Classement par règle avec aperçu des groupes.
- **Écrit dans le graphe** : attributs, contextes de groupes, catégories, groupes, appartenances.
- **Mesure** : 20 000 lignes fluides ; enregistrement de 1 000 modifications ≤ 10 s.

## P8 — Raccorder la GTB
- **But** : relier le bâtiment aux automates et aux points de mesure réels.
- **Aujourd'hui** : une douzaine d'outils (contexte BMS, découverte par protocole, profils, items, supervision, arborescence technique, profils virtuels, rapprochement BIM/BMS, surveillance) sans ordre indiqué. Plusieurs bugs bloquants (ST-PROF-08, ST-PROF-10, ST-IOT-04, ST-IOT-10).
- **Cible** : **un atelier Réseaux en pipeline**, avec l'état de chaque étape visible : 1. connecteurs (organs) → 2. découverte → 3. profils → 4. arborescence technique et rapprochement BIM/BMS → 5. surveillance et historisation. Chaque étape montre ce qui est fait et ce qui reste (« 34 automates sans profil »). Les réglages propres à chaque protocole sont gardés.
- **Écrit dans le graphe** : contexte `Network`, réseaux, dispositifs, endpoints, profils, items et leurs liens, arborescence technique, correspondances, listeners de surveillance.
- **Mesure** : aperçu de génération de 5 000 objets ≤ 2 s ; état d'un organ reflété ≤ 2 s.

## P9 — Définir et voir les points de contrôle
- **But** : définir des indicateurs métier (température, occupation…) et les voir sur le bâtiment.
- **Cible** : éditeur de profil avec seuils et couleurs, propagation avec aperçu (« 3 créations sur 240 objets »), heatmap 3D en un clic depuis un groupe, courbes sous le viewer.
- **Écrit dans le graphe** : profils, instances de points, liens de séries.
- **Mesure** : heatmap de 1 000 pièces sans gel ; courbe de 500 000 points ≤ 200 ms.

## P10 — Suivre incidents et interventions
- **But** : déclarer, suivre et planifier.
- **Cible** : tickets en colonnes par étape, ou en liste ; déclaration depuis la fiche ou la 3D ; calendrier des événements avec des portées d'annulation claires ; vue 3D colorée par étape ou par groupe.
- **Écrit dans le graphe** : tickets, étapes, journaux, événements, séries.
- **Mesure** : 2 000 événements fluides.

## P11 — Configurer une analyse
- **But** : faire calculer automatiquement des indicateurs ou des alarmes.
- **Aujourd'hui** : assistant fermé en plusieurs écrans, prévisualisation partielle, rattrapage non enregistré.
- **Cible** : une page d'édition avec sommaire, un graphe des dépendances des calculs, la prévisualisation des entrées et du résultat par entité (sans aucun effet), les 5 prochaines exécutions affichées, et un avertissement si l'organ d'analyse ne tourne pas.
- **Écrit dans le graphe** : nœuds de configuration, catégories d'attributs de l'analyse, liens à l'ancre.
- **Mesure** : ouverture ≤ 300 ms.

## P12 — Diagnostiquer et réparer
- **But** : comprendre un problème de données et le corriger.
- **Cible** : inspecteur de modèle (structure et graphe), mode expert dans la fiche, journal de session, état du hub et maintenance. Ces outils sont réservés aux experts et ne s'affichent pas dans l'usage courant.
- **Écrit dans le graphe** : valeurs atomiques éditées, avec avertissement.

## Correspondance avec les capacités

| Parcours | Capacités principales |
|---|---|
| P1 | DR-01, ADM-04, ST-SOC-01, ST-SOC-05 |
| P2 | DR-02 à DR-13, DR-VER-* |
| P3 | DR-DT-*, ST-BIM-01, ST-BIM-10 |
| P4 | ST-GEO-*, ST-VIS-01, ST-ATT-05 |
| P5 | ST-BIM-02 à 04, ST-GEO-05, 06, 11, DR-VER-03 |
| P6 | ST-ATT-01, ST-DOC-*, ST-MES-01 à 05, ST-BIM-05 à 09, ST-GRA-*, ST-LINK-* |
| P7 | ST-ATT-02 à 04, ST-GRP-*, ST-BIM-07 |
| P8 | ST-IOT-*, ST-PROF-*, ST-BAC-*, ST-OPC-*, ST-SNMP-*, ST-ORG-*, ST-VIS-02 |
| P9 | ST-CP-*, ST-SIM-*, ST-MES-06 à 08, ST-DASH-* |
| P10 | ST-TIC-*, ST-EVT-*, ST-MIS-* |
| P11 | ST-ANA-* |
| P12 | GI-*, ADM-01 à 03, ST-GRA-07 |
