<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# 04 — Studio

Route : `/studio/jumeau/<id>` (`id` = identifiant serveur du fichier Jumeau). Paramètres d'URL : `noeud`, `contexte`, `atelier`, `onglet` (onglet de la fiche).

## 1. Disposition

```
┌ ◆ SpinalCore  Drive · Studio · Admin │ ◆ Jumeau Tour A  Mes fichiers › Projets ▾ │ Ctrl K │ ⟳ │ JD ┐
├────┬──────────────────────┬───────────────────────────────────────┬────────────────────────┤
│ ⌂  │ NAVIGATEUR      🔍 ⋯ │                                       │ ◻ Bureau 2.14      ✎ ⋯ │
│ ▦  │ [Tout][Espace][Clas.]│                                       │ Pièce · Étage 2 › Tour A│
│ ⌗  │ ▾ ESPACE             │              viewer-rs                │ [Isoler][Cadrer][+Ticket]│
│ ⌬  │   ▾ ● Spatial    1 240│      (barre, cube, mesure, coupe :    │ Résumé Attributs Docs   │
│ ◎  │     ▾ Tour A          │       inchangés)                      │ Notes Mesures Tickets … │
│ ✉  │       ▸ Étage 1       │                                       │                         │
│ ▣  │       ▾ Étage 2       │                                       │ SPATIAL                 │
│ ƒ  │         ◻ Bureau 2.14 │                                       │ Surface        18,40 m² │
│    │ ▸ CLASSEMENTS         │                                       │ Niveau          Étage 2 │
│    │ ▸ RÉSEAUX             │                                       │ …                       │
│ ⚙  │ ▸ EXPLOITATION        │───────────────────────────────────────│                         │
│    │                       │ Courbes (repliable)                   │                         │
└────┴──────────────────────┴───────────────────────────────────────┴────────────────────────┘
 rail   colonne de gauche      centre                                 fiche (droite)
```

- **Rail des ateliers** (48 px) : Navigateur (par défaut), Géographie, Maquettes et scènes, Données, Réseaux et GTB, Points de contrôle, Tickets, Planning, Dashboards, Analyses. Préférences en bas. Un atelier dont le module est indisponible garde son icône, avec une pastille « indisponible » et sa cause au survol [ST-SOC-04].
- **Colonne de gauche** (280 à 640 px, réglable) : le navigateur, ou l'atelier choisi dans le rail. Un atelier peut passer **plein cadre** (`Maj F`) : il prend la place du viewer, qui se réduit en vignette flottante cliquable (pour les tableaux et les éditeurs d'analyse).
- **Centre** : viewer-rs, intact. En dessous, un **dock Courbes** repliable [ST-MES-06 à 08].
- **Fiche** (340 à 560 px, réglable, repliable par `]`) : l'objet courant.
- Disposition (largeurs, panneaux repliés) mémorisée par utilisateur [ST-SOC-03]. En dessous de 1280 px, la fiche devient un tiroir ; en dessous de 900 px, le navigateur aussi.

### 1.1 Ouverture d'un jumeau [ST-SOC-01, ST-SOC-04]

1. Chargement du fichier Jumeau par identifiant serveur. Refus ou absence : page « Jumeau inaccessible » avec la raison et un retour au Drive.
2. Installation du graphe dans `SpinalGraphService`, après fermeture propre du jumeau précédent (abonnements, couleurs, sprites, tâches liées).
3. Navigateur interactif dès que les **contextes** sont chargés : leurs enfants sont chargés à la demande.
4. En parallèle, chargement de la **scène par défaut** dans le viewer (ou de la dernière scène ouverte par cet utilisateur pour ce jumeau). La progression s'affiche dans le viewer. Un jumeau sans scène affiche dans le viewer : « Aucune maquette chargée » avec « Choisir une scène ».
5. Les ateliers sont chargés à leur première ouverture. Si l'import d'un module échoue, seul cet atelier est indisponible.

Changer de jumeau : menu du jumeau dans la barre (« Ouvrir un autre jumeau… », liste des récents) ou retour au Drive.

Quitter [ST-SOC-05] : à la sortie (autre section, autre jumeau, déconnexion), toutes les ressources du jumeau sont libérées. Les tâches en cours continuent dans le plateau, avec le nom du jumeau en libellé.

## 2. Navigateur du jumeau [ST-GRA-01 à 08]

- **Contextes regroupés par domaine**, au lieu de la liste à plat historique :

  | Domaine | Types de contexte |
  |---|---|
  | Espace | géographique, BIM Geo, référentiels (`.SiteContext`…, en mode expert) |
  | Maquettes | `BimFileContext`, scènes |
  | Classements | contextes de groupes (pièces, équipements, endpoints, autres) |
  | Réseaux | `Network` (BMS), arborescences techniques, bibliothèques de profils, points de contrôle |
  | Exploitation | tickets, événements, notes, documentation |
  | Calcul | analyses, dashboards |
  | Autres | tout type non reconnu, avec son type brut |

  Pastilles de filtre en tête (Tout, Espace, Classements…). Chaque contexte affiche sa couleur et son nombre d'enfants directs.
