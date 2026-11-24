<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# Ce qu'il faut faire — liste concrète

Une ligne = une chose que la nouvelle application doit faire. Chaque ligne a un numéro pour pouvoir la commenter (« G-4 : à changer », « S-31 : pas utile »…).

Repères en tête de ligne :
- **[=]** : repris de l'existant, même fonction (c'est là qu'il faut dire si on veut faire mieux qu'une copie) ;
- **[+]** : amélioration déjà proposée ;
- **[!]** : bug de l'existant corrigé.

Les identifiants entre parenthèses renvoient à l'inventaire des capacités.

---

## 1. Toute l'application

- **G-1** [+] Une seule application pour Drive, Studio et Admin, sous `/studio/`, avec une seule connexion. Passer du Drive au Studio ne recharge rien.
- **G-2** [+] Barre du haut toujours visible : logo, onglets Drive · Studio · Admin, recherche, tâches en cours, compte.
- **G-3** [+] Palette de commandes `Ctrl K` : chercher et lancer n'importe quelle action, objet, dossier ou atelier.
- **G-4** [+] Plateau des tâches : tous les traitements longs (dépôts, conversions, découvertes, générations, exports) avec progression, résultat élément par élément, annulation, « relancer les échecs ».
- **G-5** [+] Chaque suppression ou retrait passe par une confirmation qui dit exactement ce qui est touché, ce qui ne l'est pas, et ce qui est exclu (avec la raison).
- **G-6** [+] « Retirer » (un lien) et « Supprimer » (un objet) sont deux actions différentes, avec des libellés et des couleurs différents.
- **G-7** [+] Toast « Annuler » pendant 8 s après un renommage, un changement de couleur ou un déplacement.
- **G-8** [+] L'URL garde la position : dossier, jumeau, objet sélectionné, atelier ouvert. Recharger ou partager le lien rouvre au même endroit.
- **G-9** [+] Tout en français, avec le vocabulaire du bâtiment. Mode expert (option) pour afficher identifiants, types et relations techniques.
- **G-10** [+] Raccourcis clavier partout (`?` affiche la liste). Tout est faisable sans souris.
- **G-11** [+] Thème clair par défaut, thème sombre en option.
- **G-12** [+] Densité « Confort » ou « Compact » pour les listes et tableaux.
- **G-13** [+] Messages d'erreur en français avec « Réessayer » et le détail technique copiable. Un module en panne n'empêche pas les autres de marcher (ST-SOC-04).
- **G-14** [+] Bandeau « Connexion au hub perdue », reconnexion automatique, aucune écriture rejouée en douce.
- **G-15** [+] Listes et arbres capables d'afficher des dizaines de milliers de lignes sans ralentir.

## 2. Connexion et compte

- **C-1** [=] Se connecter avec un compte du hub ; option « Administration du hub » (DR-01).
- **C-2** [+] Messages distincts : mauvais mot de passe, compte non administrateur, hub injoignable.
- **C-3** [!] Le mot de passe n'est plus stocké dans `localStorage`. Il est gardé pour l'onglet seulement.
- **C-4** [!] Ouvrir la page de connexion ne déconnecte plus. Si une session existe, on propose « Continuer en tant que… ».
- **C-5** [!] « Se déconnecter » marche vraiment et arrête tout ce qui tournait (ST-SOC-05).
- **C-6** [=] Changer son mot de passe hub (ADM-04). [+] Garde-fou sur le compte `admin`, dont le mot de passe est fixé par la configuration Docker.

## 3. Drive

### Explorer
- **D-1** [=] Arbre des dossiers à gauche, dépliable (DR-02).
- **D-2** [=] Fil d'Ariane cliquable (DR-02).
- **D-3** [=] Tableau des fichiers : nom, type, date, dernière activité, état (transfert, conversion, visa) (DR-03).
- **D-4** [+] Tri par colonne, colonnes affichables, filtre instantané par nom dans le dossier.
- **D-5** [+] Types en clair : Dossier, Jumeau, Maquette, Document, Image, Lien…
- **D-6** [!] La colonne « création » devient « première visite » (c'est ce qu'elle mesure réellement).
- **D-7** [=] Double-clic : ouvrir selon le type (dossier → entrer, jumeau → Studio, document → télécharger…) (DR-02, DR-DT-06).
- **D-8** [+] Aperçu intégré des images et des PDF.
- **D-9** [+] Aperçu 3D d'une maquette seule, sans passer par un jumeau.
- **D-10** [+] Panneau de détails à droite (Infos, Versions, Partage, Journal) au lieu de panneaux séparés.
- **D-11** [=] Sélection multiple avec Ctrl ou Maj (DR-04). [+] Une barre indique « 3 éléments sélectionnés » avec les actions valables pour tous.

