<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# 06 — Traçabilité des 183 capacités

Chaque capacité de l'inventaire [`capacites-studio-drive.md`](../../../../docs/capacites-studio-drive.md) a une destination (écran et section de ces specs), un lot ([07-lots-recette.md](07-lots-recette.md)) et une décision.

Signification des décisions :
- **Conservée** : même intention, nouvelle interface.
- **Conservée + corrigée** : une anomalie historique documentée est corrigée. Le comportement historique est d'abord figé par un test, puis la correction est testée.
- **Conservée, améliorée** : même intention, avec une amélioration d'usage sans changement de données.
- **Décision O-x** : point ouvert, listé ci-dessous.

La recette de chaque ligne est celle de la fiche correspondante de l'inventaire, à laquelle s'ajoute la recette transversale ([07 §3](07-lots-recette.md#3-recette-transversale)).

Répartition par lot : lot 0 : 1 · lot 1 : 20 · lot 2 : 29 · lot 3 : 18 · lot 4 : 10 · lot 5 : 19 · lot 6 : 23 · lot 7 : 45 (7a et 7b) · lot 8 : 14 · lot 9 : 4 (total 183). Le lot 0 porte surtout le socle commun, d'où son unique capacité propre.

## 1. Décisions ouvertes

| # | Question | Proposition |
|---|---|---|
| O-1 | Partage : afficher les accès existants d'un fichier et permettre leur révocation ? | Vérifier au lot 1 si le hub expose les droits d'un modèle. Si oui, ajouter liste et révocation. Sinon, garder la mention honnête de la limite. |
| O-2 | Gestion des comptes hub (créer, supprimer, droits) dans l'Admin ? | Le proxy `web` expose déjà `/get_new_account`, `/get_delete_account_by_admin`, `/get_change_account_rights_by_admin`. Proposition : l'ajouter au lot 1, en écran séparé, après validation de son usage réel. |
| O-3 | Ouvrir une courbe crée la série temporelle absente (`getOrCreateTimeSeries`) : faut-il le garder ? | Non : une lecture n'écrit rien. La série est créée par l'acquisition ou par une écriture explicite. |
| O-4 | Correspondance entre profils Studio (bits de `/etc/UserProfileDir`) et profils BOS. | Garder les profils hub (le Studio est un outil hub). Table de traduction des bits en noms dans `lib/actions/profils.ts`, à valider avec un administrateur. |
| O-5 | Corbeille dans le Drive ? | Non au départ (absente historiquement). La confirmation le dit. À reconsidérer après le lot 1. |
| O-6 | Recherche du navigateur : index complet du graphe ou nœuds chargés seulement ? | Utiliser la recherche du service de graphe si elle couvre tout le graphe, sinon indiquer la portée. Mesure de coût au lot 2. |
| O-7 | Les fonctions personnalisées historiques (ST-IOT-04/05, ST-ANA) supposent-elles des globales du navigateur ? | Les exécuter dans un Worker isolé. Au lot 7, relire les configurations existantes pour repérer les fonctions qui échoueraient, et prévoir un repli documenté. |
| O-8 | Date de bascule des anciennes URL (`/drive/`, `/html/viewer/`, `/admin/`) vers la nouvelle application. | Lot 9, après recette complète. Les anciennes interfaces restent accessibles en lecture pendant une période transitoire à définir. |
| D3 · D4 · D5 · D8 | Périmètre, application unique, identité visuelle, dépôt d'hébergement. | Voir [README §2](README.md#2-décisions-de-cadrage). |

## 2. Matrice

| Capacité | Intitulé | Destination | Lot | Décision |
|---|---|---|---|---|
| DR-01 | Accéder à son espace du hub et gérer sa session | Connexion — 03 §1 ; session — 01 §3.2 | 0 | Conservée, améliorée : identifiants hors localStorage, déconnexion non implicite. |
| DR-02 | Parcourir dossiers et sous-dossiers avec un chemin intelligible | Drive › explorateur — 03 §2.1–2.3 | 1 | Conservée. |
| DR-03 | Identifier les objets et suivre leur état | Drive › explorateur — 03 §2.1–2.3 | 1 | Conservée : « première visite » remplace le libellé trompeur « création ». |
| DR-04 | Sélectionner un ou plusieurs objets | Drive › explorateur — 03 §2.1–2.3 | 1 | Conservée. |
| DR-05 | Créer et nommer un dossier | Drive › explorateur — 03 §2.1–2.3 | 1 | Conservée + corrigée : même gestion des collisions depuis l'arbre et l'explorateur ; Unicode accepté. |
| DR-06 | Déposer des fichiers binaires et suivre leur transfert | Drive › explorateur — 03 §2.1–2.3 | 1 | Conservée + corrigée : collisions réellement gérées ; dépôt sur ligne de dossier réparé. Dépôt de dossier local : refusé avec message. |
| DR-07 | Renommer une entrée sans perdre ses données | Drive › explorateur — 03 §2.1–2.3 | 1 | Conservée, améliorée : Unicode accepté, annulation par toast. |
| DR-08 | Déplacer des références entre dossiers | Drive › explorateur — 03 §2.1–2.3 | 1 | Conservée + corrigée : condition de type toujours vraie supprimée ; ajout avant retrait (pas de perte en cas d'échec). |
| DR-09 | Supprimer une entrée ou une sélection | Drive › explorateur — 03 §2.1–2.3 | 1 | Conservée + corrigée : suppression multiple réparée ; règle « visa » appliquée partout. |
| DR-10 | Télécharger le contenu d'un fichier | Drive › explorateur — 03 §2.1–2.3 | 1 | Conservée. Archive ZIP de dossier : non prévue (absente historiquement). |
| DR-11 | Partager un fichier, un dossier ou un modèle avec des utilisateurs | Drive › détails › Partage — 03 §2.5 | 1 | Conservée. Liste et révocation des accès : décision O-1. |
| DR-12 | Consulter le journal associé à un objet | Drive › détails › Journal — 03 §2.6 | 1 | Conservée (instantané, actualisation manuelle). |
| DR-13 | Ouvrir plusieurs vues de travail et les organiser | Drive › Vue double — 03 §2.7 | 1 | Conservée sous forme de vue double (remplace GoldenLayout). |
| DR-VER-01 | Conserver l'historique de versions d'un fichier | Drive › détails › Versions — 03 §2.4 | 1 | Conservée. |
| DR-VER-02 | Ajouter une version sans recréer le fichier logique | Drive › détails › Versions — 03 §2.4 | 1 | Conservée. |
| DR-VER-03 | Changer la version courante, y compris revenir en arrière | Drive › détails › Versions — 03 §2.4 | 1 | Conservée. |
| DR-VER-04 | Décrire, prévisualiser et supprimer une version | Drive › détails › Versions — 03 §2.4 | 1 | Conservée. |
| DR-DT-01 | Créer un jumeau numérique vide | Drive › Jumeau (assistant, onglet Maquettes) — 03 §3 | 2 | Conservée. |
| DR-DT-02 | Associer plusieurs fichiers sources à un jumeau | Drive › Jumeau (assistant, onglet Maquettes) — 03 §3 | 2 | Conservée + corrigée : anti-doublon par identité du fichier, pas par nom. |
| DR-DT-03 | Reconnaître les formats candidats à la conversion | Drive › Jumeau (assistant, onglet Maquettes) — 03 §3 | 2 | Conservée. |
| DR-DT-04 | Demander et suivre la conversion d'un asset | Drive › Jumeau (assistant, onglet Maquettes) — 03 §3 | 2 | Conservée + corrigée : pas de double demande pendant une conversion. |
| DR-DT-05 | Retirer un asset du jumeau | Drive › Jumeau (assistant, onglet Maquettes) — 03 §3 | 2 | Conservée, avec confirmation de portée (absente historiquement). |
| DR-DT-06 | Ouvrir les outils sur le bon jumeau | Drive › Ouvrir un jumeau — 03 §2.2, §3.2 | 2 | Conservée. |
| GI-01 | Inspecter récursivement un modèle du hub | Inspecteur › vue Structure — 03 §4 | 9 | Conservée. |
| GI-02 | Modifier une valeur atomique dans l'inspecteur | Inspecteur › vue Structure — 03 §4 | 9 | Conservée. |
| GI-03 | Explorer le graphe avec l'inspecteur autonome | Inspecteur › vue Graphe — 03 §4 | 9 | Conservée. |
| ADM-01 | Consulter l'état du hub | Admin du hub — 03 §5 | 1 | Conservée. |
| ADM-02 | Déclencher les opérations de maintenance exposées par le hub | Admin du hub — 03 §5 | 1 | Conservée. |
| ADM-03 | Reconnaître les rôles historiques et les comptes | Admin du hub — 03 §5 | 1 | Lecture seule. Gestion complète des comptes : décision O-2. |
| ADM-04 | Modifier son mot de passe hub et naviguer entre outils | Menu du compte › Mot de passe — 03 §5 | 1 | Conservée ; garde-fou sur le compte admin (configuration Docker). |
| ST-SOC-01 | Ouvrir et garder un contexte de travail cohérent | Shell du Studio — 04 §1 | 2 | Conservée. |
| ST-SOC-02 | Afficher les actions compatibles avec la sélection et les droits | Registre des actions — 01 §6 ; 04 §2 | 2 | Conservée. |
| ST-SOC-03 | Utiliser ensemble le graphe et la représentation 3D | Shell du Studio — 04 §1 | 2 | Conservée. |
| ST-SOC-04 | Charger le viewer et isoler les échecs de modules | Shell du Studio — 04 §1 | 2 | Conservée. |
| ST-SOC-05 | Quitter le Studio et libérer son travail d'interface | Shell du Studio — 04 §1 | 2 | Conservée + corrigée : vraie déconnexion (signOut absent historiquement). |
| ST-VIS-01 | Mémoriser les positions spatiales des objets BIM | Atelier Géographie › Recalculer — 04 §5.1 | 3 | Conservée + corrigée : fin de tâche après toutes les écritures ; pas d'écrasement par zéro. |
| ST-VIS-02 | Représenter le réseau matériel dans la 3D | Atelier Réseaux › Vue 3D du réseau — 04 §5.4 d | 7 | Conservée ; filtres de préfixes rendus visibles et réglables. |
| ST-GRA-01 | Explorer les contextes et les objets du jumeau | Navigateur du jumeau — 04 §2 | 2 | Conservée. |
| ST-GRA-02 | Rechercher un nœud par son nom | Navigateur du jumeau — 04 §2 | 2 | Conservée ; portée de la recherche affichée. |
| ST-GRA-03 | Renommer un nœud et définir sa couleur | Navigateur du jumeau — 04 §2 | 2 | Conservée. |
| ST-GRA-04 | Supprimer des nœuds avec un périmètre explicite | Navigateur du jumeau — 04 §2 | 2 | Conservée ; périmètre et nombre exacts avant validation. |
| ST-GRA-05 | Retirer des relations sans supprimer les objets | Navigateur du jumeau — 04 §2 | 2 | Conservée. |
| ST-GRA-06 | Inspecter les relations et ordonner les enfants | Fiche › Relations (ordonner) — 04 §3.8 ; arbre — 04 §2 | 2 | Conservée. |
| ST-GRA-07 | Ouvrir l'inspecteur de graphe technique | Navigateur › Inspecter le modèle — 04 §2 ; 03 §4 | 9 | Conservée. |
| ST-GRA-08 | Exporter la structure d'un contexte en CSV | Navigateur du jumeau — 04 §2 | 2 | Conservée. |
| ST-GEO-01 | Construire manuellement la hiérarchie géographique | Atelier Géographie — 04 §5.1 | 3 | Conservée. |
| ST-GEO-02 | Associer des objets BIM à une entité et distinguer les références | Atelier Géographie — 04 §5.1 | 3 | Conservée. |
| ST-GEO-03 | Inscrire un contexte dans les référentiels géographiques | Atelier Géographie — 04 §5.1 | 3 | Conservée. |
| ST-GEO-04 | Générer une hiérarchie depuis des propriétés de maquette | Atelier Géographie — 04 §5.1 | 3 | Conservée. |
| ST-GEO-05 | Importer ou mettre à jour l'architecture depuis une maquette | Atelier Géographie — 04 §5.1 | 3 | Conservée. |
| ST-GEO-06 | Examiner les différences et corriger les correspondances spatiales | Atelier Géographie — 04 §5.1 | 3 | Conservée. |
| ST-GEO-07 | Préparer, conserver et exécuter des commandes de génération | Atelier Géographie — 04 §5.1 | 3 | Conservée ; exécution suivie dans le plateau des tâches. |
| ST-GEO-08 | Fusionner plusieurs organisations BIM Geo dans la géographie d'exploitation | Atelier Géographie — 04 §5.1 | 3 | Conservée. |
| ST-GEO-09 | Projeter des équipements dans les espaces | Atelier Géographie — 04 §5.1 | 3 | Conservée. |
| ST-GEO-10 | Résoudre manuellement les affectations ambiguës de projection | Atelier Géographie — 04 §5.1 | 3 | Conservée. |
| ST-GEO-11 | Réparer et recalculer les informations spatiales dérivées | Atelier Géographie — 04 §5.1 | 3 | Conservée. |
| ST-BIM-01 | Composer et charger des scènes multimodèles | Atelier Maquettes et scènes — 04 §5.2 | 3 | Conservée. |
| ST-BIM-02 | Calculer et enregistrer les offsets des modèles par scène | Atelier Maquettes et scènes — 04 §5.2 | 3 | Conservée. |
| ST-BIM-03 | Comparer deux versions d'une maquette | Atelier Maquettes et scènes — 04 §5.2 | 3 | Conservée. |
| ST-BIM-04 | Réconcilier les identifiants BIM après changement de version | Atelier Maquettes et scènes — 04 §5.2 | 3 | Conservée ; introuvables listés et exportables en plus du `-1`. |
| ST-BIM-05 | Sélectionner, isoler et cadrer depuis une structure métier | Viewer et sélection 3D — 04 §4 | 2 | Conservée. |
| ST-BIM-06 | Constituer une sélection 3D par rectangle | Viewer › Sélection rectangle — 04 §4 | 2 | Conservée. |
| ST-BIM-07 | Rechercher des objets par propriétés BIM et attributs Spinal | Recherche avancée — 04 §4 | 4 | Conservée. |
| ST-BIM-08 | Accéder aux actions métier depuis un objet sélectionné en 3D | Menu de la sélection 3D, fiche d'objet 3D — 04 §3, §4 | 2 | Conservée ; menu contextuel du viewer remplace le menu circulaire. |
| ST-BIM-09 | Interagir avec la vue et les propriétés natives du modèle | viewer-rs inchangé, fiche › Résumé — 04 §3.1, §4 | 2 | Conservée. |
| ST-BIM-10 | Charger la représentation choisie d'un fichier BIM | Atelier Maquettes et scènes — 04 §5.2 | 3 | Conservée + étendue au format SBIM. |
| ST-GRP-01 | Définir des classifications transverses typées | Atelier Données › Classements — 04 §5.3 | 4 | Conservée. |
| ST-GRP-02 | Affecter ou retirer des éléments d'un groupe | Fiche › Relations › Groupes — 04 §3.8 | 4 | Conservée. |
| ST-GRP-03 | Visualiser les groupes et retrouver une pièce depuis un objet | Fiche › Relations › Groupes ; Trouver sa pièce — 04 §3.8 | 4 | Conservée. |
| ST-ATT-01 | Lire et enrichir les attributs d'un objet | Fiche › Attributs — 04 §3.2 | 2 | Conservée. |
| ST-ATT-02 | Éditer les attributs en tableau et en masse | Atelier Données (tableau) — 04 §5.3 | 4 | Conservée. |
| ST-ATT-03 | Exporter et réimporter les données attributaires Excel | Atelier Données (tableau) — 04 §5.3 | 4 | Conservée. |
| ST-ATT-04 | Enregistrer les profils de colonnes et les échanger | Atelier Données (tableau) — 04 §5.3 | 4 | Conservée. |
| ST-ATT-05 | Initialiser un attribut de capacité à partir de la surface des pièces | Atelier Géographie › Recalculer — 04 §5.1 | 3 | Conservée ; contexte choisi explicitement (plus de nom `spatial` imposé). |
| ST-GRP-04 | Générer automatiquement les catégories et groupes | Atelier Données › Classements — 04 §5.3 | 4 | Conservée. |
| ST-DOC-01 | Attacher et consulter des fichiers sur les objets | Fiche › Documents — 04 §3.3 | 2 | Conservée. |
| ST-DOC-02 | Télécharger et désassocier des documents | Fiche › Documents — 04 §3.3 | 2 | Conservée. |
| ST-DOC-03 | Gérer des liens URL documentaires | Fiche › Documents — 04 §3.3 | 2 | Conservée. |
| ST-DOC-04 | Échanger des notes contextualisées | Fiche › Notes — 04 §3.4 | 2 | Conservée. |
| ST-DOC-05 | Annoter avec une capture et un point de vue 3D restaurable | Fiche › Notes › Capturer la vue — 04 §3.4 | 2 | Conservée. |
| ST-DOC-06 | Retrouver visuellement les objets associés aux notes | Fiche › Notes ; navigateur (groupe de notes) — 04 §3.4 | 2 | Conservée. |
| ST-SIM-01 | Importer une série Excel comme profil réutilisable | Atelier Points de contrôle › Simulation — 04 §5.5 | 6 | Conservée. |
| ST-SIM-02 | Affecter un profil importé à un point de contrôle | Atelier Points de contrôle › Simulation — 04 §5.5 | 6 | Conservée. |
| ST-IOT-01 | Créer un contexte réseau logique et ses réseaux | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-IOT-02 | Ajouter une sélection 3D à l'arborescence réseau | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-IOT-03 | Définir les ensembles d'automates et d'objets contrôlés | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-IOT-04 | Paramétrer l'association automate–objets | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-IOT-05 | Définir une convention de nommage issue des données | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-IOT-06 | Prévisualiser et générer le réseau technique | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-IOT-07 | Consulter et exporter le contenu d'un réseau | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-IOT-08 | Retirer les liens du contenu d'une arborescence réseau | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-IOT-09 | Affecter un profil virtuel à des automates BIM | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-IOT-10 | Corriger manuellement les correspondances et détacher un profil | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-IOT-11 | Rapprocher les automates BIM et les dispositifs réels BMS | Atelier Réseaux › Arborescence technique — 04 §5.4 a | 7 | Conservée. |
| ST-PROF-01 | Créer la bibliothèque de profils et ses dispositifs modèles | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-PROF-02 | Générer un profil depuis un fichier XML d'automate | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-PROF-03 | Générer un profil depuis un dispositif découvert | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-PROF-04 | Mettre à jour un profil généré après évolution d'un dispositif | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-PROF-05 | Gérer les items fonctionnels d'un dispositif modèle | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-PROF-06 | Importer une liste d'items et leurs liaisons depuis BOG | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-PROF-07 | Exporter les items et leurs entrées/sorties en JSON | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-PROF-08 | Définir les entrées/sorties et le rôle maître d'un item | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-PROF-09 | Classer les points d'un item en mesures, alarmes et commandes | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-PROF-10 | Configurer les périodicités de surveillance d'un item ou du dispositif | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-PROF-11 | Configurer la supervision globale des mesures, alarmes et commandes | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-BAC-01 | Créer un contexte BMS et y référencer les organs disponibles | Atelier Réseaux › Connecteurs (BACnet) — 04 §5.4 c | 7 | Conservée. |
| ST-BAC-02 | Créer un sous-réseau BACnet | Atelier Réseaux › Connecteurs (BACnet) — 04 §5.4 c | 7 | Conservée. |
| ST-BAC-03 | Découvrir des dispositifs par broadcast ou unicast | Atelier Réseaux › Connecteurs (BACnet) — 04 §5.4 c | 7 | Conservée. |
| ST-BAC-04 | Sélectionner les résultats et créer le réseau découvert | Atelier Réseaux › Connecteurs (BACnet) — 04 §5.4 c | 7 | Conservée. |
| ST-BAC-05 | Récupérer les valeurs/objets BACnet d'une sélection de dispositifs | Atelier Réseaux › Connecteurs (BACnet) — 04 §5.4 c | 7 | Conservée. |
| ST-BAC-06 | Affecter ou détacher un profil métier aux dispositifs BACnet | Atelier Réseaux › Connecteurs (BACnet) — 04 §5.4 c | 7 | Conservée. |
| ST-BAC-07 | Démarrer, arrêter ou redémarrer la surveillance | Atelier Réseaux › Connecteurs (BACnet) — 04 §5.4 c | 7 | Conservée. |
| ST-BAC-08 | Activer/désactiver l'enregistrement des séries temporelles | Atelier Réseaux › Connecteurs (BACnet) — 04 §5.4 c | 7 | Conservée. |
| ST-BAC-09 | Demander le redémarrage d'un organ et localiser les objets BIM liés | Atelier Réseaux › Connecteurs (BACnet) — 04 §5.4 c | 7 | Conservée. |
| ST-OPC-01 | Créer un sous-réseau et préparer une découverte multi-passerelles | Atelier Réseaux › Connecteurs (OPC UA) — 04 §5.4 c | 7 | Conservée. |
| ST-OPC-02 | Découvrir, filtrer l'arbre et créer les nœuds OPC UA | Atelier Réseaux › Connecteurs (OPC UA) — 04 §5.4 c | 7 | Conservée. |
| ST-OPC-03 | Générer un profil de surveillance depuis un dispositif | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-OPC-04 | Répartir les points entre intervalles de surveillance | Atelier Réseaux › Supervision — 04 §5.4 b | 7 | Conservée. |
| ST-OPC-05 | Affecter un profil et gérer surveillance/historisation | Atelier Réseaux › Connecteurs (OPC UA) — 04 §5.4 c | 7 | Conservée. |
| ST-SNMP-01 | Préparer et lancer une découverte avec MIB | Atelier Réseaux › Connecteurs (SNMP) — 04 §5.4 c | 7 | Conservée. |
| ST-SNMP-02 | Choisir les OID découverts et créer la structure BMS | Atelier Réseaux › Connecteurs (SNMP) — 04 §5.4 c | 7 | Conservée. |
| ST-SNMP-03 | Générer et affecter un profil SNMP | Atelier Réseaux › Bibliothèque de profils — 04 §5.4 b | 7 | Conservée. |
| ST-SNMP-04 | Régler intervalle et historisation par OID, individuellement ou en masse | Atelier Réseaux › Supervision — 04 §5.4 b | 7 | Conservée. |
| ST-SNMP-05 | Piloter la surveillance des dispositifs SNMP | Atelier Réseaux › Connecteurs (SNMP) — 04 §5.4 c | 7 | Conservée. |
| ST-ORG-01 | Créer manuellement réseau et dispositif BMS | Atelier Réseaux › Organisation manuelle — 04 §5.4 c | 7 | Conservée. |
| ST-ORG-02 | Créer un endpoint typé avec regroupement optionnel | Atelier Réseaux › Organisation manuelle — 04 §5.4 c | 7 | Conservée. |
| ST-ORG-03 | Déplacer plusieurs dispositifs entre réseaux/organs | Atelier Réseaux › Organisation manuelle — 04 §5.4 c | 7 | Conservée. |
| ST-CP-01 | Créer et organiser les bibliothèques de points de contrôle | Atelier Points de contrôle — 04 §5.5 | 6 | Conservée. |
| ST-CP-02 | Définir les champs d'un profil de points de contrôle | Atelier Points de contrôle — 04 §5.5 | 6 | Conservée. |
| ST-CP-03 | Configurer les couleurs et seuils d'affichage | Atelier Points de contrôle — 04 §5.5 | 6 | Conservée. |
| ST-CP-04 | Modifier un profil et propager ses changements aux instances | Atelier Points de contrôle — 04 §5.5 | 6 | Conservée. |
| ST-CP-05 | Affecter un profil à des groupes et suivre l'évolution de leurs membres | Atelier Points de contrôle — 04 §5.5 | 6 | Conservée. |
| ST-CP-06 | Détacher un profil de points de contrôle d'un groupe | Atelier Points de contrôle — 04 §5.5 | 6 | Conservée. |
| ST-CP-07 | Afficher une heatmap dynamique des points de contrôle | Atelier Points de contrôle — 04 §5.5 | 6 | Conservée. |
| ST-LINK-01 | Explorer et créer des liens de graphe génériques | Fiche › Relations (liens génériques) — 04 §3.8 | 4 | Conservée. |
| ST-LINK-02 | Inspecter et retirer des liens génériques en masse | Fiche › Relations (liens génériques) — 04 §3.8 | 4 | Conservée. |
| ST-CP-08 | Rattacher la série temporelle d'un endpoint physique à un point métier | Atelier Points de contrôle — 04 §5.5 | 6 | Conservée. |
| ST-TIC-01 | Définir un contexte de tickets et son cycle de traitement | Atelier Tickets › Configuration — 04 §5.6 | 5 | Conservée. |
| ST-TIC-02 | Créer des processus et insérer des étapes | Atelier Tickets › Configuration — 04 §5.6 | 5 | Conservée. |
| ST-TIC-03 | Maintenir une bibliothèque d'incidents usuels | Atelier Tickets › Configuration — 04 §5.6 | 5 | Conservée. |
| ST-TIC-04 | Déclarer un ticket localisé sur le jumeau | Fiche › Tickets ; atelier Tickets — 04 §3.6, §5.6 | 5 | Conservée. |
| ST-TIC-05 | Parcourir et rechercher les tickets | Atelier Tickets › Tableau — 04 §5.6 | 5 | Conservée. |
| ST-TIC-06 | Consulter une fiche, commenter et lire la chronologie | Fiche › Tickets ; atelier Tickets — 04 §3.6, §5.6 | 5 | Conservée. |
| ST-TIC-07 | Faire avancer ou reculer un ticket | Fiche › Tickets ; atelier Tickets — 04 §3.6, §5.6 | 5 | Conservée. |
| ST-TIC-08 | Archiver et réactiver un ticket | Fiche › Tickets ; atelier Tickets — 04 §3.6, §5.6 | 5 | Conservée. |
| ST-TIC-09 | Situer les incidents dans la maquette | Atelier Tickets › Voir dans la 3D — 04 §5.6 | 5 | Conservée. |
| ST-EVT-01 | Structurer les événements en contextes, catégories et groupes | Atelier Planning — 04 §5.7 | 5 | Conservée. |
| ST-EVT-02 | Créer un événement localisé, ponctuel ou récurrent | Fiche › Événements ; atelier Planning — 04 §3.7, §5.7 | 5 | Conservée. |
| ST-EVT-03 | Consulter les plannings et événements hérités | Fiche › Événements ; atelier Planning — 04 §3.7, §5.7 | 5 | Conservée. |
| ST-EVT-04 | Consulter et modifier un événement | Fiche › Événements ; atelier Planning — 04 §3.7, §5.7 | 5 | Conservée ; portée « cette occurrence » explicite. Modifier toute la série : non prévu. |
| ST-EVT-05 | Annuler une occurrence ou un sous-ensemble de série | Fiche › Événements ; atelier Planning — 04 §3.7, §5.7 | 5 | Conservée. |
| ST-EVT-06 | Actions en lot sur la période visible | Atelier Planning › Actions sur la période — 04 §5.7 | 5 | Conservée + corrigée : seuls les événements cochés sont supprimés. |
| ST-EVT-07 | Localiser et colorer les événements | Atelier Planning › Voir dans la 3D — 04 §5.7 | 5 | Conservée. |
| ST-MIS-01 | Associer un contexte de tickets à un organ Mission | Atelier Tickets › Mission — 04 §5.6 | 5 | Conservée. |
| ST-MIS-02 | Superviser et commander l'organ | Atelier Tickets › Mission — 04 §5.6 | 5 | Conservée. |
| ST-MIS-03 | Choisir les contextes d'équipements envoyés à Mission | Atelier Tickets › Mission — 04 §5.6 | 5 | Conservée. |
| ST-MES-01 | Explorer les points d'un objet | Fiche › Mesures — 04 §3.5 | 6 | Conservée. |
| ST-MES-02 | Modifier une valeur et transmettre une commande terrain | Fiche › Mesures — 04 §3.5 | 6 | Conservée ; écriture modèle et commande terrain distinguées avant envoi. |
| ST-MES-03 | Ouvrir la documentation d'un point | Fiche › Mesures — 04 §3.5 | 6 | Conservée. |
| ST-MES-04 | Supprimer un point ou seulement dissocier un réseau | Fiche › Mesures — 04 §3.5 | 6 | Conservée ; suppression et dissociation séparées visuellement. |
| ST-MES-05 | Exporter les séries d'un point en Excel | Fiche › Mesures — 04 §3.5 | 6 | Conservée, améliorée : période choisie. |
| ST-MES-06 | Superposer des historiques de plusieurs points | Dock Courbes — 04 §5.8 | 6 | Conservée ; ne crée plus de série absente : décision O-3. |
| ST-MES-07 | Choisir la période des courbes | Dock Courbes › Période — 04 §5.8 | 6 | Conservée. |
| ST-MES-08 | Configurer la présentation d'un graphique | Dock Courbes › Réglages — 04 §5.8 | 6 | Conservée sans Plotly (uPlot). |
| ST-DASH-01 | Créer et modifier des modèles de dashboard | Atelier Dashboards — 04 §5.9 | 6 | Conservée. |
| ST-DASH-02 | Appliquer un dashboard à un objet | Atelier Dashboards — 04 §5.9 | 6 | Conservée. |
| ST-DASH-03 | Appliquer des dashboards à une arborescence | Atelier Dashboards — 04 §5.9 | 6 | Conservée. |
| ST-DASH-04 | Configurer les règles de calcul et références de mesure | Atelier Dashboards — 04 §5.9 | 6 | Conservée. |
| ST-DASH-05 | Définir des calculs en lot | Atelier Dashboards — 04 §5.9 | 6 | Conservée. |
| ST-ANA-01 | Structurer les analyses par familles d'entités | Atelier Analyses — 04 §5.10 | 8 | Conservée. |
| ST-ANA-02 | Définir une analyse et son état d'exploitation | Atelier Analyses — 04 §5.10 | 8 | Conservée + corrigée : le rattrapage est enregistré. |
| ST-ANA-03 | Choisir une ancre et la population d'analyse | Atelier Analyses — 04 §5.10 | 8 | Conservée. |
| ST-ANA-04 | Définir les entrées et leur recherche dans le graphe | Atelier Analyses — 04 §5.10 | 8 | Conservée. |
| ST-ANA-05 | Prévisualiser le périmètre des entrées | Atelier Analyses — 04 §5.10 | 8 | Conservée ; prévisualisation globale toujours absente (désactivée historiquement). |
| ST-ANA-06 | Définir plusieurs déclencheurs | Atelier Analyses — 04 §5.10 | 8 | Conservée. |
| ST-ANA-07 | Composer une chaîne de calculs ordonnée | Atelier Analyses — 04 §5.10 | 8 | Conservée. |
| ST-ANA-08 | Registre complet des 41 opérations de calcul | Atelier Analyses — 04 §5.10 | 8 | Conservée. |
| ST-ANA-09 | Produire un ticket ou une alarme | Atelier Analyses — 04 §5.10 | 8 | Conservée. |
| ST-ANA-10 | Écrire un résultat dans un endpoint ou point de contrôle | Atelier Analyses — 04 §5.10 | 8 | Conservée. |
| ST-ANA-11 | Écrire un résultat dans un attribut documentaire | Atelier Analyses — 04 §5.10 | 8 | Conservée. |
| ST-ANA-12 | Produire un log, un SMS ou une sortie Google Chat | Atelier Analyses — 04 §5.10 | 8 | Conservée. |
| ST-ANA-13 | Recharger, modifier, supprimer et réinitialiser la date d'exécution | Atelier Analyses — 04 §5.10 | 8 | Conservée ; champs inconnus préservés à l'enregistrement. |
| ST-ANA-14 | Préserver l'exécution, le rattrapage et les erreurs du moteur | Atelier Analyses — 04 §5.10 | 8 | Exécution = organ d'analyse ; l'atelier affiche son état. |