- **Arbre virtualisé, chargé à la demande.** Chaque ligne : icône du type, nom, pastille de couleur, compteur d'enfants, marque « 3D » si l'objet a une géométrie résolue. Les relations sont dépliées dans le contexte courant seulement (sémantique « in context »).
- **Recherche** [ST-GRA-02] : sous-chaîne, sans tenir compte de la casse, sur les nœuds du jumeau. Les résultats sont groupés par contexte et affichent le chemin. `Échap` revient à l'arbre. Elle passe par l'index de recherche du service de graphe ; si seule une recherche dans les nœuds chargés est possible, le champ l'indique (« dans les éléments chargés »).
- **Sélection** : clic → fiche ; si l'objet a une géométrie, sélection 3D. Le contexte de sélection est retenu dans l'URL.
- **Clic droit et barre d'actions** : actions du registre selon type, contexte et profil [ST-SOC-02].
- **Glisser-déposer** dans l'arbre : réordonner les enfants d'une relation ordonnée [ST-GRA-06] et déplacer dans le même contexte lorsque le service le permet. La confirmation dit quelle relation change.

Actions génériques sur un nœud :

| Action | Capacité | Règles |
|---|---|---|
| Renommer (`F2`), Couleur | ST-GRA-03 | Pour tous les types. Couleur : nuancier de 12 couleurs + saisie hexadécimale. Toast « Annuler ». |
| Supprimer… | ST-GRA-04 | Confirmation de portée avec choix du périmètre : ce nœud · ses enfants directs · ce nœud et ses enfants directs · tous les nœuds de type « Pièce » de ce contexte. Le nombre exact et la liste sont affichés avant validation. Si le nœud a d'autres parents, c'est dit (« Ce nœud est aussi dans 2 autres contextes »). |
| Retirer du contexte… | ST-GRA-05 | Retire les liens avec ses parents **dans ce contexte**. L'objet reste dans les autres. |
| Gérer les relations… | ST-GRA-05/06 | Ouvre l'onglet Relations de la fiche. |
| Exporter la structure (CSV) | ST-GRA-08 | Sur un contexte : téléchargement de `<contexte>.csv`, tâche dans le plateau pour les gros contextes. |
| Inspecter le modèle | ST-GRA-07 | Ouvre `/studio/inspecteur/<id>` dans un nouvel onglet. |

## 3. Fiche de l'objet

En-tête : icône et type lisible, nom (éditable), pastille de couleur, **chemin dans le contexte de sélection** (cliquable), mention « Aussi dans : Groupe Multicapteurs, Réseau CTA-2 » si plusieurs parents [ST-SOC-03]. En mode expert : `_server_id`, staticId, type brut, `bimFileId` et `dbId`, chacun copiable.

Barre d'actions : jusqu'à 3 actions principales selon le type (pour une pièce : « Isoler », « Cadrer », « Déclarer un ticket »), puis « Plus ».

Objet 3D sans nœud [ST-BIM-08] : la fiche affiche les propriétés de la maquette et un bandeau « Cet objet n'est pas encore dans le jumeau ». Les actions qui en ont besoin (attribut, document, note, groupe, ticket, événement) créent le `BIMObject` à la première écriture et le signalent dans leur toast.

Onglets, **affichés seulement s'ils s'appliquent**, avec un compteur :

### 3.1 Résumé
Propriétés clés du type (pour une pièce : surface, niveau, capacité ; pour un équipement : pièce, groupe principal), appartenances (contextes, groupes) et propriétés natives de la maquette dans un bloc repliable [ST-BIM-09].

### 3.2 Attributs [ST-ATT-01]
- Catégories repliables (« Spatial », « GTB »…) avec lignes libellé / valeur / unité. Les catégories **héritées** des groupes parents apparaissent à part, en lecture, avec leur provenance.
- Ajouter un attribut (catégorie existante ou nouvelle, libellé, valeur, unité) ; éditer en ligne ; supprimer un attribut ou une catégorie (confirmation).
- **Importer depuis la maquette** : liste des propriétés de l'objet 3D avec cases à cocher et choix de la catégorie de destination.
- Valeurs `0`, `false` et vides distinguées à l'affichage : « 0 », « Non », « — » [invariant 9.3-4].