### Actions sur les fichiers
- **D-12** [=] Créer un dossier (DR-05). [!] Même gestion des noms en double partout. [+] Accents et espaces acceptés.
- **D-13** [=] Déposer des fichiers par glisser-déposer (DR-06). [+] Bouton « Déposer » en plus.
- **D-14** [!] En cas de nom déjà pris au dépôt : Remplacer · Garder les deux · Ignorer.
- **D-15** [!] Le dépôt directement sur une ligne de dossier fonctionne (bug actuel).
- **D-16** [+] Suivi de chaque transfert (octets, débit, annulation). Le fichier n'est téléchargeable qu'une fois complet.
- **D-17** [=] Renommer (DR-07).
- **D-18** [=] Déplacer par glisser-déposer (DR-08). [+] « Déplacer vers… » avec choix du dossier. [!] Plus de perte possible si le déplacement échoue en route.
- **D-19** [=] Supprimer, c'est-à-dire retirer du dossier (DR-09). [!] La suppression de plusieurs éléments marche (bug actuel). [!] Les mêmes protections partout (dossiers synchronisés, liens, fichiers en visa).
- **D-20** [=] Télécharger un fichier (DR-10). [+] Message clair si le fichier n'est pas disponible, au lieu d'un fichier vide.
- **D-21** [=] Journal d'un fichier : action, utilisateur, date (DR-12).
- **D-22** [=] Deux dossiers côte à côte pour comparer ou déplacer, avec « Vue double » (DR-13).

### Versions
- **D-23** [=] Liste des versions : numéro, date, description, version courante marquée (DR-VER-01).
- **D-24** [=] Ajouter une version (DR-VER-02).
- **D-25** [=] Rendre une ancienne version courante (DR-VER-03). [+] Avertissement sur les jumeaux qui l'utilisent.
- **D-26** [=] Modifier la description, aperçu des images, supprimer une version non courante (DR-VER-04).

### Partage
- **D-27** [=] Partager avec un ou plusieurs utilisateurs : lecture, écriture, administration (DR-11).
- **D-28** [?] Voir qui a déjà accès et retirer un accès. N'existe pas aujourd'hui ; à faire si le hub le permet (question O-1).

## 4. Préparer un jumeau (dans le Drive)

- **J-1** [=] Créer un jumeau vide (DR-DT-01). [+] Assistant en 3 étapes : nom → maquettes → conversion.
- **J-2** [=] Associer des maquettes du Drive au jumeau (DR-DT-02). [!] Deux fichiers de même nom ne sont plus confondus.
- **J-3** [=] Ne proposer que les formats convertibles (DR-DT-03). [+] Les autres sont listés à part avec la raison.
- **J-4** [=] Lancer la conversion et voir l'étape en cours (DR-DT-04). [!] Impossible de la lancer deux fois en même temps. [+] Suivi dans le plateau des tâches.
- **J-5** [=] Retirer une maquette du jumeau (DR-DT-05). [+] Confirmation qui dit ce qui reste dans le Drive.
- **J-6** [=] « Ouvrir dans le Studio » (DR-DT-06).

## 5. Administration du hub

- **A-1** [=] État du hub : modèles, sessions, utilisateurs, mémoire, avec courbes historiques (ADM-01). [+] Unités affichées.
- **A-2** [=] Sauvegarde, ramasse-miettes, nettoyage `data.db` (ADM-02). [+] Confirmation, bouton bloqué tant que l'opération tourne.
- **A-3** [=] Voir les rôles et profils (ADM-03).
- **A-4** [?] Créer, supprimer des comptes et changer leurs droits. Le lien actuel est cassé (erreur 404) ; à faire ou non (question O-2).

## 6. Outils experts

- **E-1** [=] Inspecter un modèle du hub : arbre des propriétés, pointeurs, valeurs, identifiants (GI-01).
- **E-2** [=] Modifier une valeur simple (texte, nombre, booléen) dans l'inspecteur (GI-02).
- **E-3** [=] Voir le graphe en mode arbre (DAG) ou en mode forces, recherche, fiche de l'élément (GI-03).
- **E-4** [=] Ouvrir l'inspecteur depuis un nœud du Studio (ST-GRA-07).

## 7. Studio — base

### Ouvrir et organiser
- **S-1** [=] Ouvrir un jumeau et charger sa scène 3D par défaut (ST-SOC-01). [+] Rouvrir la dernière scène utilisée.
- **S-2** [+] Message clair si le jumeau est inaccessible ou s'il n'a pas de maquette (au lieu d'un écran vide).
- **S-3** [+] Changer de jumeau depuis la barre du haut, avec la liste des récents.
- **S-4** [!] Changer de jumeau nettoie tout : couleurs, sprites, abonnements, données de l'ancien.
- **S-5** [+] Disposition fixe : rail d'ateliers, navigateur, viewer, fiche. Les panneaux sont redimensionnables et repliables, et leur taille est mémorisée (ST-SOC-03).
- **S-6** [+] Un atelier peut passer en plein cadre ; le viewer se réduit alors en vignette.

### Navigateur du jumeau
- **S-7** [=] Arbre des contextes et de leurs objets (ST-GRA-01).
- **S-8** [+] Contextes regroupés par domaine (Espace, Maquettes, Classements, Réseaux, Exploitation, Calcul, Autres) au lieu de 30 lignes à plat. Filtres rapides.
- **S-9** [+] Sur chaque ligne : icône du type, couleur, nombre d'enfants, marque « 3D ».
- **S-10** [=] Recherche par nom (ST-GRA-02). [+] Résultats groupés par contexte, avec le chemin.
- **S-11** [=] Renommer un nœud, changer sa couleur (ST-GRA-03).
- **S-12** [=] Supprimer : le nœud, ses enfants, les deux, ou tous ceux du même type (ST-GRA-04). [+] Nombre exact et liste avant de valider.
- **S-13** [=] Retirer un nœud d'un contexte sans le supprimer (ST-GRA-05).
- **S-14** [=] Réordonner les enfants (ST-GRA-06). [+] Par glisser-déposer dans l'arbre.
- **S-15** [=] Exporter un contexte en CSV (ST-GRA-08).
- **S-16** [+] Toutes les actions d'un nœud au même endroit : clic droit, barre de la fiche, `Ctrl K`. Elles remplacent la barre du haut, la barre latérale et le menu circulaire (ST-SOC-02).

### 3D
- **S-17** [=] Le viewer reste viewer-rs, tel quel (ST-BIM-09).
- **S-18** [=] Sélection synchronisée : clic dans l'arbre → objets en 3D ; clic en 3D → fiche de l'objet.
- **S-19** [=] Depuis une pièce, un étage, un groupe… : sélectionner, isoler, cadrer ses objets 3D, isoler ses références (ST-BIM-05).
- **S-20** [=] Sélection par rectangle (ST-BIM-06).
- **S-21** [=] Actions métier sur un objet cliqué en 3D (ST-BIM-08). [+] Dans le clic droit du viewer, à la place du menu circulaire.
- **S-22** [=] Recherche d'objets par propriétés de la maquette et attributs : égal, contient, expression régulière (ST-BIM-07). [+] Le résultat est un ensemble réutilisable (isoler, colorer, grouper).
- **S-23** [+] Formats SVF **et SBIM** (ST-BIM-10).

## 8. Fiche de l'objet

Une seule fiche par objet, qui remplace les panneaux séparés de chaque plugin.

- **F-1** [+] En-tête : type, nom, couleur, chemin, « aussi dans : … » si l'objet a plusieurs parents.
- **F-2** [+] Les onglets n'apparaissent que s'ils servent pour ce type d'objet, avec un compteur.
- **F-3** [=] Un objet 3D pas encore dans le jumeau garde ses actions ; il est créé à la première écriture (ST-BIM-08). [+] C'est signalé.

**Attributs**
- **F-4** [=] Catégories d'attributs, ajouter, modifier, supprimer (ST-ATT-01).
- **F-5** [=] Attributs hérités des groupes parents, en lecture.
- **F-6** [=] Importer des propriétés de la maquette dans une catégorie.
- **F-7** [!] « 0 », « Non » et « vide » sont bien distingués.

**Documents**
- **F-8** [=] Joindre des fichiers depuis le poste, le Drive ou un contexte documentaire (ST-DOC-01).
- **F-9** [=] Télécharger un fichier, ou plusieurs en ZIP ; retirer de l'objet sans supprimer le fichier (ST-DOC-02).
- **F-10** [=] Liens URL : ajouter, modifier, retirer (ST-DOC-03).

**Notes**
- **F-11** [=] Fil de notes avec pièces jointes et images (ST-DOC-04).
- **F-12** [=] Capturer la vue 3D dans une note et restaurer ce point de vue plus tard (ST-DOC-05).
- **F-13** [=] Retrouver et colorer en 3D les objets annotés (ST-DOC-06).

**Mesures**
- **F-14** [=] Points GTB et points de contrôle de l'objet, valeur en direct, unité (ST-MES-01).
- **F-15** [=] Modifier une valeur ou envoyer une commande (ST-MES-02). [+] On dit **avant** l'envoi si ça part sur le terrain ou si c'est seulement écrit dans le jumeau.
- **F-16** [=] Ouvrir la fiche d'un point (ST-MES-03).
- **F-17** [=] Supprimer un point ou seulement dissocier un réseau (ST-MES-04). [+] Deux actions bien séparées.
- **F-18** [=] Exporter l'historique en Excel (ST-MES-05). [+] Avec choix de la période.

**Tickets**
- **F-19** [=] Déclarer un ticket sur l'objet : processus, incident usuel, priorité, message, pièces jointes (ST-TIC-04).
- **F-20** [=] Fiche du ticket : étape, chronologie, commentaires (ST-TIC-06).
- **F-21** [=] Étape suivante ou précédente, archiver, réactiver (ST-TIC-07, 08).

**Événements**
- **F-22** [=] Agenda de l'objet, avec ou sans les événements des parents (ST-EVT-03).
- **F-23** [=] Créer un événement ponctuel ou récurrent (ST-EVT-02).
- **F-24** [=] Modifier une occurrence (ST-EVT-04).
- **F-25** [=] Annuler une occurrence, les précédentes, les suivantes ou toute la série (ST-EVT-05). [+] Nombre d'occurrences touchées affiché.

**Relations**
- **F-26** [=] Voir les relations et leurs enfants, retirer des liens (ST-GRA-05, 06, ST-LINK-02).
- **F-27** [=] Créer un lien vers n'importe quel nœud (ST-LINK-01).
- **F-28** [=] Groupes de l'objet : ajouter, retirer, trouver sa pièce (ST-GRP-02, 03).

## 9. Ateliers

### Géographie
- **W-GEO-1** [=] Créer à la main : contexte, site, bâtiment, étage, zone, pièce (ST-GEO-01).
- **W-GEO-2** [=] Rattacher la sélection 3D comme équipements **ou** comme références (ST-GEO-02).
- **W-GEO-3** [=] Inscrire un contexte dans les référentiels (ST-GEO-03).
- **W-GEO-4** [=] Générer l'arborescence depuis les propriétés de la maquette, avec objets valides et invalides visibles en 3D (ST-GEO-04).
- **W-GEO-5** [=] Importer ou mettre à jour l'architecture depuis une maquette (ST-GEO-05).
- **W-GEO-6** [=] Écran des différences par étage, avec forçage manuel des correspondances (ST-GEO-06).
- **W-GEO-7** [=] Fusionner des organisations BIM Geo (ST-GEO-08). [+] Deux arbres côte à côte, glisser-déposer.
- **W-GEO-8** [=] Projeter des équipements dans les espaces, avec configurations nommées et options (ST-GEO-09).
- **W-GEO-9** [=] Résoudre à la main les affectations douteuses (ST-GEO-10).
- **W-GEO-10** [=] Enregistrer, puis exécuter des lots de commandes (ST-GEO-07). [+] Suivi dans le plateau des tâches.
- **W-GEO-11** [=] Outils de recalcul : identifiants, niveaux, surfaces, centres, positions, capacité des pièces (ST-GEO-11, ST-VIS-01, ST-ATT-05). [!] Une position vide n'écrase plus une position valide.

### Maquettes et scènes
- **W-BIM-1** [=] Créer et composer des scènes multi-maquettes (ST-BIM-01).
- **W-BIM-2** [=] Calculer les décalages des maquettes (ST-BIM-02).
- **W-BIM-3** [=] Comparer deux versions d'une maquette : ajoutés, supprimés (ST-BIM-03).
- **W-BIM-4** [=] Réconcilier les identifiants après une nouvelle version (ST-BIM-04). [+] Liste des introuvables exportable.
- **W-BIM-5** [=] Choisir la représentation par défaut d'une maquette (ST-BIM-10).

### Données (tableau)
- **W-DAT-1** [=] Tableau des attributs d'un ensemble d'objets, recherche, édition, édition en masse (ST-ATT-02). [+] Sans pagination ; modifications en attente jusqu'à « Enregistrer ».
- **W-DAT-2** [=] Export et import Excel (ST-ATT-03). [+] Aperçu des différences avant d'importer.
- **W-DAT-3** [=] Profils de colonnes, import et export (ST-ATT-04).
- **W-DAT-4** [=] Créer des classements : contexte, catégories, groupes (ST-GRP-01).
- **W-DAT-5** [=] Classer automatiquement selon une règle (ST-GRP-04). [+] Aperçu des groupes avant de créer.

### Réseaux et GTB
- **W-NET-1** [=] Créer une arborescence technique et y ajouter la sélection 3D (ST-IOT-01, 02).
- **W-NET-2** [=] Assistant de génération automates ↔ objets : ensembles, règle d'association, nommage, aperçu, génération (ST-IOT-03 à 06). [+] Test de la règle sur des exemples.
- **W-NET-3** [=] Contenu d'un réseau et export Excel ; vider les liens (ST-IOT-07, 08).
- **W-NET-4** [=] Profils virtuels sur automates, correspondances corrigeables, détacher (ST-IOT-09, 10).
- **W-NET-5** [=] Rapprocher automates BIM et dispositifs BMS (ST-IOT-11).
- **W-NET-6** [=] Bibliothèque de profils : créer, générer depuis XML ou depuis un dispositif, mettre à jour (ST-PROF-01 à 04, ST-OPC-03, ST-SNMP-03).
- **W-NET-7** [=] Items d'un profil : ajout, import BOG, export JSON, entrées et sorties, mesures, alarmes et commandes (ST-PROF-05 à 09).
- **W-NET-8** [=] Intervalles de surveillance et historisation, un par un ou en masse (ST-PROF-10, 11, ST-OPC-04, ST-SNMP-04).
- **W-NET-9** [=] BACnet : sous-réseau, découverte broadcast ou unicast, création, lecture des objets (ST-BAC-01 à 05).
- **W-NET-10** [=] OPC UA : passerelles, découverte, arbre à cocher (ST-OPC-01, 02).
- **W-NET-11** [=] SNMP : réseaux, MIB, arbre des OID (ST-SNMP-01, 02).
- **W-NET-12** [=] Surveillance des dispositifs : démarrer, arrêter, redémarrer, historiser, affecter un profil (ST-BAC-06 à 09, ST-OPC-05, ST-SNMP-05).
- **W-NET-13** [=] Créer à la main réseaux, dispositifs et endpoints ; déplacer des dispositifs (ST-ORG-01 à 03).
- **W-NET-14** [=] Afficher le réseau en 3D avec sprites et liens (ST-VIS-02). [+] Les filtres de préfixes deviennent un réglage visible.
- **W-NET-15** [+] État de chaque organ visible : en ligne, sans réponse, demande envoyée.

### Points de contrôle
- **W-CP-1** [=] Bibliothèques de profils de points (ST-CP-01).
- **W-CP-2** [=] Définir les points d'un profil : nom, type, unité, commande, historisation (ST-CP-02).
- **W-CP-3** [=] Couleurs et seuils d'affichage (ST-CP-03).
- **W-CP-4** [=] Modifier un profil et propager aux objets (ST-CP-04). [+] « 3 créations, 1 suppression sur 240 objets » affiché avant d'appliquer.
- **W-CP-5** [=] Affecter ou détacher un profil sur des groupes (ST-CP-05, 06).
- **W-CP-6** [=] Heatmap en 3D avec légende (ST-CP-07).
- **W-CP-7** [=] Rattacher les séries des endpoints aux points métier (ST-CP-08).
- **W-CP-8** [=] Importer une série Excel comme profil de simulation et l'affecter (ST-SIM-01, 02).

### Tickets
- **W-TIC-1** [=] Contextes de tickets, étapes, processus, incidents usuels (ST-TIC-01 à 03).
- **W-TIC-2** [=] Liste des tickets avec recherche et tri (ST-TIC-05). [+] Vue en colonnes par étape.
- **W-TIC-3** [=] Voir les tickets en 3D, colorés par étape (ST-TIC-09).
- **W-TIC-4** [=] Mission : liaison à l'organ, état, commandes, contextes envoyés (ST-MIS-01 à 03).

### Planning
- **W-EVT-1** [=] Contextes, catégories et groupes d'événements (ST-EVT-01).
- **W-EVT-2** [=] Calendrier jour, semaine, mois, liste.
- **W-EVT-3** [=] Sélectionner en 3D ou supprimer les événements de la période visible (ST-EVT-06). [!] Seuls les événements cochés sont supprimés (bug actuel : tout était supprimé).
- **W-EVT-4** [=] Voir et colorer en 3D (ST-EVT-07).

### Courbes
- **W-CRB-1** [=] Superposer les historiques de plusieurs points (ST-MES-06). [+] Dans un panneau sous le viewer, plus rapide (uPlot au lieu de Plotly).
- **W-CRB-2** [=] Périodes : 1 h, 3 h, 24 h, hier, 3 j, 7 j, personnalisée (ST-MES-07).
- **W-CRB-3** [=] Réglages : lignes, points, légende, zoom (ST-MES-08).
- **W-CRB-4** [!] Ouvrir une courbe ne crée plus de série vide dans le jumeau (question O-3).

### Dashboards
- **W-DSH-1** [=] Modèles de dashboard par type d'espace (ST-DASH-01).
- **W-DSH-2** [=] Appliquer à un objet ou à toute une arborescence (ST-DASH-02, 03). [+] Aperçu du nombre d'objets touchés.
- **W-DSH-3** [=] Règles de calcul (somme, moyenne, min, max, référence), une à une ou en lot (ST-DASH-04, 05).

### Analyses
- **W-ANA-1** [=] Contextes d'analyses et familles d'entités (ST-ANA-01).
- **W-ANA-2** [=] Éditeur : général, population, entrées, déclencheurs, calculs, sortie (ST-ANA-02 à 07, 09 à 12). [+] Une seule page avec sommaire, au lieu d'un assistant fermé.
- **W-ANA-3** [=] Prévisualiser les entrées sans aucun effet (ST-ANA-05).
- **W-ANA-4** [=] Les 41 opérations de calcul, avec leur documentation (ST-ANA-08).
- **W-ANA-5** [+] Graphe des dépendances entre calculs, avec les erreurs signalées.
- **W-ANA-6** [+] Aperçu des 5 prochaines exécutions d'un cron.
- **W-ANA-7** [=] Recharger, modifier, supprimer, réinitialiser la date (ST-ANA-13). [!] L'option « rattrapage » est enfin enregistrée.
- **W-ANA-8** [+] Avertissement si l'organ d'analyse ne tourne pas (ST-ANA-14).

## 10. Ce qu'on ne fait pas (sauf avis contraire)

- **N-1** Toucher au viewer-rs.
- **N-2** Modifier le hub, l'API BOS, les organs ou le format des données.
- **N-3** Reprendre l'ancien SpinalTwin (« ST App list »).
- **N-4** Corbeille dans le Drive (n'existe pas aujourd'hui, question O-5).
- **N-5** Archive ZIP d'un dossier du Drive, dépôt d'un dossier entier depuis le poste.
- **N-6** Modifier toute une série d'événements d'un coup.
- **N-7** Version téléphone (le portail s'en charge).
- **N-8** Traduction dans d'autres langues.