### 3.3 Documents [ST-DOC-01 à 03]
- Fichiers rattachés, avec fil d'Ariane des dossiers associés, et liens URL. Les documents des groupes parents apparaissent à part, en lecture.
- **Ajouter** : depuis le poste (dépôt), depuis le Drive (sélecteur de fichiers), ou depuis un contexte documentaire (arbre). Dans les deux derniers cas, le document est **relié** sans être recréé.
- **Télécharger** : un fichier directement ; plusieurs fichiers ou un dossier en archive ZIP (tâche).
- **Retirer de l'objet** : confirmation « Le fichier reste disponible dans le Drive et sur les autres objets » [§9.2].
- **Liens** : libellé + URL, créer, modifier, retirer.

### 3.4 Notes [ST-DOC-04 à 06]
- Fil de messages (auteur, date, texte, pièces jointes, images en vignettes).
- Zone de saisie : texte, pièces jointes, bouton **« Capturer la vue »** [ST-DOC-05], qui joint l'image du viewer et un point de vue restaurable (caméra, rendu, objets sélectionnés et isolés par maquette).
- **Restaurer ce point de vue** sur chaque message qui en contient un.
- Classement des nouvelles notes (contexte, catégorie, groupe) : par défaut la destination historique, créée au besoin, avec « Modifier » pour changer.
- Depuis un groupe de notes du navigateur : « Colorer les objets annotés » et « Restaurer les couleurs » [ST-DOC-06]. Sur un message : « Voir l'objet » (cadrer ou isoler son parent géographique).

### 3.5 Mesures [ST-MES-01 à 05]
- Deux blocs : **Points de la GTB** (endpoints) et **Points de contrôle**. Cartes : nom, valeur courante (mise à jour en direct), unité, horodatage de la dernière valeur, type (nombre, texte, booléen).
- Sur chaque carte : « Ajouter aux courbes » (ajout ou retrait du dock, [ST-MES-06]), « Exporter l'historique (Excel) » avec choix de la période, plus large que l'historique [ST-MES-05], « Documentation du point » (ouvre la fiche du point, [ST-MES-03]), « Modifier la valeur » [ST-MES-02].
- **Modifier la valeur** : saisie adaptée au type (interrupteur pour un booléen) et priorité. Le dialogue dit, **avant** l'envoi, si la valeur sera **envoyée au terrain** (organ BACnet, OPC UA ou SNMP trouvé : il le nomme) ou **seulement écrite dans le jumeau**. États : Envoi · Accepté par l'organ · Échec [§9.2].
- **Supprimer le point** (suppression du graphe) et **Dissocier un réseau** (retrait de lien) sont deux actions séparées, dans deux couleurs et avec deux confirmations différentes [ST-MES-04].
- Légende et heatmap des points de contrôle : voir l'atelier Points de contrôle [ST-CP-07].

### 3.6 Tickets [ST-TIC-04, 06 à 09]
- Tickets de l'objet : titre, étape (pastille couleur), priorité, date, auteur.
- **Déclarer un ticket** : contexte, puis processus, puis incident usuel (facultatif, qui préremplit le titre), titre, priorité (Occasionnelle, Normale, Urgente), message, pièces jointes.
- La fiche d'un ticket s'ouvre en panneau superposé : étape, priorité, chronologie (journal + commentaires, avec ajout de commentaire et de pièces jointes), boutons « Étape précédente » et « Étape suivante » (désactivés aux bornes), « Archiver » ou « Réactiver », « Voir dans la 3D ».

### 3.7 Événements [ST-EVT-02 à 05, 07]
- Agenda compact de l'objet (liste par date), avec deux options : « Inclure les événements des parents directs » et « Seulement ceux des parents » [ST-EVT-03]. On évite le mot « partagés » (historique trompeur).
- **Créer un événement** : groupe (contexte, catégorie, groupe, avec création à la volée), nom, description, début et fin (par défaut : maintenant + 1 h), récurrence (tous les N jours, semaines, mois ou années, jusqu'au…).
- **Modifier** : la portée est explicite (« Cette occurrence uniquement », seul comportement historique). Modifier toute la série n'est pas proposé (non pris en charge historiquement).
- **Annuler** : choix parmi 4 portées (cette occurrence · celle-ci et les précédentes · celle-ci et les suivantes · toute la série), avec le nombre d'occurrences touchées [ST-EVT-05].

### 3.8 Relations [ST-GRA-05/06, ST-LINK-01/02, ST-GRP-02/03]
- Relations sortantes groupées par nom (`hasGeographicRoom`…, libellé lisible + nom technique), avec le type (`Ref`, `PtrLst`, `LstPtr`) en mode expert et le nombre d'enfants.
- **Ordonner** : mode édition avec glisser, monter / descendre, « Trier par nom », puis Valider ou Annuler [ST-GRA-06].
- **Retirer des liens** : sélection multiple des cibles, en distinguant celles du contexte courant des autres [ST-GRA-05, ST-LINK-02].
- **Créer un lien** [ST-LINK-01] : explorateur de tous les contextes (chargement à la demande, recherche), nom de la relation (par défaut `hasEndPoint`, liste des noms existants proposée), mode avec ou sans contexte.
- **Groupes** : appartenances aux groupes avec « Retirer du groupe » et « Ajouter à un groupe… » (sélecteur contexte, catégorie, groupe, avec création à la volée) [ST-GRP-02]. Pour un objet 3D : « Trouver sa pièce » [ST-GRP-03].

## 4. Viewer et sélection 3D [ST-BIM-05 à 09]

- viewer-rs inchangé : ses outils (navigation, cube, mesure, coupe, propriétés natives, arborescence de la maquette) restent les siens [ST-BIM-09].
- Depuis un nœud métier (pièce, étage, bâtiment, zone, site, équipement, groupe) : **Sélectionner**, **Isoler**, **Cadrer** les objets 3D descendants, et **Isoler les références** (géométrie d'espace) [ST-BIM-05]. Les objets sont regroupés par maquette, y compris les instances d'une maquette dans plusieurs scènes.
- **Sélection par rectangle** [ST-BIM-06] : action « Sélection rectangle » (`B`) qui active l'outil de boîte de viewer-rs. Le résultat reste associé à chaque maquette.
- **Menu de la sélection 3D** [ST-BIM-08] : clic droit dans le viewer → menu SpinalCore (actions du registre pour l'objet : documenter, noter, déclarer un ticket, ajouter à un groupe, trouver la pièce, inspecter), à la suite des entrées propres au viewer. Il remplace le menu circulaire.
- **Recherche avancée** [ST-BIM-07] (palette `Ctrl K` → « Rechercher des objets », ou rail) : panneau de critères (nom de propriété / valeur, égal · contient · expression régulière avec options, source : propriétés de la maquette, attributs SpinalCore ou les deux), à partir de tous les objets ou d'une sélection de référence. Le résultat est un ensemble de sélection : sélectionner, isoler, colorer, ajouter à un groupe.

## 5. Ateliers

Chaque atelier :
- s'ouvre dans la colonne de gauche, ou en plein cadre ;
- a sa propre URL (`?atelier=geographie`) ;
- libère ses ressources (couleurs, sprites, abonnements) à sa fermeture ;
- n'écrit rien tant que l'utilisateur n'a pas validé une étape qui le dit.

### 5.1 Géographie [ST-GEO-01 à 11, ST-VIS-01, ST-ATT-05, ST-BIM-04 (variante géographique)]

Page d'accueil de l'atelier : choix du contexte géographique (ou « Nouveau contexte »), puis quatre entrées :

1. **Construire à la main** [ST-GEO-01, 02, 03]
   - Dans le navigateur, sur un nœud géographique : « Ajouter… » propose seulement les types valides après ce parent (site → bâtiment → étage → zone → pièce → équipement ; les niveaux intermédiaires peuvent être omis).
   - « Rattacher la sélection 3D » : **comme équipements** ou **comme références** (géométrie de la pièce ou de l'étage), deux actions distinctes avec une explication.
   - « Inscrire dans les référentiels » sur la racine.
2. **Générer depuis la maquette** [ST-GEO-04] : assistant en étapes.
   - Source : tous les objets, ou un ensemble de sélection.
   - Niveaux ordonnés : pour chacun, une propriété ou une valeur fixe.
   - Analyse dans un Worker : objets valides et invalides, avec compteurs, « Montrer dans la 3D » pour chaque ensemble.
   - Création ou complétion de l'arborescence. Les réglages sont enregistrés dans le contexte et rechargés à la prochaine ouverture.
3. **Importer ou mettre à jour l'architecture** [ST-GEO-05, 06, 08]
   - Cible : géographie d'exploitation, ou contexte BIM Geo (données brutes) ; mode « références d'étages seulement » ; filtres avancés repliés.
   - **Écran de différences** [ST-GEO-06] : par étage, compteurs Créations · Suppressions · Modifications · Inchangés ; détail des pièces et références avec anciennes et nouvelles valeurs et unités ; « Sélectionner / Isoler / Cadrer » sur chaque ligne ; correspondance forcée d'un étage ou d'une pièce par identifiant externe.
   - **Fusion BIM Geo** [ST-GEO-08] : deux arbres côte à côte (BIM Geo à gauche, géographie d'exploitation à droite), glisser une partie d'étage vers un étage cible, création de bâtiments et d'étages cibles, états ajout et retrait visibles.
   - Résultat : **un lot de commandes enregistré**, pas une écriture directe.
4. **Projeter les équipements** [ST-GEO-09, 10]
   - Configurations nommées (liste, créer, dupliquer).
   - Groupes ordonnés d'objets (ensembles de sélection ou groupes existants), options (arrêt aux feuilles, approximation par niveau, décalages R, T, Z) avec aperçu des points dans la 3D.
   - Enregistrer, puis lancer.
   - **Résolution** [ST-GEO-10] : résultats, avertissements et erreurs, navigation par étage et pièce, recherche, « Isoler l'étage », valider ou refuser chaque affectation proposée. Résultat : un lot de commandes.

**Lots de commandes** [ST-GEO-07] : liste des lots enregistrés dans le graphe, avec date et origine. « Exécuter » crée une tâche du plateau (Attente · Exécution · Vérification · Terminé · Erreur, avec avancement). L'écran d'exécution ne se ferme pas pendant le traitement ; le reste de l'application reste utilisable. « Relancer » est disponible sur les nœuds de génération.

**Outils de réparation** [ST-GEO-11, ST-VIS-01, ST-ATT-05, ST-BIM-04] : une section « Recalculer » avec une carte par outil, chacune avec son périmètre (maquettes, étages) et une confirmation :
- « Mettre à jour noms et dbId depuis les identifiants externes » ;
- « Mettre à jour les dbId documentaires des pièces » ;
- « Renseigner niveau, surface et centre » ;
- « Enregistrer les positions des objets (Spatial / XYZ center) » [ST-VIS-01] : une position absente n'écrase jamais une position valide ; la fin de tâche attend toutes les écritures ;
- « Initialiser la capacité des pièces (surface ÷ 5) » [ST-ATT-05] : le contexte est choisi explicitement, et non plus imposé par le nom `spatial`.

Chaque outil donne un bilan (mis à jour, introuvables, ignorés).

### 5.2 Maquettes et scènes [ST-BIM-01 à 04, ST-BIM-10]

- **Maquettes** : fichiers BIM du jumeau. Pour chacun : versions, représentation par défaut (liste des représentations SVF/SBIM avec miniature, « Utiliser par défaut ») [ST-BIM-10], « Charger dans la vue ».
- **Scènes** [ST-BIM-01] : liste ; créer (nom, description) ; composer en ajoutant ou retirant des maquettes, avec pour chacune « Maquette complète » ou « Sélection d'objets » (ensemble de sélection, « Revoir dans la 3D ») ; résumé (maquettes, nombre d'objets) ; enregistrer ; charger.
- **Décalages** [ST-BIM-02] : par scène, « Calculer le décalage » pour une maquette ou toutes, avec affichage des valeurs x/y/z enregistrées sur la version courante.
- **Comparer deux versions** [ST-BIM-03] : choix du fichier et de deux versions, comparaison par `externalId` dans un Worker, compteurs Ajoutés · Supprimés · Communs, coloration (vert, rouge), « Sélectionner / Isoler » chaque ensemble.
- **Réconcilier les identifiants** [ST-BIM-04] : après un changement de version, reconstruction `externalId` → `dbId` sur les nœuds. Aperçu (à mettre à jour, introuvables), puis exécution. Les introuvables reçoivent `-1` comme historiquement **et** sont listés, avec export.

### 5.3 Données (tableau d'attributs) [ST-ATT-02 à 04, ST-GRP-01, ST-GRP-04]

En plein cadre par défaut.
- Départ : un nœud (bouton « Depuis la sélection ») et un type d'objets (pièces, équipements…).
- **Tableau virtualisé** (pas de pagination) : nom + colonnes `catégorie / attribut`, définies par un **profil de colonnes** [ST-ATT-04] (choisir, créer, modifier, désactiver ; import et export `configurations_spinalcom.xlsx`).
- Recherche par nom ou valeur. Sélection : tout, résultats filtrés, lignes. Les lignes sélectionnées se sélectionnent, s'isolent ou se cadrent dans la 3D.
- **Édition** : cellule en ligne ; « Affecter une valeur à la colonne » pour les lignes choisies ; « Reprendre la valeur de la maquette » par cellule ou en masse ; « Nouvel attribut ». Les modifications sont **en attente** (cellules marquées) jusqu'à « Enregistrer 37 modifications », avec « Annuler les modifications ».
- **Excel** [ST-ATT-03] : « Exporter la sélection » (`spinalcom.xlsx`, colonnes historiques conservées à l'identique). « Importer » → **aperçu des différences** (renommages, valeurs modifiées, lignes non rapprochées) avant d'enregistrer.
- **Classements** [ST-GRP-01, ST-GRP-04] :
  - « Créer un classement » : contexte de groupes typé, catégories, groupes, avec nom, icône et couleur modifiables ;
  - « Classer automatiquement » : règle de catégorie et de groupe (valeur fixe ; segment du nom avec séparateur et position à partir de 1 ; valeur d'un attribut dont le libellé correspond à une expression régulière, avec repli sur les propriétés de la maquette pour les équipements), **aperçu** des groupes produits et de leurs effectifs, puis exécution.

### 5.4 Réseaux et GTB [ST-IOT-*, ST-PROF-*, ST-BAC-*, ST-OPC-*, ST-SNMP-*, ST-ORG-*, ST-VIS-02]

Atelier en quatre onglets.

**a) Arborescence technique** [ST-IOT-01 à 11]
- Créer un contexte réseau logique et ses réseaux [01]. « Ajouter la sélection 3D » sur un réseau [02].
- **Assistant de génération** [03 à 06], en étapes :
  - **Automates** et **Objets contrôlés** : deux ensembles de sélection, avec choix de l'attribut porteur [03] ;
  - **Association** : opérateur (contient, commence par, égal, finit par, expression régulière avec opérande et options, fonction personnalisée dans CodeMirror) et test immédiat sur 10 exemples [04] ;
  - **Nommage** : attribut et fonction de transformation facultative, avec aperçu [05] ;
  - **Aperçu** : arbre automate → équipements, compteurs associés et invalides, « Montrer dans la 3D » ; options « Ne pas créer les automates sans objet » et « Classer les automates par attribut » ; puis Générer [06].
- Contenu d'un réseau : tableau (identifiant, nom, parents, groupes) et export XLSX avec les colonnes historiques [07]. « Vider les liens du réseau » : confirmation de portée qui dit que les objets BIM ne sont pas supprimés [08].
- **Profils virtuels** [09, 10] : choisir contexte, profil et dispositif modèle, puis appliquer à un automate ou à une sélection. Le tableau des correspondances (réussies, objets sans correspondance, items sans objet) se corrige à la main (ajouter ou retirer un couple), puis on valide. « Détacher le profil » au niveau d'un automate, d'un groupe ou d'un réseau, avec confirmation de portée.
- **Rapprocher automates BIM et dispositifs BMS** [11] : périmètre BMS, attribut BIM, attribut BMS, normalisations distinctes de chaque côté, aperçu des couples et des non-associés, puis liaison.

**b) Bibliothèque de profils** [ST-PROF-01 à 11, ST-OPC-03, ST-OPC-04, ST-SNMP-03, ST-SNMP-04]
- Arbre : contexte de profils → profils → dispositifs modèles. Création de chacun [PROF-01] ; un `Main.xml` peut être joint.
- « Générer depuis le XML » [PROF-02], « … depuis un dispositif découvert » [PROF-03, OPC-03, SNMP-03] : tâche avec bilan.
- « Mettre à jour depuis le dispositif » [PROF-04] : différences en deux listes (Ajouts, Suppressions) à cocher, puis exécution et compteurs.
- **Items** [PROF-05 à 09] : tableau des items (nom, type métier, maître, convention de nommage BIM), ajout avec contrôle des doublons, import BOG/XML [06] avec table temporaire en aperçu, export `item_list.json` [07]. La fiche d'un item a trois onglets : **Entrées / Sorties** (recherche des valeurs BACnet, associer ou dissocier) [08], **Mesures · Alarmes · Commandes** [09], **Surveillance** [10].
- **Supervision** [PROF-10, 11, OPC-04, SNMP-04] : tableau des points (nom générique, nom, item d'origine), intervalle (Non surveillé, COV, 5 s, 30 s, 1 min, 5 min, 30 min, 1 h, plus les intervalles personnalisés), historisation, filtre par nom, « Appliquer aux lignes affichées », glisser-déposer vers un intervalle. Les intervalles déjà présents sont conservés même s'ils ne sont pas dans la liste par défaut.

**c) Connecteurs** [ST-BAC-*, ST-OPC-01/02/05, ST-SNMP-01/02/05, ST-ORG-*]
- Contexte BMS : organs disponibles (lus dans `/etc/Organs`), avec « Référencer » ou « Retirer » [BAC-01], et l'état de chaque organ (en ligne, sans réponse).
- Par organ, selon son protocole :
  - **BACnet** : sous-réseau [BAC-02] ; découverte broadcast (adresse et port préremplis `255.255.255.255:47808`) ou unicast (liste d'adresses et de Device ID, import XLSX multi-feuilles) [BAC-03] ; résultats à cocher puis Créer, avec suivi Découverte · Attente · Délai dépassé · Terminé · Erreur, et Arrêter / Relancer [BAC-04] ; lecture des familles d'objets choisies [BAC-05].
  - **OPC UA** : sous-réseau et passerelles (adresse, port, endpoint, import XLSX) [OPC-01] ; découverte avec compteurs total, terminés et échecs, réponse aux choix demandés, arbre à cocher (une branche emporte son sous-arbre) [OPC-02].
  - **SNMP** : sous-réseau, réseaux (nom, `ip:port`, MIB téléversée par ligne) [SNMP-01] ; arbre des OID à cocher (les ancêtres sont gardés) [SNMP-02].
- **Surveillance** des dispositifs (commune aux protocoles, onglet par réseau) : tableau des dispositifs, profil affecté, état (Sans profil · Surveillé · Arrêté), « Démarrer · Arrêter · Redémarrer » individuels ou globaux, « Historiser » oui ou non pour BACnet et OPC UA (pour SNMP, l'historisation se règle point par point dans le profil, ST-SNMP-04) [BAC-06, 07, 08, OPC-05, SNMP-05]. Un profil est exigé pour démarrer, et la raison s'affiche s'il manque.
- « Redémarrer l'organ » et « Localiser les objets BIM liés » [BAC-09].
- **Organisation manuelle** [ORG-01 à 03] : créer un réseau, un dispositif, un endpoint typé (nom, chemin, type de donnée, valeur, unité, groupe facultatif) ; « Déplacer des dispositifs » vers un autre réseau du même contexte (sélection multiple, puis destination).

**d) Vue 3D du réseau** [ST-VIS-02] : sur un réseau d'une arborescence technique, « Afficher dans la 3D » place des sprites aux positions mémorisées et relie parents et enfants. Les **filtres de préfixes** (`CS2_`, `CS1_`, `MR_`…) deviennent un réglage visible et modifiable de l'atelier, et non plus une règle cachée. Clic sur un sprite : fiche de l'objet. Les sprites sont retirés à la fermeture.

### 5.5 Points de contrôle [ST-CP-01 à 08, ST-SIM-01/02]

- **Bibliothèques** [CP-01] : contexte, catégories, groupes, profils (même sélecteur avec création à la volée).
- **Éditeur de profil** [CP-02, 03, 04] : tableau des points (nom, alias, type de donnée, type métier : Température, Hygrométrie, Puissance, Occupation, Lumière, Alarme, Consigne, CO₂, Autre ; unité, commande oui ou non, historisation oui ou non). Pour chaque point, l'**affichage** : seuils min, milieu et max avec couleurs et aperçu du dégradé (nombres), couleurs par valeur (booléens), libellés et couleurs (énumérations). Changer le type demande confirmation, car la configuration d'affichage est réinitialisée. Enregistrer affiche **l'effet sur les instances** (« 3 créations, 1 suppression, sur 240 objets ») avant d'appliquer [CP-04].
- **Affecter** [CP-05] et **Détacher** [CP-06] un profil sur un contexte, une catégorie ou un groupe, avec confirmation de portée. Le suivi des nouveaux membres du groupe est indiqué.
- **Heatmap** [CP-07] : sur un groupe géographique, choix du profil et du point, coloration des objets selon la valeur courante et les seuils, légende flottante sur le viewer. Plusieurs légendes peuvent coexister ; les couleurs sont libérées à la fermeture.
- **Rattacher des séries** [CP-08] : assistant (périmètre, nom du profil, point métier en nom exact ou expression régulière, expression régulière de l'endpoint, taille de lot, 20 par défaut), aperçu des couples, puis exécution en tâche. Le texte explique que l'historique est **partagé** et non copié [§9.2].
- **Simulation** [SIM-01/02] : importer un classeur Excel comme profil `{date, valeur}` (aperçu des lignes écartées et de leur raison), puis affecter ce profil à un point de contrôle (remplace la relation existante, avec confirmation).

### 5.6 Tickets [ST-TIC-01 à 09, ST-MIS-01 à 03]

- **Configuration** [TIC-01, 02, 03] : contextes de tickets, avec étapes (nom, couleur, ordre, réordonnables, au moins une), processus, insertion d'étape avant ou après, incidents usuels par processus. L'étape d'archive est gérée par le système et n'est pas proposée comme référence.
- **Tableau des tickets** [TIC-05] : vue **colonnes par étape** (kanban, lecture et glisser vers l'étape suivante ou précédente seulement) ou vue **liste** (nom, étape, date, priorité, auteur ; recherche, tri ; filtre par contexte, processus et étape). État vide explicite.
- Fiche, transitions et archivage : comme dans la fiche d'objet (§3.6) [TIC-06, 07, 08].
- **Voir dans la 3D** [TIC-09] : colorer les objets des tickets d'un processus ou d'une étape avec la couleur de l'étape ; sélectionner, isoler, cadrer.
- **Mission** [MIS-01 à 03], sur la racine d'un contexte de tickets : association à un organ Mission (organ, contexte spatial, identifiant, mot de passe masqué et révélable, appelant, préfixe bâtiment, intervalle de récupération, dernière synchronisation) ; panneau d'état de l'organ (états rapportés par l'organ, commandes Exécuter · Arrêter · Synchroniser spatial · processus · équipements · Redémarrer) ; choix des contextes d'équipements envoyés.

### 5.7 Planning [ST-EVT-01 à 07]

- Calendrier (jour, semaine, mois, liste) des événements sous le nœud choisi, colorés par groupe [EVT-01, 03].
- Création, modification et annulation : comme dans la fiche (§3.7).
- **Actions sur la période visible** [EVT-06] : « Sélectionner les objets dans la 3D » et « Supprimer des événements… », avec une liste **à cocher** dont seuls les éléments cochés sont supprimés (corrige l'anomalie de `delete-all.vue`). Les événements hérités des parents sont exclus, et c'est dit.
- **Voir dans la 3D** [EVT-07] : sélectionner, isoler, cadrer, colorer par groupe, restaurer.

### 5.8 Courbes (dock sous le viewer) [ST-MES-06 à 08]

- Ajouter un point depuis une carte de mesure ou le navigateur ; le rajouter le retire. Plusieurs points sont superposés, avec des axes par unité (au plus 2 axes, au-delà les courbes sont normalisées et c'est indiqué).
- **Période** : 1 h, 3 h, 24 h glissantes, Hier, 3 jours, 7 jours, Personnalisée (début et fin). « Hier » et « 24 h » sont bien distincts.
- Réglages : lignes, points, lignes + points ; légende (afficher, position) ; curseur de plage ; réinitialiser le zoom. Valeur au survol, en chiffres tabulaires.
- Point sans historique : « Pas de données sur la période ». Point texte : non tracé, avec la raison.
- L'ouverture d'une courbe **ne crée pas** de série temporelle absente : écart volontaire avec `getOrCreateTimeSeries`. Décision ouverte O-3, voir [06-tracabilite.md](06-tracabilite.md).

### 5.9 Dashboards [ST-DASH-01 à 05]

- Modèles de dashboard par contexte (nom, type géographique, mesures standards cochées : température °C, hygrométrie %, puissance W, occupation, éclairage %…) [01].
- **Appliquer à un objet** [02] : choix du modèle compatible. Si un dashboard existe déjà, la confirmation dit que ses points seront **remplacés** (objets métier créés et retirés).
- **Appliquer à une arborescence** [03] : par type descendant, choisir un modèle ou « Aucun ». Aperçu du nombre d'objets touchés par type, puis bilan.
- **Règles de calcul** [04, 05] : par point de sortie, somme, moyenne, maximum, minimum ou référence (choix du descendant). Une édition en lot construit une table d'affectations retirables avant l'enregistrement. Le texte précise que la règle est **enregistrée** et que son calcul dépend du moteur déployé.

### 5.10 Analyses [ST-ANA-01 à 14]

En plein cadre par défaut.
- **Arbre** : contextes d'analyses → familles d'entités (nom, nom standard, type d'entité) → analyses, avec un statut Active ou Inactive [ANA-01].
- **Éditeur d'analyse**, en sections sur une page (pas un assistant fermé), avec un sommaire à gauche et une validation par section :
  1. **Général** : nom, description, active, exécuter au démarrage de l'organ, rattrapage des exécutions manquées (enfin enregistré, voir l'anomalie ANA-02), cron d'agrégation facultatif [02] ;
  2. **Population** : ancre (groupe, espace ou contexte) et aperçu des entités suivies [03] ;
  3. **Entrées** `I0…In` : méthode (endpoint, point de contrôle, attribut `catégorie:attribut`), filtre (expression régulière sensible à la casse), profondeur, profondeur stricte, relations, capture multiple [04] ; « **Prévisualiser** » par entité, avec « Introuvable » signalé [05] ;
  4. **Déclencheurs** : intervalle, changement de valeur, changement avec seuil, cron (avec validation et les 5 prochaines exécutions) [06] ;
  5. **Calculs** `A0…An` : opération choisie dans le registre des 41 opérations (avec documentation des paramètres), dépendances vers `I*` et `A*` réordonnables, résultat final `R`, et un graphe des dépendances qui signale les cycles et les références orphelines [07, 08] ;
  6. **Sortie** : ticket ou alarme (contexte, processus, priorité), endpoint ou point de contrôle (création autorisée ou non, unité, durée de conservation), attribut (catégorie obligatoire), journal, SMS, Google Chat [09 à 12].
- La prévisualisation ne produit **aucun** effet externe : ni ticket, ni écriture, ni envoi [§9.2].
- **Recharger, modifier, supprimer** : l'édition relit fidèlement les configurations anciennes et multi-algorithmes. Les champs inconnus sont conservés à l'enregistrement. La suppression précise ce qui est supprimé (configuration) et ce qui est conservé (sorties déjà produites). « Réinitialiser la date d'exécution » est distinct de toute exécution [13].
- L'exécution reste le rôle de l'organ d'analyse. L'atelier affiche son état s'il est déployé, et sinon : « L'organ d'analyse ne tourne pas : cette analyse ne s'exécutera pas » [14].
