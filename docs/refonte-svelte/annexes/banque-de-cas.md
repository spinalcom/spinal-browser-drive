<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# Banque de cas — liste détaillée des capacités (3 000 points)

> **Statut : annexe.** Ce n’est pas un cahier des charges écran par écran. Elle sert à ne rien oublier et à alimenter la base de tests ([08-tests.md](../08-tests.md)) : chaque point `[recette]` et `[!]` doit être couvert par au moins un test. Les écrans se conçoivent à partir des parcours ([03-parcours.md](../03-parcours.md)).

Une ligne = un point concret. Chaque point a un numéro pour être commenté (« DR-06.3 : à changer », « ST-GEO-04.7 : pas utile »…).

**Couverture : les 183 capacités de l'inventaire [`capacites-studio-drive.md`](../../../../../docs/capacites-studio-drive.md), avec tout leur détail** (paramètres, valeurs par défaut, formats, états, limites, anomalies, cas de recette), plus les règles transverses de l'inventaire (§9) et les points communs à toute l'application.

Repères :

| Repère | Sens |
|---|---|
| **[=]** | Repris de l'existant, même fonction. C'est là qu'il faut dire si on veut faire mieux qu'une copie. |
| **[+]** | Amélioration déjà proposée dans les specs. |
| **[!]** | Bug documenté de l'existant, corrigé. |
| **[recette]** | Cas à vérifier avant de dire que c'est fait. |
| **[non]** | Volontairement pas fait (raison donnée). |
| **[?]** | À décider (questions O-x de [06-tracabilite.md](../06-tracabilite.md)). |

Sommaire :
1. Toute l'application (G)
2. Règles à respecter partout (R)
3. Drive, jumeaux, outils experts, administration (DR, DR-VER, DR-DT, GI, ADM)
4. Studio : socle et 3D (ST-SOC, ST-VIS)
5. Graphe et géographie (ST-GRA, ST-GEO)
6. Maquettes, classements, attributs, documents, simulation (ST-BIM, ST-GRP, ST-ATT, ST-DOC, ST-SIM)
7. Réseaux : arborescence technique et profils (ST-IOT, ST-PROF)
8. Réseaux : connecteurs, points de contrôle, liens (ST-BAC, ST-OPC, ST-SNMP, ST-ORG, ST-CP, ST-LINK)
9. Tickets, événements, Mission, mesures, dashboards (ST-TIC, ST-EVT, ST-MIS, ST-MES, ST-DASH)
10. Analyses (ST-ANA)
11. Modules techniques sans capacité propre
12. Ce qu'on ne fait pas

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


## 2. Règles à respecter partout

Elles viennent des contrats de non-régression de l'inventaire (§9) et s'appliquent à tous les écrans.

### Opérations à ne jamais confondre (§9.2)
- **R-1** [=] Déplacer un fichier Drive change son dossier, pas l'objet pointé.
- **R-2** [=] Supprimer une entrée Drive retire une référence ; les objets partagés et les binaires peuvent rester ailleurs. La confirmation le dit.
- **R-3** [=] Retirer un document d'une fiche retire l'association à cet objet seulement ; ses autres usages restent.
- **R-4** [=] Retirer un objet d'un groupe change son classement, ne supprime pas l'équipement.
- **R-5** [=] Détacher une relation dans un contexte préserve les relations des autres contextes ; vérifier l'effet réel des services historiques plus larges.
- **R-6** [=] Supprimer un nœud peut toucher plusieurs parents et contextes ; distinguer suppression simple, récursive et nettoyage des objets partagés.
- **R-7** [=] Supprimer un asset BIM touche son nœud dans le jumeau ; source, versions, fichiers convertis, scènes et liens métier ont des cycles de vie distincts.
- **R-8** [=] Changer de version courante change le contenu de référence, sans migration automatique garantie des objets.
- **R-9** [+] Changer la valeur d'un endpoint : dire avant l'envoi s'il s'agit d'une écriture dans le modèle ou d'une commande envoyée au terrain.
- **R-10** [=] Activer une surveillance enregistre une intention de collecte ; cela ne prouve pas que des mesures arrivent.
- **R-11** [=] Lier une série temporelle partage le même historique par pointeur ; ne jamais le remplacer par une copie.
- **R-12** [=] Archiver un ticket le sort du traitement actif en gardant ses données et la possibilité de le réactiver.
- **R-13** [=] Annuler un événement récurrent : choisir précisément occurrence, passé, futur ou série, sans toucher les autres séries.
- **R-14** [=] Prévisualiser une analyse résout son périmètre sans produire de ticket, d'écriture ni de notification.

### Invariants sur les données (§9.3)
- **R-15** [=] Conserver les identités (jumeaux, nœuds, contextes, fichiers, versions) ; les anciens liens ciblent toujours le bon objet ; jamais de reconstruction par les noms.
- **R-16** [=] Graphe à plusieurs parents : garder les relations typées et leur contexte ; l'affichage en arbre ne modifie jamais les appartenances.
- **R-17** [=] Conserver binaires, versions, descriptions, pièces jointes, auteurs, dates, notes et captures.
- **R-18** [=] Mesures : conserver unités, types, `0` et `false`, différence entre absent et zéro, horodatage, durée de conservation et sémantique d'agrégation (une somme n'est pas une intégrale, une moyenne simple n'est pas une moyenne pondérée).
- **R-19** [=] Maquettes : conserver correspondances maquette / version / objet, décalages, scènes et points de vue ; le même `dbId` dans deux maquettes ne fusionne jamais deux équipements.
- **R-20** [=] Configuration : recharger et rééditer profils de colonnes, règles de génération, profils d'équipements, intervalles, workflows et analyses existants ; un champ non affiché n'est jamais effacé à l'enregistrement.
- **R-21** [=] Permissions : maintenir accès et refus effectifs ; correspondance explicite entre profils du portail, contextes autorisés de l'API, rôles Studio et droits du hub.
- **R-22** [=] Asynchrone : progression, succès partiel, erreurs et dépendance aux organs ; une demande reçue n'est pas un travail réalisé ; fermer un écran ne crée pas de doublon au retour.
- **R-23** [=] Calculs : identifiants d'algorithmes, types de paramètres, ordre des opérandes et conventions temporelles préservés ; toute correction est visible et testée.
- **R-24** [=] Cycles de vie : aucun listener, couleur, sprite, chargement ou commande d'un jumeau n'agit dans un autre après navigation.

### Scénarios de recette transversaux (§9.4)
- **R-25** [recette] Du fichier au jumeau exploitable : nouveau graphe, deux maquettes, un document, plusieurs versions ; import, association, conversion, scène et géographie cohérents.
- **R-26** [recette] Révision BIM avec données métier (attributs, groupe, ticket, note, endpoint) : différences explicites, liens préservés ou signalés, aucun rattachement à un homonyme.
- **R-27** [recette] Même document partagé par deux objets : le retirer du premier ne le fait pas disparaître du second ni du Drive.
- **R-28** [recette] Réseau raccordé au BIM : correspondances automatiques puis manuelles, persistance, surveillance et dissociation aux bonnes portées.
- **R-29** [recette] Points de contrôle et calcul avec `0`, `false`, valeurs absentes et série irrégulière : valeurs, types et unités conservés, bonnes agrégations, prévisualisation sans effet.
- **R-30** [recette] Ticket avec pièces jointes et événement récurrent sur le même objet : la transition et l'archivage gardent la fiche ; annuler l'événement ne touche ni le ticket ni l'autre série.
- **R-31** [recette] Édition tabulaire aller-retour (Unicode, zéro, cellule vide, plusieurs pages) : export et import exacts, aperçu des changements, annulation sans écriture.
- **R-32** [recette] Lot mêlant objets autorisés, protégés et en erreur : périmètre confirmé, exclusions expliquées, retour par objet, reprise sans doublon.
- **R-33** [recette] Administrateur, utilisateur restreint et destinataire d'un partage : accès réels cohérents ; rien n'est autorisé juste parce qu'un bouton est visible.
- **R-34** [recette] Lien direct, rechargement, changement de jumeau, précédent / suivant : URL cohérente, bonne cible, aucune ressource résiduelle.
- **R-35** [recette] Organ arrêté, maquette absente, ressource inaccessible : état explicite, le reste utilisable, aucune fausse réussite ni perte de configuration.
- **R-36** [recette] Deux vues sur le même objet, grands graphes, long historique, nombreux fichiers : actualisation cohérente, sélection stable, aucun écrasement silencieux.

## 3. Drive, jumeaux, outils experts, administration

### DR-01 — Accéder à son espace du hub et gérer sa session
Destination : Connexion `/studio/connexion` ; session et menu du compte dans la barre supérieure
- **DR-01.1** [=] Se connecter avec un compte du hub : champs « Identifiant » et « Mot de passe », bouton « Se connecter ».
- **DR-01.2** [=] Vérifier un compte ordinaire par `/get_user_id`, puis ouvrir la connexion au hub.
- **DR-01.3** [=] Proposer une case « Administration du hub » qui vérifie le compte par `/get_admin_id`.
- **DR-01.4** [=] Ouvrir l'espace personnel `/__users__/<utilisateur>` après une connexion ordinaire.
- **DR-01.5** [=] Ouvrir la racine `/` du hub pour une session d'administration.
- **DR-01.6** [+] Afficher trois messages distincts : identifiant ou mot de passe incorrect, compte valide mais non administrateur, hub injoignable.
- **DR-01.7** [+] Après connexion, revenir à l'URL demandée au départ, sinon au Drive.
- **DR-01.8** [=] Afficher l'utilisateur connecté dans le menu du compte.
- **DR-01.9** [=] Afficher la section Admin seulement pour une session administrateur hub.
- **DR-01.10** [=] Se déconnecter depuis le menu du compte.
- **DR-01.11** [!] Ne plus déconnecter à la simple ouverture de la page de connexion.
- **DR-01.12** [+] Si une session existe, proposer « Continuer en tant que <utilisateur> » ou « Changer de compte ».
- **DR-01.13** [!] Ne plus stocker les identifiants dans `spinalhome_cfg` (`localStorage`) : mémoire et `sessionStorage` de l'onglet seulement.
- **DR-01.14** [+] Redemander la connexion dans un nouvel onglet, sauf s'il est ouvert depuis l'application (jeton passé par `BroadcastChannel`, jamais par l'URL).
- **DR-01.15** [+] À la déconnexion : fermer le connecteur, arrêter tâches et abonnements, vider `sessionStorage`, revenir à `/studio/connexion`.
- **DR-01.16** [+] En cas d'expiration ou de perte du hub : bandeau permanent « Connexion au hub perdue », écritures bloquées, reconnexion automatique progressive.
- **DR-01.17** [+] Ne jamais rejouer une écriture en silence après reconnexion.
- **DR-01.18** [=] Utiliser une vraie session hub : ne pas supposer que le JWT BOS du portail en tient lieu.
- **DR-01.19** [non] Partager les identifiants mémorisés avec les anciens outils du même origin : ce stockage historique n'est pas une capacité à reproduire.
- **DR-01.20** [recette] Un utilisateur ne voit que les espaces auxquels il a droit.
- **DR-01.21** [recette] Un administrateur retrouve ses outils supplémentaires.
- **DR-01.22** [recette] Un compte ordinaire avec la case Administration obtient « compte non administrateur », pas « mot de passe incorrect ».
- **DR-01.23** [recette] Après déconnexion ou expiration, aucune commande ne reste active sous l'identité précédente.
- **DR-01.24** [recette] Hub arrêté : message « hub injoignable », puis reprise sans écriture rejouée.

### DR-02 — Parcourir dossiers et sous-dossiers avec un chemin intelligible
Destination : Drive `/studio/drive/<chemin>` › arborescence de gauche, fil d'Ariane, tableau du contenu
- **DR-02.1** [=] Afficher l'arborescence des dossiers à gauche : dossiers ordinaires (`Directory`) et synchronisés (`Synchronized Directory`).
- **DR-02.2** [=] Déplier et replier les branches à la demande.
- **DR-02.3** [=] Choisir un dossier dans l'arbre pour afficher son contenu ; mettre le dossier courant en surbrillance.
- **DR-02.4** [=] Faire piloter par l'arbre l'explorateur qui a le focus (volet actif en vue double).
- **DR-02.5** [+] Rendre l'arbre repliable et sa largeur réglable.
- **DR-02.6** [+] Afficher les éléments partagés avec l'utilisateur dans une branche « Partagés » de l'arbre.
- **DR-02.7** [=] Afficher un fil d'Ariane cliquable pour remonter à chaque ancêtre.
- **DR-02.8** [=] Montrer dans le fil d'Ariane le chemin effectivement suivi.
- **DR-02.9** [=] Garder séparés le chemin d'accès et l'identité de l'objet : plusieurs références peuvent mener au même objet.
- **DR-02.10** [+] Porter le dossier courant dans l'URL : recharger ou partager le lien rouvre le même dossier.
- **DR-02.11** [=] Double-clic ou `Entrée` sur un dossier ou un dossier synchronisé : entrer dedans.
- **DR-02.12** [=] Double-clic sur un jumeau : ouvrir le Studio sur ce jumeau (voir DR-DT-06).
- **DR-02.13** [+] Double-clic sur une maquette (`BIM Project`) : aperçu 3D du fichier seul, sans graphe ; « Ouvrir dans un jumeau… » en action secondaire.
- **DR-02.14** [+] Double-clic sur une image ou un PDF : aperçu dans un panneau de prévisualisation.
- **DR-02.15** [+] Double-clic sur un autre `Path` : téléchargement après confirmation.
- **DR-02.16** [+] Double-clic sur un lien HTTP : afficher l'URL, puis l'ouvrir dans un nouvel onglet.
- **DR-02.17** [=] Ne pas ouvrir indistinctement tous les types de modèles comme des dossiers.
- **DR-02.18** [=] Charger le contenu d'un dossier par ses pointeurs, à la demande.
- **DR-02.19** [=] Actualiser l'affichage quand le modèle change (autre vue, autre utilisateur).
- **DR-02.20** [+] Filtrer instantanément le dossier par nom (« Rechercher dans ce dossier », touche `/`).
- **DR-02.21** [+] Recherche sans résultat : rappeler le terme et proposer « Effacer la recherche ».
- **DR-02.22** [+] Dossier vide : « Ce dossier est vide. Déposez des fichiers ou créez un dossier. »
- **DR-02.23** [+] Parcourir l'arbre et le tableau au clavier (flèches pour parcourir et déplier, `Entrée` pour ouvrir).
- **DR-02.24** [recette] Naviguer jusqu'à un dossier profond puis revenir à chaque ancêtre.
- **DR-02.25** [recette] Consulter un dossier vide et un dossier synchronisé.
- **DR-02.26** [recette] Modifier un dossier depuis une autre vue et constater l'actualisation.
- **DR-02.27** [recette] Ouvrir un document, un jumeau et un dossier : chacun déclenche l'action adaptée.
- **DR-02.28** [recette] Atteindre le même objet par deux chemins : le fil d'Ariane suit le chemin, l'identité reste la même.

### DR-03 — Identifier les objets et suivre leur état
Destination : Drive › tableau du contenu du dossier
- **DR-03.1** [=] Afficher une colonne nom avec l'icône du type.
- **DR-03.2** [+] Afficher le type en clair : Dossier, Dossier synchronisé, Jumeau, Maquette, Document, Image, Lien HTTP…
- **DR-03.3** [!] Renommer la colonne « Création » en « Première visite » : elle vient du premier journal (souvent l'entrée « 1st visit »), pas de la création du binaire.
- **DR-03.4** [=] Afficher une colonne « Dernière activité » tirée de la dernière entrée du journal, sans prétendre couvrir toute écriture du modèle.
- **DR-03.5** [=] Afficher une colonne État : progression du transfert, état de conversion, erreur.
- **DR-03.6** [=] Afficher le visa en pourcentage quand `_info.visaValidation.isValid` existe.
- **DR-03.7** [=] Afficher une donnée manquante comme absente, sans date ni pourcentage inventés.
- **DR-03.8** [+] Trier par colonne.
- **DR-03.9** [+] Choisir les colonnes affichées et mémoriser ce choix dans les préférences.
- **DR-03.10** [+] Virtualiser le tableau pour supporter des dizaines de milliers de lignes.
- **DR-03.11** [+] Dates relatives en dessous de 7 jours, absolues au-delà, forme exacte en infobulle.
- **DR-03.12** [+] Montrer chaque état avec une icône et un libellé, jamais par la couleur seule.
- **DR-03.13** [non] Colonne propriétaire : commentée dans l'historique, non reprise.
- **DR-03.14** [non] Workflow complet de visa : absent du Drive historique, non prévu.
- **DR-03.15** [recette] Objet sans journal ni date : affichage propre de l'absence.
- **DR-03.16** [recette] Transfert à 0 %, transfert terminé, transfert en échec.
- **DR-03.17** [recette] Objet avec visa : pourcentage affiché.

### DR-04 — Sélectionner un ou plusieurs objets
Destination : Drive › tableau, barre de sélection, panneau de détails
- **DR-04.1** [=] Sélectionner un fichier ou un dossier par clic.
- **DR-04.2** [=] Ajouter ou retirer un élément de la sélection avec `Ctrl`/`Cmd` + clic.
- **DR-04.3** [+] Sélectionner une plage avec `Maj` + clic, tout avec `Ctrl A`, ou par cases à cocher.
- **DR-04.4** [=] Glisser la sélection vers un dossier pour la déplacer (voir DR-08).
- **DR-04.5** [=] Accéder aux actions applicables par clic droit et dans le panneau de détails.
- **DR-04.6** [=] Conserver la sélection quand les lignes existantes s'actualisent.
- **DR-04.7** [+] Remplacer la barre d'outils par une barre de sélection « 3 éléments sélectionnés » dès qu'une ligne est cochée.
- **DR-04.8** [+] N'y montrer que les actions valables pour toute la sélection (Déplacer, Supprimer).
- **DR-04.9** [+] Désactiver les actions qui ne portent que sur un élément, avec la raison en infobulle.
- **DR-04.10** [=] Indiquer la cible réelle de chaque action (« 3 éléments », pas l'élément survolé).
- **DR-04.11** [=] Ne pas proposer comme exécutables les actions incompatibles avec le type sélectionné.
- **DR-04.12** [+] Sans sélection, afficher dans le panneau de détails le dossier courant.
- **DR-04.13** [+] `Échap` ferme le menu, puis la boîte de dialogue, puis désélectionne.
- **DR-04.14** [non] Téléchargement ZIP, partage groupé et renommage par lot : la multisélection ne les crée pas.
- **DR-04.15** [recette] Chaque action vise sa cible réelle, y compris après actualisation de la liste.
- **DR-04.16** [recette] Les actions incompatibles avec le type sélectionné ne sont pas exécutables.

### DR-05 — Créer et nommer un dossier
Destination : Drive › « Nouveau → Dossier », clic droit sur le fond du tableau ou sur l'arbre
- **DR-05.1** [=] Créer un `Directory` et l'ajouter au dossier parent.
- **DR-05.2** [=] Créer depuis le dossier courant ou depuis l'arbre.
- **DR-05.3** [+] Saisir le nom en ligne, directement dans le tableau.
- **DR-05.4** [!] En cas de nom déjà pris, proposer un suffixe « (2) » visible avant validation, pour tous les points d'entrée (l'arbre n'en avait pas).
- **DR-05.5** [+] Accepter l'Unicode : lettres accentuées et espaces.
- **DR-05.6** [+] Refuser seulement `/` et les caractères de contrôle, avec un message.
- **DR-05.7** [=] `Échap` annule sans rien créer.
- **DR-05.8** [recette] Créer deux dossiers de même nom : ils restent distincts.
- **DR-05.9** [recette] Ouvrir le nouveau dossier et le voir depuis une seconde vue.
- **DR-05.10** [recette] Annuler la création : aucune entrée créée.
- **DR-05.11** [recette] Nom avec caractères français accepté ; nom avec `/` refusé avec message.

### DR-06 — Déposer des fichiers binaires et suivre leur transfert
Destination : Drive › bouton « Déposer », glisser-déposer sur la zone, sur une ligne ou un dossier de l'arbre ; plateau des tâches
- **DR-06.1** [=] Importer un ou plusieurs fichiers du poste dans un dossier du Drive.
- **DR-06.2** [=] Créer un `Path` par fichier, puis une entrée dans le dossier.
- **DR-06.3** [=] Accepter le glisser-déposer sur toute la zone du contenu du dossier courant.
- **DR-06.4** [+] Ajouter un bouton « Déposer » qui ouvre le sélecteur de fichiers.
- **DR-06.5** [!] Faire fonctionner le dépôt sur une ligne de dossier (condition de type contradictoire).
- **DR-06.6** [+] Accepter le dépôt sur un dossier de l'arbre.
- **DR-06.7** [=] Suivre le transfert d'après la taille à transférer et les octets restants.
- **DR-06.8** [+] Créer une tâche par fichier dans le plateau : octets transférés, débit, annulation.
- **DR-06.9** [!] Gérer réellement les noms déjà pris (le nom libre calculé était ignoré) : boîte « Remplacer · Garder les deux · Ignorer ».
- **DR-06.10** [+] Ajouter « Appliquer à tous » dans cette boîte.
- **DR-06.11** [=] Laisser la ligne en état « Transfert » jusqu'à disponibilité réelle du binaire.
- **DR-06.12** [=] Interdire le téléchargement avant la fin du transfert.
- **DR-06.13** [+] Garder les tâches de transfert actives pendant la navigation dans l'application.
- **DR-06.14** [+] Demander confirmation avant de fermer l'onglet pendant un transfert.
- **DR-06.15** [non] Dépôt d'un dossier local (import récursif) : refusé avec un message ; amélioration possible plus tard.
- **DR-06.16** [non] Reprise d'un transfert interrompu là où il s'est arrêté : non établie historiquement, non prévue.
- **DR-06.17** [recette] Un fichier seul, puis plusieurs fichiers.
- **DR-06.18** [recette] Nom déjà présent : tester Remplacer, Garder les deux, Ignorer, et « Appliquer à tous ».
- **DR-06.19** [recette] Fichier volumineux, interruption et erreur de transfert.
- **DR-06.20** [recette] Aucune version annoncée comme téléchargeable avant sa disponibilité effective.
- **DR-06.21** [recette] Dépôt sur une ligne de dossier et sur un dossier de l'arbre.
- **DR-06.22** [recette] Dépôt d'un dossier local : message de refus, rien de créé.

### DR-07 — Renommer une entrée sans perdre ses données
Destination : Drive › `F2`, clic droit, panneau de détails
- **DR-07.1** [=] Modifier `File.name` en gardant l'identité et les références de l'objet.
- **DR-07.2** [=] Proposer la valeur actuelle au départ.
- **DR-07.3** [+] Éditer le nom en ligne dans le tableau.
- **DR-07.4** [=] Nom inchangé : aucune écriture.
- **DR-07.5** [=] Nom invalide : refus avec message distinct.
- **DR-07.6** [=] Nom déjà pris : refus avec message, sans écraser l'autre entrée.
- **DR-07.7** [+] Accepter l'Unicode (la règle historique se limitait aux lettres ASCII, chiffres, espace, point, tiret, underscore) ; refuser `/` et les caractères de contrôle.
- **DR-07.8** [+] Proposer « Annuler » dans un toast pendant 8 secondes.
- **DR-07.9** [=] Prévenir qu'un lien historique bâti sur le chemin texte peut devenir obsolète après renommage.
- **DR-07.10** [recette] Après renommage : contenu, versions, rattachements BIM et partages intacts.
- **DR-07.11** [recette] Collision traitée sans écraser l'autre entrée.
- **DR-07.12** [recette] Liens existants testés selon la stratégie de compatibilité retenue (anciennes URL servies jusqu'à la bascule).

### DR-08 — Déplacer des références entre dossiers
Destination : Drive › glisser vers un dossier (arbre, ligne, autre volet de la vue double), « Déplacer vers… »
- **DR-08.1** [=] Déplacer un ou plusieurs objets sans réimporter leur contenu.
- **DR-08.2** [=] Utiliser deux explorateurs comme source et destination.
- **DR-08.3** [=] Accepter le dépôt sur le fond de l'autre volet.
- **DR-08.4** [!] Faire fonctionner le dépôt sur une ligne de dossier (test « type différent de `Directory` OU différent de `Synchronized Directory` » toujours vrai).
- **DR-08.5** [+] Accepter le dépôt sur un dossier de l'arbre.
- **DR-08.6** [+] Proposer « Déplacer vers… » avec choix d'un dossier.
- **DR-08.7** [=] Ignorer un déplacement dans le même dossier.
- **DR-08.8** [=] Refuser de déplacer un dossier dans sa propre descendance, avec un message.
- **DR-08.9** [+] Homonyme dans la cible : boîte « Remplacer · Garder les deux · Ignorer », comme au dépôt.
- **DR-08.10** [!] Ajouter dans la cible avant de retirer de la source : un échec laisse la source intacte.
- **DR-08.11** [+] Proposer « Annuler » dans un toast pendant 8 secondes.
- **DR-08.12** [non] Copie ou duplication indépendante : non démontrée historiquement, non prévue.
- **DR-08.13** [recette] Déplacement d'un élément, puis de plusieurs.
- **DR-08.14** [recette] Cible contenant un homonyme.
- **DR-08.15** [recette] Refus d'un cycle, y compris sur plusieurs niveaux.
- **DR-08.16** [recette] Perte de connexion pendant l'opération : source conservée.

### DR-09 — Supprimer une entrée ou une sélection
Destination : Drive › `Suppr`, clic droit, barre de sélection, arbre ; confirmation de portée
- **DR-09.1** [=] Retirer un fichier ou un dossier de son parent (`remove_ref`) après confirmation.
- **DR-09.2** [+] Confirmation de portée avec verbe exact et nombre : « Retirer 4 éléments de « Projets » », liste dépliable.
- **DR-09.3** [+] Dire dans la confirmation que les objets partagés ailleurs restent accessibles depuis leurs autres emplacements.
- **DR-09.4** [=] Ne pas présenter le retrait comme un effacement physique des binaires encore référencés ailleurs.
- **DR-09.5** [=] Ne pas confondre retrait d'un dossier et suppression métier des équipements d'un graphe.
- **DR-09.6** [=] Exclure la racine, les liens HTTP (`HttpPath`) et les dossiers synchronisés (`Synchronized Directory`).
- **DR-09.7** [!] Exclure partout les fichiers en validation (`visaValidation` présent), pas seulement depuis l'arbre.
- **DR-09.8** [+] Lister les éléments exclus avec leur raison (« 2 fichiers synchronisés ne peuvent pas être supprimés »).
- **DR-09.9** [!] Réparer la suppression multiple (« Delete Selected » classait tout en ignoré).
- **DR-09.10** [+] Bouton de validation avec le verbe et le nombre, jamais « OK ».
- **DR-09.11** [+] Afficher l'action en rouge, séparée des autres groupes.
- **DR-09.12** [+] Lot : résultat par élément dans le plateau (réussis, ignorés avec raison, erreurs) et « Relancer les échecs ».
- **DR-09.13** [non] Pas de corbeille au départ ; la confirmation le dit.
- **DR-09.14** [?] Corbeille à reconsidérer après le lot 1 (O-5).
- **DR-09.15** [recette] Suppression unitaire, puis annulation à la confirmation.
- **DR-09.16** [recette] Exclusions affichées pour chaque type protégé, y compris un fichier en visa depuis la ligne et depuis l'arbre.
- **DR-09.17** [recette] Lot mêlant objets autorisés et protégés : seuls les autorisés sont retirés.
- **DR-09.18** [recette] Objet partagé ailleurs : toujours accessible depuis son autre emplacement.

### DR-10 — Télécharger le contenu d'un fichier
Destination : Drive › clic droit, panneau de détails, double-clic sur un `Path`
- **DR-10.1** [=] Télécharger le binaire pointé par un `Path`, sous son nom d'origine.
- **DR-10.2** [=] Demander confirmation avant le téléchargement.
- **DR-10.3** [=] Récupérer le binaire par `/sceen/_?u=<identifiant du pointeur cible>`.
- **DR-10.4** [=] Proposer l'action pour les `Path` seulement.
- **DR-10.5** [=] Télécharger le contenu de la version courante.
- **DR-10.6** [+] Transfert inachevé ou binaire absent : message explicite, jamais de fichier vide.
- **DR-10.7** [+] Plusieurs fichiers : téléchargements successifs.
- **DR-10.8** [non] Archive ZIP d'un dossier ou d'un lot : absente historiquement, non prévue.
- **DR-10.9** [non] Export de jumeau : ce n'est pas cette commande.
- **DR-10.10** [recette] Nom du fichier obtenu et intégrité du binaire.
- **DR-10.11** [recette] Contenu obtenu après bascule de version courante.
- **DR-10.12** [recette] Fichier indisponible : message, aucun fichier vide.

### DR-11 — Partager un fichier, un dossier ou un modèle avec des utilisateurs
Destination : Drive › détails › onglet « Partage », clic droit ; inspecteur de modèle › « Partager le modèle »
- **DR-11.1** [=] Choisir plusieurs utilisateurs existants du hub.
- **DR-11.2** [=] Rechercher les destinataires par préfixe du nom ou de l'identifiant.
- **DR-11.3** [=] Exclure des propositions les destinataires déjà choisis.
- **DR-11.4** [+] Afficher les destinataires choisis en jetons.
- **DR-11.5** [=] Proposer trois droits cumulables : Lecture (`RD`), Écriture (`WR`), Partage et administration (`AD`).
- **DR-11.6** [+] Donner à chaque droit un libellé et une phrase d'explication.
- **DR-11.7** [=] Exiger au moins un utilisateur et au moins un droit pour valider.
- **DR-11.8** [+] Bouton de validation avec le nombre : « Partager avec 2 utilisateurs ».
- **DR-11.9** [=] Appliquer le partage par `spinalCore.share_model` avec les drapeaux choisis.
- **DR-11.10** [=] Proposer le partage depuis un fichier, un dossier hors racine et l'inspecteur de modèle.
- **DR-11.11** [+] Afficher : « Le partage donne accès au même fichier, sans copie. La liste des accès existants et leur révocation ne sont pas disponibles. »
- **DR-11.12** [=] Ne pas compter sur le masquage d'un bouton : afficher le refus du hub s'il survient.
- **DR-11.13** [=] Ne pas assimiler les drapeaux `RD`/`WR`/`AD` aux profils BOS ni aux rôles Studio.
- **DR-11.14** [?] Liste des accès existants et révocation, si le hub expose les droits d'un modèle (O-1).
- **DR-11.15** [recette] Pour chaque combinaison de droits : accès réel du destinataire, édition permise ou interdite, repartage possible ou non.
- **DR-11.16** [recette] Un partage ne crée pas de second jumeau indépendant.
- **DR-11.17** [recette] Les partages historiques restent accessibles avec la session hub de la nouvelle application.

### DR-12 — Consulter le journal associé à un objet
Destination : Drive › détails › onglet « Journal »
- **DR-12.1** [=] Afficher les entrées de `_info.log` : action, utilisateur, date.
- **DR-12.2** [=] Indiquer quel fichier est consulté.
- **DR-12.3** [+] Suivre l'élément sélectionné dans le panneau de détails (l'historique prenait le premier fichier d'une sélection déposée).
- **DR-12.4** [+] Trier du plus récent au plus ancien.
- **DR-12.5** [=] Charger un instantané, sans abonnement permanent.
- **DR-12.6** [+] Bouton « Actualiser ».
- **DR-12.7** [+] Journal vide : « Aucune entrée de journal pour ce fichier. »
- **DR-12.8** [+] Note discrète : la première visite d'un fichier peut créer l'entrée « 1st visit ».
- **DR-12.9** [non] Journal exhaustif de toute écriture, traçabilité immuable ou actualisation continue : non établis, non promis.
- **DR-12.10** [non] Exigences d'audit supplémentaires : à définir à part.
- **DR-12.11** [recette] Le bon objet est consulté ; changer de cible change le journal.
- **DR-12.12** [recette] Ordre et lisibilité des dates.
- **DR-12.13** [recette] Journal vide.

### DR-13 — Ouvrir plusieurs vues de travail et les organiser
Destination : Drive › « Vue double », panneau de détails ; préférences
- **DR-13.1** [+] Bouton « Vue double » : le centre se partage en deux explorateurs indépendants.
- **DR-13.2** [=] Donner à chaque volet son dossier, son fil d'Ariane, sa sélection et son focus.
- **DR-13.3** [+] Marquer le volet actif d'un liseré orange ; l'arbre pilote le volet actif.
- **DR-13.4** [=] Déplacer des fichiers par glisser-déposer entre volets.
- **DR-13.5** [+] Fermer un volet rend toute la largeur à l'autre.
- **DR-13.6** [+] Mémoriser la disposition dans les préférences (aucune sauvegarde historique).
- **DR-13.7** [=] Garder une liste et ses détails côte à côte : panneau de droite repliable (Infos, Versions, Partage, Journal).
- **DR-13.8** [=] Garder l'accès au journal, aux versions, au gestionnaire de jumeau et à l'inspecteur pendant le travail dans l'explorateur.
- **DR-13.9** [non] GoldenLayout, ses onglets libres et le dépôt de panneaux : remplacés par une disposition fixe.
- **DR-13.10** [recette] Changer de volet actif sans agir sur le mauvais dossier.
- **DR-13.11** [recette] Fermer un volet sans interrompre l'autre.
- **DR-13.12** [recette] Rouvrir un onglet de détails : données cohérentes, aucun abonnement en double.

### DR-VER-01 — Conserver l'historique de versions d'un fichier
Destination : Drive › détails › onglet « Versions »
- **DR-VER-01.1** [=] Lister toutes les versions d'un `Path` à partir de `FileVersionContainerModel` (`versionLst`, `currentID`, pointeur `currentVersion`).
- **DR-VER-01.2** [+] Trier de la plus récente à la plus ancienne.
- **DR-VER-01.3** [=] Afficher pour chaque version son numéro et sa date, relative et exacte.
- **DR-VER-01.4** [+] Afficher aussi l'auteur s'il est connu, la description, la taille et l'état de conversion.
- **DR-VER-01.5** [=] Marquer la version courante d'un badge « Courante », sans ambiguïté.
- **DR-VER-01.6** [=] Donner accès aux actions propres à chaque version.
- **DR-VER-01.7** [=] Distinguer une version disponible d'une version en cours de transfert.
- **DR-VER-01.8** [=] Reprendre les historiques existants sans renuméroter.
- **DR-VER-01.9** [recette] Historique existant retrouvé avec ses numéros d'origine.
- **DR-VER-01.10** [recette] Version disponible et version en transfert bien distinguées.
- **DR-VER-01.11** [recette] Plusieurs vues du même fichier voient la même version courante.

### DR-VER-02 — Ajouter une version sans recréer le fichier logique
Destination : Drive › détails › onglet « Versions » › « Ajouter une version » ; plateau des tâches
- **DR-VER-02.1** [=] Choisir un binaire local et l'ajouter au conteneur de versions : nouveau `Path`, puis `addVersion`.
- **DR-VER-02.2** [+] Choisir le fichier par sélecteur ou par dépôt sur l'onglet.
- **DR-VER-02.3** [=] Proposer l'ajout pour les `Path` seulement.
- **DR-VER-02.4** [=] Suivre le transfert de chaque version, dans le plateau des tâches.
- **DR-VER-02.5** [=] Garder les anciennes versions consultables.
- **DR-VER-02.6** [+] Annoncer avant l'envoi que la nouvelle version deviendra courante (comportement historique).
- **DR-VER-02.7** [non] Renommer le fichier logique quand le nouveau binaire porte un autre nom : code historique commenté, non repris.
- **DR-VER-02.8** [recette] Ajouter un binaire de même nom, puis de nom différent.
- **DR-VER-02.9** [recette] Descriptions et versions précédentes conservées.
- **DR-VER-02.10** [recette] Interruption et progression du transfert.
- **DR-VER-02.11** [recette] Vérifier quelle version est courante avant la fin du transfert.
- **DR-VER-02.12** [recette] Version effectivement utilisée par les assets BIM liés.

### DR-VER-03 — Changer la version courante, y compris revenir en arrière
Destination : Drive › détails › onglet « Versions » › « Rendre courante »
- **DR-VER-03.1** [=] Promouvoir une version existante par `setVersionById`, après confirmation.
- **DR-VER-03.2** [=] Confirmation qui nomme départ et arrivée : « Passer de la v4 à la v2 ».
- **DR-VER-03.3** [=] Version déjà courante : action absente, aucune écriture.
- **DR-VER-03.4** [+] Rappeler dans la confirmation que les jumeaux qui utilisent ce fichier chargeront la nouvelle version courante.
- **DR-VER-03.5** [+] Signaler qu'une réconciliation peut être nécessaire, avec un lien vers ST-BIM-04.
- **DR-VER-03.6** [=] Conserver l'identité et le nom du fichier lors de la bascule.
- **DR-VER-03.7** [non] Reconstruction automatique de tous les rattachements métier : non prise en charge, non annoncée.
- **DR-VER-03.8** [recette] Basculer vers une version antérieure puis revenir.
- **DR-VER-03.9** [recette] Après bascule : téléchargement, asset, état de conversion et scène.

### DR-VER-04 — Décrire, prévisualiser et supprimer une version
Destination : Drive › détails › onglet « Versions »
- **DR-VER-04.1** [=] Lire et modifier une description par version.
- **DR-VER-04.2** [+] Éditer la description en ligne, enregistrée à la perte du focus.
- **DR-VER-04.3** [=] Porter la description sur la version : elle survit au changement de version courante.
- **DR-VER-04.4** [=] Prévisualiser les images GIF, JPG, JPEG et PNG.
- **DR-VER-04.5** [+] Afficher une vignette, agrandie au clic.
- **DR-VER-04.6** [=] Charger le binaire de la version choisie, pas forcément la courante.
- **DR-VER-04.7** [=] Décider de l'aperçu d'après l'extension du nom logique du fichier.
- **DR-VER-04.8** [=] Supprimer une version non courante après une confirmation qui dit l'irréversibilité.
- **DR-VER-04.9** [=] Interdire la suppression de la version courante : action absente.
- **DR-VER-04.10** [+] Expliquer dans une infobulle pourquoi la version courante ne peut pas être supprimée.
- **DR-VER-04.11** [non] Aperçu bureautique et comparaison de contenu : non prouvés, non prévus.
- **DR-VER-04.12** [recette] Modifier deux descriptions distinctes.
- **DR-VER-04.13** [recette] Comparer deux images de versions différentes.
- **DR-VER-04.14** [recette] Annuler puis confirmer la suppression d'une version non courante.
- **DR-VER-04.15** [recette] Suppression de la version courante impossible.

### DR-DT-01 — Créer un jumeau numérique vide
Destination : Drive › « Nouveau → Jumeau numérique » (assistant en 3 étapes)
- **DR-DT-01.1** [=] Nommer un nouveau jumeau dans le dossier courant.
- **DR-DT-01.2** [=] Créer un `SpinalGraph`, puis un fichier de type `Digital twin` dans le dossier.
- **DR-DT-01.3** [+] Assistant en 3 étapes : Nom, Sources, Conversion.
- **DR-DT-01.4** [+] Étape Sources : choisir des fichiers du Drive ou en déposer de nouveaux (voir DR-DT-02).
- **DR-DT-01.5** [+] Étape Conversion : une case cochée par défaut pour chaque maquette, puis « Créer le jumeau et lancer les conversions ».
- **DR-DT-01.6** [+] À la fin, ouvrir le jumeau dans les détails avec ses conversions en cours et un bouton « Ouvrir dans le Studio ».
- **DR-DT-01.7** [+] Permettre de sortir à toute étape : ce qui est créé est conservé, et c'est dit.
- **DR-DT-01.8** [!] Définir et appliquer une règle de collision de nom (la création historique n'en avait aucune).
- **DR-DT-01.9** [=] Ne pas présenter la création comme une hiérarchie de bâtiment, une scène, une maquette convertie ou une configuration de micro-app.
- **DR-DT-01.10** [=] Ne pas faire du nouveau jumeau le jumeau actif BOS.
- **DR-DT-01.11** [recette] Ouvrir le nouveau graphe dans les outils.
- **DR-DT-01.12** [recette] Retrouver le jumeau après rechargement.
- **DR-DT-01.13** [recette] Distinguer création du fichier et déclaration dans le portail.
- **DR-DT-01.14** [recette] Créer deux jumeaux de même nom dans un dossier.

### DR-DT-02 — Associer plusieurs fichiers sources à un jumeau
Destination : Drive › assistant (étape Sources) ; détails d'un jumeau › onglet « Maquettes » › « Ajouter des maquettes »
- **DR-DT-02.1** [=] Constituer la liste des maquettes d'un jumeau à partir de fichiers déjà présents dans le Drive.
- **DR-DT-02.2** [=] Accepter les `Path` et `HttpPath` dont le nom a un format reconnu (DR-DT-03).
- **DR-DT-02.3** [=] Accepter plusieurs fichiers en une sélection.
- **DR-DT-02.4** [=] Séparer les fichiers incompatibles des candidats.
- **DR-DT-02.5** [+] Lister les incompatibles à part, en grisé, avec la raison « Format non reconnu ».
- **DR-DT-02.6** [=] Enregistrer dans le jumeau un contexte `BimFileContext`, une relation `hasBimFile` et des nœuds `BimFile`.
- **DR-DT-02.7** [=] Faire référencer par l'élément du nœud `BimFile` le conteneur de versions du fichier source.
- **DR-DT-02.8** [=] Afficher par maquette : nom, identifiant, version courante utilisée, date, description, état de conversion.
- **DR-DT-02.9** [=] Actualiser la liste quand le modèle change.
- **DR-DT-02.10** [!] Détecter les doublons par identité du fichier source (`_server_id` du conteneur de versions), pas par nom.
- **DR-DT-02.11** [!] Créer `BimFileContext` au premier ajout, pas à la simple consultation (une lecture n'écrit rien).
- **DR-DT-02.12** [=] Ne pas présenter une association comme une conversion ou un chargement 3D réussi.
- **DR-DT-02.13** [recette] Ajouter plusieurs formats à la fois.
- **DR-DT-02.14** [recette] Fichier non supporté, puis doublon du même fichier.
- **DR-DT-02.15** [recette] Deux homonymes de dossiers différents : les deux sont acceptés et distincts.
- **DR-DT-02.16** [recette] Changer la version du fichier source : la maquette reste liée au bon conteneur.

### DR-DT-03 — Reconnaître les formats candidats à la conversion
Destination : Drive › assistant (étape Sources), onglet « Maquettes », type « Maquette » du tableau
- **DR-DT-03.1** [=] Reconnaître par extension : `3DM, 3DS, ASM, CATPART, CATPRODUCT, CGR, COLLABORATION, DAE, DGN, DLV3, DWF, DWFX, DWG, DWT, DXF, EMODE, EXP, F2D, F3D, FBX, G, GBXML, GLB, GLTF, IAM, IDW, IFC, IGE, IGES, IGS, IPT, IWM, JT, MAX, MODEL, NEU, NWC, NWD, OBJ, PDF, PMLPRJ, PMLPRJZ, PRT, PSMODEL, RCP, RVT, SAB, SAT, SESSION, SKP, SLDASM, SLDPRT, STE, STEP, STL, STLA, STLB, STP, STPZ, WIRE, X_B, X_T, XAS, XPR, ZIP, SVF.ZIP`.
- **DR-DT-03.2** [=] Reconnaître la double extension `.svf.zip`.
- **DR-DT-03.3** [+] Marquer « Maquette » les fichiers reconnus ; lister les autres à part avec « Format non reconnu ».
- **DR-DT-03.4** [=] Présenter la liste comme un filtre de candidats, pas comme une garantie de support par Autodesk ou par l'instance.
- **DR-DT-03.5** [=] Distinguer trois états : format candidat, transfert réussi, maquette exploitable.
- **DR-DT-03.6** [=] Signaler que les fichiers multiples et archives peuvent avoir des prérequis propres au convertisseur.
- **DR-DT-03.7** [recette] Un fichier candidat qui échoue à la conversion n'est pas présenté comme exploitable.

### DR-DT-04 — Demander et suivre la conversion d'un asset
Destination : Drive › détails d'un jumeau › onglet « Maquettes » › « Convertir » / « Reconvertir » ; assistant (étape Conversion) ; plateau des tâches
- **DR-DT-04.1** [=] Déclencher la conversion en mettant l'état de la version courante à `1` pour l'organ Forge.
- **DR-DT-04.2** [=] Afficher l'état : Initialisation · Commande envoyée · Téléchargement par l'organ · Envoi à Forge · En file d'attente · Conversion · Récupération · Prête · Échec.
- **DR-DT-04.3** [=] Pour les archives `.svf.zip`, afficher aussi Détection et Décompression.
- **DR-DT-04.4** [=] Présenter le traitement local d'un `.svf.zip` comme distinct d'une conversion distante.
- **DR-DT-04.5** [!] Désactiver « Convertir » pendant toute conversion en cours, pas seulement à l'état « Converted » : jamais deux demandes.
- **DR-DT-04.6** [+] Proposer « Reconvertir » sur une maquette prête ou en échec.
- **DR-DT-04.7** [+] Suivre chaque conversion par une tâche du plateau, d'après l'état écrit par l'organ.
- **DR-DT-04.8** [+] Distinguer « Demande envoyée » de l'état rapporté par l'organ.
- **DR-DT-04.9** [+] Afficher « Sans réponse de l'organ » au-delà du délai prévu.
- **DR-DT-04.10** [+] En échec, afficher la cause si l'organ la fournit.
- **DR-DT-04.11** [=] Ne pas mélanger l'ancien pourcentage des lignes de fichiers (autre table d'états) avec ces états sans vérifier les deux conventions.
- **DR-DT-04.12** [=] Rattacher chaque état à la bonne version.
- **DR-DT-04.13** [=] Conserver l'état après fermeture de l'écran ; aucun doublon au retour.
- **DR-DT-04.14** [recette] Succès, attente longue, échec, nouvelle tentative.
- **DR-DT-04.15** [recette] Organ Forge arrêté : état « Sans réponse de l'organ », pas de fausse réussite.
- **DR-DT-04.16** [recette] Version courante changée pendant le traitement.
- **DR-DT-04.17** [recette] Archive SVF valide puis invalide.
- **DR-DT-04.18** [recette] Fermer l'écran pendant la conversion, rouvrir : état juste, pas de seconde demande.

### DR-DT-05 — Retirer un asset du jumeau
Destination : Drive › détails d'un jumeau › onglet « Maquettes » › « Retirer du jumeau »
- **DR-DT-05.1** [=] Retirer une maquette du jumeau : trouver son nœud `BimFile` dans `BimFileContext`, puis `removeFromGraph`.
- **DR-DT-05.2** [+] Ajouter une confirmation de portée (absente historiquement).
- **DR-DT-05.3** [+] Texte : « Retire la maquette de ce jumeau. Le fichier, ses versions et ses conversions restent dans le Drive. Les objets de cette maquette déjà rattachés au graphe gardent leurs liens mais ne s'afficheront plus en 3D. »
- **DR-DT-05.4** [=] Libeller l'action « Retirer » (un lien), pas « Supprimer ».
- **DR-DT-05.5** [=] Ne pas supprimer le fichier source, ses versions, ses fichiers convertis ni ses entrées de scène.
- **DR-DT-05.6** [=] Ne jamais détruire un fichier réutilisé par un autre jumeau.
- **DR-DT-05.7** [non] Orchestrer toutes les suppressions liées (source, versions, conversions, scènes) : non démontré, non fait.
- **DR-DT-05.8** [recette] Après retrait : ce qui reste dans le Drive et dans les scènes correspond au texte de la confirmation.
- **DR-DT-05.9** [recette] Références pendantes traitées (scène qui citait la maquette).
- **DR-DT-05.10** [recette] Fichier utilisé par un autre jumeau : toujours présent et lié.

### DR-DT-06 — Ouvrir les outils sur le bon jumeau
Destination : Drive › double-clic, détails d'un jumeau › « Ouvrir dans le Studio » ; Studio `/studio/jumeau/<id>`
- **DR-DT-06.1** [=] Ouvrir le Studio sur un fichier `Digital twin` depuis le Drive.
- **DR-DT-06.2** [+] Désigner le jumeau par son identifiant serveur (`/studio/jumeau/<id>`) au lieu du chemin `/__users__/<utilisateur>/…/<fichier>` passé dans `path`.
- **DR-DT-06.3** [=] Faire de « Ouvrir dans le Studio » le bouton principal des détails d'un jumeau.
- **DR-DT-06.4** [+] Pour une maquette (`BIM Project`) : aperçu 3D seul, et « Ouvrir dans un jumeau… » en action secondaire.
- **DR-DT-06.5** [=] Ne jamais remplacer le graphe demandé par le jumeau actif BOS.
- **DR-DT-06.6** [=] Ouvrir l'inspecteur sur l'identifiant serveur du modèle pointé (`/studio/inspecteur/<id>`).
- **DR-DT-06.7** [+] Servir les anciens liens `/html/viewer/?path=…` par l'ancien Studio jusqu'à la bascule, puis les rediriger vers `/studio/jumeau/<id>`.
- **DR-DT-06.8** [non] Ouvrir l'ancienne liste d'applications (SpinalTwin, « ST App list ») : hors périmètre, ses usages relèvent du portail BOS (D3, à valider).
- **DR-DT-06.9** [?] Date de bascule des anciennes URL (O-8).
- **DR-DT-06.10** [recette] Le jumeau ouvert est bien celui choisi.
- **DR-DT-06.11** [recette] Jumeau dans un dossier imbriqué, nom avec espaces.
- **DR-DT-06.12** [recette] Jumeau partagé par un autre utilisateur.
- **DR-DT-06.13** [recette] Ouverture après reconnexion.

### GI-01 — Inspecter récursivement un modèle du hub
Destination : Inspecteur `/studio/inspecteur/<id>` › vue Structure (clic droit « Inspecter le modèle » en mode expert dans le Drive, ou depuis un nœud du Studio)
- **GI-01.1** [=] Afficher l'arbre des propriétés d'un modèle : listes, pointeurs, valeurs atomiques.
- **GI-01.2** [=] Déplier et replier à la demande.
- **GI-01.3** [=] « Suivre le pointeur » charge sa cible.
- **GI-01.4** [=] Différencier les types (`Str`, `Val`, `Bool`, `Lst`, `Ptr`, `Model`…) par une couleur **et** un libellé.
- **GI-01.5** [+] Montrer par ligne : nom, type, valeur ou nombre d'éléments, identifiant serveur.
- **GI-01.6** [+] Ouvrir l'inspecteur par clic droit au lieu du dépôt historique depuis l'explorateur.
- **GI-01.7** [=] Actualiser la vue quand les modèles suivis changent.
- **GI-01.8** [=] Zoomer, déplacer la vue et recentrer sur la racine (vue Graphe).
- **GI-01.9** [+] Pointeur absent marqué « Non chargé » ou « Introuvable », sans bloquer le reste.
- **GI-01.10** [+] Cycle signalé : « ↺ déjà affiché plus haut ».
- **GI-01.11** [=] Afficher clairement l'identifiant serveur et distinguer donnée métier et structure technique.
- **GI-01.12** [=] Inclure les objets qui ne sont pas des nœuds métier.
- **GI-01.13** [non] Remplacer l'inspecteur par une simple fiche d'équipement : perte de diagnostic, exclu.
- **GI-01.14** [recette] Valeurs simples et listes imbriquées.
- **GI-01.15** [recette] Pointeurs non chargés et pointeur absent : le reste reste utilisable.
- **GI-01.16** [recette] Modèle partagé et cycle.

### GI-02 — Modifier une valeur atomique dans l'inspecteur
Destination : Inspecteur › vue Structure (et dialogue typé de la vue Graphe)
- **GI-02.1** [=] Éditer une chaîne (`Str`), un nombre (`Val`) ou un booléen (`Bool`).
- **GI-02.2** [+] Double-clic sur la valeur : saisie adaptée (texte, nombre, interrupteur).
- **GI-02.3** [=] Valider par `Entrée`, annuler par `Échap` sans écrire.
- **GI-02.4** [=] Écrire directement par `model.set`.
- **GI-02.5** [+] Bandeau : l'écriture est directe, sans les règles métier.
- **GI-02.6** [=] Partager le modèle depuis l'inspecteur, avec le formulaire du Drive (DR-11).
- **GI-02.7** [=] Réserver l'édition atomique au mode expert, hors des écrans usuels.
- **GI-02.8** [+] Afficher clairement un refus du hub (droits insuffisants).
- **GI-02.9** [non] Créer une classe de modèle arbitraire ou réécrire une relation entière : non prévu.
- **GI-02.10** [recette] Type et valeur corrects après rechargement.
- **GI-02.11** [recette] Annulation sans écriture.
- **GI-02.12** [recette] Droits insuffisants : refus affiché.
- **GI-02.13** [recette] Les autres vues du même modèle se mettent à jour.

### GI-03 — Explorer le graphe avec l'inspecteur autonome
Destination : Inspecteur `/studio/inspecteur/<id>` › vue Graphe
- **GI-03.1** [=] Ouvrir un modèle par son identifiant serveur.
- **GI-03.2** [=] Développer au clic les enfants et les parents d'un nœud.
- **GI-03.3** [=] Suivre les relations `Ref`, `PtrLst` et `LstPtr`.
- **GI-03.4** [=] Choisir une mise en page DAG ou par forces.
- **GI-03.5** [=] Rechercher par nom avec compteur et résultat précédent/suivant.
- **GI-03.6** [=] Limiter la recherche aux nœuds affichés, et le dire.
- **GI-03.7** [=] Panneau de droite : propriétés de l'élément et de la relation, dont le nombre d'enfants.
- **GI-03.8** [=] Copier les identifiants.
- **GI-03.9** [=] Ouvrir le modèle d'un nœud dans la vue Structure depuis son menu contextuel.
- **GI-03.10** [=] Éditer les modèles atomiques dans un dialogue typé (GI-02).
- **GI-03.11** [=] Garder en parallèle la structure et la fiche de propriétés, avec des séparateurs réglables.
- **GI-03.12** [+] Contrôles : zoom, recentrer, ajuster.
- **GI-03.13** [=] Conserver la sélection en changeant de vue ou de mise en page.
- **GI-03.14** [=] Ouvrir l'inspecteur depuis un nœud du Studio, dans un nouvel onglet, en complément du navigateur métier.
- **GI-03.15** [recette] Graphe à plusieurs parents.
- **GI-03.16** [recette] Relations `Ref`, `PtrLst`, `LstPtr`.
- **GI-03.17** [recette] Recherche parmi les nœuds développés.
- **GI-03.18** [recette] Inspection d'un élément et copie de ses identifiants.
- **GI-03.19** [recette] Sélection conservée en passant de DAG à forces.

### ADM-01 — Consulter l'état du hub
Destination : Admin du hub `/studio/admin` › État du hub
- **ADM-01.1** [=] Réserver la page à une session administrateur hub.
- **ADM-01.2** [=] Afficher les valeurs courantes : nombre de modèles, de sessions, d'utilisateurs, mémoire résidente, mémoire virtuelle.
- **ADM-01.3** [=] Afficher l'historique de chaque valeur en courbe.
- **ADM-01.4** [=] Afficher la valeur au survol de la courbe.
- **ADM-01.5** [=] S'abonner à `/etc/Status`, et libérer l'abonnement en quittant la page.
- **ADM-01.6** [+] Afficher les unités (Mo, Go).
- **ADM-01.7** [+] Données absentes : « — » et « Pas encore de mesure ».
- **ADM-01.8** [=] Adapter les courbes à la taille de la fenêtre.
- **ADM-01.9** [=] Afficher les valeurs brutes, sans diagnostic automatique de santé.
- **ADM-01.10** [recette] Données absentes.
- **ADM-01.11** [recette] Mise à jour des compteurs en direct.
- **ADM-01.12** [recette] Redimensionnement de la fenêtre.
- **ADM-01.13** [recette] Abonnement libéré à la sortie de la page.

### ADM-02 — Déclencher les opérations de maintenance exposées par le hub
Destination : Admin du hub › Maintenance
- **ADM-02.1** [=] « Sauvegarder maintenant » : écrire `btn.backup = 1`.
- **ADM-02.2** [=] « Lancer le ramasse-miettes » : écrire `btn.garbageCollector = 1`.
- **ADM-02.3** [=] « Nettoyer data.db » : écrire `btn.backup = 2`, seulement si le hub est en version 4.1.0 ou plus.
- **ADM-02.4** [+] Confirmation pour chaque bouton, qui dit l'effet et la durée possible.
- **ADM-02.5** [=] Désactiver le bouton tant que le drapeau du hub est non nul, avec « En cours… ».
- **ADM-02.6** [=] Déduire la fin du retour du drapeau à 0.
- **ADM-02.7** [=] Garder ces commandes dans l'Admin, séparées du Studio.
- **ADM-02.8** [non] Restauration de sauvegarde et planification : non prises en charge historiquement, non proposées.
- **ADM-02.9** [recette] Droits effectifs : un compte non administrateur ne peut pas déclencher.
- **ADM-02.10** [recette] États demandé, en cours, terminé, échec.
- **ADM-02.11** [recette] Double clic rapide : un seul déclenchement.
- **ADM-02.12** [recette] Ne pas tester restauration ni nettoyage sur la base de travail.

### ADM-03 — Reconnaître les rôles historiques et les comptes
Destination : Admin du hub › Rôles et comptes (lecture seule)
- **ADM-03.1** [=] Lister en lecture les rôles historiques : Admin, Intégrateur, Mainteneur, Asset Manager, Basic Utilisateur.
- **ADM-03.2** [=] Lister en lecture les profils par utilisateur.
- **ADM-03.3** [=] Conserver les profils d'applications et les liens vers l'espace public créés par l'ancienne initialisation Admin.
- **ADM-03.4** [=] Utiliser ces données pour filtrer les actions du Studio (ST-SOC-02).
- **ADM-03.5** [!] Ne pas reprendre le lien « Open User Manager » vers `/html/user_role_manager/`, qui renvoie une erreur 404.
- **ADM-03.6** [=] Ne pas présenter le proxy de création/suppression de compte comme une gestion des comptes opérationnelle.
- **ADM-03.7** [=] Une app autorisée dans le portail n'autorise pas la maintenance du hub.
- **ADM-03.8** [?] Gestion complète des comptes (création, suppression, droits) via `/get_new_account`, `/get_delete_account_by_admin`, `/get_change_account_rights_by_admin`, en écran séparé (O-2).
- **ADM-03.9** [?] Table de correspondance entre bits de profil Studio et profils BOS, à valider avec un administrateur (O-4).
- **ADM-03.10** [recette] Chaque rôle est retrouvé avec ses droits effectifs.
- **ADM-03.11** [recette] Les anciennes autorisations sont associées explicitement aux profils BOS.
- **ADM-03.12** [recette] Vérifier si la nouvelle Admin doit recréer les rôles et profils manquants comme l'ancienne initialisation.

### ADM-04 — Modifier son mot de passe hub et naviguer entre outils
Destination : barre supérieure › sections Drive · Studio · Admin ; menu du compte › « Changer le mot de passe »
- **ADM-04.1** [+] Passer du Drive à l'Admin (et au Studio) par les sections de la barre supérieure, sans recharger.
- **ADM-04.2** [=] Identifier le compte courant dans le menu du compte.
- **ADM-04.3** [=] Formulaire : ancien mot de passe, nouveau mot de passe, confirmation.
- **ADM-04.4** [+] Ouvrir le formulaire depuis le menu du compte, pour tout utilisateur.
- **ADM-04.5** [+] Afficher les règles : 12 à 128 caractères `[A-Za-z0-9._~-]`, compatibles avec la configuration Docker.
- **ADM-04.6** [=] Afficher le succès ou l'échec, et mettre à jour les informations de session.
- **ADM-04.7** [!] Refaire le parcours (l'ancien contrôleur utilisait le même nom `change_password` pour le formulaire et la fonction).
- **ADM-04.8** [=] Dire que le changement concerne le compte hub, pas le compte BOS.
- **ADM-04.9** [+] Compte `admin` : avertissement bloquant tant qu'il n'est pas confirmé, car son mot de passe est fixé par `HUB_ADMIN_PASSWORD` ; renvoyer à la procédure de déploiement.
- **ADM-04.10** [+] Un seul formulaire de mot de passe dans l'application, pas deux formulaires ambigus.
- **ADM-04.11** [recette] Mauvais ancien mot de passe.
- **ADM-04.12** [recette] Confirmation différente du nouveau mot de passe.
- **ADM-04.13** [recette] Mot de passe hors règles refusé avec message.
- **ADM-04.14** [recette] Reconnexion dans les outils associés avec le nouveau mot de passe.

## 4. Studio : socle et 3D

### ST-SOC-01 — Ouvrir et garder un contexte de travail cohérent
Destination : Studio `/studio/jumeau/<id>` › ouverture d'un jumeau ; barre supérieure (jumeau ouvert, « Changer de jumeau »)
- **ST-SOC-01.1** [=] Charger un graphe ciblé, puis faire travailler tous les outils sur ce graphe.
- **ST-SOC-01.2** [+] Charger le fichier Jumeau par son identifiant serveur.
- **ST-SOC-01.3** [+] Refus ou absence : page « Jumeau inaccessible » avec la raison et un retour au Drive.
- **ST-SOC-01.4** [=] Vérifier l'accès par le chargement hub lui-même : un chemin encodé ou chiffré n'est pas une autorisation.
- **ST-SOC-01.5** [=] Installer un seul graphe actif dans `SpinalGraphService`.
- **ST-SOC-01.6** [!] Fermer proprement le jumeau précédent (abonnements, couleurs, sprites, tâches liées) avant d'installer le nouveau.
- **ST-SOC-01.7** [+] Annuler les chargements en cours quand on quitte le jumeau.
- **ST-SOC-01.8** [+] Rendre le navigateur interactif dès que les contextes sont chargés ; charger les enfants à la demande.
- **ST-SOC-01.9** [+] Ne pas parcourir tout le graphe à l'ouverture.
- **ST-SOC-01.10** [+] Charger en parallèle la scène par défaut, ou la dernière scène ouverte par cet utilisateur pour ce jumeau, avec progression dans le viewer.
- **ST-SOC-01.11** [+] Jumeau sans scène : « Aucune maquette chargée » avec « Choisir une scène ».
- **ST-SOC-01.12** [+] Afficher dans la barre le jumeau ouvert et son chemin Drive.
- **ST-SOC-01.13** [+] Menu du jumeau : « Ouvrir un autre jumeau… » et liste des récents.
- **ST-SOC-01.14** [+] Porter `noeud`, `contexte`, `atelier` et `onglet` dans l'URL ; recharger restaure la vue.
- **ST-SOC-01.15** [=] Garder les liens historiques par `path` fonctionnels (ancien Studio jusqu'à la bascule, puis redirection qui décode `path`).
- **ST-SOC-01.16** [recette] Ouverture depuis le Drive.
- **ST-SOC-01.17** [recette] Lien direct valide, puis invalide.
- **ST-SOC-01.18** [recette] Lien ouvert sans session.
- **ST-SOC-01.19** [recette] Jumeau interdit : « Jumeau inaccessible ».
- **ST-SOC-01.20** [recette] Passer d'un jumeau à un autre : aucun panneau, cache ou résultat asynchrone de l'ancien ne modifie le nouveau.
- **ST-SOC-01.21** [recette] Vérifier si le mode sans `path` (session distante par `tokenKey`, chargement de `session.graphServerId`) est encore utilisé ; les specs ne le reprennent pas.

### ST-SOC-02 — Afficher les actions compatibles avec la sélection et les droits
Destination : registre des actions (clic droit, barre d'actions de la fiche, palette `Ctrl K`, menu de la sélection 3D)
- **ST-SOC-02.1** [=] Proposer des actions selon le contexte, le nœud, le modèle et le profil de l'utilisateur.
- **ST-SOC-02.2** [+] Déclarer chaque action une fois dans un registre ; elle apparaît partout où elle s'applique (remplace `GraphManagerTopBar`, `GraphManagerSideBar` et le menu circulaire).
- **ST-SOC-02.3** [=] Décider de la visibilité de chaque action par une condition.
- **ST-SOC-02.4** [=] Lire le profil dans `/etc/UserProfileDir/<utilisateur>` et comparer les bits de profil.
- **ST-SOC-02.5** [=] Action sans profil déclaré : réservée par défaut à l'administration.
- **ST-SOC-02.6** [+] Traduire les bits en noms lisibles ; garder et afficher tel quel un bit inconnu.
- **ST-SOC-02.7** [=] Ne pas recopier les valeurs `[3]`, `[7]`… comme des noms de rôles BOS.
- **ST-SOC-02.8** [=] Séparer visibilité et autorisation : un refus du hub est affiché comme erreur, jamais masqué.
- **ST-SOC-02.9** [+] Barre d'actions : 3 actions principales visibles, le reste dans « Plus ».
- **ST-SOC-02.10** [+] Ordre fixe des groupes : Créer, Modifier, Relier, Voir, Exporter, puis, après un filet, Retirer et Supprimer en rouge.
- **ST-SOC-02.11** [+] Imposer la confirmation de portée aux actions de retrait et de suppression.
- **ST-SOC-02.12** [+] Tester que chaque capacité est portée par au moins une action ou un écran.
- **ST-SOC-02.13** [?] Correspondance entre bits de profil Studio et profils BOS (O-4).
- **ST-SOC-02.14** [recette] Matrice rôle × type de nœud × contexte × action, y compris sans sélection.
- **ST-SOC-02.15** [recette] Vérifier séparément la visibilité et l'autorisation réelle d'écriture.

### ST-SOC-03 — Utiliser ensemble le graphe et la représentation 3D
Destination : shell du Studio (rail, navigateur, viewer, fiche, dock Courbes)
- **ST-SOC-03.1** [=] Voir le graphe et le viewer en même temps.
- **ST-SOC-03.2** [+] Disposition fixe : rail des ateliers (48 px), colonne de gauche (280 à 640 px, réglable), viewer au centre, fiche à droite (340 à 560 px, réglable).
- **ST-SOC-03.3** [=] Replier la fiche (`]`) et la colonne de gauche pour donner la place à la 3D.
- **ST-SOC-03.4** [+] Passer un atelier en plein cadre (`Maj F`) ; le viewer devient une vignette flottante cliquable.
- **ST-SOC-03.5** [+] Mémoriser largeurs et panneaux repliés par utilisateur.
- **ST-SOC-03.6** [=] Fenêtre étroite : fiche en tiroir sous 1280 px, navigateur aussi sous 900 px.
- **ST-SOC-03.7** [=] Depuis les outils métier, isoler, cadrer, colorer et annoter les objets 3D correspondants.
- **ST-SOC-03.8** [=] Sélectionner un nœud qui a une géométrie sélectionne ses objets 3D, sans cadrer (le cadrage est l'action `F`).
- **ST-SOC-03.9** [=] Sélectionner un objet 3D ouvre sa fiche ; s'il est dans plusieurs contextes, proposer « Voir dans… ».
- **ST-SOC-03.10** [=] Retenir le contexte de sélection d'un nœud.
- **ST-SOC-03.11** [=] Gérer plusieurs maquettes ; le même `dbId` dans deux maquettes ne fusionne jamais deux objets.
- **ST-SOC-03.12** [=] Travailler sur des nœuds sans représentation 3D.
- **ST-SOC-03.13** [non] Reproduire le découpage du shell historique et ses trois positions de panneau : pas un invariant.
- **ST-SOC-03.14** [recette] Changement de dimensions de la fenêtre.
- **ST-SOC-03.15** [recette] Graphe sans scène, modèle partiellement chargé.
- **ST-SOC-03.16** [recette] Objets homonymes dans plusieurs maquettes : sélection juste.
- **ST-SOC-03.17** [recette] Fermer un panneau sans perdre les autres.

### ST-SOC-04 — Charger le viewer et isoler les échecs de modules
Destination : shell du Studio › rail des ateliers, viewer
- **ST-SOC-04.1** [=] Démarrer le Studio même si l'import d'un module échoue.
- **ST-SOC-04.2** [+] Charger chaque atelier à sa première ouverture ; un import en échec rend seulement cet atelier indisponible.
- **ST-SOC-04.3** [!] Afficher l'échec dans l'interface, pas seulement en console.
- **ST-SOC-04.4** [+] Garder l'icône de l'atelier avec une pastille « indisponible » et la cause au survol.
- **ST-SOC-04.5** [+] Carte « Indisponible » qui nomme la cause ; les autres modules restent utilisables.
- **ST-SOC-04.6** [=] Charger le viewer depuis les ressources locales (viewer-rs), sans dépendre de l'objet Autodesk global.
- **ST-SOC-04.7** [=] Charger les extensions de couleur, panneaux et graphiques.
- **ST-SOC-04.8** [=] Ne pas laisser croire que tout marche hors réseau : conversion et ressources distantes signalées indisponibles.
- **ST-SOC-04.9** [=] Ne jamais confondre module indisponible et jumeau vide.
- **ST-SOC-04.10** [recette] Distinguer quatre cas : scène vide, ressource 3D absente, import de module échoué, chargement encore en cours.

### ST-SOC-05 — Quitter le Studio et libérer son travail d'interface
Destination : shell du Studio › sortie (autre section, autre jumeau, déconnexion) ; menu du compte
- **ST-SOC-05.1** [=] Revenir au Drive ou se déconnecter depuis le Studio.
- **ST-SOC-05.2** [!] Faire une vraie déconnexion (la méthode `signOut` appelée n'existait pas, le chemin de connexion contenait des caractères en trop).
- **ST-SOC-05.3** [=] À la sortie, libérer abonnements de modèles, écouteurs, minuteries, couleurs temporaires, sprites et panneaux.
- **ST-SOC-05.4** [+] Libérer les ressources d'un atelier (couleurs, sprites, abonnements) à sa fermeture.
- **ST-SOC-05.5** [=] Changer de section ou d'atelier puis revenir sans effet résiduel.
- **ST-SOC-05.6** [+] Laisser les tâches en cours continuer dans le plateau, libellées avec le nom du jumeau.
- **ST-SOC-05.7** [+] Demander confirmation avant de fermer l'onglet pendant une tâche.
- **ST-SOC-05.8** [=] Aucune écriture différée sous la mauvaise identité après déconnexion.
- **ST-SOC-05.9** [recette] Quitter avec une sélection, des sprites et une courbe ouverts.
- **ST-SOC-05.10** [recette] Rouvrir le même jumeau, puis un autre : aucun reste, aucun abonnement en double.
- **ST-SOC-05.11** [recette] Se déconnecter puis se reconnecter sous un autre compte : aucune écriture sous l'ancien.

### ST-VIS-01 — Mémoriser les positions spatiales des objets BIM
Destination : Studio › atelier Géographie › section « Recalculer » › carte « Enregistrer les positions des objets (Spatial / XYZ center) »
- **ST-VIS-01.1** [=] Calculer le centre des objets BIM chargés.
- **ST-VIS-01.2** [=] Stocker ce centre dans l'attribut `Spatial / XYZ center`, au format `x;y;z`.
- **ST-VIS-01.3** [=] Variante géographique : objets et références de pièces sous un contexte géographique ou un étage.
- **ST-VIS-01.4** [=] Variante réseau matériel : `BIMObject` d'un contexte de réseau matériel.
- **ST-VIS-01.5** [+] Choisir le périmètre (maquettes, étages) sur la carte, puis confirmer.
- **ST-VIS-01.6** [!] Utiliser le contexte géographique choisi à l'accueil de l'atelier, pas le premier `geographicContext` trouvé.
- **ST-VIS-01.7** [=] Ne traiter que les objets avec `bimFileId` et `dbid` résolubles dans une maquette chargée.
- **ST-VIS-01.8** [!] Une position absente n'écrase jamais une position valide (pas de zéro).
- **ST-VIS-01.9** [!] Terminer la tâche seulement quand toutes les écritures sont faites.
- **ST-VIS-01.10** [+] Suivre le traitement dans le plateau des tâches.
- **ST-VIS-01.11** [+] Donner un bilan : mis à jour, introuvables, ignorés.
- **ST-VIS-01.12** [recette] Objets de plusieurs maquettes.
- **ST-VIS-01.13** [recette] Objets sans géométrie chargée : comptés introuvables, coordonnées existantes intactes.
- **ST-VIS-01.14** [recette] Translation d'une maquette puis recalcul.
- **ST-VIS-01.15** [recette] Graphe avec plusieurs contextes géographiques.

### ST-VIS-02 — Représenter le réseau matériel dans la 3D
Destination : Studio › atelier Réseaux et GTB › onglet « Vue 3D du réseau »
- **ST-VIS-02.1** [=] Proposer « Afficher dans la 3D » sur un nœud `network` d'un `networkTreeContext`.
- **ST-VIS-02.2** [=] Parcourir la relation `hasNetworkTreeBimObject`.
- **ST-VIS-02.3** [=] Placer des sprites aux positions `Spatial / XYZ center`.
- **ST-VIS-02.4** [=] Choisir le type de sprite d'après `hasBacnetItem` quand il existe.
- **ST-VIS-02.5** [=] Relier certains parents et enfants par des lignes.
- **ST-VIS-02.6** [+] Clic sur un sprite : ouvrir la fiche de l'objet (documents, mesures), au lieu des boutons documentation et dashboard séparés.
- **ST-VIS-02.7** [+] Rendre visible et modifiable le filtre de préfixes (`CS2_`, `CS1_`, `MR_`, `BDV_`, `PAS_`, `CLU_`, `BLG_`) appliqué à l'attribut `default / namingConvention`.
- **ST-VIS-02.8** [=] Pouvoir activer ou désactiver ce filtre.
- **ST-VIS-02.9** [=] Limiter la profondeur aux niveaux traités historiquement ; pas de représentation récursive arbitraire promise.
- **ST-VIS-02.10** [=] Retirer les sprites à la fermeture.
- **ST-VIS-02.11** [non] Répartition maître/esclave : boutons commentés historiquement, non repris.
- **ST-VIS-02.12** [recette] Réseau avec et sans coordonnées.
- **ST-VIS-02.13** [recette] Plusieurs maquettes.
- **ST-VIS-02.14** [recette] Type matériel inconnu.
- **ST-VIS-02.15** [recette] Filtre actif, puis inactif.
- **ST-VIS-02.16** [recette] Ouverture de la fiche depuis un sprite.
- **ST-VIS-02.17** [recette] Plus aucun sprite après fermeture de l'atelier.

## 5. Graphe et géographie

### ST-GRA-01 — Explorer les contextes et les objets du jumeau

Destination : Studio, colonne de gauche, Navigateur du jumeau (§2), avec la fiche de l'objet à droite
- **ST-GRA-01.1** [=] Afficher les contextes du graphe chargé, puis les enfants de chaque contexte, à la demande.
- **ST-GRA-01.2** [=] Déplier les relations dans le contexte courant seulement (sémantique « in context »).
- **ST-GRA-01.3** [=] Sélectionner un nœud et retenir à la fois son identité et son contexte de sélection.
- **ST-GRA-01.4** [=] Proposer sur le nœud sélectionné uniquement les actions compatibles avec son type, son contexte et le profil.
- **ST-GRA-01.5** [=] Garder la séparation : actions de création (barre générale) et actions sur la sélection (apportées par les modules).
- **ST-GRA-01.6** [=] Traiter le modèle comme un graphe : un même objet retrouvé depuis plusieurs contextes n'est jamais dupliqué.
- **ST-GRA-01.7** [=] Aucune modification métier pendant l'exploration : lecture du graphe, chargement des enfants et état de sélection seulement.
- **ST-GRA-01.8** [=] Action « Actualiser » : remet à jour l'arbre et les actions disponibles, notamment après une mutation.
- **ST-GRA-01.9** [=] Masquer par défaut les contextes dont le nom commence par `.` et le contexte `BIMObjectContext`.
- **ST-GRA-01.10** [=] Garder un accès aux contextes masqués (équivalent de `SHOW_HIDDEN_NODES`), placé dans le mode expert.
- **ST-GRA-01.11** [+] Contextes regroupés par domaine au lieu d'une liste à plat : Espace, Maquettes, Classements, Réseaux, Exploitation, Calcul, Autres.
- **ST-GRA-01.12** [+] Domaine Espace : contextes géographiques, BIM Geo, et référentiels (`.SiteContext`…) en mode expert.
- **ST-GRA-01.13** [+] Domaine Maquettes : `BimFileContext` et scènes.
- **ST-GRA-01.14** [+] Domaine Classements : contextes de groupes (pièces, équipements, endpoints, autres).
- **ST-GRA-01.15** [+] Domaine Réseaux : `Network` (BMS), arborescences techniques, bibliothèques de profils, points de contrôle.
- **ST-GRA-01.16** [+] Domaine Exploitation : tickets, événements, notes, documentation ; domaine Calcul : analyses, dashboards.
- **ST-GRA-01.17** [+] Domaine Autres : tout type de contexte non reconnu, affiché avec son type brut.
- **ST-GRA-01.18** [+] Pastilles de filtre en tête du navigateur (Tout, Espace, Classements…).
- **ST-GRA-01.19** [+] Chaque contexte affiche sa couleur et son nombre d'enfants directs.
- **ST-GRA-01.20** [+] Arbre virtualisé, chargé à la demande, capable de dizaines de milliers de lignes.
- **ST-GRA-01.21** [+] Chaque ligne : icône du type, nom, pastille de couleur, compteur d'enfants, marque « 3D » si la géométrie est résolue.
- **ST-GRA-01.22** [+] Clic sur un nœud : ouverture de sa fiche ; s'il a une géométrie, sélection 3D sans cadrage (le cadrage reste l'action `F`).
- **ST-GRA-01.23** [+] Nœud et contexte de sélection retenus dans l'URL (`noeud`, `contexte`) : recharger rouvre au même endroit.
- **ST-GRA-01.24** [+] Actions au clic droit, dans la barre d'actions et dans la palette `Ctrl K`, issues du registre d'actions.
- **ST-GRA-01.25** [+] Navigation clavier complète de l'arbre (`role=tree`, flèches, `Entrée`, `/` pour rechercher).
- **ST-GRA-01.26** [+] Fiche : mention « Aussi dans : … » quand l'objet a plusieurs parents, et « Voir dans… » pour chaque contexte d'appartenance.
- **ST-GRA-01.27** [recette] Retrouver le même objet depuis ses différentes appartenances (géographie, groupe, réseau) : même identité, même fiche.
- **ST-GRA-01.28** [recette] Après sélection, les actions lancées reçoivent bien le nœud et le contexte de sélection.
- **ST-GRA-01.29** [recette] Après une mutation (création, suppression, renommage), l'actualisation montre l'état réel.
- **ST-GRA-01.30** [recette] Les contextes masqués restent accessibles en mode expert.
- **ST-GRA-01.31** [recette] Navigateur interactif en 1,5 s au plus après ouverture du jumeau ; 100 000 nœuds dépliés à 60 images/s.

### ST-GRA-02 — Rechercher un nœud par son nom

Destination : Studio, Navigateur du jumeau (§2), champ de recherche ; aussi la palette `Ctrl K`
- **ST-GRA-02.1** [=] Champ de recherche en texte libre dans le navigateur.
- **ST-GRA-02.2** [=] Afficher les nœuds dont le nom contient le texte (sous-chaîne), sans tenir compte de la casse.
- **ST-GRA-02.3** [=] Texte vide : retour à l'arbre des contextes.
- **ST-GRA-02.4** [!] Limite historique : la recherche ne parcourt que les nœuds déjà connus de la vue (`state.nodes`), sans garantie d'exhaustivité.
- **ST-GRA-02.5** [+] Rechercher par l'index de recherche du service de graphe, sur tous les nœuds du jumeau.
- **ST-GRA-02.6** [+] Si seule la recherche dans les nœuds chargés est possible, le champ l'indique : « dans les éléments chargés ».
- **ST-GRA-02.7** [+] Résultats groupés par contexte, avec le chemin de chaque résultat.
- **ST-GRA-02.8** [+] `Échap` revient à l'arbre.
- **ST-GRA-02.9** [+] Recherche sans résultat : rappel du terme et bouton « Effacer la recherche ».
- **ST-GRA-02.10** [=] Un résultat reste actionnable (sélection, fiche, actions) avec son identité.
- **ST-GRA-02.11** [?] Décider si la recherche ignore aussi les accents (« etage » trouve « Étage ») ; l'existant ne l'assure pas.
- **ST-GRA-02.12** [recette] Noms avec accents.
- **ST-GRA-02.13** [recette] Homonymes dans des contextes différents : distingués par leur contexte et leur chemin.
- **ST-GRA-02.14** [recette] Texte vide : retour aux contextes.
- **ST-GRA-02.15** [recette] Le périmètre réellement cherché est affiché.

### ST-GRA-03 — Renommer un nœud et définir sa couleur

Destination : Studio, Navigateur (actions génériques « Renommer », « Couleur ») et en-tête de la fiche (nom éditable, pastille de couleur)
- **ST-GRA-03.1** [=] Renommer un nœud sélectionné : modifie `info.name`.
- **ST-GRA-03.2** [=] Définir la couleur d'un nœud : modifie `info.color`.
- **ST-GRA-03.3** [=] Ces deux actions sont proposées pour tous les types de nœud, pas seulement pièces et équipements.
- **ST-GRA-03.4** [=] Changer la couleur de métadonnée ne colorise pas le sous-arbre dans la 3D (deux choses distinctes).
- **ST-GRA-03.5** [+] Raccourci `F2` pour renommer ; nom aussi éditable dans l'en-tête de la fiche.
- **ST-GRA-03.6** [+] Choix de couleur : nuancier de 12 couleurs + saisie hexadécimale.
- **ST-GRA-03.7** [+] Toast « Annuler » pendant 8 s après un renommage ou un changement de couleur.
- **ST-GRA-03.8** [+] Nom et couleur réunis dans la fiche de l'objet.
- **ST-GRA-03.9** [recette] Après renommage : identité (`_server_id`, staticId), relations et données associées inchangées.
- **ST-GRA-03.10** [recette] La couleur persiste après réouverture du jumeau.
- **ST-GRA-03.11** [recette] « Annuler » rétablit l'ancien nom ou l'ancienne couleur, y compris une couleur absente.

### ST-GRA-04 — Supprimer des nœuds avec un périmètre explicite

Destination : Studio, Navigateur, action « Supprimer… » avec confirmation de portée (`ConfirmerPortee`)
- **ST-GRA-04.1** [=] Supprimer à partir d'un nœud et de son contexte sélectionnés, après confirmation.
- **ST-GRA-04.2** [=] Périmètre « ce nœud seulement ».
- **ST-GRA-04.3** [=] Périmètre « ses enfants directs ».
- **ST-GRA-04.4** [=] Périmètre « ce nœud et ses enfants directs ».
- **ST-GRA-04.5** [=] Périmètre « tous les nœuds de ce type dans le contexte » (libellé avec le type lisible, ex. « Pièce »).
- **ST-GRA-04.6** [=] Les périmètres « enfants » portent sur les enfants directs, pas sur tous les descendants ; le libellé le dit.
- **ST-GRA-04.7** [=] Filtre des candidats par nom : nom exact ou sous-chaîne ; filtre vide = tous les candidats.
- **ST-GRA-04.8** [=] Exclusion des enfants qui ont un autre parent, n'importe où.
- **ST-GRA-04.9** [=] Exclusion des enfants qui ont un autre parent dans le même contexte.
- **ST-GRA-04.10** [=] Exclusion des enfants qui ont un autre parent dans un autre contexte.
- **ST-GRA-04.11** [=] Suppression d'un `SpinalBmsDevice` : retirer aussi son modèle listener.
- **ST-GRA-04.12** [=] Il s'agit d'une suppression du graphe (`removeFromGraph`), distincte du retrait d'une relation (ST-GRA-05).
- **ST-GRA-04.13** [!] « Nœud et enfants » : attendre toutes les suppressions avant d'annoncer la fin (l'existant lance des promesses sans les attendre).
- **ST-GRA-04.14** [!] Ordre de suppression maîtrisé (enfants puis nœud), au lieu de l'ordre non garanti de l'existant.
- **ST-GRA-04.15** [+] Confirmation avec le verbe exact « Supprimer du graphe », le nombre exact et la liste dépliable des nœuds touchés.
- **ST-GRA-04.16** [+] La confirmation dit ce qui n'est pas touché et liste les exclus avec leur raison (autre parent).
- **ST-GRA-04.17** [+] Si le nœud a d'autres parents, c'est dit : « Ce nœud est aussi dans 2 autres contextes ».
- **ST-GRA-04.18** [+] Bouton de validation avec verbe et nombre (« Supprimer 12 nœuds »), en rouge, jamais « OK ».
- **ST-GRA-04.19** [+] La confirmation indique que l'opération n'est pas annulable.
- **ST-GRA-04.20** [+] Touche `Suppr` : ouvre toujours la confirmation.
- **ST-GRA-04.21** [+] Lot volumineux : tâche dans le plateau avec résultat par nœud (supprimés, ignorés avec raison, erreurs) et « Relancer les échecs ».
- **ST-GRA-04.22** [+] Un enfant partagé n'est jamais considéré comme jetable par défaut : exclusions cochées par défaut.
- **ST-GRA-04.23** [recette] Chaque variante de périmètre, sur un jeu de données dédié avec enfants partagés.
- **ST-GRA-04.24** [recette] Le nombre et la portée annoncés correspondent exactement à ce qui est supprimé.
- **ST-GRA-04.25** [recette] Les trois exclusions protègent effectivement les enfants partagés.
- **ST-GRA-04.26** [recette] Suppression d'un `SpinalBmsDevice` : listener retiré.
- **ST-GRA-04.27** [recette] Suppression et désassociation donnent des résultats différents sur le même objet.

### ST-GRA-05 — Retirer des relations sans supprimer les objets

Destination : Studio, Navigateur, action « Retirer du contexte… » ; fiche, onglet Relations (§3.8), « Retirer des liens »
- **ST-GRA-05.1** [=] Retirer les liens d'un nœud avec ses parents qui appartiennent au contexte courant.
- **ST-GRA-05.2** [=] Lister les relations enfants sortantes, en sélectionner certaines et retirer leurs liens.
- **ST-GRA-05.3** [=] Les objets cibles restent dans le graphe et dans leurs autres appartenances.
- **ST-GRA-05.4** [=] Filtrage des parents selon leur appartenance au contexte courant.
- **ST-GRA-05.5** [!] Prendre en charge les trois types de relation `Ref`, `PtrLst` et `LstPtr` (l'existant n'essaie que `PtrLst` puis `LstPtr`).
- **ST-GRA-05.6** [!] Vérifier la portée réelle avant retrait : une relation sous-jacente partagée entre contextes ne doit pas être retirée pour tous à l'insu de l'utilisateur.
- **ST-GRA-05.7** [+] Sélection multiple des cibles, en distinguant celles du contexte courant des autres.
- **ST-GRA-05.8** [+] Confirmation de portée : verbe « Retirer du contexte » ou « Retirer le lien », nombre, liste, et « L'objet reste dans les autres contextes ».
- **ST-GRA-05.9** [+] Couleur et libellé distincts de « Supprimer ».
- **ST-GRA-05.10** [+] Relations groupées par nom, libellé lisible et nom technique ; type de relation en mode expert.
- **ST-GRA-05.11** [recette] Retirer un équipement du groupe A : l'équipement existe toujours et reste dans le groupe B.
- **ST-GRA-05.12** [recette] Relations inspectées avant et après : seul le lien visé a disparu.
- **ST-GRA-05.13** [recette] Retrait sur chacun des types `Ref`, `PtrLst`, `LstPtr`.

### ST-GRA-06 — Inspecter les relations et ordonner les enfants

Destination : Studio, fiche, onglet Relations (§3.8) ; glisser-déposer dans le Navigateur
- **ST-GRA-06.1** [=] Ouvrir l'inspection depuis un nœud du graphe ou depuis un objet 3D déjà présent dans le graphe.
- **ST-GRA-06.2** [=] Choisir une relation, lire ses enfants et leurs noms.
- **ST-GRA-06.3** [=] Mode édition : monter ou descendre un enfant.
- **ST-GRA-06.4** [=] Trier les enfants par ordre alphabétique (« Trier par nom »).
- **ST-GRA-06.5** [=] Valider le nouvel ordre ou annuler.
- **ST-GRA-06.6** [=] Prendre en charge les relations `Ref`, `PtrLst` et `LstPtr`.
- **ST-GRA-06.7** [+] Réordonner aussi par glisser dans la liste et dans l'arbre du navigateur ; la confirmation dit quelle relation change.
- **ST-GRA-06.8** [+] Nombre d'enfants affiché par relation ; type de relation en mode expert.
- **ST-GRA-06.9** [+] Toast « Annuler » pendant 8 s après validation d'un nouvel ordre.
- **ST-GRA-06.10** [non] Action « retirer du parent » (`removeFromParent`) de cet outil : non implémentée dans l'existant ; remplacée par « Retirer des liens » (ST-GRA-05).
- **ST-GRA-06.11** [!] Suppression globale depuis l'inspecteur : chemin cassé dans l'existant (identifiant converti en chaîne, `event` non défini) ; passer par « Supprimer… » (ST-GRA-04).
- **ST-GRA-06.12** [recette] Après réordonnancement, le même ensemble d'enfants, seul l'ordre change.
- **ST-GRA-06.13** [recette] « Annuler » en mode édition ne persiste aucun changement.
- **ST-GRA-06.14** [recette] Tester les trois types de relation réellement présents dans un jumeau.

### ST-GRA-07 — Ouvrir l'inspecteur de graphe technique

Destination : Studio, Navigateur, action « Inspecter le modèle » → `/studio/inspecteur/<id>` dans un nouvel onglet
- **ST-GRA-07.1** [=] Depuis un nœud sélectionné (liste ou objet 3D) existant dans le graphe, ouvrir l'inspecteur technique.
- **ST-GRA-07.2** [=] Transmettre le `_server_id` exact du nœud.
- **ST-GRA-07.3** [=] Ouverture dans une autre fenêtre ou un autre onglet.
- **ST-GRA-07.4** [!] Remplacer l'URL historique `/html/graph-inspector/?id=…` (non garantie dans le déploiement actuel) par `/studio/inspecteur/<id>`.
- **ST-GRA-07.5** [+] Rediriger les anciens liens `/html/graph-inspector/?id=…` vers la nouvelle route.
- **ST-GRA-07.6** [+] Action placée en mode expert.
- **ST-GRA-07.7** [recette] L'inspecteur s'ouvre sur le nœud dont l'identifiant dynamique a été passé.
- **ST-GRA-07.8** [recette] Aller d'une entité métier à son inspection technique reste possible depuis le navigateur et la 3D.

### ST-GRA-08 — Exporter la structure d'un contexte en CSV

Destination : Studio, Navigateur, action « Exporter la structure (CSV) » sur un contexte
- **ST-GRA-08.1** [=] Action proposée sur un `SpinalContext` sélectionné.
- **ST-GRA-08.2** [=] Parcourir les enfants dans ce contexte.
- **ST-GRA-08.3** [=] Télécharger `<nom du contexte>.csv`.
- **ST-GRA-08.4** [=] Une ligne par chemin de noms ; en-têtes dérivés des relations géographiques.
- **ST-GRA-08.5** [!] Homonymes au même niveau : ne plus se remplacer (l'existant indexe par nom) ; une ligne par nœud.
- **ST-GRA-08.6** [!] Accents encodés correctement (UTF-8 avec BOM pour Excel).
- **ST-GRA-08.7** [!] Virgules, guillemets et retours à la ligne échappés dans les noms.
- **ST-GRA-08.8** [!] Détails d'équipement : relations actuelles (`hasBimObject`) au lieu de l'ancien nom `HasEquipment`.
- **ST-GRA-08.9** [+] Gros contexte : tâche dans le plateau avec progression.
- **ST-GRA-08.10** [=] Export présenté comme lisible, pas comme sauvegarde : objets, attributs métier, pointeurs, types et identifiants ne sont pas tous inclus, et l'action le dit.
- **ST-GRA-08.11** [non] Export intégral ou restaurable du graphe : hors périmètre de cette action.
- **ST-GRA-08.12** [recette] Export d'un contexte géographique avec accents, virgules et homonymes au même niveau : aucun nœud perdu, fichier ouvert correctement.

### ST-GEO-01 — Construire manuellement la hiérarchie géographique

Destination : Studio, atelier Géographie (§5.1), entrée 1 « Construire à la main », et action « Ajouter… » du Navigateur
- **ST-GEO-01.1** [=] Créer un contexte géographique à partir d'un nom (« Nouveau contexte » sur l'accueil de l'atelier).
- **ST-GEO-01.2** [=] Ajouter sous un parent sélectionné un site, un bâtiment, un étage, une zone ou une pièce.
- **ST-GEO-01.3** [=] Ordre des types : contexte → site → bâtiment → étage → zone → pièce → équipement.
- **ST-GEO-01.4** [=] « Ajouter… » propose seulement les types situés après le parent dans cet ordre.
- **ST-GEO-01.5** [=] Les niveaux intermédiaires peuvent être omis (pièce directement sous un étage, étage directement sous le contexte, etc.).
- **ST-GEO-01.6** [=] Ce dialogue n'ajoute pas d'équipement : les équipements passent par le rattachement BIM (ST-GEO-02).
- **ST-GEO-01.7** [=] Champs : type d'enfant (obligatoire) et nom (obligatoire, non vide).
- **ST-GEO-01.8** [=] Nom nettoyé par `trim()` ; enregistrement refusé si le type manque ou si le nom est vide après nettoyage.
- **ST-GEO-01.9** [=] Créer des nœuds `geographic*` avec les relations géographiques nommées (`hasGeographicBuilding`, `hasGeographicFloor`, `hasGeographicZone`, `hasGeographicRoom`…) et l'appartenance au contexte.
- **ST-GEO-01.10** [+] Types affichés en langage métier (Site, Bâtiment, Étage, Zone, Pièce) ; types techniques en mode expert.
- **ST-GEO-01.11** [+] Bouton de validation désactivé tant que le nom est vide, avec la raison.
- **ST-GEO-01.12** [recette] Structure sans site et structure sans zone.
- **ST-GEO-01.13** [recette] Les types et relations créés sont ceux attendus par les micro-apps du portail (`/building/read`, `/floor/list`, `/floor/{id}/room_list`).
- **ST-GEO-01.14** [recette] Organiser un bâtiment complet sans maquette chargée.
- **ST-GEO-01.15** [recette] Nom fait d'espaces seulement : refusé.

### ST-GEO-02 — Associer des objets BIM à une entité et distinguer les références

Destination : Studio, atelier Géographie (§5.1), entrée 1, action « Rattacher la sélection 3D » (comme équipements / comme références)
- **ST-GEO-02.1** [=] Partir d'une sélection 3D, éventuellement répartie sur plusieurs maquettes, d'une entité géographique cible et d'un contexte.
- **ST-GEO-02.2** [=] « Rattacher comme équipements » : les objets BIM deviennent des équipements descendants de l'entité (`hasBimObject`).
- **ST-GEO-02.3** [=] « Rattacher comme références » : la géométrie devient la référence de l'élément géographique (`hasReferenceObject` pour un étage, `hasReferenceObject.ROOM` pour une pièce).
- **ST-GEO-02.4** [=] Deux actions distinctes, avec une explication du rôle de chacune (représenter l'étage ou la pièce, ou être contenu dedans).
- **ST-GEO-02.5** [=] Nom des nœuds créés lu dans la maquette.
- **ST-GEO-02.6** [=] Transmettre au service BIM le couple maquette + `dbId` de chaque objet, jamais le `dbId` seul.
- **ST-GEO-02.7** [=] Ajout de référence interdit sur la racine du contexte et sur un équipement.
- **ST-GEO-02.8** [=] Ajout d'équipement interdit sur un équipement.
- **ST-GEO-02.9** [!] Sélection vide : toujours signalée (« Aucun objet sélectionné dans la 3D ») au lieu d'être tantôt ignorée, tantôt signalée.
- **ST-GEO-02.10** [+] Actions non autorisées masquées ou désactivées avec la raison, selon le type du nœud cible.
- **ST-GEO-02.11** [+] Compteur des objets de la sélection et nombre de maquettes concernées affichés avant validation.
- **ST-GEO-02.12** [+] Résultat par objet dans un toast ou dans le plateau (ajoutés, déjà présents, erreurs).
- **ST-GEO-02.13** [recette] Deux maquettes utilisant le même `dbId` : deux objets distincts, jamais fusionnés.
- **ST-GEO-02.14** [recette] Les trois relations `hasBimObject`, `hasReferenceObject`, `hasReferenceObject.ROOM` produites au bon endroit.
- **ST-GEO-02.15** [recette] Refus sur racine de contexte et sur équipement.

### ST-GEO-03 — Inscrire un contexte dans les référentiels géographiques

Destination : Studio, atelier Géographie (§5.1), entrée 1, action « Inscrire dans les référentiels » sur la racine
- **ST-GEO-03.1** [=] Action proposée sur la racine d'un contexte géographique.
- **ST-GEO-03.2** [=] Ajouter le contexte aux référentiels transverses (opération `addContextToReference`).
- **ST-GEO-03.3** [=] Référentiels : `.SiteContext`, `.BuildingContext`, `.FloorContext`, `.ZoneContext`, `.RoomContext`.
- **ST-GEO-03.4** [=] Ces référentiels servent notamment à retrouver les pièces à classer.
- **ST-GEO-03.5** [=] Référentiels masqués dans l'arbre principal, visibles dans le domaine Espace en mode expert.
- **ST-GEO-03.6** [+] L'action reste visible hors mode expert : le besoin ne disparaît pas avec le masquage technique.
- **ST-GEO-03.7** [+] Indiquer sur la racine si le contexte est déjà inscrit.
- **ST-GEO-03.8** [recette] Les nouvelles entités apparaissent dans les sélecteurs et opérations de classement, indépendamment du contexte d'origine.

### ST-GEO-04 — Générer une hiérarchie depuis des propriétés de maquette

Destination : Studio, atelier Géographie (§5.1), entrée 2 « Générer depuis la maquette » (assistant en étapes)
- **ST-GEO-04.1** [=] Partir d'un contexte géographique existant.
- **ST-GEO-04.2** [=] Source : tous les objets de la maquette, ou un référentiel constitué par sélection (ensemble de sélection).
- **ST-GEO-04.3** [=] Décrire les niveaux dans l'ordre ; chaque niveau est défini par une propriété de la maquette ou par une valeur fixe.
- **ST-GEO-04.4** [=] Niveaux proposés : Site, Bâtiment, Étage, Pièce ; un niveau peut être omis.
- **ST-GEO-04.5** [?] Ajouter Zone aux niveaux proposés (présent dans les constantes, absent de la liste affichée historique).
- **ST-GEO-04.6** [=] Analyser les objets : séparer ceux qui ont toutes les propriétés requises (valides) des autres (invalides).
- **ST-GEO-04.7** [=] Lire les valeurs des propriétés de la maquette et, selon le chemin d'analyse, les attributs Spinal.
- **ST-GEO-04.8** [=] Sélectionner visuellement dans la 3D l'ensemble des valides et celui des invalides.
- **ST-GEO-04.9** [=] Créer ou compléter l'arborescence ; réutiliser les enfants existants de même nom au niveau recherché.
- **ST-GEO-04.10** [=] Rattacher les objets terminaux comme BIM (`hasBimObject`) ou comme références, selon le réglage.
- **ST-GEO-04.11** [=] Réglages et référentiel enregistrés dans l'élément du contexte, rechargés à la prochaine ouverture.
- **ST-GEO-04.12** [+] Analyse exécutée dans un Worker, sans figer l'interface.
- **ST-GEO-04.13** [+] Compteurs valides / invalides et « Montrer dans la 3D » pour chaque ensemble.
- **ST-GEO-04.14** [+] Liste des objets invalides avec la propriété manquante.
- **ST-GEO-04.15** [+] Aperçu avant écriture : nombre d'entités à créer et à réutiliser par niveau.
- **ST-GEO-04.16** [+] Génération lancée comme tâche du plateau, avec progression et bilan.
- **ST-GEO-04.17** [!] Utiliser la maquette de chaque objet (couple maquette + `dbId`) au lieu du « modèle courant » de l'existant ; prise en charge multimaquette.
- **ST-GEO-04.18** [recette] Valeurs fixes et niveaux omis produisent l'arborescence attendue.
- **ST-GEO-04.19** [recette] Aperçu des valides et invalides conforme au contenu de la maquette.
- **ST-GEO-04.20** [recette] Paramètres retrouvés après réouverture du jumeau.
- **ST-GEO-04.21** [recette] Deux exécutions successives ne recréent pas les mêmes espaces.
- **ST-GEO-04.22** [recette] Génération sur deux maquettes chargées ensemble.
- **ST-GEO-04.23** [recette] Graphe identique à celui produit par le Studio historique sur un jumeau de test (comparaison scriptée).

### ST-GEO-05 — Importer ou mettre à jour l'architecture depuis une maquette

Destination : Studio, atelier Géographie (§5.1), entrée 3 « Importer ou mettre à jour l'architecture »
- **ST-GEO-05.1** [=] Choisir la maquette qui contient l'architecture (obligatoire pour continuer).
- **ST-GEO-05.2** [=] Choisir la cible (obligatoire pour continuer) : bâtiment existant ou à créer dans la géographie d'exploitation.
- **ST-GEO-05.3** [=] Autre cible : contexte BIM Geo, qui garde l'organisation issue du fichier (données brutes).
- **ST-GEO-05.4** [=] Mode « références d'étages seulement ».
- **ST-GEO-05.5** [=] Extraire l'architecture avec identifiants externes et propriétés, puis la comparer au graphe.
- **ST-GEO-05.6** [=] Produire une proposition de changements (vers l'écran de différences, ST-GEO-06).
- **ST-GEO-05.7** [=] Enregistrer la configuration spatiale.
- **ST-GEO-05.8** [=] Filtres avancés pour détecter niveaux, pièces et structures.
- **ST-GEO-05.9** [=] Filtre par catégorie Revit.
- **ST-GEO-05.10** [=] Filtre par couple propriété-valeur.
- **ST-GEO-05.11** [=] Opérateurs de filtre : égalité, contenu, expression régulière.
- **ST-GEO-05.12** [=] « Tester les filtres » avant de continuer, avec le résultat de la détection.
- **ST-GEO-05.13** [+] Filtres avancés repliés par défaut.
- **ST-GEO-05.14** [+] Expression régulière invalide signalée dans le champ, sans bloquer les autres filtres.
- **ST-GEO-05.15** [+] Extraction et comparaison dans un Worker, sans tâche de plus de 50 ms sur le fil principal.
- **ST-GEO-05.16** [+] Résultat : un lot de commandes enregistré, pas une écriture directe.
- **ST-GEO-05.17** [recette] Les trois scénarios : géographie d'exploitation, BIM Geo, références d'étages seulement.
- **ST-GEO-05.18** [recette] Fichier mal catégorisé importé grâce à des filtres adaptés.
- **ST-GEO-05.19** [recette] Mise à jour : l'identité des espaces existants est conservée.
- **ST-GEO-05.20** [recette] Différences d'une architecture de 5 000 pièces calculées sans tâche de plus de 50 ms sur le fil principal.

### ST-GEO-06 — Examiner les différences et corriger les correspondances spatiales

Destination : Studio, atelier Géographie (§5.1), entrée 3, écran de différences
- **ST-GEO-06.1** [=] Différences présentées par étage.
- **ST-GEO-06.2** [=] Catégories : créations, suppressions, mises à jour, inchangés.
- **ST-GEO-06.3** [=] Détail des pièces et des références structurelles.
- **ST-GEO-06.4** [=] Anciennes et nouvelles valeurs, avec unités.
- **ST-GEO-06.5** [=] Distinction entre propriétés métier et références géométriques dans la comparaison.
- **ST-GEO-06.6** [=] Sur chaque ligne : Sélectionner, Isoler, Cadrer dans la 3D.
- **ST-GEO-06.7** [=] Forcer la correspondance d'un étage ou d'une pièce entre identifiant externe de la maquette et nœud existant.
- **ST-GEO-06.8** [=] Table des correspondances manuelles conservée et appliquée avant le calcul des commandes.
- **ST-GEO-06.9** [=] Exclure des éléments des commandes (liste `skip`) avant génération.
- **ST-GEO-06.10** [=] Générer les commandes de mutation à partir des différences retenues.
- **ST-GEO-06.11** [+] Compteurs par étage : Créations · Suppressions · Modifications · Inchangés.
- **ST-GEO-06.12** [+] Les suppressions d'espaces portant notes, documents, tickets ou équipements sont signalées et non cochées par défaut.
- **ST-GEO-06.13** [!] Écouteurs de l'écran libérés à sa fermeture (le hook historique `beforDestroy` est mal orthographié et ne nettoie rien).
- **ST-GEO-06.14** [recette] Un espace dont seul le nom BIM change n'est pas remplacé : notes, documents, tickets et équipements restent attachés.
- **ST-GEO-06.15** [recette] Appariement vérifié et corrigé avant toute écriture.
- **ST-GEO-06.16** [recette] Les éléments exclus n'apparaissent pas dans les commandes.
- **ST-GEO-06.17** [recette] Ouvrir et fermer l'écran plusieurs fois : aucun écouteur dupliqué.

### ST-GEO-07 — Préparer, conserver et exécuter des commandes de génération

Destination : Studio, atelier Géographie (§5.1), « Lots de commandes », exécution suivie dans le plateau des tâches
- **ST-GEO-07.1** [=] Sources d'un lot : différences approuvées, fusion préparée ou projection préparée.
- **ST-GEO-07.2** [=] Enregistrer un lot de commandes dans le graphe (nœud de génération + contenu des commandes).
- **ST-GEO-07.3** [=] Recharger un lot enregistré et le lancer, sans recommencer la préparation.
- **ST-GEO-07.4** [=] Séparation stricte entre préparation (aucune écriture métier) et exécution.
- **ST-GEO-07.5** [=] États d'exécution : Attente, Exécution, Vérification, Terminé, Erreur.
- **ST-GEO-07.6** [=] Avancement affiché pendant l'exécution.
- **ST-GEO-07.7** [=] L'écran d'exécution ne peut pas être fermé pendant le traitement.
- **ST-GEO-07.8** [=] « Relancer » sur les nœuds de génération, de type géographie ou projection.
- **ST-GEO-07.9** [=] Erreurs visibles.
- **ST-GEO-07.10** [+] Liste des lots enregistrés avec date et origine (différences, fusion, projection).
- **ST-GEO-07.11** [+] « Exécuter » crée une tâche du plateau ; le reste de l'application reste utilisable pendant l'exécution.
- **ST-GEO-07.12** [+] Bilan par commande : réussies, ignorées avec raison, erreurs.
- **ST-GEO-07.13** [+] Revenir sur l'écran après l'avoir quitté ne relance pas un doublon.
- **ST-GEO-07.14** [non] Transaction globale, annulation complète, reprise exacte au dernier objet : non établies, ne pas les annoncer.
- **ST-GEO-07.15** [recette] Lot enregistré, application fermée, lot rouvert et exécuté.
- **ST-GEO-07.16** [recette] Une commande en erreur apparaît dans le bilan avec son message.
- **ST-GEO-07.17** [recette] Pendant l'exécution, la navigation ailleurs fonctionne et la tâche continue.

### ST-GEO-08 — Fusionner plusieurs organisations BIM Geo dans la géographie d'exploitation

Destination : Studio, atelier Géographie (§5.1), entrée 3, « Fusion BIM Geo »
- **ST-GEO-08.1** [=] Entrées : contexte spatial, arbres BIM Geo disponibles, étage spatial cible.
- **ST-GEO-08.2** [=] Comparer deux arbres : BIM Geo et géographie d'exploitation.
- **ST-GEO-08.3** [=] Créer des bâtiments et des étages cibles.
- **ST-GEO-08.4** [=] Rattacher une partie d'étage BIM à un étage spatial.
- **ST-GEO-08.5** [=] Refuser le rattachement d'une partie déjà intégrée dans le contexte spatial, avec la raison.
- **ST-GEO-08.6** [=] Retirer une affectation, ou un étage nouvellement préparé.
- **ST-GEO-08.7** [=] Visualiser les états ajout et retrait.
- **ST-GEO-08.8** [=] Transformer le résultat en lot de commandes enregistré puis exécutable (ST-GEO-07).
- **ST-GEO-08.9** [+] Deux arbres côte à côte : BIM Geo à gauche, géographie d'exploitation à droite.
- **ST-GEO-08.10** [+] Glisser une partie d'étage vers un étage cible.
- **ST-GEO-08.11** [recette] Un étage d'exploitation regroupe des contributions de plusieurs maquettes.
- **ST-GEO-08.12** [recette] L'organisation des fichiers et l'organisation fonctionnelle restent indépendantes après fusion.

### ST-GEO-09 — Projeter des équipements dans les espaces

Destination : Studio, atelier Géographie (§5.1), entrée 4 « Projeter les équipements »
- **ST-GEO-09.1** [=] Entrées : contexte géographique et ensembles d'objets, issus de la sélection 3D ou d'un groupe existant.
- **ST-GEO-09.2** [=] Plusieurs configurations de projection nommées, persistées.
- **ST-GEO-09.3** [=] Groupes ordonnés d'objets dans une configuration.
- **ST-GEO-09.4** [=] Ajouter ou retirer des objets et des groupes.
- **ST-GEO-09.5** [=] Visualiser un groupe dans la 3D.
- **ST-GEO-09.6** [=] Option « arrêt aux feuilles ».
- **ST-GEO-09.7** [=] Option « approximation par niveau ».
- **ST-GEO-09.8** [=] Décalages configurables `R`, `T`, `Z`, avec aperçu des points dans la 3D.
- **ST-GEO-09.9** [=] Correspondance entre niveaux détectés et étages spatiaux.
- **ST-GEO-09.10** [=] Conserver les identités maquette + objet dans les configurations.
- **ST-GEO-09.11** [=] Calcul des intersections avec les références des pièces pour proposer des affectations.
- **ST-GEO-09.12** [=] Enregistrer la configuration, puis lancer la projection.
- **ST-GEO-09.13** [=] Présenter les objets non affectés.
- **ST-GEO-09.14** [+] Configurations : liste, créer, dupliquer.
- **ST-GEO-09.15** [+] Chaque groupe est un ensemble de sélection (`EnsembleSelection`) : compteur, « Ajouter la sélection 3D », « Vider », « Montrer dans la 3D », retrait unitaire.
- **ST-GEO-09.16** [+] Une branche sélectionnée est développée en objets feuilles, et l'interface le dit.
- **ST-GEO-09.17** [+] Résultat de la projection : un lot de commandes, pas une écriture directe.
- **ST-GEO-09.18** [recette] Réglages par famille d'équipement, leur ordre et leur réutilisation conservés après réouverture.
- **ST-GEO-09.19** [recette] Objets dont le point géométrique exige un décalage correctement affectés grâce à `R`, `T`, `Z`.
- **ST-GEO-09.20** [recette] Les objets non affectés sont listés.
- **ST-GEO-09.21** [recette] Graphe identique à celui produit par le Studio historique sur un jumeau de test.

### ST-GEO-10 — Résoudre manuellement les affectations ambiguës de projection

Destination : Studio, atelier Géographie (§5.1), entrée 4, écran « Résolution »
- **ST-GEO-10.1** [=] Ouvrir le résultat d'une projection enregistrée à partir du contexte et du nœud de génération.
- **ST-GEO-10.2** [=] Consulter résultats, avertissements et erreurs.
- **ST-GEO-10.3** [=] Naviguer par étage, puis par pièce.
- **ST-GEO-10.4** [=] Rechercher par nom.
- **ST-GEO-10.5** [=] « Isoler l'étage » dans la 3D.
- **ST-GEO-10.6** [=] Montrer dans la 3D les objets et les références concernés.
- **ST-GEO-10.7** [=] Valider ou refuser chaque affectation proposée.
- **ST-GEO-10.8** [=] Générer les commandes correspondant aux décisions (nouveaux liens géographiques).
- **ST-GEO-10.9** [=] Toujours offrir une voie manuelle quand la géométrie ne suffit pas à déterminer la pièce.
- **ST-GEO-10.10** [+] Résultat : un lot de commandes exécuté via le plateau (ST-GEO-07).
- **ST-GEO-10.11** [recette] Un objet difficile à projeter peut être rattaché à la main.
- **ST-GEO-10.12** [recette] La correction est visible dans la 3D et reste liée à l'objet de la bonne maquette.

### ST-GEO-11 — Réparer et recalculer les informations spatiales dérivées

Destination : Studio, atelier Géographie (§5.1), section « Recalculer » (une carte par outil)
- **ST-GEO-11.1** [=] Outil « Mettre à jour noms et dbId depuis les identifiants externes » des BIMObjects.
- **ST-GEO-11.2** [=] Choix entre mise à jour du nom, des `dbId`, ou des deux.
- **ST-GEO-11.3** [=] Outil « Mettre à jour les dbId documentaires des pièces ».
- **ST-GEO-11.4** [=] Outil « Renseigner niveau, surface et centre » : attributs de niveau, surface et position centrale du contexte spatial.
- **ST-GEO-11.5** [=] Périmètre : maquettes choisies et, selon l'outil, étages sélectionnés (choix des étages pour l'outil de centre).
- **ST-GEO-11.6** [=] Messages de progression pendant le calcul.
- **ST-GEO-11.7** [=] Mise à jour sans refaire toute l'importation spatiale.
- **ST-GEO-11.8** [+] Chaque carte : périmètre explicite et confirmation avant écriture.
- **ST-GEO-11.9** [+] Exécution comme tâche du plateau.
- **ST-GEO-11.10** [+] Bilan par outil : mis à jour, introuvables, ignorés.
- **ST-GEO-11.11** [recette] Changement de version BIM réparé sans recréer les nœuds.
- **ST-GEO-11.12** [recette] Mise à jour du nom seul et des identifiants seuls donnent des résultats distincts.
- **ST-GEO-11.13** [recette] Après recalcul, sprites, tableaux et sélecteurs spatiaux du portail lisent toujours niveau, surface et centre.

## 6. Maquettes, classements, attributs, documents, simulation

### ST-BIM-01 — Composer et charger des scènes multimodèles
Destination : Atelier « Maquettes et scènes », section Scènes (ecrans-studio §5.2) ; ouverture du jumeau (§1.1, scène par défaut)
- **ST-BIM-01.1** [=] Lister les scènes du contexte `Scenes` du jumeau.
- **ST-BIM-01.2** [=] Créer une scène avec un nom et une description.
- **ST-BIM-01.3** [!] Le champ description de la création enregistre bien la description (l'ancien champ appelait `onNameChange` et écrasait le nom).
- **ST-BIM-01.4** [=] Proposer en source les fichiers BIM du contexte des maquettes (`BimFileContext`).
- **ST-BIM-01.5** [=] Ajouter une maquette à la scène (relation `hasParts`).
- **ST-BIM-01.6** [=] Retirer une maquette de la scène, sans supprimer le fichier BIM.
- **ST-BIM-01.7** [=] Pour chaque maquette : choix « Maquette complète » ou « Sélection d'objets ».
- **ST-BIM-01.8** [=] « Sélection d'objets » : accumuler des objets 3D par maquette dans un ensemble de sélection (`EnsembleSelection` : compteur, « Ajouter la sélection 3D », « Vider », « Montrer dans la 3D », retrait unitaire).
- **ST-BIM-01.9** [=] Vider la sélection d'objets d'une maquette.
- **ST-BIM-01.10** [=] « Revoir dans la 3D » la sélection enregistrée d'une maquette.
- **ST-BIM-01.11** [=] Persister les options par maquette, clé URN, avec la liste de `dbIds` retenus.
- **ST-BIM-01.12** [!] Le mode « Maquette complète » est lu et écrit sous la même clé (aujourd'hui lecture `useAllModels`, écriture `useAllDT`) ; les scènes existantes portant l'une ou l'autre clé sont relues correctement.
- **ST-BIM-01.13** [!] Les choix par maquette sont associés à l'identité de la maquette, pas à son nom : deux maquettes homonymes gardent chacune leurs réglages.
- **ST-BIM-01.14** [=] Choix de l'alignement de la scène (`sceneAlignMethod`) parmi trois : centre à centre, origine à origine, coordonnées partagées.
- **ST-BIM-01.15** [=] Option « Charger automatiquement à l'ouverture » (`autoLoad`).
- **ST-BIM-01.16** [+] À l'ouverture du jumeau, charger la scène par défaut (`autoLoad`) ou la dernière scène ouverte par cet utilisateur pour ce jumeau, avec progression dans le viewer.
- **ST-BIM-01.17** [+] Jumeau sans scène : message « Aucune maquette chargée » dans le viewer, avec « Choisir une scène ».
- **ST-BIM-01.18** [=] Résumé de la scène : liste des maquettes et nombre d'objets sélectionnés par maquette.
- **ST-BIM-01.19** [!] Les compteurs du résumé sont calculés par maquette effectivement présente (l'ancien résumé les invoquait sans modèle).
- **ST-BIM-01.20** [=] Enregistrer la scène.
- **ST-BIM-01.21** [=] Charger une scène depuis l'atelier ou depuis le navigateur (contexte « Maquettes »).
- **ST-BIM-01.22** [=] Charger une maquette seule depuis le graphe (« Charger dans la vue »).
- **ST-BIM-01.23** [recette] Scène enregistrée, jumeau fermé puis rouvert : maquettes, sous-ensembles, alignement et `autoLoad` identiques.
- **ST-BIM-01.24** [recette] Sous-ensemble d'objets sur une maquette et maquette complète sur une autre, dans la même scène.
- **ST-BIM-01.25** [recette] Deux maquettes homonymes dans une scène : réglages distincts conservés.
- **ST-BIM-01.26** [recette] Chacun des trois alignements donne une superposition correcte sur une scène de test.
- **ST-BIM-01.27** [recette] Réouverture automatique de la scène `autoLoad` au chargement du jumeau.
- **ST-BIM-01.28** [recette] Sélection 3D dans une scène multimodèle : chaque objet reste rattaché à sa maquette.
- **ST-BIM-01.29** [recette] Scène historique écrite avec `useAllDT` relue en « Maquette complète ».

### ST-BIM-02 — Calculer et enregistrer les offsets des modèles par scène
Destination : Atelier « Maquettes et scènes », section Décalages (ecrans-studio §5.2)
- **ST-BIM-02.1** [=] Point d'entrée : le contexte des scènes ou une scène choisie.
- **ST-BIM-02.2** [=] « Calculer le décalage » pour une maquette de la scène.
- **ST-BIM-02.3** [=] « Calculer le décalage » pour toutes les maquettes de la scène en une fois.
- **ST-BIM-02.4** [=] Le calcul suit l'alignement de la scène (`sceneAlignMethod`).
- **ST-BIM-02.5** [=] Origine à origine : décalage tiré du premier offset global du modèle.
- **ST-BIM-02.6** [=] Coordonnées partagées : décalage tiré du fichier AEC de la maquette.
- **ST-BIM-02.7** [!] Centre à centre : le calcul renvoie réellement un décalage (aujourd'hui aucun, alors que l'écriture lit `offset.x`) ; à défaut, l'action est désactivée avec la raison.
- **ST-BIM-02.8** [=] Stocker le résultat sur la version courante du fichier sous `offset[sceneId].x`, `.y`, `.z`.
- **ST-BIM-02.9** [!] Afficher les valeurs x/y/z enregistrées pour chaque maquette (l'ancien écran affichait toujours `-`).
- **ST-BIM-02.10** [+] Une maquette sans décalage enregistré l'indique en clair (« Non calculé »).
- **ST-BIM-02.11** [recette] Même fichier dans deux scènes : deux décalages distincts mémorisés.
- **ST-BIM-02.12** [recette] Recalculer le décalage d'une scène ne change pas celui des autres scènes.
- **ST-BIM-02.13** [recette] Calcul groupé puis unitaire : valeurs cohérentes et relues après rechargement.

### ST-BIM-03 — Comparer deux versions d'une maquette
Destination : Atelier « Maquettes et scènes », section « Comparer deux versions » (ecrans-studio §5.2)
- **ST-BIM-03.1** [=] Choisir un fichier BIM puis deux numéros de version.
- **ST-BIM-03.2** [=] Ne proposer que les versions qui contiennent une représentation SVF (ou SBIM) chargeable.
- **ST-BIM-03.3** [=] Charger les deux versions et parcourir leurs objets feuilles.
- **ST-BIM-03.4** [=] Comparer par `externalId` (présence seulement).
- **ST-BIM-03.5** [+] Calcul fait dans un Worker, sans bloquer l'interface.
- **ST-BIM-03.6** [=] Compter les objets de chaque version.
- **ST-BIM-03.7** [=] Identifier les objets ajoutés et supprimés.
- **ST-BIM-03.8** [+] Afficher aussi le nombre d'objets communs.
- **ST-BIM-03.9** [=] Colorer les ensembles : ajoutés en vert, supprimés en rouge.
- **ST-BIM-03.10** [=] « Sélectionner » et « Isoler » chaque ensemble.
- **ST-BIM-03.11** [+] L'écran dit explicitement que la comparaison porte sur la présence des identifiants externes, pas sur la géométrie ni les propriétés des objets conservés.
- **ST-BIM-03.12** [!] URL de chargement des versions construite avec le protocole de la page (plus de `http://` en dur).
- **ST-BIM-03.13** [!] Masquages appliqués aux deux maquettes réellement chargées pour la comparaison (plus d'identifiants de modèles 2 et 3 en dur).
- **ST-BIM-03.14** [!] Écouteurs et couleurs de la comparaison libérés à la fermeture.
- **ST-BIM-03.15** [recette] Ajouts et suppressions entre deux versions retrouvés et situés dans la 3D.
- **ST-BIM-03.16** [recette] Un objet modifié mais au même `externalId` n'apparaît ni en ajouté ni en supprimé.
- **ST-BIM-03.17** [recette] Une autre maquette déjà chargée n'est ni colorée ni masquée.
- **ST-BIM-03.18** [non] Comparateur de géométrie ou de propriétés : non attesté, non promis sans essai.

### ST-BIM-04 — Réconcilier les identifiants BIM après changement de version
Destination : Atelier « Maquettes et scènes », « Réconcilier les identifiants » (ecrans-studio §5.2) ; variante géographique dans l'atelier Géographie, outils « Recalculer » (§5.1)
- **ST-BIM-04.1** [=] Point d'entrée : un fichier BIM ou un contexte spatial.
- **ST-BIM-04.2** [=] Exige la maquette chargée et des nœuds portant `externalId` et `bimFileId`.
- **ST-BIM-04.3** [=] Reconstruire la correspondance `externalId` → `dbId` dans le modèle actuel.
- **ST-BIM-04.4** [=] Mettre à jour le `dbId` des nœuds existants du graphe.
- **ST-BIM-04.5** [=] Variante géographique : parcourir aussi les références de pièces et la hiérarchie géographique.
- **ST-BIM-04.6** [=] Les objets introuvables reçoivent `dbId = -1`.
- **ST-BIM-04.7** [+] Aperçu avant exécution : nombre à mettre à jour, nombre d'introuvables.
- **ST-BIM-04.8** [+] Bilan après exécution : mis à jour, introuvables, ignorés.
- **ST-BIM-04.9** [+] Liste des introuvables affichée, avec export.
- **ST-BIM-04.10** [+] Exécution en tâche du plateau avec progression.
- **ST-BIM-04.11** [!] Une seule commande pour les deux anciennes variantes (contexte géographique et `item_model_selector`) ; la variante ancienne, qui ne traitait pas les absents, n'est pas reprise.
- **ST-BIM-04.12** [=] Ne jamais changer le staticId, les documents, tickets et relations des nœuds réconciliés.
- **ST-BIM-04.13** [recette] Nouvelle version avec `dbId` renumérotés : documents, tickets, notes et groupes restent sur le bon objet.
- **ST-BIM-04.14** [recette] Objets supprimés dans la nouvelle version : `-1`, listés, exportables.
- **ST-BIM-04.15** [recette] Références de pièces mises à jour par la variante géographique.

### ST-BIM-05 — Sélectionner, isoler et cadrer depuis une structure métier
Destination : Viewer et sélection 3D (ecrans-studio §4) ; barre d'actions de la fiche (§3)
- **ST-BIM-05.1** [=] Disponible depuis une pièce, un étage, un bâtiment, une zone, un site, un équipement ou un groupe compatible.
- **ST-BIM-05.2** [=] « Sélectionner » : sélectionne dans la 3D les `BIMObject` descendants.
- **ST-BIM-05.3** [=] « Isoler » : isole ces objets.
- **ST-BIM-05.4** [=] « Cadrer » : ajuste la caméra sur ces objets (raccourci `F`).
- **ST-BIM-05.5** [=] « Isoler les références » : isole la géométrie d'espace (références) séparément des équipements.
- **ST-BIM-05.6** [=] Parcours par une liste explicite de relations géographiques et de groupes, historiques et modernes, pas n'importe quelle relation.
- **ST-BIM-05.7** [=] Objets regroupés par maquette, y compris les instances d'une même maquette dans plusieurs scènes.
- **ST-BIM-05.8** [=] Aucune écriture métier : interaction viewer seulement.
- **ST-BIM-05.9** [=] Objets sans `bimFileId` exploitable ignorés.
- **ST-BIM-05.10** [+] Le nombre d'objets ignorés (sans géométrie résolue) est indiqué à l'utilisateur, pas seulement en log.
- **ST-BIM-05.11** [+] Sélectionner un nœud ayant une géométrie sélectionne ses objets 3D sans cadrer ; le cadrage reste une action.
- **ST-BIM-05.12** [+] Marque « 3D » dans l'arbre sur les nœuds à géométrie résolue.
- **ST-BIM-05.13** [recette] Même résultat depuis une pièce et depuis un groupe transversal contenant les mêmes objets.
- **ST-BIM-05.14** [recette] Distinction enveloppe spatiale (références) / équipements respectée.
- **ST-BIM-05.15** [recette] Sélection sur plusieurs maquettes et sur une maquette présente dans deux scènes.

### ST-BIM-06 — Constituer une sélection 3D par rectangle
Destination : Viewer et sélection 3D (ecrans-studio §4)
- **ST-BIM-06.1** [=] Action « Sélection rectangle » qui active l'outil de boîte de viewer-rs.
- **ST-BIM-06.2** [+] Raccourci `B` (les anciens raccourcis Alt/Ctrl étaient commentés).
- **ST-BIM-06.3** [=] Sélectionner les objets feuilles contenus dans le volume calculé depuis la caméra et le rectangle dessiné.
- **ST-BIM-06.4** [=] Tenir compte des objets isolés ou masqués : un objet masqué n'est pas sélectionné.
- **ST-BIM-06.5** [=] Utiliser les boîtes englobantes transformées des objets (pas un test triangle par triangle).
- **ST-BIM-06.6** [=] Mode par défaut : sélection totale (objet entièrement dans le volume).
- **ST-BIM-06.7** [?] Exposer ou non l'option « sélection partielle » (existe dans le service, `false` par défaut, sans commande UI).
- **ST-BIM-06.8** [=] Le résultat reste associé à chaque maquette.
- **ST-BIM-06.9** [=] Le résultat est réutilisable pour groupes, références, documentation et ensembles de sélection.
- **ST-BIM-06.10** [recette] Rectangle couvrant deux maquettes : objets des deux, chacun avec sa maquette.
- **ST-BIM-06.11** [recette] Objets masqués ou hors isolation exclus.

### ST-BIM-07 — Rechercher des objets par propriétés BIM et attributs Spinal
Destination : Viewer et sélection 3D, « Recherche avancée » (ecrans-studio §4, palette `Ctrl K` ou rail)
- **ST-BIM-07.1** [=] Périmètre : tous les objets, ou une sélection de référence.
- **ST-BIM-07.2** [=] Sélection de référence : accumuler des objets, l'inspecter, retirer des objets unitairement (`EnsembleSelection`).
- **ST-BIM-07.3** [=] Liste de critères nom / valeur : ajouter, retirer, réinitialiser.
- **ST-BIM-07.4** [=] Opérateurs : égal (insensible à la casse), contient (insensible à la casse), expression régulière.
- **ST-BIM-07.5** [=] Expression régulière : options séparées pour le nom et pour la valeur.
- **ST-BIM-07.6** [=] Source : propriétés de la maquette, attributs SpinalCore, ou les deux.
- **ST-BIM-07.7** [=] Validation : au moins une source et au moins un critère valide, sinon recherche désactivée avec la raison.
- **ST-BIM-07.8** [=] Attributs SpinalCore : tous les critères doivent trouver un attribut correspondant.
- **ST-BIM-07.9** [=] Les deux sources : recherche complémentaire, résultat combiné.
- **ST-BIM-07.10** [+] Expression régulière invalide signalée sur le champ, sans lancer la recherche.
- **ST-BIM-07.11** [=] Résultat = ensemble de sélection : sélectionner, isoler, colorer, ajouter à un groupe.
- **ST-BIM-07.12** [=] Variante « Filtrer par niveau » : propriété exacte `Level`, saisie limitée à des chiffres, sur la maquette courante.
- **ST-BIM-07.13** [+] « Filtrer par niveau » présenté comme un filtre de propriété, distinct de la géographie (étages du jumeau).
- **ST-BIM-07.14** [recette] Valeur littérale contenant `.`, `(`, `[`, `*` en mode « égal » ou « contient » : trouvée telle quelle.
- **ST-BIM-07.15** [recette] Recherche limitée à une sélection de référence : aucun objet hors périmètre.
- **ST-BIM-07.16** [recette] Recherche sur attributs enrichis (non présents dans la maquette).
- **ST-BIM-07.17** [recette] Recherche avancée avec expression régulière sur le nom et la valeur.

### ST-BIM-08 — Accéder aux actions métier depuis un objet sélectionné en 3D
Destination : Viewer, menu de la sélection 3D (ecrans-studio §4) ; fiche de l'objet 3D sans nœud (§3)
- **ST-BIM-08.1** [=] Déclencheur : clic ou toucher dans le viewer sélectionnant un seul objet d'une seule maquette.
- **ST-BIM-08.2** [=] Déclencheur aussi : événement d'objet dynamique pris en charge par le service.
- **ST-BIM-08.3** [=] Résoudre le `BIMObject` associé à la sélection.
- **ST-BIM-08.4** [=] Fournir aux actions l'objet, le `dbId`, la maquette et l'indicateur `exist`.
- **ST-BIM-08.5** [+] Clic droit dans le viewer → menu SpinalCore, à la suite des entrées propres à viewer-rs ; il remplace le menu circulaire.
- **ST-BIM-08.6** [=] Actions du registre pour l'objet : documenter, noter, déclarer un ticket, ajouter à un groupe, trouver la pièce, voir dans le graphe, inspecter.
- **ST-BIM-08.7** [=] Objet sans nœud : les actions capables de le créer restent disponibles.
- **ST-BIM-08.8** [+] Fiche d'un objet sans nœud : propriétés de la maquette et bandeau « Cet objet n'est pas encore dans le jumeau ».
- **ST-BIM-08.9** [+] Le `BIMObject` est créé à la première écriture (attribut, document, note, groupe, ticket, événement), et le toast le signale.
- **ST-BIM-08.10** [=] `Échap` ou une autre interaction ferme le menu.
- **ST-BIM-08.11** [=] Une multisélection ordinaire ne propose pas les actions unitaires.
- **ST-BIM-08.12** [+] Avec une multisélection, le menu affiche sa cible réelle (« 3 éléments ») et seulement les actions valables pour tous.
- **ST-BIM-08.13** [+] Sélectionner un objet 3D ouvre sa fiche ; s'il est dans plusieurs contextes, « Voir dans… » pour chacun.
- **ST-BIM-08.14** [recette] Actions depuis la 3D sur un objet connu et sur un objet inconnu du graphe.
- **ST-BIM-08.15** [recette] Deux maquettes avec le même `dbId` : l'action vise le bon objet de la bonne maquette.
- **ST-BIM-08.16** [recette] Une action unitaire n'est jamais appliquée à toute une multisélection.

### ST-BIM-09 — Interagir avec la vue et les propriétés natives du modèle
Destination : Viewer (ecrans-studio §4, viewer-rs inchangé) ; fiche, onglet Résumé, bloc « Propriétés de la maquette » (§3.1)
- **ST-BIM-09.1** [+] viewer-rs remplace `Autodesk.Viewing.Private.GuiViewer3D` ; ses outils restent les siens.
- **ST-BIM-09.2** [=] Afficher les maquettes chargées.
- **ST-BIM-09.3** [=] Arborescence de la maquette (équivalent `getObjectTree`).
- **ST-BIM-09.4** [=] Propriétés natives d'un objet (équivalent `getProperties`), aussi dans un bloc repliable du Résumé de la fiche.
- **ST-BIM-09.5** [=] Sélection et désélection.
- **ST-BIM-09.6** [=] Visibilité : masquer (`H`), tout afficher (`Maj H`), isoler (`I`).
- **ST-BIM-09.7** [=] Cadrage appelé par les panneaux métier (`F`).
- **ST-BIM-09.8** [=] Panneau des propriétés ouvrable depuis l'atelier Données (ST-ATT-02).
- **ST-BIM-09.9** [=] Sauvegarde et restauration de la caméra et des paramètres de rendu pour les notes (ST-DOC-05).
- **ST-BIM-09.10** [=] Navigation : orbite, panoramique, zoom, vue de retour, cube d'orientation.
- **ST-BIM-09.11** [=] Choix perspective / orthographique.
- **ST-BIM-09.12** [=] Mesure et coupe (outils de viewer-rs).
- **ST-BIM-09.13** [?] Éclatement, première personne, annotations natives, unités et calibration de mesure, sélecteur de feuilles 2D : relever ce que l'ancien Studio proposait réellement sur une maquette représentative avant de décider.
- **ST-BIM-09.14** [=] Les raccourcis du viewer restent ceux de viewer-rs quand la 3D a le focus.
- **ST-BIM-09.15** [recette] Examiner un modèle, lire les propriétés d'un objet, restaurer une vue enregistrée.
- **ST-BIM-09.16** [recette] Compléter la recette avec les contrôles natifs effectivement observés dans l'ancien Studio.
- **ST-BIM-09.17** [non] Promettre toute capacité générale du SDK Autodesk comme fonction Studio garantie.

### ST-BIM-10 — Charger la représentation choisie d'un fichier BIM
Destination : Atelier « Maquettes et scènes », section Maquettes (ecrans-studio §5.2)
- **ST-BIM-10.1** [=] Lister les représentations de la version courante : nom, chemin, miniature.
- **ST-BIM-10.2** [+] Liste incluant les représentations SVF et SBIM.
- **ST-BIM-10.3** [=] Lire le chemin de la représentation par défaut (`defaultItem`).
- **ST-BIM-10.4** [+] « Utiliser par défaut » : enregistrer `defaultItem` (aucune UI n'était raccordée).
- **ST-BIM-10.5** [=] Charger en priorité la représentation par défaut.
- **ST-BIM-10.6** [=] À défaut, charger la première sortie dont le chemin contient `svf`.
- **ST-BIM-10.7** [=] Pour chaque maquette : versions et « Charger dans la vue ».
- **ST-BIM-10.8** [=] Conserver `defaultItem` des données existantes.
- **ST-BIM-10.9** [+] Un fichier peut avoir plusieurs vues : la représentation chargée est indiquée.
- **ST-BIM-10.10** [?] Plans et feuilles 2D (`.f2d`), aujourd'hui non sélectionnés : auditer les conversions présentes avant de décider de les proposer.
- **ST-BIM-10.11** [recette] Jumeau existant : la représentation par défaut d'origine est chargée.
- **ST-BIM-10.12** [recette] Changement de représentation par défaut relu après rechargement.

### ST-GRP-01 — Définir des classifications transverses typées
Destination : Atelier « Données », « Créer un classement » (ecrans-studio §5.3) ; navigateur, domaine Classements (§2)
- **ST-GRP-01.1** [=] Créer un contexte de groupes : nom et type d'éléments.
- **ST-GRP-01.2** [=] Types proposés : contexte géographique, site, bâtiment, étage, zone, pièce, équipement, endpoint, device, réseau, groupe d'endpoints, note, agenda, point de contrôle, analyse, documentaire.
- **ST-GRP-01.3** [=] Créer des catégories dans le contexte.
- **ST-GRP-01.4** [=] Créer des groupes dans une catégorie.
- **ST-GRP-01.5** [=] Modifier le nom et l'icône d'une catégorie.
- **ST-GRP-01.6** [=] Modifier le nom, l'icône et la couleur d'un groupe.
- **ST-GRP-01.7** [=] Structure contexte → catégorie → groupe → éléments existants, indépendante de la géographie.
- **ST-GRP-01.8** [=] Les anciens types de groupes restent reconnus et affichés.
- **ST-GRP-01.9** [=] Un même objet peut appartenir à plusieurs classements.
- **ST-GRP-01.10** [+] Types affichés en libellés métier ; type brut en mode expert.
- **ST-GRP-01.11** [recette] Un objet dans trois classements : couleurs et icônes de chaque groupe conservées.
- **ST-GRP-01.12** [recette] Un jumeau avec groupes historiques : contextes, catégories et groupes lisibles et éditables.
- **ST-GRP-01.13** [recette] Classement d'autres types que les équipements (pièces, endpoints, notes…).

### ST-GRP-02 — Affecter ou retirer des éléments d'un groupe
Destination : Fiche, onglet Relations, bloc Groupes (ecrans-studio §3.8) ; menu de la sélection 3D (§4) ; atelier Données (§5.3)
- **ST-GRP-02.1** [=] Sélecteur contexte → catégorie → groupe, filtré sur les groupes compatibles avec le type.
- **ST-GRP-02.2** [=] Création à la volée d'un contexte, d'une catégorie ou d'un groupe pendant l'affectation.
- **ST-GRP-02.3** [=] Rattacher les objets choisis au groupe.
- **ST-GRP-02.4** [=] Ajouter les objets de la sélection 3D à un groupe, en créant le `BIMObject` si nécessaire.
- **ST-GRP-02.5** [=] Affecter la pièce trouvée depuis un objet 3D.
- **ST-GRP-02.6** [=] Pour les pièces : liste des pièces référencées avec « Lier » / « Délier », groupe et couleur actuels affichés, recherche textuelle.
- **ST-GRP-02.7** [=] Le sélecteur est réutilisable avec rappel, notamment pour la destination des nouvelles notes (ST-DOC-04).
- **ST-GRP-02.8** [=] « Retirer du groupe » : retire le lien, l'objet reste dans le jumeau.
- **ST-GRP-02.9** [+] Confirmation de portée : « Les objets restent dans la géographie et les autres groupes ».
- **ST-GRP-02.10** [=] Lien vers le même nœud métier, sans copie.
- **ST-GRP-02.11** [+] Objet déjà membre du groupe : non dupliqué, signalé comme ignoré.
- **ST-GRP-02.12** [recette] Équipement dans deux groupes : un seul nœud, deux appartenances.
- **ST-GRP-02.13** [recette] Désaffectation : l'objet disparaît du groupe seulement.
- **ST-GRP-02.14** [recette] Création de catégorie et de groupe pendant une affectation.

### ST-GRP-03 — Visualiser les groupes et retrouver une pièce depuis un objet
Destination : Navigateur, actions sur un groupe (ecrans-studio §2) ; fiche, onglet Relations, « Trouver sa pièce » (§3.8) ; menu de la sélection 3D (§4)
- **ST-GRP-03.1** [=] « Colorer les objets » d'un contexte, d'une catégorie ou d'un groupe de pièces ou d'équipements, avec la couleur du groupe.
- **ST-GRP-03.2** [=] « Restaurer les couleurs » : retour aux couleurs antérieures.
- **ST-GRP-03.3** [+] Couleurs libérées automatiquement à la fermeture de l'atelier ou du jumeau.
- **ST-GRP-03.4** [=] Depuis un objet 3D : « Voir dans le graphe » active le nœud correspondant.
- **ST-GRP-03.5** [=] « Trouver sa pièce » via les relations équipement et référence.
- **ST-GRP-03.6** [=] Depuis la pièce trouvée : l'ouvrir ou la classer dans un groupe.
- **ST-GRP-03.7** [+] Plusieurs pièces parentes possibles : toutes proposées, au lieu de la première.
- **ST-GRP-03.8** [+] Pièce introuvable : message qui le dit, avec les relations interrogées.
- **ST-GRP-03.9** [recette] Colorer puis restaurer : couleurs d'origine exactes.
- **ST-GRP-03.10** [recette] Parcours 3D → objet du graphe → pièce → classement.

### ST-ATT-01 — Lire et enrichir les attributs d'un objet
Destination : Fiche de l'objet, onglet Attributs (ecrans-studio §3.2)
- **ST-ATT-01.1** [=] Ouvrir depuis une entité du graphe ou un objet 3D, même sans `BIMObject`.
- **ST-ATT-01.2** [=] Catégories d'attributs repliables, lignes libellé / valeur / unité.
- **ST-ATT-01.3** [=] Catégories héritées des groupes parents affichées à part, en lecture, avec leur provenance.
- **ST-ATT-01.4** [=] Créer une catégorie.
- **ST-ATT-01.5** [=] Ajouter un attribut : catégorie existante ou nouvelle, libellé, valeur, unité.
- **ST-ATT-01.6** [=] Éditer en ligne un attribut (libellé, valeur, unité).
- **ST-ATT-01.7** [=] Renommer une catégorie.
- **ST-ATT-01.8** [=] Supprimer un attribut, avec confirmation.
- **ST-ATT-01.9** [=] Supprimer une catégorie, avec confirmation qui donne le nombre d'attributs supprimés.
- **ST-ATT-01.10** [=] « Importer depuis la maquette » : propriétés de l'objet 3D à cocher, choix de la catégorie de destination.
- **ST-ATT-01.11** [=] Créer le `BIMObject` avant le premier enrichissement si besoin (signalé dans le toast).
- **ST-ATT-01.12** [=] L'ouverture renseigne les informations du bâtiment (`setBuildingInformationAttributes`).
- **ST-ATT-01.13** [=] L'enrichissement ne modifie jamais le fichier BIM.
- **ST-ATT-01.14** [+] Valeurs `0`, `false` et vide distinguées : « 0 », « Non », « — ».
- **ST-ATT-01.15** [recette] Import sélectif de trois propriétés dans une nouvelle catégorie.
- **ST-ATT-01.16** [recette] Attributs déjà présents sur l'entité conservés après ajout et édition.
- **ST-ATT-01.17** [recette] Attributs hérités d'un groupe affichés avec la provenance, non éditables depuis l'objet.
- **ST-ATT-01.18** [recette] Premier attribut sur un objet 3D sans nœud : nœud créé, attribut présent après rechargement.

### ST-ATT-02 — Éditer les attributs en tableau et en masse
Destination : Atelier « Données », tableau d'attributs, plein cadre par défaut (ecrans-studio §5.3)
- **ST-ATT-02.1** [=] Départ : un nœud (bouton « Depuis la sélection ») et un type d'objets (pièces, équipements…).
- **ST-ATT-02.2** [=] Colonnes : nom, puis `catégorie / attribut` selon le profil de colonnes courant (ST-ATT-04).
- **ST-ATT-02.3** [+] Tableau virtualisé, sans pagination (remplace le tableau paginé).
- **ST-ATT-02.4** [=] Recherche par nom ou par valeur.
- **ST-ATT-02.5** [=] Sélectionner tout, les lignes une à une.
- **ST-ATT-02.6** [+] « Sélectionner les résultats filtrés » remplace « sélectionner la page ».
- **ST-ATT-02.7** [=] Lignes sélectionnées : « Sélectionner », « Isoler », « Cadrer » dans la 3D.
- **ST-ATT-02.8** [=] Modifier une cellule en ligne.
- **ST-ATT-02.9** [=] « Affecter une valeur à la colonne » pour les lignes choisies.
- **ST-ATT-02.10** [=] « Reprendre la valeur de la maquette » pour une cellule.
- **ST-ATT-02.11** [=] « Reprendre la valeur de la maquette » en masse sur une colonne et des lignes choisies.
- **ST-ATT-02.12** [=] « Nouvel attribut » (catégorie, libellé) pour les lignes sélectionnées.
- **ST-ATT-02.13** [=] Modifications en attente, séparées des valeurs enregistrées, cellules marquées.
- **ST-ATT-02.14** [+] Bouton « Enregistrer N modifications » avec le nombre exact.
- **ST-ATT-02.15** [=] « Annuler les modifications » : aucune écriture.
- **ST-ATT-02.16** [=] Écriture par catégorie et attribut.
- **ST-ATT-02.17** [=] Panneau des propriétés de la maquette depuis une ligne dont le `BIMObject` a un modèle chargé.
- **ST-ATT-02.18** [+] Quitter l'atelier avec des modifications en attente : demande de confirmation.
- **ST-ATT-02.19** [+] Résultat de l'enregistrement par ligne dans le plateau (réussies, erreurs).
- **ST-ATT-02.20** [recette] Édition sur des nœuds purement métier, sans 3D chargée.
- **ST-ATT-02.21** [recette] Valeurs différentes sur différentes lignes enregistrées correctement.
- **ST-ATT-02.22** [recette] Annulation : aucune écriture dans le graphe.
- **ST-ATT-02.23** [recette] Sélection conservée après filtrage et défilement.
- **ST-ATT-02.24** [recette] Lignes concernées retrouvées dans la 3D (sélection, isolation, cadrage).

### ST-ATT-03 — Exporter et réimporter les données attributaires Excel
Destination : Atelier « Données », section Excel (ecrans-studio §5.3)
- **ST-ATT-03.1** [=] « Exporter la sélection » : fichier `spinalcom.xlsx` limité aux lignes sélectionnées.
- **ST-ATT-03.2** [=] Colonnes historiques à l'identique : `SpinalGraph ID`, `Dynamic ID`, `Revit ID`, `Name`, puis une colonne par `catégorie / libellé`.
- **ST-ATT-03.3** [=] Lignes triées par nom.
- **ST-ATT-03.4** [=] `Revit ID` déduit du texte entre crochets dans le nom.
- **ST-ATT-03.5** [+] Nom sans crochets : `Revit ID` vide, sans erreur.
- **ST-ATT-03.6** [=] « Importer » un XLSX, toutes feuilles lues.
- **ST-ATT-03.7** [=] Rapprochement par `SpinalGraph ID` (pas par `Dynamic ID`).
- **ST-ATT-03.8** [+] Aperçu des différences avant écriture : renommages, valeurs modifiées, lignes non rapprochées.
- **ST-ATT-03.9** [=] Renommer les objets et mettre à jour les valeurs existantes après confirmation.
- **ST-ATT-03.10** [=] Lignes dont l'identité est absente du tableau : ignorées, listées dans l'aperçu.
- **ST-ATT-03.11** [=] Pas de création d'objets ni de colonnes arbitraires par l'import.
- **ST-ATT-03.12** [+] Colonnes inconnues signalées dans l'aperçu.
- **ST-ATT-03.13** [!] Les valeurs `0`, `false` et vides sont relues telles quelles (l'ancien parseur les transformait en `-`).
- **ST-ATT-03.14** [!] Nombre et texte conservés (pas de conversion silencieuse).
- **ST-ATT-03.15** [+] Les modifications importées passent par les modifications en attente du tableau (ST-ATT-02), annulables avant enregistrement.
- **ST-ATT-03.16** [recette] Aller-retour sans modification : aucun changement détecté.
- **ST-ATT-03.17** [recette] Aller-retour avec accents, zéro, cellule vide, nombre et texte, noms modifiés.
- **ST-ATT-03.18** [recette] Fichier contenant des objets hors périmètre : aucun écrasement silencieux.
- **ST-ATT-03.19** [recette] Fichier produit par l'ancien Studio importé correctement.

### ST-ATT-04 — Enregistrer les profils de colonnes et les échanger
Destination : Atelier « Données », profils de colonnes (ecrans-studio §5.3)
- **ST-ATT-04.1** [=] Organisation catégorie → groupe de configurations → profil nommé.
- **ST-ATT-04.2** [=] Créer et renommer catégories, groupes et profils.
- **ST-ATT-04.3** [=] Éditer la liste des catégories et attributs du profil (colonnes à afficher).
- **ST-ATT-04.4** [=] Choisir le profil courant.
- **ST-ATT-04.5** [=] Désactiver le profil courant (toutes les colonnes).
- **ST-ATT-04.6** [=] Rafraîchir les tableaux après changement de profil.
- **ST-ATT-04.7** [=] Profil courant persisté (pointeur de configuration courante).
- **ST-ATT-04.8** [=] Un profil définit des colonnes, pas des valeurs d'attributs.
- **ST-ATT-04.9** [=] Exporter un profil, un groupe ou une catégorie de profils en `configurations_spinalcom.xlsx`.
- **ST-ATT-04.10** [=] Importer un fichier aux colonnes `Category`, `Group`, `Configuration Profil`, `Attribute Category`, `Attribute Name`.
- **ST-ATT-04.11** [!] Import : création du groupe quand il n'existe pas (l'ancien test `if (groupFound)` inversé plantait dès un nouveau groupe).
- **ST-ATT-04.12** [+] Aperçu de l'import (profils créés, complétés) avant écriture.
- **ST-ATT-04.13** [=] Contextes, catégories, groupes et profils du service de nomenclature relus et édités.
- **ST-ATT-04.14** [recette] Export puis réimport complet dans un jumeau vierge : profils identiques.
- **ST-ATT-04.15** [recette] Import avec un groupe nouveau dès la première ligne.
- **ST-ATT-04.16** [recette] Profil courant conservé après rechargement.
- **ST-ATT-04.17** [non] Dialogue d'export séparé (ancien placeholder vide) : l'export est dans l'écran des profils.

### ST-ATT-05 — Initialiser un attribut de capacité à partir de la surface des pièces
Destination : Atelier « Géographie », outils « Recalculer », carte « Initialiser la capacité des pièces (surface ÷ 5) » (ecrans-studio §5.1)
- **ST-ATT-05.1** [=] Créer sur les pièces l'attribut `Standard Attributes / capacity`.
- **ST-ATT-05.2** [=] Type `number`, unité `people`.
- **ST-ATT-05.3** [=] Valeur `Math.round(area / 5)` depuis `Spatial / area`.
- **ST-ATT-05.4** [=] Parcours bâtiment → étage → pièce.
- **ST-ATT-05.5** [+] Contexte géographique choisi explicitement (plus imposé par le nom exact `spatial`).
- **ST-ATT-05.6** [=] Catégorie et attribut créés seulement s'ils sont absents.
- **ST-ATT-05.7** [=] Une capacité existante n'est jamais écrasée.
- **ST-ATT-05.8** [=] Initialisation ponctuelle, pas un calcul entretenu.
- **ST-ATT-05.9** [+] La carte affiche la formule, l'unité de surface attendue et le périmètre avant confirmation.
- **ST-ATT-05.10** [+] La carte dit que le diviseur 5 est une règle par défaut, pas une norme d'occupation.
- **ST-ATT-05.11** [?] Rendre le diviseur réglable.
- **ST-ATT-05.12** [!] Recherche de la catégorie `Spatial` et de l'attribut `area` dans toutes les catégories, pas seulement la première.
- **ST-ATT-05.13** [!] Tous les calculs asynchrones attendus avant le bilan.
- **ST-ATT-05.14** [!] Surface absente, nulle ou non numérique : pièce ignorée avec la raison.
- **ST-ATT-05.15** [+] Bilan : créées, déjà renseignées, ignorées.
- **ST-ATT-05.16** [+] Exécution en tâche du plateau.
- **ST-ATT-05.17** [+] Disponibilité selon le profil hub, au lieu du profil historique `[3]` en dur dans la barre supérieure.
- **ST-ATT-05.18** [recette] Surface nulle et surface absente.
- **ST-ATT-05.19** [recette] Pièce avec plusieurs catégories, `Spatial` en dernière position.
- **ST-ATT-05.20** [recette] Capacité existante non modifiée.
- **ST-ATT-05.21** [recette] Deuxième exécution : aucune création, aucun doublon.

### ST-GRP-04 — Générer automatiquement les catégories et groupes
Destination : Atelier « Données », « Classer automatiquement » (ecrans-studio §5.3)
- **ST-GRP-04.1** [=] Entrée : objets sélectionnés dans le tableau et leur type.
- **ST-GRP-04.2** [=] Destination : nouveau contexte de groupes ou contexte existant.
- **ST-GRP-04.3** [=] Règle de catégorie et règle de groupe, chacune parmi trois modes.
- **ST-GRP-04.4** [=] Mode « Valeur fixe ».
- **ST-GRP-04.5** [=] Mode « Segment du nom » : séparateur et position à partir de 1.
- **ST-GRP-04.6** [=] Mode « Valeur d'attribut » : attribut dont le libellé correspond à une expression régulière.
- **ST-GRP-04.7** [=] Équipements : repli sur les propriétés de la maquette si l'attribut SpinalCore manque.
- **ST-GRP-04.8** [=] Validation des paramètres avant l'étape de création.
- **ST-GRP-04.9** [+] Aperçu des groupes produits et de leurs effectifs avant exécution.
- **ST-GRP-04.10** [=] Liste des objets qui ne fournissent pas la valeur nécessaire.
- **ST-GRP-04.11** [+] « Montrer dans la 3D » les objets sans valeur.
- **ST-GRP-04.12** [=] Génération : création des catégories, des groupes et des rattachements.
- **ST-GRP-04.13** [+] Groupes et catégories déjà existants réutilisés, pas dupliqués.
- **ST-GRP-04.14** [+] Exécution en tâche du plateau, résultat par objet.
- **ST-GRP-04.15** [=] Aucune modification de la géographie.
- **ST-GRP-04.16** [recette] Classement par segment du nom (ex. `CTA-02-N3`, séparateur `-`, position 1).
- **ST-GRP-04.17** [recette] Classement par attribut avec repli maquette sur des équipements.
- **ST-GRP-04.18** [recette] Objets sans valeur listés et exclus.
- **ST-GRP-04.19** [recette] Seconde génération sur un contexte existant : pas de doublons.

### ST-DOC-01 — Attacher et consulter des fichiers sur les objets
Destination : Fiche de l'objet, onglet Documents (ecrans-studio §3.3)
- **ST-DOC-01.1** [=] Disponible sur une entité ou une sélection 3D.
- **ST-DOC-01.2** [=] Ajouter depuis le poste : dépôt de plusieurs fichiers.
- **ST-DOC-01.3** [=] Ajouter depuis le Drive : sélecteur de fichiers, document relié sans être recréé.
- **ST-DOC-01.4** [=] Ajouter depuis un contexte documentaire : arbre de répertoires et fichiers, document relié sans être recréé.
- **ST-DOC-01.5** [=] Parcourir les répertoires associés avec un fil d'Ariane.
- **ST-DOC-01.6** [=] Documents des groupes parents affichés à part, en lecture, avec leur provenance.
- **ST-DOC-01.7** [=] Créer le `BIMObject` avant l'ajout si besoin.
- **ST-DOC-01.8** [=] Explorateur Drive protégé contre les cycles de répertoires.
- **ST-DOC-01.9** [+] Suivi des dépôts dans le plateau (octets, annulation).
- **ST-DOC-01.10** [recette] Trois origines utilisées sur le même objet.
- **ST-DOC-01.11** [recette] Fichiers dans des dossiers imbriqués.
- **ST-DOC-01.12** [recette] Même document relié à deux objets : un seul fichier.
- **ST-DOC-01.13** [recette] Fichier du Drive relié sans nouveau téléversement.
- **ST-DOC-01.14** [recette] Documents hérités d'un groupe affichés avec la provenance.

### ST-DOC-02 — Télécharger et désassocier des documents
Destination : Fiche de l'objet, onglet Documents (ecrans-studio §3.3)
- **ST-DOC-02.1** [=] Télécharger un fichier unique directement, avec son nom.
- **ST-DOC-02.2** [=] Plusieurs fichiers ou un dossier : archive ZIP de l'arborescence.
- **ST-DOC-02.3** [+] Constitution du ZIP en tâche du plateau.
- **ST-DOC-02.4** [=] « Retirer de l'objet » (`unlinkFileFromNode`) : retire le lien seulement.
- **ST-DOC-02.5** [+] Confirmation « Le fichier reste disponible dans le Drive et sur les autres objets ».
- **ST-DOC-02.6** [=] Distinguer un dossier de plusieurs fichiers d'un lien vers un seul fichier.
- **ST-DOC-02.7** [+] Fichier indisponible : message clair, pas de fichier vide.
- **ST-DOC-02.8** [recette] Octets identiques après téléchargement.
- **ST-DOC-02.9** [recette] Noms Unicode conservés, y compris dans le ZIP.
- **ST-DOC-02.10** [recette] Dossier multi-fichiers téléchargé en ZIP complet.
- **ST-DOC-02.11** [recette] Retrait sur un objet : le document reste sur l'autre objet et dans le Drive.
- **ST-DOC-02.12** [recette] Document visible et téléchargeable depuis le Drive et depuis la fiche.
- **ST-DOC-02.13** [?] « Exporter vers le Drive » (`exportToDrive`) : enregistrement commenté, non actif ; décider si l'intention est reprise.

### ST-DOC-03 — Gérer des liens URL documentaires
Destination : Fiche de l'objet, onglet Documents, bloc Liens (ecrans-studio §3.3)
- **ST-DOC-03.1** [=] Créer un lien : libellé et URL, distincts.
- **ST-DOC-03.2** [=] Lister les liens de l'objet.
- **ST-DOC-03.3** [=] Modifier le libellé ou l'URL d'un lien.
- **ST-DOC-03.4** [=] Retirer un lien.
- **ST-DOC-03.5** [=] Liens des groupes parents affichés à part, en lecture, avec leur provenance.
- **ST-DOC-03.6** [=] Ajouter un lien à une sélection 3D (menu de la sélection).
- **ST-DOC-03.7** [!] La modification fonctionne partout où elle est proposée (l'ancien bouton Edit du clic droit appelait un `editURL()` vide).
- **ST-DOC-03.8** [+] URL invalide signalée sur le champ.
- **ST-DOC-03.9** [+] Ouvrir le lien dans un nouvel onglet.
- **ST-DOC-03.10** [recette] Modifier un lien ne recrée pas les autres.
- **ST-DOC-03.11** [recette] Provenance directe ou groupe affichée.

### ST-DOC-04 — Échanger des notes contextualisées
Destination : Fiche de l'objet, onglet Notes (ecrans-studio §3.4)
- **ST-DOC-04.1** [=] Fil de messages : auteur, date, texte, pièces jointes, images en vignettes.
- **ST-DOC-04.2** [=] Ajouter un message texte.
- **ST-DOC-04.3** [=] Joindre des fichiers et des images.
- **ST-DOC-04.4** [=] Envoi possible avec fichiers et texte vide.
- **ST-DOC-04.5** [=] Texte composé uniquement d'espaces sans fichier : non envoyé.
- **ST-DOC-04.6** [=] Auteur = utilisateur courant, date d'envoi enregistrée.
- **ST-DOC-04.7** [=] Note stockée avec texte, type et fichier, liée au nœud et à un groupe de notes.
- **ST-DOC-04.8** [=] Destination de classement (contexte, catégorie, groupe) : par défaut la destination historique, créée au besoin.
- **ST-DOC-04.9** [=] « Modifier » la destination via le sélecteur de groupe (ST-GRP-02).
- **ST-DOC-04.10** [=] Liste mise à jour en direct quand le nœud change.
- **ST-DOC-04.11** [=] Créer le `BIMObject` à la première note si besoin, sans perdre la note.
- **ST-DOC-04.12** [=] Télécharger une pièce jointe depuis un message.
- **ST-DOC-04.13** [=] Plafond de 25 000 000 octets cumulés pour les pièces jointes choisies.
- **ST-DOC-04.14** [!] Le même plafond s'applique aux captures et images ajoutées autrement.
- **ST-DOC-04.15** [+] Dépassement du plafond : message avec la taille totale et la limite.
- **ST-DOC-04.16** [?] Modifier ou supprimer un message : non attesté aujourd'hui, à décider.
- **ST-DOC-04.17** [recette] Texte, auteur, date, classement et binaires relus après rechargement.
- **ST-DOC-04.18** [recette] Première note sur un objet 3D sans nœud : conservée.
- **ST-DOC-04.19** [recette] Envoi de fichiers sans texte ; refus d'un texte vide.

### ST-DOC-05 — Annoter avec une capture et un point de vue 3D restaurable
Destination : Fiche de l'objet, onglet Notes, bouton « Capturer la vue » (ecrans-studio §3.4)
- **ST-DOC-05.1** [=] Capturer une image PNG du viewer seule.
- **ST-DOC-05.2** [=] Capturer l'image avec un point de vue restaurable.
- **ST-DOC-05.3** [=] Point de vue : `viewState` (caméra, viewport, rendu, overrides) et `objectState` (objets sélectionnés et isolés par maquette), sérialisés.
- **ST-DOC-05.4** [=] L'ensemble d'objets générique de l'état de vue est remplacé par les ensembles explicites par maquette.
- **ST-DOC-05.5** [=] Joindre la capture à la note.
- **ST-DOC-05.6** [=] Télécharger la capture depuis le message.
- **ST-DOC-05.7** [=] « Restaurer ce point de vue » sur chaque message qui en contient un.
- **ST-DOC-05.8** [=] Une capture simple n'a pas de point de vue : pas de bouton de restauration.
- **ST-DOC-05.9** [!] `objectState` indexé par identité de maquette stable, pas par l'identifiant de modèle du viewer.
- **ST-DOC-05.10** [+] Restauration impossible (maquette absente, autre version) : message qui le dit, image toujours téléchargeable.
- **ST-DOC-05.11** [+] Points de vue des notes historiques (format Autodesk) relus au mieux, ou signalés non restaurables.
- **ST-DOC-05.12** [recette] Restauration dans une scène multimodèle : caméra, sélection et isolation cohérentes.
- **ST-DOC-05.13** [recette] Restauration après rechargement du jumeau.
- **ST-DOC-05.14** [recette] Restauration après changement de version de la maquette.
- **ST-DOC-05.15** [recette] Image simple et image avec point de vue distinguées.

### ST-DOC-06 — Retrouver visuellement les objets associés aux notes
Destination : Fiche, onglet Notes (ecrans-studio §3.4) ; navigateur, groupe de notes (§2)
- **ST-DOC-06.1** [=] Ouvrir le détail d'un message.
- **ST-DOC-06.2** [=] « Voir l'objet » : retrouver le parent géographique de la note.
- **ST-DOC-06.3** [=] Cadrer ou isoler ce parent.
- **ST-DOC-06.4** [=] Depuis un groupe de notes : « Colorer les objets annotés ».
- **ST-DOC-06.5** [=] « Restaurer les couleurs ».
- **ST-DOC-06.6** [=] Parcours des relations des notes, puis conversion des parents en ensembles 3D par maquette.
- **ST-DOC-06.7** [=] Fonctionne pour toutes les notes, pas seulement celles créées depuis la 3D.
- **ST-DOC-06.8** [recette] Note sur une pièce : la pièce est cadrée et isolée.
- **ST-DOC-06.9** [recette] Note sur un équipement dans une scène multimodèle.
- **ST-DOC-06.10** [recette] Colorer puis restaurer : couleurs d'origine.

### ST-SIM-01 — Importer une série Excel comme profil réutilisable
Destination : Atelier « Points de contrôle », section Simulation (ecrans-studio §5.5)
- **ST-SIM-01.1** [=] Créer un contexte d'import de type `uploadFileContext`.
- **ST-SIM-01.2** [=] Saisir le nom du profil.
- **ST-SIM-01.3** [=] Choisir un classeur Excel, toutes les feuilles lues.
- **ST-SIM-01.4** [=] Date lue dans la colonne `DATE / HEURE`.
- **ST-SIM-01.5** [=] Valeur lue dans la deuxième colonne de chaque ligne.
- **ST-SIM-01.6** [=] Lignes dont la date ou la valeur n'est pas numérique écartées.
- **ST-SIM-01.7** [=] Profil enregistré : nœud `uploadProfil`, relation `hasUploadProfil`, liste de points `{date, value}` par pointeur.
- **ST-SIM-01.8** [+] Aperçu avant enregistrement : colonnes reconnues, lignes retenues, lignes écartées avec leur raison.
- **ST-SIM-01.9** [+] Fuseau horaire des dates affiché.
- **ST-SIM-01.10** [?] Mapping interactif des colonnes : absent aujourd'hui, à décider.
- **ST-SIM-01.11** [recette] Classeur multi-feuilles : toutes les lignes valides importées.
- **ST-SIM-01.12** [recette] Lignes invalides comptées et expliquées.
- **ST-SIM-01.13** [recette] Profil réutilisé par plusieurs points.
- **ST-SIM-01.14** [non] Interpolation et exécution de simulation : hors de ce dialogue.

### ST-SIM-02 — Affecter un profil importé à un point de contrôle
Destination : Atelier « Points de contrôle », section Simulation (ecrans-studio §5.5)
- **ST-SIM-02.1** [=] Partir d'un élément d'un contexte de groupes.
- **ST-SIM-02.2** [=] Choisir le point de contrôle lié à alimenter.
- **ST-SIM-02.3** [=] Choisir le contexte d'import puis le profil.
- **ST-SIM-02.4** [=] Remplacer la relation `endpointHasProfil` existante par celle vers le nouveau profil.
- **ST-SIM-02.5** [+] Confirmation du remplacement, avec le profil actuel nommé.
- **ST-SIM-02.6** [=] Un profil peut être partagé par plusieurs points.
- **ST-SIM-02.7** [+] L'écran dit que l'affectation n'implique pas un rejeu des valeurs tant que l'organ consommateur n'est pas identifié.
- **ST-SIM-02.8** [?] Identifier l'organ qui rejoue les profils avant de promettre la simulation.
- **ST-SIM-02.9** [recette] Réaffectation : un seul lien `endpointHasProfil` sur le point.
- **ST-SIM-02.10** [recette] Le bon point est alimenté quand l'élément en a plusieurs.
- **ST-SIM-02.11** [non] Autres liens du dialogue `linkGroup.vue` : commande commentée, non reprise comme parcours.

## 7. Réseaux : arborescence technique et profils

### ST-IOT-01 — Créer un contexte réseau logique et ses réseaux
Destination : Atelier Réseaux et GTB › a) Arborescence technique (et section RÉSEAUX du navigateur)
- **ST-IOT-01.1** [=] Créer un contexte d'arborescence technique de type `networkTreeContext`, avec un nom saisi.
- **ST-IOT-01.2** [=] La création du contexte est possible à tout moment, sans sélection préalable (action de la barre du haut historique).
- **ST-IOT-01.3** [=] Créer un réseau nommé (nœud de type `network`) sous le contexte ou sous un réseau existant, par la relation `hasNetworkTreeGroup` (`PtrLst`), dans ce contexte.
- **ST-IOT-01.4** [=] L'action « Créer un sous-réseau » n'est proposée que dans un contexte de type `networkTreeContext`.
- **ST-IOT-01.5** [=] Nom obligatoire : un nom vide ou fait d'espaces ne crée rien ; le nom est enregistré sans les espaces de début et de fin.
- **ST-IOT-01.6** [=] Ce contexte organise objets BIM et automates ; il reste distinct du contexte de découverte BMS de type `Network`.
- **ST-IOT-01.7** [+] Libellés en français : « Nouvelle arborescence technique », « Ajouter un réseau » ; dans le mode expert, les types `networkTreeContext`, `network` et la relation `hasNetworkTreeGroup` restent visibles.
- **ST-IOT-01.8** [+] Le nouveau contexte apparaît sous RÉSEAUX dans le navigateur, et le réseau créé est sélectionné.
- **ST-IOT-01.9** [+] Message de refus explicite si le hub refuse l'écriture, au lieu d'un échec silencieux.
- **ST-IOT-01.10** [?] Refuser ou signaler deux réseaux de même nom sous le même parent ? Aujourd'hui, rien ne l'empêche. Or la génération (ST-IOT-06) réutilise les groupes par nom.
- **ST-IOT-01.11** [recette] Créer un contexte, puis deux réseaux, et recharger : noms, types `networkTreeContext`/`network` et parenté sont conservés.
- **ST-IOT-01.12** [recette] Le contexte géographique existant n'est pas modifié.
- **ST-IOT-01.13** [recette] Créer un réseau imbriqué (réseau sous un réseau) et le relire.

### ST-IOT-02 — Ajouter une sélection 3D à l'arborescence réseau
Destination : Atelier Réseaux et GTB › a) Arborescence technique, action « Ajouter la sélection 3D » sur un réseau
- **ST-IOT-02.1** [=] Rattacher les objets 3D sélectionnés au nœud choisi d'un contexte `networkTreeContext`.
- **ST-IOT-02.2** [=] La sélection agrégée peut couvrir plusieurs maquettes : chaque objet reste rattaché à sa maquette (`bimFileId`, `dbId`).
- **ST-IOT-02.3** [=] Pour chaque objet, son nœud `BIMObject` existant est réutilisé ; à défaut, il est créé avec le nom lu dans la maquette.
- **ST-IOT-02.4** [=] Le lien utilise la relation `hasNetworkTreeBimObject` (`PtrLst`), dans le contexte.
- **ST-IOT-02.5** [=] Sélection 3D vide : message « Sélectionnez au moins un objet dans la 3D », sans écriture.
- **ST-IOT-02.6** [!] La fin de l'action attend la création effective de tous les liens. Aujourd'hui, les promesses sont empilées dans des rappels asynchrones, et l'attente porte sur une liste encore vide.
- **ST-IOT-02.7** [+] Le bouton indique sa cible réelle : « Ajouter 12 objets (2 maquettes) à Réseau CVC ».
- **ST-IOT-02.8** [+] Bilan affiché : objets ajoutés, objets déjà présents (ignorés), erreurs.
- **ST-IOT-02.9** [+] Un objet déjà lié au même nœud n'est pas lié une seconde fois.
- **ST-IOT-02.10** [recette] Ajouter des objets de deux maquettes, puis recharger : retrouver `bimFileId` et `dbId` de chaque objet.
- **ST-IOT-02.11** [recette] Réutiliser un objet qui existe déjà comme `BIMObject` (par exemple dans la géographie) : aucun doublon de nœud.
- **ST-IOT-02.12** [recette] Ajouter deux fois la même sélection : pas de lien en double.

### ST-IOT-03 — Définir les ensembles d'automates et d'objets contrôlés
Destination : Atelier Réseaux et GTB › a) Assistant de génération, étapes « Automates » et « Objets contrôlés »
- **ST-IOT-03.1** [=] L'assistant se lance sur un nœud d'un contexte `networkTreeContext`. Ce nœud devient le réseau de destination de la génération.
- **ST-IOT-03.2** [=] Deux ensembles indépendants : les automates (étape 1) et les objets contrôlés (étape 2).
- **ST-IOT-03.3** [=] « Ajouter la sélection 3D » complète l'ensemble avec la sélection courante.
- **ST-IOT-03.4** [=] Une branche sélectionnée est développée en objets feuilles de la maquette.
- **ST-IOT-03.5** [=] Dédoublonnage par maquette et par `dbId` lors des ajouts répétés.
- **ST-IOT-03.6** [=] « Vider » remet l'ensemble à zéro.
- **ST-IOT-03.7** [=] « Montrer dans la 3D » resélectionne tous les objets de l'ensemble.
- **ST-IOT-03.8** [=] Compteur d'objets de chaque ensemble.
- **ST-IOT-03.9** [=] Champ « Attribut » propre à chaque ensemble. Valeur par défaut : `BOS_ID` pour les automates, `BOS_CONTROLE_PAR` pour les objets contrôlés.
- **ST-IOT-03.10** [=] L'attribut est d'abord cherché parmi les attributs SpinalCore du nœud : libellé sans tenir compte de la casse, catégorie facultative.
- **ST-IOT-03.11** [=] À défaut, l'attribut est cherché dans les propriétés de la maquette : nom affiché ou nom interne, sans tenir compte de la casse, catégorie facultative, valeur non vide.
- **ST-IOT-03.12** [=] « Vérifier » indique le nombre d'objets valides (attribut trouvé) et invalides (attribut absent ou vide).
- **ST-IOT-03.13** [=] Chaque liste, valide ou invalide, peut être sélectionnée dans la 3D, sur toutes les maquettes.
- **ST-IOT-03.14** [=] Tout reste en mémoire : rien n'est écrit dans le graphe à ces étapes.
- **ST-IOT-03.15** [=] Toute modification d'un ensemble annule la vérification déjà faite à l'étape « Aperçu ».
- **ST-IOT-03.16** [!] « Montrer dans la 3D » sélectionne les objets de toutes les maquettes. Aujourd'hui, une sélection par maquette remplace la précédente, et seule la dernière maquette reste sélectionnée.
- **ST-IOT-03.17** [!] Une valeur numérique de propriété de maquette ne fait plus échouer la recherche : la valeur est convertie en texte avant comparaison.
- **ST-IOT-03.18** [!] Une sélection 3D vide n'ouvre plus une alerte navigateur en anglais : le message s'affiche dans l'interface.
- **ST-IOT-03.19** [+] Chaque ensemble utilise le composant `EnsembleSelection` : compteur, « Ajouter la sélection 3D », « Vider », « Montrer dans la 3D », liste dépliable avec retrait unitaire.
- **ST-IOT-03.20** [+] L'interface dit qu'une branche a été développée en objets feuilles, avec le nombre obtenu.
- **ST-IOT-03.21** [+] Les compteurs « valides » et « invalides » sont recalculés automatiquement, dans un Worker, sans bouton « Vérifier ».
- **ST-IOT-03.22** [+] La liste des invalides donne pour chaque objet sa maquette, son nom et la raison (attribut absent ou vide).
- **ST-IOT-03.23** [+] Choix de l'attribut dans une liste des attributs et propriétés présents sur les objets de l'ensemble, avec saisie libre possible.
- **ST-IOT-03.24** [recette] Objet sans l'attribut : il est compté invalide et identifiable dans la 3D.
- **ST-IOT-03.25** [recette] Branche contenant plusieurs feuilles : toutes les feuilles sont comptées.
- **ST-IOT-03.26** [recette] Sélection répétée : pas de doublon.
- **ST-IOT-03.27** [recette] Sélection sur deux maquettes : « Montrer dans la 3D » sélectionne les deux.
- **ST-IOT-03.28** [recette] Attribut porté seulement par SpinalCore, seulement par la maquette, puis par les deux : la valeur SpinalCore est prioritaire.

### ST-IOT-04 — Paramétrer l'association automate–objets
Destination : Atelier Réseaux et GTB › a) Assistant de génération, étape « Association »
- **ST-IOT-04.1** [=] Règle « contient » : la valeur de l'objet contrôlé contient celle de l'automate (expression `PLC`, sujet `OBJ`, option `i`).
- **ST-IOT-04.2** [=] Règle « commence par » : la valeur de l'objet commence par celle de l'automate (`^PLC`, option `i`).
- **ST-IOT-04.3** [=] Règle « égal » : la valeur de l'objet est égale à celle de l'automate (`^PLC$`, option `i`).
- **ST-IOT-04.4** [=] Règle « finit par » : la valeur de l'objet finit par celle de l'automate (`PLC$`, option `i`).
- **ST-IOT-04.5** [=] Les quatre règles prédéfinies ne tiennent pas compte de la casse.
- **ST-IOT-04.6** [=] Mode « expression régulière » : choix de l'opérande testé (valeur de l'automate ou valeur de l'objet contrôlé) et saisie de l'expression.
- **ST-IOT-04.7** [=] Dans l'expression, le jeton `PLC` représente la valeur de l'automate et le jeton `OBJ` la valeur de l'objet.
- **ST-IOT-04.8** [=] Options de l'expression, combinables : `g` (global), `m` (multiligne : ^ et $ par ligne), `i` (casse ignorée), `u` (Unicode complet).
- **ST-IOT-04.9** [=] Mode « fonction personnalisée » : `elementIsControlled(automateAttrValue, elementAttrValue)`, qui doit renvoyer un booléen.
- **ST-IOT-04.10** [=] Le modèle de fonction proposé par défaut est conservé : comparaison des segments 1, 2 et dernier séparés par « - », avec chiffre final de 1 à 9.
- **ST-IOT-04.11** [=] Pour chaque objet contrôlé, l'automate retenu est le premier qui satisfait la règle. Un objet ne peut pas être son propre automate.
- **ST-IOT-04.12** [=] La règle sert à la vérification, puis à la génération (ST-IOT-06).
- **ST-IOT-04.13** [non] Les anciens réglages « séparateur » et « indice » ne sont pas repris : ils sont commentés dans le code et ne sont pas exposés.
- **ST-IOT-04.14** [!] Le mode personnalisé est réellement accessible. Aujourd'hui, son lien est placé dans un bouton radio désactivé.
- **ST-IOT-04.15** [!] Aucune règle par défaut implicite : sans règle choisie, l'expression est vide, ce qui associe tout objet au premier automate. L'étape exige désormais un choix.
- **ST-IOT-04.16** [!] Les valeurs insérées à la place de `PLC` et `OBJ` dans une expression sont échappées. Aujourd'hui, un point ou une parenthèse dans une valeur fausse la règle.
- **ST-IOT-04.17** [!] Plus d'`eval` : la fonction personnalisée est compilée une fois, puis appelée avec les deux valeurs.
- **ST-IOT-04.18** [!] Ambiguïté signalée : quand plusieurs automates satisfont la règle pour un même objet, l'objet est marqué « ambigu » avec la liste des candidats, au lieu d'un choix silencieux du premier.
- **ST-IOT-04.19** [+] Éditeur de fonction dans CodeMirror, avec coloration et erreurs de syntaxe signalées avant validation.
- **ST-IOT-04.20** [+] Les fonctions personnalisées tournent dans un Worker isolé, sans accès au DOM ni au connecteur, avec un avertissement explicite.
- **ST-IOT-04.21** [+] Test immédiat de la règle sur 10 exemples tirés des deux ensembles : couple, résultat, automate retenu.
- **ST-IOT-04.22** [+] Libellés en français : « Contient », « Commence par », « Égal à », « Finit par », « Expression régulière », « Fonction personnalisée ».
- **ST-IOT-04.23** [?] Faut-il enregistrer la règle choisie dans le contexte réseau, pour la retrouver à la prochaine génération, comme pour la géographie (ST-GEO-04) ?
- **ST-IOT-04.24** [recette] Pour chaque règle : un cas positif et un cas négatif.
- **ST-IOT-04.25** [recette] Casse différente entre automate et objet, avec et sans l'option `i`.
- **ST-IOT-04.26** [recette] Séparateurs (« - », « _ », « . ») dans les valeurs, et caractères spéciaux d'expression régulière.
- **ST-IOT-04.27** [recette] Valeur d'attribut absente d'un côté.
- **ST-IOT-04.28** [recette] Ambiguïtés : « AUT1 » et « AUT10 » avec la règle « contient ».
- **ST-IOT-04.29** [recette] Fonction personnalisée qui lève une exception ou ne renvoie pas un booléen : erreur affichée par couple, sans arrêt global.
- **ST-IOT-04.30** [recette] Relire les fonctions personnalisées des configurations existantes, pour repérer celles qui supposent des globales du navigateur (O-7).

### ST-IOT-05 — Définir une convention de nommage issue des données
Destination : Atelier Réseaux et GTB › a) Assistant de génération, étape « Nommage »
- **ST-IOT-05.1** [=] Choix de l'attribut BIM qui fournit le nom. Valeur par défaut : `BOS_ID`.
- **ST-IOT-05.2** [=] Mode « valeur de l'attribut » (par défaut) : le nom est la valeur brute de l'attribut.
- **ST-IOT-05.3** [=] Mode « fonction personnalisée » : `getNamingConvention(attributeValue)`, qui doit renvoyer une chaîne.
- **ST-IOT-05.4** [=] Le modèle de fonction proposé par défaut est conservé : avant-dernier segment séparé par « - », « _ », puis dernier caractère du dernier segment ; sinon, la valeur d'origine.
- **ST-IOT-05.5** [=] L'attribut est recherché comme en ST-IOT-03 : SpinalCore d'abord, puis la maquette.
- **ST-IOT-05.6** [=] Le nom calculé est enregistré sur chaque nœud créé (automate et objet contrôlé) dans l'attribut `namingConvention` de la catégorie `default`.
- **ST-IOT-05.7** [=] Une valeur vide ou un attribut absent ne produit pas d'attribut `namingConvention`.
- **ST-IOT-05.8** [=] Ce nom est la clé du rapprochement ultérieur avec les items des profils (ST-IOT-09).
- **ST-IOT-05.9** [!] Le mode personnalisé est réellement accessible. Aujourd'hui, son lien est placé dans un bouton radio désactivé.
- **ST-IOT-05.10** [!] Plus d'`eval` d'une chaîne construite : aujourd'hui, une valeur contenant une apostrophe fait échouer la fonction.
- **ST-IOT-05.11** [+] Éditeur CodeMirror, exécution dans un Worker isolé, avec un avertissement explicite.
- **ST-IOT-05.12** [+] Aperçu : valeur source et nom produit, sur des exemples réels de l'ensemble.
- **ST-IOT-05.13** [+] Collisions signalées dans l'aperçu : deux objets d'un même automate qui reçoivent le même nom.
- **ST-IOT-05.14** [+] La liberté de transformation est conservée comme capacité métier ; le JavaScript évalué n'est pas une exigence d'architecture.
- **ST-IOT-05.15** [recette] Attribut présent, transformation appliquée.
- **ST-IOT-05.16** [recette] Valeur vide : pas d'attribut `namingConvention`, et l'objet est signalé dans l'aperçu.
- **ST-IOT-05.17** [recette] Caractères accentués et apostrophes dans la valeur.
- **ST-IOT-05.18** [recette] Collision de noms.
- **ST-IOT-05.19** [recette] Le nom produit correspond au `namingConvention` d'un item de profil (ST-IOT-09).

### ST-IOT-06 — Prévisualiser et générer le réseau technique
Destination : Atelier Réseaux et GTB › a) Assistant de génération, étape « Aperçu », puis « Générer »
- **ST-IOT-06.1** [=] Vérification préalable : construction de l'arbre automates → objets contrôlés, à partir des objets valides des deux ensembles et de la règle d'association.
- **ST-IOT-06.2** [=] Compteurs des objets associés et non associés, et sélection de chaque liste dans la 3D.
- **ST-IOT-06.3** [=] Option « Ne pas créer les automates sans objet contrôlé », cochée par défaut.
- **ST-IOT-06.4** [=] Option « Classer les automates par niveau », cochée par défaut, avec le critère `Level`.
- **ST-IOT-06.5** [=] Les critères `Level`, `niveau`, `floor` et `etage` (sans tenir compte de la casse) déclenchent la recherche de l'étage géographique parent de l'automate.
- **ST-IOT-06.6** [=] Avec ce classement, un groupe réseau portant le nom de l'étage est créé ou réutilisé sous le réseau choisi.
- **ST-IOT-06.7** [=] Ce groupe est relié à l'étage géographique par la relation `hasNetworkTree` (`PtrLst`).
- **ST-IOT-06.8** [=] Automate sans étage connu : il est classé sous le groupe `Others`.
- **ST-IOT-06.9** [=] Avec un autre critère, le groupe prend la valeur de cet attribut de l'automate, ou `Others` si la valeur est absente.
- **ST-IOT-06.10** [=] Sans classement, les automates sont placés directement sous le réseau choisi.
- **ST-IOT-06.11** [=] Les groupes réseau sont réutilisés par nom : un groupe existant n'est pas recréé.
- **ST-IOT-06.12** [=] Automate et objets sont des nœuds `BIMObject` (réutilisés s'ils existent), liés par `hasNetworkTreeBimObject` dans le contexte.
- **ST-IOT-06.13** [=] Chaque automate reçoit les informations `isAutomate = true` et une couleur aléatoire (`color`).
- **ST-IOT-06.14** [=] Chaque objet contrôlé est lié sous son automate par `hasNetworkTreeBimObject`.
- **ST-IOT-06.15** [=] L'attribut `namingConvention` (catégorie `default`) est posé sur les nœuds qui ont un nom calculé (ST-IOT-05).
- **ST-IOT-06.16** [=] La génération traite les automates un par un, avec un état Création · Réussi · Erreur.
- **ST-IOT-06.17** [=] Toute modification d'une étape précédente annule la vérification.
- **ST-IOT-06.18** [!] Le champ du critère de classement est exposé et modifiable. Aujourd'hui, il est commenté et reste figé sur `Level`.
- **ST-IOT-06.19** [!] La progression est réelle (automates traités sur total). Aujourd'hui, le pourcentage reste à 0 %.
- **ST-IOT-06.20** [!] « Vérifier » est refusé tant que l'un des deux ensembles est vide. Aujourd'hui, une seule condition (ensemble vide **et** attribut vide) bloque le bouton.
- **ST-IOT-06.21** [!] Le lien étage → groupe (`hasNetworkTree`) n'est créé qu'une fois par groupe, et non à chaque automate.
- **ST-IOT-06.22** [!] Une erreur sur un automate n'arrête plus tout : les échecs sont listés, puis « Relancer les échecs » est proposé.
- **ST-IOT-06.23** [!] La reprise ne crée pas de doublon : les liens et groupes déjà créés sont détectés avant écriture.
- **ST-IOT-06.24** [!] La recherche d'étage ne crée plus de nœud `BIMObject` comme effet de bord pendant la vérification.
- **ST-IOT-06.25** [+] Aperçu en arbre automate → objets, avec compteurs associés, invalides et ambigus, et « Montrer dans la 3D » sur chaque ensemble.
- **ST-IOT-06.26** [+] Aperçu calculé dans un Worker : 5 000 objets en 2 s au plus.
- **ST-IOT-06.27** [+] Aperçu du classement : groupes produits (étages ou valeurs, et `Others`) avec leurs effectifs.
- **ST-IOT-06.28** [+] La génération est une tâche du plateau (En attente · En cours · Terminé · Terminé avec réserves · Erreur), avec un résultat par automate.
- **ST-IOT-06.29** [+] Rien n'est écrit avant le clic sur « Générer ».
- **ST-IOT-06.30** [+] La confirmation annonce l'absence de transaction globale : les créations faites avant une erreur sont conservées.
- **ST-IOT-06.31** [recette] Génération avec classement puis sans classement.
- **ST-IOT-06.32** [recette] Automate dont l'étage est connu, puis inconnu (`Others`).
- **ST-IOT-06.33** [recette] Automate sans objet, option cochée puis décochée.
- **ST-IOT-06.34** [recette] Erreur partielle provoquée, puis reprise sans doublon de groupes ni de liens.
- **ST-IOT-06.35** [recette] Deuxième génération sur le même réseau : les groupes d'étage existants sont réutilisés.
- **ST-IOT-06.36** [recette] Le lien `hasNetworkTree` est visible depuis l'étage géographique.

### ST-IOT-07 — Consulter et exporter le contenu d'un réseau
Destination : Atelier Réseaux et GTB › a) Arborescence technique, « Contenu d'un réseau »
- **ST-IOT-07.1** [=] Tableau de tous les objets `BIMObject` atteints depuis le nœud choisi par `hasNetworkTreeGroup` et `hasNetworkTreeBimObject`.
- **ST-IOT-07.2** [=] Colonne « Identifiant » : `externalId` de l'objet.
- **ST-IOT-07.3** [=] Colonne « Nom ».
- **ST-IOT-07.4** [=] Colonne « Parent(s) » : `externalId` des objets BIM parents (automates), séparés par des virgules ; « - » s'il n'y en a pas.
- **ST-IOT-07.5** [=] Colonne « Groupe(s) » : noms des réseaux parents de type `network`, séparés par des virgules ; « - » s'il n'y en a pas.
- **ST-IOT-07.6** [=] Titre : « Arborescence réseau : <nom> ».
- **ST-IOT-07.7** [=] Tableau vide : « Aucun objet BIM dans ce contexte ».
- **ST-IOT-07.8** [=] Export XLSX `spinalcom.xlsx`, colonnes dans cet ordre : `BimFileId`, `Dbid`, `ExternalId`, `Name`, `Type`, `Parent(s)`, `Group(s)`.
- **ST-IOT-07.9** [=] Classeur d'auteur `spinalcom`, avec une feuille nommée `Network Tree <nom>`, et des colonnes de largeur 20.
- **ST-IOT-07.10** [=] Lecture seule : aucune mutation du graphe.
- **ST-IOT-07.11** [=] « Voir les objets liés » sur un automate : isoler dans la 3D l'automate et ses objets `hasNetworkTreeBimObject`, regroupés par maquette.
- **ST-IOT-07.12** [!] Le tableau du contenu est accessible : dans le build livré, aucun bouton n'ouvre ce panneau. Seule l'isolation 3D l'est.
- **ST-IOT-07.13** [!] Le nom de la feuille Excel est tronqué à 31 caractères et nettoyé des caractères interdits (limite d'Excel).
- **ST-IOT-07.14** [+] Tableau virtualisé, triable et filtrable par nom.
- **ST-IOT-07.15** [+] Les lignes sélectionnées se sélectionnent, s'isolent ou se cadrent dans la 3D.
- **ST-IOT-07.16** [+] L'export, généré avec `exceljs` chargé à la demande, reprend à l'identique les en-têtes historiques.
- **ST-IOT-07.17** [recette] Objet ayant plusieurs parents et plusieurs groupes.
- **ST-IOT-07.18** [recette] Réseau vide : état vide affiché, et export d'un fichier avec en-têtes seulement.
- **ST-IOT-07.19** [recette] Caractères français dans les noms : fichier valide.
- **ST-IOT-07.20** [recette] Chaque ligne exportée correspond à un objet visible dans la 3D (`BimFileId` et `Dbid`).

### ST-IOT-08 — Retirer les liens du contenu d'une arborescence réseau
Destination : Atelier Réseaux et GTB › a) Arborescence technique, « Vider les liens du réseau »
- **ST-IOT-08.1** [=] Depuis le nœud choisi d'un contexte `networkTreeContext`, parcourir récursivement ses enfants dans ce contexte.
- **ST-IOT-08.2** [=] Retirer les relations `hasNetworkTreeBimObject` et `hasNetworkTreeGroup` à chaque niveau.
- **ST-IOT-08.3** [=] Les objets BIM ne sont pas supprimés de la base : seuls les liens réseau sont retirés.
- **ST-IOT-08.4** [=] Capacité de nettoyage massif conservée : sous-réseau, réseau ou contexte entier.
- **ST-IOT-08.5** [!] Pour chaque enfant, la relation réellement portée par le lien est retirée. Aujourd'hui, la première des deux relations trouvée chez le parent sert pour tous les enfants.
- **ST-IOT-08.6** [!] Plus d'action immédiate sans confirmation.
- **ST-IOT-08.7** [+] Confirmation de portée : verbe « Retirer les liens », nombre de réseaux et d'objets touchés, liste dépliable.
- **ST-IOT-08.8** [+] La confirmation dit ce qui n'est pas touché : « Les objets BIM ne sont pas supprimés et restent dans la géographie et les autres contextes. »
- **ST-IOT-08.9** [+] Résultat dans le plateau des tâches : liens retirés, erreurs.
- **ST-IOT-08.10** [?] Faut-il aussi retirer les liens de profil (`hasBacnetProfile`, `hasBacnetItem`) et BMS des objets retirés, ou seulement les liens réseau comme aujourd'hui ?
- **ST-IOT-08.11** [recette] Parent qui porte à la fois des sous-réseaux et des objets BIM : tous les liens sont retirés.
- **ST-IOT-08.12** [recette] Les objets conservent leurs liens géographiques et leurs autres contextes.
- **ST-IOT-08.13** [recette] Vérifier chaque niveau après rechargement.

### ST-IOT-09 — Affecter un profil virtuel à des automates BIM
Destination : Atelier Réseaux et GTB › a) Arborescence technique, « Profils virtuels »
- **ST-IOT-09.1** [=] Choisir en cascade un contexte de profils (type `deviceProfileContext`), un profil (`deviceProfile`), puis un dispositif modèle (`device`).
- **ST-IOT-09.2** [=] Changer de contexte vide le profil choisi ; changer de profil vide le dispositif choisi.
- **ST-IOT-09.3** [=] « Suivant » exige un contexte et un dispositif modèle.
- **ST-IOT-09.4** [=] Cible : un automate (nœud `BIMObject` avec `isAutomate = true`) ou tous les automates trouvés sous le nœud choisi dans le contexte.
- **ST-IOT-09.5** [=] Rapprochement par automate : objets contrôlés (enfants `hasNetworkTreeBimObject`) et items du dispositif modèle.
- **ST-IOT-09.6** [=] La clé est l'attribut `namingConvention` (catégorie `default`), sans espaces et en minuscules, des deux côtés.
- **ST-IOT-09.7** [=] Le `namingConvention` d'un item peut contenir plusieurs alias séparés par « / ».
- **ST-IOT-09.8** [=] Objet sans `namingConvention` ou sans correspondance : il est classé « sans correspondance ».
- **ST-IOT-09.9** [=] Résultat par automate : nom, nombre d'items liés, nombre d'objets non liés, puis « Modifier ».
- **ST-IOT-09.10** [=] Enregistrement : lien automate → dispositif modèle par `hasBacnetProfile`.
- **ST-IOT-09.11** [=] Enregistrement : lien objet → item par `hasBacnetItem`. Un objet n'a qu'un item ; un lien vers un autre item est remplacé.
- **ST-IOT-09.12** [=] Un automate déjà lié à un profil en est d'abord détaché (liens d'items compris), puis lié au nouveau.
- **ST-IOT-09.13** [=] Enregistrement automate par automate, avec un pourcentage d'avancement. Un nouvel item créé pendant le dialogue recharge les données.
- **ST-IOT-09.14** [!] Deux items qui partagent un même alias sont signalés. Aujourd'hui, le dernier écrase l'autre en silence.
- **ST-IOT-09.15** [!] La liste « items sans objet » ne contient que les items réellement inutilisés, une fois chacun. Aujourd'hui, elle contient tous les items, répétés par alias.
- **ST-IOT-09.16** [!] Une erreur sur un automate n'arrête plus tout : résultat par automate, puis « Relancer les échecs ».
- **ST-IOT-09.17** [!] L'abonnement à l'événement de création d'item est retiré à la fermeture.
- **ST-IOT-09.18** [+] Tableau des correspondances en trois parties : réussies, objets sans correspondance, items sans objet.
- **ST-IOT-09.19** [+] Le remplacement d'un profil déjà affecté est annoncé avant validation, avec le nom de l'ancien profil.
- **ST-IOT-09.20** [+] Rien n'est écrit avant la validation.
- **ST-IOT-09.21** [+] Enregistrement en tâche du plateau.
- **ST-IOT-09.22** [recette] Un automate seul, puis un réseau complet.
- **ST-IOT-09.23** [recette] Profil avec des items non utilisés.
- **ST-IOT-09.24** [recette] Objet sans correspondance.
- **ST-IOT-09.25** [recette] Item à alias multiples (« A/B »).
- **ST-IOT-09.26** [recette] Relecture des liens `hasBacnetProfile` et `hasBacnetItem` après rechargement.
- **ST-IOT-09.27** [recette] Réaffectation d'un autre profil : les anciens liens ont disparu.

### ST-IOT-10 — Corriger manuellement les correspondances et détacher un profil
Destination : Atelier Réseaux et GTB › a) Arborescence technique, « Profils virtuels » (correction, « Détacher le profil »)
- **ST-IOT-10.1** [=] Corriger dans l'aperçu, avant l'enregistrement (ST-IOT-09).
- **ST-IOT-10.2** [=] Rouvrir les correspondances existantes d'un automate lié (action proposée seulement si `hasBacnetProfile` existe).
- **ST-IOT-10.3** [=] À la réouverture, une correspondance existe si un lien `hasBacnetItem` existe ; tout autre objet est « non lié ».
- **ST-IOT-10.4** [=] Ajouter un couple : choisir un objet non lié et un item, puis « Lier ».
- **ST-IOT-10.5** [=] Un même item peut être lié à plusieurs objets : il reste disponible après un couplage.
- **ST-IOT-10.6** [=] Retirer un couple : l'objet repasse dans « non liés ».
- **ST-IOT-10.7** [=] Enregistrer : créer les liens `hasBacnetItem` des couples, et retirer ceux des objets non liés.
- **ST-IOT-10.8** [=] Détacher le profil d'un automate, d'un groupe ou réseau, ou du contexte entier.
- **ST-IOT-10.9** [=] Détacher retire les liens `hasBacnetItem` des objets, puis le lien `hasBacnetProfile` de l'automate.
- **ST-IOT-10.10** [=] Option « Détacher aussi les dispositifs BMS ».
- **ST-IOT-10.11** [=] Avec cette option, les dispositifs BMS liés à l'automate par `hasBmsDevice` et portant le même profil sont détachés dans leur contexte de type `Network`.
- **ST-IOT-10.12** [=] Les nœuds physiques (automates, objets, dispositifs, endpoints) ne sont jamais supprimés.
- **ST-IOT-10.13** [!] Retirer un couple ne retire que ce couple. Aujourd'hui, deux inégalités combinées retirent tous les couples qui partagent l'objet **ou** l'item.
- **ST-IOT-10.14** [!] Un item retiré redevient disponible dans la liste des items.
- **ST-IOT-10.15** [!] Lier un couple introuvable ne vide plus la liste des correspondances. Aujourd'hui, la liste devient indéfinie.
- **ST-IOT-10.16** [!] Le détachement au niveau du contexte ou d'un réseau atteint les automates à toute profondeur. Aujourd'hui, les automates placés sous un groupe d'étage sont oubliés.
- **ST-IOT-10.17** [!] Avec l'option BMS, les liens endpoint → objet (`hasBmsEndpoint`) sont bien retirés. Aujourd'hui, le retrait vise la mauvaise relation (`hasBmsDevice`).
- **ST-IOT-10.18** [!] La fin du détachement attend toutes les écritures.
- **ST-IOT-10.19** [!] Le bouton « Lier un profil » ou « Détacher » est visible de façon fiable sur un réseau qui contient des sous-réseaux. Aujourd'hui, la visibilité dépend d'un index qui vaut 0 dans ce cas.
- **ST-IOT-10.20** [+] Correction intégrée au tableau des correspondances, sans fenêtre séparée.
- **ST-IOT-10.21** [+] Mode de couplage explicite : un objet par item, ou plusieurs objets pour un item.
- **ST-IOT-10.22** [+] Confirmation de portée : verbe « Détacher le profil », nombre d'automates, de liens d'items et de dispositifs BMS concernés.
- **ST-IOT-10.23** [+] La confirmation dit : « Aucun objet, automate ni dispositif n'est supprimé. »
- **ST-IOT-10.24** [recette] Association multiple (un item pour plusieurs objets).
- **ST-IOT-10.25** [recette] Retrait ciblé, quand un item est partagé.
- **ST-IOT-10.26** [recette] Détachement global, avec puis sans l'option BMS.
- **ST-IOT-10.27** [recette] Aucune perte de nœuds physiques, et liens géographiques intacts.

### ST-IOT-11 — Rapprocher les automates BIM et les dispositifs réels BMS
Destination : Atelier Réseaux et GTB › a) Arborescence technique, « Rapprocher automates BIM et dispositifs BMS »
- **ST-IOT-11.1** [=] Choisir le périmètre BMS : un contexte (type `Network`), un sous-réseau ou un dispositif. Le niveau le plus fin choisi l'emporte.
- **ST-IOT-11.2** [=] Cible BIM : l'automate choisi, ou tous les automates (`isAutomate = true`) sous le nœud dans le contexte.
- **ST-IOT-11.3** [=] Attribut BMS : saisie libre, `name` par défaut, cherché parmi les attributs SpinalCore du dispositif.
- **ST-IOT-11.4** [=] Attribut BIM : saisie libre, `CFA_Repère d'équipement` par défaut, cherché dans SpinalCore puis dans la maquette.
- **ST-IOT-11.5** [=] Fonction de normalisation facultative de chaque côté : `formatAttributeValue(attributeValue)`, qui renvoie une chaîne.
- **ST-IOT-11.6** [=] Modèles par défaut : côté BIM, « - » remplacé par « _ » ; côté BMS, « _ » remplacé par « - ».
- **ST-IOT-11.7** [=] Un automate dont l'attribut BIM est absent est classé « non associé ».
- **ST-IOT-11.8** [=] Rapprochement par égalité des valeurs normalisées. Un dispositif BMS déjà associé n'est plus proposé.
- **ST-IOT-11.9** [=] Aperçu : couples, automates non associés, dispositifs non associés, avec une correction manuelle avant liaison.
- **ST-IOT-11.10** [=] Chemin « par profil » (par défaut) : le profil de l'automate (`hasBacnetProfile`) s'impose ; à défaut, celui du dispositif BMS.
- **ST-IOT-11.11** [=] Chemin « par profil » : si le dispositif a un autre profil, il est remplacé, et les liens `hasBacnetItem` de ses endpoints sont refaits.
- **ST-IOT-11.12** [=] Chemin « par profil » : clé endpoint `typeId_idNetwork` côté BMS, et `typeId_(IDX+1)` des mesures de l'item côté BIM.
- **ST-IOT-11.13** [=] Chemin « par profil » : chaque objet contrôlé est lié à ses endpoints par `hasBmsEndpoint`.
- **ST-IOT-11.14** [=] Chemin « par profil » : sans profil ni d'un côté ni de l'autre, l'erreur « aucun profil lié » est levée.
- **ST-IOT-11.15** [=] Chemin « par attributs » (option « Utiliser aussi ces réglages pour les sous-éléments ») : endpoints et objets contrôlés sont rapprochés par la valeur des attributs choisis.
- **ST-IOT-11.16** [=] Dans les deux chemins, l'automate est relié au dispositif BMS par `hasBmsDevice`.
- **ST-IOT-11.17** [=] La conversion `IDX = idNetwork - 1` est propre aux profils BACnet et n'est pas généralisée aux autres protocoles.
- **ST-IOT-11.18** [!] Doublons de valeur normalisée signalés comme ambiguïtés. Aujourd'hui, la table indexée par valeur écrase une entrée en silence.
- **ST-IOT-11.19** [!] Valeur d'attribut absente et maquette non chargée sont traitées explicitement, avec une raison affichée.
- **ST-IOT-11.20** [!] Plus d'`eval` des fonctions de normalisation : Worker isolé, valeur passée en argument (les apostrophes ne cassent plus l'appel).
- **ST-IOT-11.21** [!] Progression réactive. Aujourd'hui, le pourcentage est passé par valeur et ne bouge pas.
- **ST-IOT-11.22** [!] Les erreurs par couple ne sont plus avalées : elles sont listées dans le résultat.
- **ST-IOT-11.23** [!] La fin de la liaison attend toutes les écritures de liens.
- **ST-IOT-11.24** [+] Attribut BMS choisi dans une liste (Device ID `id`, nom `name`, adresse IP `address`, adresse MAC `hostId`), avec saisie libre conservée.
- **ST-IOT-11.25** [+] L'aperçu montre, pour chaque couple, les valeurs brutes et normalisées des deux côtés.
- **ST-IOT-11.26** [+] Les deux chemins sont présentés comme un choix explicite : « Par profil » ou « Par attributs ».
- **ST-IOT-11.27** [+] Liaison en tâche du plateau, avec un résultat par couple.
- **ST-IOT-11.28** [recette] Valeurs uniques : tous les couples sont attendus.
- **ST-IOT-11.29** [recette] Collisions de valeurs.
- **ST-IOT-11.30** [recette] Valeur manquante d'un côté.
- **ST-IOT-11.31** [recette] Correction manuelle d'un couple avant validation.
- **ST-IOT-11.32** [recette] Automates de plusieurs maquettes.
- **ST-IOT-11.33** [recette] Profil présent seulement côté BMS, puis seulement côté BIM.
- **ST-IOT-11.34** [recette] Liens `hasBmsDevice` et `hasBmsEndpoint` relus après rechargement.

### ST-PROF-01 — Créer la bibliothèque de profils et ses dispositifs modèles
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, arbre contexte → profils → dispositifs modèles
- **ST-PROF-01.1** [=] Initialiser le contexte de profils, nommé `deviceProfileContext`, de type `deviceProfileContext`. S'il existe déjà, il est réutilisé.
- **ST-PROF-01.2** [=] Créer un profil nommé (`deviceProfile`) sous le contexte, par la relation `hasDevice` (`LstPtr`).
- **ST-PROF-01.3** [=] Créer un dispositif modèle nommé (`device`) sous un profil, par la relation `hasParts` (`LstPtr`).
- **ST-PROF-01.4** [=] Option « Importer le Main.xml du dossier GFX » à la création du dispositif modèle.
- **ST-PROF-01.5** [=] Le fichier fourni est déposé dans le répertoire du dispositif, créé au besoin : relation `hasFiles`, nœud `[Files]` de type `SpinalFiles`.
- **ST-PROF-01.6** [=] « Télécharger le XML » renvoie le premier fichier du répertoire, identique à l'original.
- **ST-PROF-01.7** [!] Un profil est créé dans le contexte sélectionné. Aujourd'hui, il va toujours dans le contexte nommé `deviceProfileContext`.
- **ST-PROF-01.8** [!] Le nom vide est refusé avec un message.
- **ST-PROF-01.9** [+] Libellés en français : « Nouveau contexte de profils », « Nouveau profil », « Nouveau dispositif modèle », « Joindre un Main.xml ».
- **ST-PROF-01.10** [+] Le fichier joint est contrôlé : extension `.xml` et XML lisible, avant le dépôt.
- **ST-PROF-01.11** [+] Le dispositif modèle affiche s'il a un XML joint, et lequel.
- **ST-PROF-01.12** [recette] Profil vide.
- **ST-PROF-01.13** [recette] Dispositif modèle avec XML, puis sans.
- **ST-PROF-01.14** [recette] Réouverture : noms, types, relations et fichier conservés.
- **ST-PROF-01.15** [recette] Le XML téléchargé est identique, octet pour octet, au fichier déposé.

### ST-PROF-02 — Générer un profil depuis un fichier XML d'automate
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, « Générer depuis le XML » (tâche avec bilan)
- **ST-PROF-02.1** [=] Lecture du XML joint (racine `Root`), attributs fusionnés aux éléments et espaces préservés.
- **ST-PROF-02.2** [=] Création du nœud `BacnetValues` (`bacnetValues`) par la relation `hasBacnetValues`.
- **ST-PROF-02.3** [=] Si un nœud `hasBacnetValues` existe déjà, aucune nouvelle génération des valeurs n'est faite.
- **ST-PROF-02.4** [=] Famille `BacnetIPNetworkValueResource` → « Network Values » (`networkValues`, `hasNetworkValues`) → `networkValue` (`hasNetworkValue`).
- **ST-PROF-02.5** [=] Famille `BacnetIPBinaryValueResource` → « Binary Values » (`binaryValues`, `hasBinaryValues`) → `binaryValue` (`hasBinaryValue`).
- **ST-PROF-02.6** [=] Famille `BacnetIPAnalogValueResource` → « Analog Values » (`analogValues`, `hasAnalogValues`) → `analogValue` (`hasAnalogValue`).
- **ST-PROF-02.7** [=] Famille `BacnetIPMultiStateValueResource` → « Multi-State Value » (`multiStateValues`, `hasMultiStateValues`) → `multiStateValue` (`hasMultiStateValue`).
- **ST-PROF-02.8** [=] Une valeur sans `NAME` est nommée « Unnamed ». Le nœud porte `IDX`.
- **ST-PROF-02.9** [=] Tous les champs XML sont recopiés en attributs de la catégorie `default`. Un sous-élément devient une catégorie à son nom.
- **ST-PROF-02.10** [=] Entrées et sorties matérielles : familles « Analog Input » (`analogInputs`), « Binary Input » (`binaryInputs`), « Analog Output » (`analogOutputs`) et « Multi State Input » (`multiStateInputs`).
- **ST-PROF-02.11** [=] `BacnetIPHardwareInputResource` : `binaryInput` si `Maximum` = 1, sinon `analogInput` ; « undefined Name » si le nom manque.
- **ST-PROF-02.12** [=] `BacnetIPHardwareOutputResource` → `analogOutput`, seulement s'il a un `NAME`.
- **ST-PROF-02.13** [=] Éclairage `BacnetIPLightOutputResource` → `analogOutput`, s'il a un `NAME`.
- **ST-PROF-02.14** [=] Stores `BacnetIPSunblindOutputObjectResource` → `analogOutput`, s'il a un `NAME`.
- **ST-PROF-02.15** [=] Capteurs `SmartSenseObjectResource` : `binaryInput` si `InputType` = 3, sinon `analogInput`, s'il a un `NAME`.
- **ST-PROF-02.16** [=] `BacnetIPLightAndSunblindModuleInputResource` → entrée multi-états, s'il a un `NAME`.
- **ST-PROF-02.17** [=] Création de la liste d'items « Item_list » (`itemList`, `hasItemList`), si elle n'existe pas.
- **ST-PROF-02.18** [=] Création du squelette de supervision globale (ST-PROF-11), s'il n'existe pas.
- **ST-PROF-02.19** [=] Ce n'est pas un import XML universel : seuls les chemins du format constructeur ci-dessus sont lus.
- **ST-PROF-02.20** [!] Le type d'entrée multi-états est écrit `multiStateInput`. Aujourd'hui, `multiStateinput` est mal orthographié et ne se convertit pas en type BACnet.
- **ST-PROF-02.21** [!] La fin d'opération est réelle : succès ou erreur. Aujourd'hui, la promesse de `getXmlContent` n'est jamais résolue.
- **ST-PROF-02.22** [!] Le bouton est proposé quand le dispositif a une relation `hasFiles`, quelle que soit sa position. Aujourd'hui, seule la première relation est testée.
- **ST-PROF-02.23** [!] Un XML mal formé ou d'un autre format affiche une erreur, sans écriture partielle silencieuse.
- **ST-PROF-02.24** [+] Analyse du XML dans un Worker, puis aperçu des familles et compteurs avant écriture.
- **ST-PROF-02.25** [+] Génération en tâche du plateau, avec un bilan : valeurs créées par famille, éléments ignorés (sans nom) et raison.
- **ST-PROF-02.26** [+] Une deuxième génération est refusée avec une explication, puisque les valeurs existent déjà.
- **ST-PROF-02.27** [recette] Fichier constructeur réel : toutes les familles attendues.
- **ST-PROF-02.28** [recette] Mauvais format : message d'erreur.
- **ST-PROF-02.29** [recette] Génération complète, sans attente infinie.
- **ST-PROF-02.30** [recette] `Maximum` = 1 et `InputType` = 3 donnent des entrées binaires.

### ST-PROF-03 — Générer un profil depuis un dispositif découvert
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, « Générer depuis un dispositif découvert » (tâche avec bilan)
- **ST-PROF-03.1** [=] Proposé pour un dispositif modèle sans XML joint.
- **ST-PROF-03.2** [=] Choisir le contexte réseau (type `Network`), le sous-réseau et le dispositif BMS découvert.
- **ST-PROF-03.3** [=] Création de `BacnetValues` (`hasBacnetValues`) si elle n'existe pas, dans le contexte du profil.
- **ST-PROF-03.4** [=] Les groupes d'endpoints `BmsEndpointGroup` sont convertis en familles selon `typeNetwork`.
- **ST-PROF-03.5** [=] `analog_value` → `analogValues`, `analog_input` → `analogInputs`, `analog_output` → `analogOutputs`.
- **ST-PROF-03.6** [=] `binary_value` → `binaryValues`, `binary_input` → `binaryInputs`, `binary_output` → `binaryOutputs`.
- **ST-PROF-03.7** [=] `multi_state_value` → `multiStateValues`, `multi_state_input` → `multiStateInputs`, `multi_state_output` → `multiStateOutputs`.
- **ST-PROF-03.8** [=] `network_value` → `networkValues`.
- **ST-PROF-03.9** [=] Chaque endpoint devient un nœud nommé, avec les attributs `default` : `NAME`, `type`, `typeId`, et `IDX` = `idNetwork - 1`.
- **ST-PROF-03.10** [=] Création de la liste d'items et de la supervision, comme en ST-PROF-02.
- **ST-PROF-03.11** [=] Le profil produit est indépendant de l'équipement physique source.
- **ST-PROF-03.12** [!] Les familles BACnet inconnues (boucle `Loop`, `Bit_String`, autres) sont créées avec leur libellé et leur relation propres, ou signalées. Aujourd'hui, elles reçoivent une relation au nom brut et un nom vide.
- **ST-PROF-03.13** [!] La fin de tâche attend la création des endpoints et de leurs attributs.
- **ST-PROF-03.14** [!] Tous les contextes `Network` sont proposés, et pas seulement le premier.
- **ST-PROF-03.15** [+] Aperçu avant génération : familles et nombre d'endpoints du dispositif source.
- **ST-PROF-03.16** [+] Bilan : endpoints copiés par famille et familles ignorées.
- **ST-PROF-03.17** [recette] Plusieurs familles BACnet.
- **ST-PROF-03.18** [recette] Identifiants limites (`idNetwork` 0 et 1, grand nombre) : vérifier la conversion de l'IDX.
- **ST-PROF-03.19** [recette] Dispositif sans endpoint.
- **ST-PROF-03.20** [recette] Liste produite comparée, endpoint par endpoint, au dispositif source.

### ST-PROF-04 — Mettre à jour un profil généré après évolution d'un dispositif
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, « Mettre à jour depuis le dispositif » (`DiffList`)
- **ST-PROF-04.1** [=] Proposé pour un dispositif modèle sans XML joint.
- **ST-PROF-04.2** [=] Rechoisir la source BMS : contexte, sous-réseau, dispositif.
- **ST-PROF-04.3** [=] Comparaison par clé : `typeId_idNetwork` côté endpoints réels, `typeId_(IDX+1)` côté items de profil (attributs `default`).
- **ST-PROF-04.4** [=] Deux listes : Ajouts (endpoints absents du profil) et Suppressions (items absents du dispositif).
- **ST-PROF-04.5** [=] Cocher ou décocher tout ou partie de chaque liste.
- **ST-PROF-04.6** [=] Exécution, puis compteurs « créés » et « supprimés ».
- **ST-PROF-04.7** [=] États affichés : « Rien à mettre à jour », succès, erreur avec « Réessayer ».
- **ST-PROF-04.8** [=] Un ajout va dans la famille correspondante ; une famille absente est créée (et `BacnetValues` au besoin).
- **ST-PROF-04.9** [=] Familles connues : Analog Input/Output/Values, Binary Input/Output/Values, Multi State Input/Output, Multi-State Value, Binary Lighting Output, Loop et Bit_String.
- **ST-PROF-04.10** [=] Ces familles ont leurs nœuds, types et relations propres (par exemple `binaryLightingOutputs`/`hasBinaryLightingOutput`, `loopValues`, `bitStringValues`).
- **ST-PROF-04.11** [=] Un item ajouté reçoit les attributs `NAME`, `type`, `typeId`, `IDX`, `unit`.
- **ST-PROF-04.12** [=] Une suppression retire le nœud du graphe (`removeFromGraph`). C'est plus qu'un détachement.
- **ST-PROF-04.13** [!] Avant une suppression, les liens métier de l'item sont listés : entrée/sortie d'item, mesure, alarme, commande, intervalle, `hasBacnetItem`. La confirmation le dit.
- **ST-PROF-04.14** [!] Un item identique dont le nom ou l'unité a changé apparaît dans une troisième liste « Modifications », et peut être mis à jour.
- **ST-PROF-04.15** [!] Un item sans `typeId` (profil issu d'un XML) est signalé « non comparable », et n'est pas proposé à la suppression.
- **ST-PROF-04.16** [+] Composant `DiffList` : Ajouts · Suppressions · Modifications, avec compteurs, ancienne et nouvelle valeur, et cases à cocher.
- **ST-PROF-04.17** [+] Exécution en tâche du plateau, avec un résultat par item.
- **ST-PROF-04.18** [recette] Ajout seul.
- **ST-PROF-04.19** [recette] Retrait seul.
- **ST-PROF-04.20** [recette] Choix partiel.
- **ST-PROF-04.21** [recette] Aucune différence.
- **ST-PROF-04.22** [recette] Source inaccessible.
- **ST-PROF-04.23** [recette] Conversion IDX ±1.
- **ST-PROF-04.24** [recette] Suppression d'un item déjà utilisé dans une supervision : avertissement, puis état des liens après coup.

### ST-PROF-05 — Gérer les items fonctionnels d'un dispositif modèle
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, « Items » (tableau)
- **ST-PROF-05.1** [=] Tableau des items (`item`, relation `hasItem` sous `Item_list`).
- **ST-PROF-05.2** [=] Colonnes : nom, maître, type d'item, surveillance, convention de nommage BIM, détails.
- **ST-PROF-05.3** [=] Ajouter un item : nom (obligatoire, exemple « L_1 ») et type métier (obligatoire, exemple « Lamp »).
- **ST-PROF-05.4** [=] Ajouter un item : case « Maître » (non cochée par défaut) et convention de nommage BIM (exemple « L_1 »).
- **ST-PROF-05.5** [=] Champs obligatoires vides : champ marqué en erreur, sans création.
- **ST-PROF-05.6** [=] Doublon (même nom, même type et même valeur de maître) : message, sans création.
- **ST-PROF-05.7** [=] Un item créé porte en informations `name`, `maitre`, `itemType`, `namingConvention`, `type` = `item`.
- **ST-PROF-05.8** [=] Il porte les attributs `maitre` et `namingConvention` dans la catégorie `default`.
- **ST-PROF-05.9** [=] Structure créée avec chaque item : « Inputs » (`input`, `hasInputs`), « Outputs » (`output`, `hasOutputs`) et « Supervision » (`itemSupervision`, `hasSupervisionNode`).
- **ST-PROF-05.10** [=] La Supervision contient « Measures » (`measures`, `hasMeasures`), « Alarms » (`alarms`, `hasAlarms`) et « Commands » (`commands`, `hasCommands`).
- **ST-PROF-05.11** [=] Ouvrir le détail d'un item (ST-PROF-08) et son paramétrage de surveillance (ST-PROF-10).
- **ST-PROF-05.12** [=] « Vider la liste » retire les relations `hasItem`, `hasInputs`/`hasInput`, `hasOutputs`/`hasOutput`, et les tables temporaires `hasTempTab`.
- **ST-PROF-05.13** [=] Case « Surveillance » par item. À l'enregistrement, les sorties des items cochés sont rattachées à l'intervalle par défaut du dispositif.
- **ST-PROF-05.14** [!] Aucune écriture avant la validation de la fenêtre. Aujourd'hui, ajout, vidage et import modifient le graphe avant le bouton de fermeture.
- **ST-PROF-05.15** [!] « Vider la liste » demande une confirmation de portée qui dit ce qui reste dans le graphe. Aujourd'hui, les nœuds d'items et leur supervision restent détachés mais présents, et le vidage est immédiat.
- **ST-PROF-05.16** [!] L'enregistrement de la case « Surveillance » ne dépend plus d'un nœud `hasMonitoringNode` que les profils récents n'ont pas, ni d'une fonction de liaison retirée du code. Il passe par la supervision globale (ST-PROF-11).
- **ST-PROF-05.17** [!] Une valeur d'attribut absente s'affiche vide, et non « -1 ».
- **ST-PROF-05.18** [+] Tableau virtualisé, triable et filtrable par nom ou type.
- **ST-PROF-05.19** [+] Le contrôle des doublons s'affiche pendant la saisie.
- **ST-PROF-05.20** [+] Libellés en français : « Nom de l'item », « Type d'item », « Maître », « Convention de nommage BIM ».
- **ST-PROF-05.21** [recette] Création, puis réouverture.
- **ST-PROF-05.22** [recette] Doublon.
- **ST-PROF-05.23** [recette] Champs manquants.
- **ST-PROF-05.24** [recette] Vidage confirmé puis annulé : aucune écriture en cas d'annulation.
- **ST-PROF-05.25** [recette] Les associations non visées (supervision d'autres items, liens `hasBacnetItem`) sont conservées.

### ST-PROF-06 — Importer une liste d'items et leurs liaisons depuis BOG
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, « Items » › « Importer un BOG », avec table temporaire en aperçu
- **ST-PROF-06.1** [=] Choisir un fichier BOG/XML exporté de Niagara (`bajaObjectGraph`).
- **ST-PROF-06.2** [=] Lecture des composants sous `bajaObjectGraph › p › p › p[0] › p`.
- **ST-PROF-06.3** [=] Pour chaque composant : son nom, et ses références lues dans le slot `values` (chaîne séparée par « ; »).
- **ST-PROF-06.4** [=] Une référence vaut `<type>$3a<idx>[$3a<suite>]`. Le type vaut `nv`, `av`, `bv` ou `mv`, et le suffixe `$3be` est ignoré.
- **ST-PROF-06.5** [=] Les entrées `baja:String`, `iconName` et celles qui contiennent « $ » ne sont pas des noms de référence.
- **ST-PROF-06.6** [=] Le suffixe `_Data` est retiré du nom, et les références des composants de même nom sont fusionnées.
- **ST-PROF-06.7** [=] Les composants sans référence sont ignorés.
- **ST-PROF-06.8** [=] Le résultat est stocké dans une table temporaire (`tempTab`, relation `hasTempTab`) jusqu'à validation ou annulation.
- **ST-PROF-06.9** [=] Type d'item déduit du préfixe du nom : `FC` → Fan Coil, `L` → Lamp, `B` → Blind, `WC` → Windows Contact, `Device` → Device, `RC` → Remote Controller.
- **ST-PROF-06.10** [=] Préfixe `CG` ou inconnu : l'item n'est pas créé.
- **ST-PROF-06.11** [=] Un item importé a `maitre = false` et `namingConvention` égale à son nom. Il reçoit Inputs, Outputs et Supervision (ST-PROF-05).
- **ST-PROF-06.12** [=] Une référence `nv` est liée en entrée (`hasInput`) aux Network Values.
- **ST-PROF-06.13** [=] Les références `av`, `bv` et `mv` sont liées en sortie (`hasOutput`) aux Analog, Binary et Multi-State Values.
- **ST-PROF-06.14** [=] Correspondance des valeurs : `IDX + 1` = idx du BOG, ou plage [idx, idx + suite[ quand `suite` > 0.
- **ST-PROF-06.15** [=] Valider l'import vide la liste existante, puis régénère les items.
- **ST-PROF-06.16** [=] Annuler retire la table temporaire.
- **ST-PROF-06.17** [=] Ce parseur est spécifique à une structure BOG donnée : pas de prise en charge garantie de toutes les versions de Niagara.
- **ST-PROF-06.18** [!] La table temporaire n'est plus écrite dans le graphe dès le choix du fichier : l'aperçu reste en mémoire jusqu'à validation.
- **ST-PROF-06.19** [!] Lors d'une réouverture, les nœuds `hasTempTab` hérités sont retirés.
- **ST-PROF-06.20** [!] La `suite` est remise à 0 pour chaque référence. Aujourd'hui, dans une des branches du parseur, la valeur de la référence précédente est reprise.
- **ST-PROF-06.21** [!] Les références `av`, `bv` et `mv` sont comparées comme le `nv`, sur leur valeur texte. Aujourd'hui, la comparaison porte sur l'objet, avec un risque de liaison manquée.
- **ST-PROF-06.22** [!] Un profil sans `BacnetValues` ou sans la famille visée donne une erreur claire, au lieu d'un échec.
- **ST-PROF-06.23** [+] Analyse dans un Worker.
- **ST-PROF-06.24** [+] Aperçu en tableau : items reconnus (nom, type déduit, entrées et sorties trouvées), items ignorés avec raison (`CG`, préfixe inconnu), références introuvables.
- **ST-PROF-06.25** [+] Remplacer la liste existante est annoncé dans la confirmation, avec le nombre d'items supprimés.
- **ST-PROF-06.26** [?] Proposer aussi « Ajouter à la liste existante » sans vider ? Aujourd'hui, seul le remplacement existe.
- **ST-PROF-06.27** [?] Rendre modifiable la table préfixe → type d'item (FC, L, B, WC, Device, RC), au lieu de la laisser figée ?
- **ST-PROF-06.28** [recette] BOG représentatif.
- **ST-PROF-06.29** [recette] Références absentes.
- **ST-PROF-06.30** [recette] Fichier malformé.
- **ST-PROF-06.31** [recette] Remplacement d'une liste existante.
- **ST-PROF-06.32** [recette] Annulation : aucun nœud `hasTempTab` restant.
- **ST-PROF-06.33** [recette] Plage `suite` > 0.
- **ST-PROF-06.34** [recette] Composants `_Data` fusionnés.

### ST-PROF-07 — Exporter les items et leurs entrées/sorties en JSON
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, « Items » › « Exporter item_list.json »
- **ST-PROF-07.1** [=] Téléchargement `item_list.json`, depuis le tableau des items ou depuis l'action « Enregistrer en JSON » sur `Item_list`.
- **ST-PROF-07.2** [=] Contenu : un tableau d'items, chacun avec `name`, `type` (type d'item), `maitre`, `namingConvention`, `inputs`, `outputs`.
- **ST-PROF-07.3** [=] `inputs` et `outputs` sont des tableaux d'objets `{ name, IDX, type }`.
- **ST-PROF-07.4** [=] Ce n'est pas une sauvegarde complète du profil : ni valeurs BACnet, ni intervalles, ni matériel, ni historique.
- **ST-PROF-07.5** [=] Aucun import réciproque de ce JSON n'existe.
- **ST-PROF-07.6** [!] Seuls les nœuds de type `item` sont exportés. Aujourd'hui, tous les enfants de la liste le sont, y compris une table temporaire, ce qui fait échouer l'export.
- **ST-PROF-07.7** [!] Un item sans nœud Inputs ou Outputs est exporté avec un tableau vide, au lieu de faire échouer l'export.
- **ST-PROF-07.8** [!] Le fichier est servi en `application/json` UTF-8. Aujourd'hui, le type MIME est invalide (`.json`).
- **ST-PROF-07.9** [!] L'export ne vide plus la table temporaire comme effet de bord.
- **ST-PROF-07.10** [!] Une seule implémentation de l'export : les deux fonctions identiques sont fusionnées.
- **ST-PROF-07.11** [+] JSON indenté pour être lisible ; le format des champs est inchangé.
- **ST-PROF-07.12** [recette] Chaque champ est confronté aux relations du graphe.
- **ST-PROF-07.13** [recette] Item sans entrée ni sortie.
- **ST-PROF-07.14** [recette] Fichier UTF-8 valide, avec des accents.

### ST-PROF-08 — Définir les entrées/sorties et le rôle maître d'un item
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, fiche d'un item › onglet « Entrées / Sorties »
- **ST-PROF-08.1** [=] Modifier la convention de nommage BIM et l'indicateur « Maître ».
- **ST-PROF-08.2** [=] Liste des valeurs BACnet disponibles du profil (famille, nom, IDX), avec une recherche par nom.
- **ST-PROF-08.3** [=] Associer ou dissocier des entrées, et associer ou dissocier des sorties.
- **ST-PROF-08.4** [=] Colonnes : famille (titre de type `AV_` + IDX+1), nom, IDX.
- **ST-PROF-08.5** [=] Enregistrer remplace l'ensemble des liens `hasInput` (sous Inputs) et `hasOutput` (sous Outputs) de l'item par la sélection.
- **ST-PROF-08.6** [=] Les valeurs BACnet existantes sont liées, jamais copiées.
- **ST-PROF-08.7** [!] La convention et le maître sont enregistrés dans les attributs `default` (`namingConvention`, `maitre`), que lisent la fiche et le rapprochement ST-IOT-09. Aujourd'hui, seules les informations du nœud sont modifiées : le changement n'apparaît pas à la réouverture et n'est pas pris en compte.
- **ST-PROF-08.8** [!] Un item importé d'un BOG, sans information `namingConvention`, se modifie sans erreur.
- **ST-PROF-08.9** [!] Fermer sans enregistrer ne modifie rien.
- **ST-PROF-08.10** [+] Barre d'état : « 3 entrées, 5 sorties », et modifications en attente marquées jusqu'à l'enregistrement.
- **ST-PROF-08.11** [+] Préfixes génériques complets : `NV_`, `AV_`, `AI_`, `AO_`, `BV_`, `BI_`, `BO_`, `MSV_`, `MSI_`, `MSO_`, et non « undefined_ ».
- **ST-PROF-08.12** [recette] Plusieurs entrées et sorties.
- **ST-PROF-08.13** [recette] Recherche sans candidat.
- **ST-PROF-08.14** [recette] Enregistrement, puis réouverture.
- **ST-PROF-08.15** [recette] Changement de maître relu dans la fiche et dans l'export JSON.
- **ST-PROF-08.16** [recette] Annulation sans modification non désirée.

### ST-PROF-09 — Classer les points d'un item en mesures, alarmes et commandes
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, fiche d'un item › onglet « Mesures · Alarmes · Commandes »
- **ST-PROF-09.1** [=] Liste des valeurs BACnet disponibles du profil (hors Network Values), avec titre générique, nom et IDX.
- **ST-PROF-09.2** [=] Recherche par titre générique ou par nom, sans tenir compte de la casse.
- **ST-PROF-09.3** [=] Ajouter ou retirer des valeurs dans trois catégories : Mesures, Alarmes, Commandes.
- **ST-PROF-09.4** [=] Une mesure est liée par `hasMeasure` sous Measures, et dans la supervision globale sous l'intervalle « Not Monitored » des mesures (`hasIntervalTime`).
- **ST-PROF-09.5** [=] Une alarme est liée par `hasAlarm` sous Alarms, et sous l'intervalle « Not Monitored » des alarmes.
- **ST-PROF-09.6** [=] Une commande est liée par `hasCommand` sous Commands, et dans la liste globale des commandes (`hasGlobalCommand`).
- **ST-PROF-09.7** [=] Retirer une valeur retire ses liens locaux et globaux ; le point n'est jamais supprimé.
- **ST-PROF-09.8** [=] Classer une valeur en commande ne déclenche aucune écriture BACnet (pilotage : ST-MES-02).
- **ST-PROF-09.9** [!] Retirer une commande retire le lien `hasCommand` de son vrai parent. Aujourd'hui, le code vise le parent des alarmes (`parentSupervisionAlarms`).
- **ST-PROF-09.10** [!] Un intervalle « Not Monitored » absent donne une erreur claire, ou est recréé, au lieu de faire échouer l'enregistrement.
- **ST-PROF-09.11** [!] Plus d'écriture tant que la fenêtre n'est pas validée.
- **ST-PROF-09.12** [+] Trois listes côte à côte, avec glisser-déposer depuis les valeurs disponibles.
- **ST-PROF-09.13** [+] Un point classé ailleurs dans le même item est signalé.
- **ST-PROF-09.14** [recette] Ajout puis retrait dans chaque catégorie.
- **ST-PROF-09.15** [recette] Cohérence locale et globale : le point apparaît dans ST-PROF-11.
- **ST-PROF-09.16** [recette] Un simple déclassement ne supprime aucun point.
- **ST-PROF-09.17** [recette] Retrait d'une commande sans exception ni mauvaise suppression.

### ST-PROF-10 — Configurer les périodicités de surveillance d'un item ou du dispositif
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, fiche d'un item › onglet « Surveillance » (et section Supervision)
- **ST-PROF-10.1** [=] Tableau des sorties surveillables (valeurs liées par `hasOutput`) : nom générique (`AV_`/`BV_`/`MSV_` + IDX+1), nom, item d'origine, intervalle courant.
- **ST-PROF-10.2** [=] L'écran s'ouvre depuis un item (ses sorties) ou depuis un nœud `deviceMonitoring` (les sorties de tous les items du dispositif).
- **ST-PROF-10.3** [=] Attribuer un intervalle choisi dans la liste.
- **ST-PROF-10.4** [=] Créer un intervalle en millisecondes. Une valeur déjà présente est refusée.
- **ST-PROF-10.5** [=] « Désactiver la surveillance » d'une ligne, et « Vider la configuration » pour toutes.
- **ST-PROF-10.6** [=] Persistance par la relation `hasIntervalTime`, de l'intervalle vers le point. Ces relations sont utilisées par les services de surveillance.
- **ST-PROF-10.7** [!] L'enregistrement fonctionne : aujourd'hui, la fonction de liaison appelée est commentée dans le code, et « Enregistrer » échoue.
- **ST-PROF-10.8** [!] La liste des intervalles se lit sur le bon nœud. Aujourd'hui, la lecture attend la supervision globale mais reçoit le nœud `deviceMonitoring`.
- **ST-PROF-10.9** [!] Les arguments de la création d'intervalle sont dans le bon ordre. Aujourd'hui, la valeur et le nœud parent sont inversés.
- **ST-PROF-10.10** [!] L'intervalle courant est lu dans la catégorie réellement écrite (`Supervision`), et pas seulement dans `Monitoring`. Aujourd'hui, il s'affiche « null ».
- **ST-PROF-10.11** [!] Les bases existantes qui ont un nœud `deviceMonitoring` (`hasMonitoringNode`) restent lisibles et éditables, alors que la génération actuelle n'en crée plus.
- **ST-PROF-10.12** [+] Même tableau que la supervision globale (ST-PROF-11), filtré sur l'item.
- **ST-PROF-10.13** [+] Changer d'intervalle, désactiver et vider : modifications en attente jusqu'à « Enregistrer », avec « Annuler les modifications ».
- **ST-PROF-10.14** [+] Choix d'intervalle : Non surveillé, COV, 5 s, 30 s, 1 min, 5 min, 30 min, 1 h, plus les intervalles personnalisés. Les intervalles déjà présents sont conservés.
- **ST-PROF-10.15** [recette] Intervalle existant.
- **ST-PROF-10.16** [recette] Nouvel intervalle.
- **ST-PROF-10.17** [recette] Arrêt d'un point, puis arrêt de tous.
- **ST-PROF-10.18** [recette] Changement d'intervalle : le point garde son identité.
- **ST-PROF-10.19** [recette] Ouverture depuis un item, puis depuis un nœud `deviceMonitoring` hérité.

### ST-PROF-11 — Configurer la supervision globale des mesures, alarmes et commandes
Destination : Atelier Réseaux et GTB › b) Bibliothèque de profils, « Supervision »
- **ST-PROF-11.1** [=] Squelette créé une fois par dispositif modèle : « Supervision » (`globalDeviceSupervision`, `hasGlobalSupervision`).
- **ST-PROF-11.2** [=] Ce squelette contient « Measures » (`deviceGlobalMeasures`, `hasGlobalMeasures`), « Alarms » (`deviceGlobalAlarms`, `hasGlobalAlarms`) et « Commands » (`deviceGlobalCommands`, `hasGlobalCommands`).
- **ST-PROF-11.3** [=] Intervalles par défaut, pour les mesures et pour les alarmes : nœuds `supervisionIntervalTime` (`hasIntervalTimeNode`), attributs de catégorie `Supervision`.
- **ST-PROF-11.4** [=] « Not Monitored » : `Monitoring = false`, `IntervalTime = 0`.
- **ST-PROF-11.5** [=] « COV » : `Monitoring = true`, `IntervalTime = "COV"`.
- **ST-PROF-11.6** [=] « 5000 » : `Monitoring = true`, `IntervalTime = 5000` ms.
- **ST-PROF-11.7** [=] Vue consolidée en trois onglets : Mesures, Alarmes, Commandes.
- **ST-PROF-11.8** [=] Colonnes : nom générique (préfixe de famille + IDX+1), nom, item d'origine, et intervalle pour les mesures et alarmes.
- **ST-PROF-11.9** [=] Mesures et alarmes : affecter un intervalle, créer un intervalle en ms (nœud nommé par la valeur saisie, `Monitoring = true`), désactiver une surveillance.
- **ST-PROF-11.10** [=] Commandes : consultation de la liste regroupée.
- **ST-PROF-11.11** [=] Un changement déplace le lien `hasIntervalTime` vers le nouvel intervalle.
- **ST-PROF-11.12** [=] Un changement émet l'événement `deviceProfileContext-ChangeSupervision`, avec le tag `MODIFIED`, pour les organs à l'écoute.
- **ST-PROF-11.13** [=] Cette configuration sert à l'affectation du profil aux dispositifs BMS.
- **ST-PROF-11.14** [!] Les changements d'alarmes sont réellement enregistrés. Aujourd'hui, la sauvegarde ne traite que les mesures.
- **ST-PROF-11.15** [!] Le bouton de remise à zéro des alarmes fonctionne, ou est retiré : il appelle une méthode dont l'implémentation est commentée.
- **ST-PROF-11.16** [!] Préfixes génériques complets (`BO_`, `MSO_`, `BLO_`, boucle, chaîne de bits) au lieu de « undefined_type_ ».
- **ST-PROF-11.17** [!] La saisie d'un intervalle non numérique est refusée. Aujourd'hui, `parseInt` donne NaN.
- **ST-PROF-11.18** [!] La fermeture sans enregistrement n'écrit rien.
- **ST-PROF-11.19** [+] Choix d'intervalle : Non surveillé, COV, 5 s, 30 s, 1 min, 5 min, 30 min, 1 h, plus les intervalles personnalisés.
- **ST-PROF-11.20** [+] Les intervalles déjà présents sont conservés même s'ils ne sont pas dans la liste par défaut.
- **ST-PROF-11.21** [+] Durées affichées en clair (« 5 s ») ; la valeur enregistrée reste en millisecondes.
- **ST-PROF-11.22** [+] Colonne « Historisation » (oui ou non).
- **ST-PROF-11.23** [+] Filtre par nom.
- **ST-PROF-11.24** [+] « Appliquer aux lignes affichées ».
- **ST-PROF-11.25** [+] Glisser-déposer de lignes vers un intervalle.
- **ST-PROF-11.26** [+] « Surveiller » n'est pas présenté comme « mesures reçues » : un intervalle est une intention de collecte, pas une preuve de connectivité.
- **ST-PROF-11.27** [+] Configuration relue et réenregistrée sans perte : les champs inconnus sont conservés.
- **ST-PROF-11.28** [recette] Réouverture des trois onglets.
- **ST-PROF-11.29** [recette] Modification des mesures, puis des alarmes, relue après rechargement.
- **ST-PROF-11.30** [recette] Valeurs « Not Monitored », COV et intervalles périodiques.
- **ST-PROF-11.31** [recette] Création d'un intervalle personnalisé, puis réaffectation.
- **ST-PROF-11.32** [recette] Un organ à l'écoute reçoit l'événement de modification.

## 8. Réseaux : connecteurs, points de contrôle, liens

### ST-BAC-01 — Créer un contexte BMS et y référencer les organs disponibles
Destination : Atelier Réseaux et GTB › Connecteurs (contexte BMS)
- **ST-BAC-01.1** [=] Créer un contexte de type `Network` (contexte BMS) avec un nom.
- **ST-BAC-01.2** [=] Lister les organs disponibles via le service (`getOrgans`), lus dans `/etc/Organs`.
- **ST-BAC-01.3** [=] Pour chaque organ, bouton « Référencer » s'il n'est pas encore dans le contexte, « Retirer » s'il y est déjà (`addToReference`, `removeToReference`).
- **ST-BAC-01.4** [=] Le bouton indique à tout moment si l'organ est déjà référencé dans ce contexte.
- **ST-BAC-01.5** [=] La référence est persistante dans le graphe : elle organise les connecteurs, rien de plus.
- **ST-BAC-01.6** [+] Afficher l'état de chaque organ : en ligne ou « Sans réponse de l'organ ».
- **ST-BAC-01.7** [+] Texte explicite : « Référencer un organ ne l'installe pas et ne démarre pas son processus ».
- **ST-BAC-01.8** [+] Liste vide : « Aucun organ disponible », avec la cause (aucun organ déclaré dans `/etc/Organs`).
- **ST-BAC-01.9** [+] « Retirer » passe par la confirmation de portée : seul le lien est retiré, l'organ et ses réseaux ne sont pas supprimés.
- **ST-BAC-01.10** [!] Référencer un organ réutilise son modèle existant : un même modèle n'est jamais recréé à chaque rattachement.
- **ST-BAC-01.11** [recette] Aucun organ disponible : état vide explicite.
- **ST-BAC-01.12** [recette] Organ déjà lié : bouton « Retirer » affiché, pas de second lien possible.
- **ST-BAC-01.13** [recette] Ajouter, retirer, rajouter, puis fermer et rouvrir : état identique et un seul modèle d'organ dans le graphe.

### ST-BAC-02 — Créer un sous-réseau BACnet
Destination : Atelier Réseaux et GTB › Connecteurs › BACnet
- **ST-BAC-02.1** [=] Action « Créer un sous-réseau » disponible uniquement sous un organ BACnet autorisé.
- **ST-BAC-02.2** [=] Saisir un nom ; le nom est obligatoire.
- **ST-BAC-02.3** [=] Crée un `SpinalBmsNetwork` relié dans le contexte par la relation du modèle BMS.
- **ST-BAC-02.4** [=] Le sous-réseau sert de conteneur persistant pour ranger et découvrir des équipements.
- **ST-BAC-02.5** [!] Un nom composé seulement d'espaces est refusé (nom nettoyé avant contrôle).
- **ST-BAC-02.6** [+] Le bouton « Créer » reste désactivé tant que le nom est vide, avec la raison.
- **ST-BAC-02.7** [recette] Annuler : rien n'est créé.
- **ST-BAC-02.8** [recette] Nom fait d'espaces seuls : refusé.
- **ST-BAC-02.9** [recette] Créer puis recharger le graphe : sous-réseau présent sous l'organ, avec la bonne relation.
- **ST-BAC-02.10** [recette] Le sous-réseau créé est une destination valide de « Déplacer des dispositifs » (ST-ORG-03).

### ST-BAC-03 — Découvrir des dispositifs par broadcast ou unicast
Destination : Atelier Réseaux et GTB › Connecteurs › BACnet › Découverte
- **ST-BAC-03.1** [=] Champ « Nom du réseau » à créer par la découverte.
- **ST-BAC-03.2** [=] Choix du mode : Broadcast ou Unicast.
- **ST-BAC-03.3** [=] Broadcast : adresse préremplie `255.255.255.255`, modifiable.
- **ST-BAC-03.4** [=] Broadcast : port prérempli `47808`, modifiable.
- **ST-BAC-03.5** [=] Unicast : liste de lignes « adresse + Device ID ».
- **ST-BAC-03.6** [=] Unicast : ajouter une ligne, retirer une ligne, réinitialiser la liste.
- **ST-BAC-03.7** [=] Unicast : import d'un classeur XLSX, toutes les feuilles lues.
- **ST-BAC-03.8** [=] Import XLSX : colonne `address` reconnue sans tenir compte de la casse.
- **ST-BAC-03.9** [=] Import XLSX : colonne `deviceid` reconnue sans tenir compte de la casse, et aussi écrite avec un espace (« Device ID »).
- **ST-BAC-03.10** [=] Lancer la découverte crée un `SpinalDiscoverModel` persistant (demande de découverte) à destination de l'organ.
- **ST-BAC-03.11** [=] Les dispositifs trouvés reviennent de manière asynchrone, écrits par l'organ.
- **ST-BAC-03.12** [+] La découverte apparaît dans le plateau des tâches, avec « Demande envoyée » distincte de l'état rapporté par l'organ.
- **ST-BAC-03.13** [+] Aperçu de l'import XLSX avant ajout : lignes retenues, lignes écartées avec leur raison (adresse vide, Device ID non numérique, feuille sans colonne reconnue).
- **ST-BAC-03.14** [+] Contrôle du format d'adresse IP et du port (1 à 65535) avant lancement.
- **ST-BAC-03.15** [+] Organ absent ou ne répondant pas : état « Sans réponse de l'organ » au-delà du délai, sans fausse réussite.
- **ST-BAC-03.16** [recette] Mode broadcast avec valeurs par défaut.
- **ST-BAC-03.17** [recette] Mode broadcast avec un port spécifique différent de `47808`.
- **ST-BAC-03.18** [recette] Mode unicast avec plusieurs lignes saisies à la main.
- **ST-BAC-03.19** [recette] Import XLSX de plusieurs lignes réparties sur plusieurs feuilles.
- **ST-BAC-03.20** [recette] Import XLSX avec lignes invalides et en-têtes de casse différente.
- **ST-BAC-03.21** [recette] Découverte sans aucun résultat : message clair, pas d'erreur.
- **ST-BAC-03.22** [recette] Organ absent : demande enregistrée, état « Sans réponse de l'organ ».

### ST-BAC-04 — Sélectionner les résultats et créer le réseau découvert
Destination : Atelier Réseaux et GTB › Connecteurs › BACnet › Découverte (résultats)
- **ST-BAC-04.1** [=] Tableau des dispositifs trouvés : nom, Device ID, adresse.
- **ST-BAC-04.2** [=] Case à cocher par dispositif, et « Tout cocher ».
- **ST-BAC-04.3** [=] Bouton « Créer » : le modèle de découverte reçoit l'arbre à créer et l'état de création ; l'organ réalise la création BMS.
- **ST-BAC-04.4** [=] États affichés : Découverte · Attente · Délai dépassé · Terminé · Erreur.
- **ST-BAC-04.5** [=] Actions « Arrêter » et « Relancer » la découverte.
- **ST-BAC-04.6** [=] Modifier un paramètre réseau (nom, mode, adresse, port, liste unicast) annule la découverte en cours.
- **ST-BAC-04.7** [+] Avertir avant de modifier un paramètre si une découverte est en cours : « Modifier ce champ annule la découverte ».
- **ST-BAC-04.8** [+] Les états sont mappés sur les statuts communs (En attente, En cours, Terminé, Erreur, Annulé, Arrêté) avec icône et libellé.
- **ST-BAC-04.9** [+] Bilan de création par dispositif dans le plateau des tâches (créé, déjà présent, erreur).
- **ST-BAC-04.10** [!] Fermer le panneau et le détruire ont le même nettoyage : abonnements retirés, aucune opération fantôme au retour.
- **ST-BAC-04.11** [?] Politique de dédoublonnage quand un réseau existant est redécouvert : non prouvée côté UI, à établir avec l'organ et à afficher.
- **ST-BAC-04.12** [recette] Création partielle : seuls les dispositifs cochés sont créés.
- **ST-BAC-04.13** [recette] Nouvelle découverte d'un réseau déjà existant : pas de doublon silencieux.
- **ST-BAC-04.14** [recette] Délai dépassé puis Relancer : la découverte repart proprement.
- **ST-BAC-04.15** [recette] Arrêter, fermer, rouvrir : aucune découverte ni création fantôme.

### ST-BAC-05 — Récupérer les valeurs/objets BACnet d'une sélection de dispositifs
Destination : Atelier Réseaux et GTB › Connecteurs › BACnet › Lire les objets
- **ST-BAC-05.1** [=] Choisir les familles d'objets à lire (cases à cocher).
- **ST-BAC-05.2** [=] Familles analogiques : Analog Input, Analog Output, Analog Value.
- **ST-BAC-05.3** [=] Familles binaires : Binary Input, Binary Output, Binary Value, Binary Lighting Output.
- **ST-BAC-05.4** [=] Familles multi-états : Multistate Input, Multistate Output, Multistate Value.
- **ST-BAC-05.5** [=] Autres familles : Bitstring Value, Loop.
- **ST-BAC-05.6** [=] Liste des familles issue de la constante `SENSOR_TYPES` (codes inchangés).
- **ST-BAC-05.7** [=] Périmètre : dispositifs d'une sélection (dispositif, réseau ou organ choisi).
- **ST-BAC-05.8** [=] Lancer dépose un `SpinalBacnetValueModel` par dispositif, exécuté par l'organ.
- **ST-BAC-05.9** [=] Les dispositifs sont traités l'un après l'autre (séquentiel).
- **ST-BAC-05.10** [=] État par dispositif : en attente, récupération, progression, succès, erreur.
- **ST-BAC-05.11** [=] Résultat : points du réseau créés ou complétés.
- **ST-BAC-05.12** [+] La lecture est une tâche du plateau ; fermer l'écran ne l'arrête pas.
- **ST-BAC-05.13** [!] Annulation explicite : « Annuler » stoppe les dispositifs suivants et dit si la demande déjà en cours peut encore aboutir (pas d'annulation garantie côté organ).
- **ST-BAC-05.14** [+] « Relancer les échecs » pour les seuls dispositifs en erreur.
- **ST-BAC-05.15** [recette] Chaque famille réellement disponible sur un équipement de test.
- **ST-BAC-05.16** [recette] Famille cochée absente de l'équipement : pas d'erreur bloquante, résultat vide signalé.
- **ST-BAC-05.17** [recette] Plusieurs dispositifs dont un en erreur : les autres aboutissent.
- **ST-BAC-05.18** [recette] Récupération répétée : pas de points en double.
- **ST-BAC-05.19** [recette] Les points créés correspondent au dispositif réel interrogé.

### ST-BAC-06 — Affecter ou détacher un profil métier aux dispositifs BACnet
Destination : Atelier Réseaux et GTB › Connecteurs › Surveillance (profil affecté)
- **ST-BAC-06.1** [=] Choisir le contexte de profils.
- **ST-BAC-06.2** [=] Choisir le profil (`device_profile`).
- **ST-BAC-06.3** [=] Choisir le dispositif modèle du profil.
- **ST-BAC-06.4** [=] Choisir le périmètre BMS ; la liste des dispositifs vient du parcours du sous-arbre sélectionné.
- **ST-BAC-06.5** [=] « Affecter » : associe le modèle métier aux dispositifs physiques (`linkProfilToBmsDevice`).
- **ST-BAC-06.6** [=] « Détacher » : retire l'association (`unLinkProfilToBmsDevice`).
- **ST-BAC-06.7** [=] Le lien est utilisé par la surveillance et par le rapprochement avec les automates BIM.
- **ST-BAC-06.8** [+] Avant d'affecter, afficher les dispositifs déjà dotés d'un profil et ce qui sera remplacé.
- **ST-BAC-06.9** [+] « Détacher » passe par la confirmation de portée : les points physiques et leurs historiques sont conservés.
- **ST-BAC-06.10** [recette] Affecter à un dispositif, puis à plusieurs.
- **ST-BAC-06.11** [recette] Dispositif ayant déjà un profil : comportement annoncé et vérifié.
- **ST-BAC-06.12** [recette] Détacher puis réaffecter, puis reprendre la surveillance.
- **ST-BAC-06.13** [recette] Points physiques et historiques intacts après chaque opération.

### ST-BAC-07 — Démarrer, arrêter ou redémarrer la surveillance
Destination : Atelier Réseaux et GTB › Connecteurs › Surveillance (onglet par réseau)
- **ST-BAC-07.1** [=] Tableau des dispositifs du périmètre, avec profil affecté et état.
- **ST-BAC-07.2** [=] États historiques `Running` / `Stopped`, affichés « Surveillé » / « Arrêté » ; « Sans profil » si aucun profil.
- **ST-BAC-07.3** [=] « Démarrer », « Arrêter », « Redémarrer » par dispositif.
- **ST-BAC-07.4** [=] « Tout démarrer », « Tout arrêter », « Tout redémarrer » sur le périmètre affiché.
- **ST-BAC-07.5** [=] Un profil est requis pour démarrer ; sans profil, l'action est indisponible et la raison s'affiche.
- **ST-BAC-07.6** [=] Redémarrer = arrêter, attendre 1,5 s, relancer.
- **ST-BAC-07.7** [=] Démarrer crée ou met à jour le listener et son pointeur de profil (`createOrModifyListenerModel`).
- **ST-BAC-07.8** [=] Le changement de `monitored` est persistant.
- **ST-BAC-07.9** [+] L'état distingue l'intention (`monitored=true`, « Demande envoyée ») de la réception effective de mesures (date de la dernière valeur reçue).
- **ST-BAC-07.10** [+] Listener qui ne répond pas : état « Sans réponse de l'organ » au-delà du délai.
- **ST-BAC-07.11** [+] Actions globales : confirmation avec le nombre de dispositifs touchés et les exclus (sans profil) ; bilan dans le plateau.
- **ST-BAC-07.12** [recette] Dispositif sans profil : action indisponible, raison affichée.
- **ST-BAC-07.13** [recette] Listener absent (créé au démarrage) et listener existant (mis à jour).
- **ST-BAC-07.14** [recette] Changer de profil puis reprendre : le listener pointe le nouveau profil.
- **ST-BAC-07.15** [recette] Actions globales sur un réseau mêlant dispositifs avec et sans profil.
- **ST-BAC-07.16** [recette] Listener qui ne répond pas : pas d'état « Surveillé » trompeur.

### ST-BAC-08 — Activer/désactiver l'enregistrement des séries temporelles
Destination : Atelier Réseaux et GTB › Connecteurs › Surveillance (colonne « Historiser »)
- **ST-BAC-08.1** [=] Case « Historiser » (`Save TimeSeries`) par dispositif.
- **ST-BAC-08.2** [=] « Tout historiser » / « Ne plus rien historiser » pour tous les dispositifs affichés.
- **ST-BAC-08.3** [=] Écrit `listener.saveTimeSeries` (création ou modification).
- **ST-BAC-08.4** [=] Désactiver arrête l'enregistrement futur ; aucune purge d'historique.
- **ST-BAC-08.5** [!] Cocher la case sur un dispositif sans listener crée ou configure le listener (aujourd'hui, le drapeau est perdu).
- **ST-BAC-08.6** [+] Texte explicite : « Les mesures déjà enregistrées sont conservées ».
- **ST-BAC-08.7** [+] L'action globale annonce qu'elle porte sur les seules lignes affichées (filtre compris).
- **ST-BAC-08.8** [recette] Drapeau conservé après fermeture et réouverture.
- **ST-BAC-08.9** [recette] Dispositif sans listener : listener créé avec le bon drapeau.
- **ST-BAC-08.10** [recette] Désactivation : données passées conservées.
- **ST-BAC-08.11** [recette] Réactivation : de nouveaux points arrivent dans la série.

### ST-BAC-09 — Demander le redémarrage d'un organ et localiser les objets BIM liés
Destination : Atelier Réseaux et GTB › Connecteurs (« Redémarrer l'organ », « Localiser les objets BIM liés »)
- **ST-BAC-09.1** [=] Lister les organs concernés par le périmètre.
- **ST-BAC-09.2** [=] « Redémarrer l'organ » positionne `organ.restart=true` (demande persistante).
- **ST-BAC-09.3** [+] L'état affiche « Demande envoyée » puis l'acquittement réel de l'organ, ou « Sans réponse de l'organ » après délai.
- **ST-BAC-09.4** [+] Confirmation avant redémarrage : l'acquisition est interrompue pendant le redémarrage.
- **ST-BAC-09.5** [=] « Localiser les objets BIM liés » depuis un dispositif ou un endpoint compatible : remonte les parents BIM liés.
- **ST-BAC-09.6** [=] Les objets trouvés sont sélectionnés et cadrés dans le viewer.
- **ST-BAC-09.7** [+] Aucun parent BIM : message « Aucun objet BIM lié ».
- **ST-BAC-09.8** [+] Plusieurs parents : tous sélectionnés, regroupés par maquette, avec leur nombre.
- **ST-BAC-09.9** [+] Maquette non chargée : message qui nomme la maquette et propose de charger la scène.
- **ST-BAC-09.10** [recette] Acquittement réel de l'organ vérifié, pas seulement le drapeau.
- **ST-BAC-09.11** [recette] Aucun parent BIM, un parent, plusieurs parents.
- **ST-BAC-09.12** [recette] Maquette non chargée.

### ST-OPC-01 — Créer un sous-réseau et préparer une découverte multi-passerelles
Destination : Atelier Réseaux et GTB › Connecteurs › OPC UA
- **ST-OPC-01.1** [=] Créer un sous-réseau nommé sous un organ OPC UA (nom obligatoire).
- **ST-OPC-01.2** [=] Lancer la découverte depuis l'organ ou depuis un réseau de cet organ.
- **ST-OPC-01.3** [=] Champ « Nom du réseau ».
- **ST-OPC-01.4** [=] Liste de passerelles, chaque ligne : adresse, port, endpoint.
- **ST-OPC-01.5** [=] Ajouter et retirer des lignes de passerelles.
- **ST-OPC-01.6** [=] Import XLSX multi-feuilles des passerelles.
- **ST-OPC-01.7** [=] Préparation de `serverInfo`, puis création du modèle de découverte à destination de l'organ.
- **ST-OPC-01.8** [!] Pas de valeurs préremplies d'un site particulier : les exemples historiques ne sont pas repris comme valeurs par défaut.
- **ST-OPC-01.9** [+] Contrôle de l'adresse et du port de chaque ligne avant lancement ; aperçu de l'import avec lignes écartées et raison.
- **ST-OPC-01.10** [?] Certificats et authentification OPC UA : aucun écran existant ; décider s'ils entrent dans le périmètre (ne pas les présenter comme acquis).
- **ST-OPC-01.11** [recette] Deux passerelles dans la même découverte.
- **ST-OPC-01.12** [recette] Endpoint renseigné.
- **ST-OPC-01.13** [recette] Import XLSX.
- **ST-OPC-01.14** [recette] Adresse invalide refusée.
- **ST-OPC-01.15** [recette] Lancement depuis un sous-réseau existant.

### ST-OPC-02 — Découvrir, filtrer l'arbre et créer les nœuds OPC UA
Destination : Atelier Réseaux et GTB › Connecteurs › OPC UA › Découverte
- **ST-OPC-02.1** [=] Démarrer, annuler et relancer une découverte.
- **ST-OPC-02.2** [=] Compteurs : total, terminés, échecs.
- **ST-OPC-02.3** [=] En état `pending`, l'organ demande un choix : l'interface l'affiche et transmet la réponse.
- **ST-OPC-02.4** [=] Arbre découvert affiché, branches et nœuds à cocher.
- **ST-OPC-02.5** [=] Cocher une branche emporte tout son sous-arbre.
- **ST-OPC-02.6** [=] Cocher des feuilles conserve leurs ancêtres nécessaires.
- **ST-OPC-02.7** [=] L'arbre est filtré par `nodeId` avant envoi.
- **ST-OPC-02.8** [=] Modèle `SpinalOPCUADiscoverModel`, transitions `readyToDiscover`, `readyToCreate`, `created`.
- **ST-OPC-02.9** [=] « Créer » transmet l'arbre filtré ; l'organ crée les nœuds.
- **ST-OPC-02.10** [+] La découverte et la création sont des tâches du plateau, avec états communs.
- **ST-OPC-02.11** [!] Le désabonnement de la progression porte sur `progress` (aujourd'hui fait sur `state`).
- **ST-OPC-02.12** [!] La fermeture vérifie l'existence du modèle avant d'y accéder (aujourd'hui sans garde dans `beforeDestroy`).
- **ST-OPC-02.13** [?] Étape « Choix de l'entrypoint » : commentée dans l'enchaînement actif ; décider si elle est reprise.
- **ST-OPC-02.14** [recette] Arbre profond.
- **ST-OPC-02.15** [recette] Sélection partielle : seuls les nœuds cochés et leurs ancêtres sont créés.
- **ST-OPC-02.16** [recette] Annulation, retour arrière.
- **ST-OPC-02.17** [recette] Demande intermédiaire de l'organ (`pending`) traitée.
- **ST-OPC-02.18** [recette] Fin de création puis fermeture, plusieurs fois de suite, sans erreur.

### ST-OPC-03 — Générer un profil de surveillance depuis un dispositif
Destination : Atelier Réseaux et GTB › Bibliothèque de profils › « Générer depuis un dispositif découvert »
- **ST-OPC-03.1** [=] Disponible sur un `BmsDevice` rattaché à un organ OPC UA.
- **ST-OPC-03.2** [=] Nom du profil : celui du dispositif par défaut, ou un nom saisi.
- **ST-OPC-03.3** [=] Parcourt les endpoints du dispositif pour constituer les items.
- **ST-OPC-03.4** [=] Crée le contexte dédié `OPCdeviceProfileContext` s'il n'existe pas.
- **ST-OPC-03.5** [=] Crée le profil `OPCUADeviceProfile`, sa liste d'items et sa supervision.
- **ST-OPC-03.6** [=] Le profil est réutilisable sur d'autres dispositifs.
- **ST-OPC-03.7** [+] Tâche avec bilan : nombre d'items créés.
- **ST-OPC-03.8** [+] Nom déjà utilisé : avertissement avant création.
- **ST-OPC-03.9** [recette] Noms d'endpoints, identifiants réseau et nombre d'items conservés.
- **ST-OPC-03.10** [recette] Dispositif sans point : message, pas de profil vide silencieux.
- **ST-OPC-03.11** [recette] Nom personnalisé.
- **ST-OPC-03.12** [recette] Doublon de nom.

### ST-OPC-04 — Répartir les points entre intervalles de surveillance
Destination : Atelier Réseaux et GTB › Bibliothèque de profils › Supervision
- **ST-OPC-04.1** [=] Recherche des endpoints du profil par nom, sans distinction de casse.
- **ST-OPC-04.2** [=] Sélectionner un, plusieurs ou tous les résultats.
- **ST-OPC-04.3** [=] Affecter à un intervalle par action ou par glisser-déposer.
- **ST-OPC-04.4** [=] Intervalles proposés au départ : COV (0), 30 s, 1 min, 5 min.
- **ST-OPC-04.5** [=] Créer un intervalle personnalisé : nom et valeur numérique.
- **ST-OPC-04.6** [=] Retirer un point d'un intervalle.
- **ST-OPC-04.7** [=] Retirer un intervalle : ses points reviennent dans la liste disponible.
- **ST-OPC-04.8** [=] Écrit les relations des items vers les intervalles dans la supervision et met à jour `indirectModificationDate`.
- **ST-OPC-04.9** [+] Liste d'intervalles commune aux protocoles : Non surveillé, COV, 5 s, 30 s, 1 min, 5 min, 30 min, 1 h, plus les personnalisés.
- **ST-OPC-04.10** [+] Les intervalles déjà présents dans le profil sont conservés même s'ils ne sont pas dans la liste par défaut.
- **ST-OPC-04.11** [+] « Appliquer aux lignes affichées » après filtre, avec le nombre de lignes concernées.
- **ST-OPC-04.12** [!] Retirer un intervalle existant le supprime réellement à l'enregistrement (aujourd'hui absent du différentiel persistant).
- **ST-OPC-04.13** [recette] Réouverture après chaque opération : état identique.
- **ST-OPC-04.14** [recette] Filtre puis sélection globale : seules les lignes filtrées sont touchées.
- **ST-OPC-04.15** [recette] Déplacer des points d'un intervalle à un autre.
- **ST-OPC-04.16** [recette] Supprimer un intervalle existant puis rouvrir : il a disparu.
- **ST-OPC-04.17** [recette] Intervalle personnalisé créé, utilisé, relu.

### ST-OPC-05 — Affecter un profil et gérer surveillance/historisation
Destination : Atelier Réseaux et GTB › Connecteurs › Surveillance (OPC UA)
- **ST-OPC-05.1** [=] Choisir un profil existant pour un dispositif OPC UA.
- **ST-OPC-05.2** [=] L'ancien rattachement est remplacé (`_removeOldProfile`) ; relation `hasProfile`.
- **ST-OPC-05.3** [=] Démarrer, arrêter, redémarrer les dispositifs d'un réseau ou le dispositif choisi, un par un ou tous.
- **ST-OPC-05.4** [=] Activer ou désactiver l'historisation (`saveTimeSeries`), un par un ou tous.
- **ST-OPC-05.5** [=] États : Sans profil · Surveillé · Arrêté.
- **ST-OPC-05.6** [=] Modèle `SpinalOPCUAListener`, champ `monitored`.
- **ST-OPC-05.7** [=] La reprise met à jour le pointeur du listener vers le profil courant.
- **ST-OPC-05.8** [!] Le message de succès n'apparaît qu'une fois toutes les liaisons terminées (promesses attendues ensemble).
- **ST-OPC-05.9** [+] Remplacement de profil annoncé dans la confirmation (« remplace le profil X »).
- **ST-OPC-05.10** [+] État distinguant intention de surveillance et mesures effectivement reçues.
- **ST-OPC-05.11** [recette] Profil changé pendant l'arrêt, puis reprise : le nouveau profil est utilisé.
- **ST-OPC-05.12** [recette] Listener existant réutilisé.
- **ST-OPC-05.13** [recette] Opérations globales.
- **ST-OPC-05.14** [recette] Historisation relue après réouverture et points effectivement reçus.

### ST-SNMP-01 — Préparer et lancer une découverte avec MIB
Destination : Atelier Réseaux et GTB › Connecteurs › SNMP
- **ST-SNMP-01.1** [=] Créer un sous-réseau SNMP nommé sous un organ.
- **ST-SNMP-01.2** [=] Liste de réseaux, chaque ligne : nom, adresse `ip:port`, fichier MIB téléversé.
- **ST-SNMP-01.3** [=] Ajouter et retirer des lignes.
- **ST-SNMP-01.4** [=] Lancer la découverte depuis l'organ ou depuis un sous-réseau.
- **ST-SNMP-01.5** [=] Modèle `SpinalSNMPDiscover` soumis à l'organ avec les informations réseau et MIB.
- **ST-SNMP-01.6** [=] Progression, annuler, réessayer.
- **ST-SNMP-01.7** [+] Contrôle de chaque ligne : nom non vide, `ip:port` valide, MIB présente.
- **ST-SNMP-01.8** [!] Le lancement depuis un sous-réseau existant fonctionne (aujourd'hui écriture de `serverInfo.name` alors que seul `networks` existe).
- **ST-SNMP-01.9** [?] SNMPv3 (utilisateur, authentification, chiffrement) : non exposé aujourd'hui ; décider s'il entre dans le périmètre.
- **ST-SNMP-01.10** [recette] MIB valide, invalide, absente.
- **ST-SNMP-01.11** [recette] Plusieurs réseaux dans la même découverte.
- **ST-SNMP-01.12** [recette] Organ indisponible : « Sans réponse de l'organ ».
- **ST-SNMP-01.13** [recette] Lancement depuis l'organ, puis depuis un sous-réseau.

### ST-SNMP-02 — Choisir les OID découverts et créer la structure BMS
Destination : Atelier Réseaux et GTB › Connecteurs › SNMP › Découverte
- **ST-SNMP-02.1** [=] Arbre découvert affiché, sélection par OID.
- **ST-SNMP-02.2** [=] Cocher une branche emporte son sous-arbre ; cocher des feuilles garde leurs ancêtres.
- **ST-SNMP-02.3** [=] La sélection filtrée est transmise pour création (`filterTree`, `createNodes`).
- **ST-SNMP-02.4** [=] État de création et résultat affichés.
- **ST-SNMP-02.5** [=] L'organ crée l'arbre BMS à partir du modèle de découverte ; réinitialisation possible (`resetSpinalDiscover`).
- **ST-SNMP-02.6** [!] Désabonnement de la progression sur `progress` et garde à la fermeture (même anomalie qu'OPC UA).
- **ST-SNMP-02.7** [non] Import XLSX des réseaux SNMP : commenté dans l'existant, pas une action accessible.
- **ST-SNMP-02.8** [recette] Sous-arbre complet.
- **ST-SNMP-02.9** [recette] Feuilles de branches différentes.
- **ST-SNMP-02.10** [recette] OID identiques sous des périmètres différents : pas de confusion.
- **ST-SNMP-02.11** [recette] Reprise, puis fermeture après création.

### ST-SNMP-03 — Générer et affecter un profil SNMP
Destination : Atelier Réseaux et GTB › Bibliothèque de profils ; Connecteurs › Surveillance (affectation)
- **ST-SNMP-03.1** [=] Générer un profil nommé à partir des endpoints d'un dispositif SNMP.
- **ST-SNMP-03.2** [=] Profil avec items OID et supervision, rangé dans la bibliothèque SNMP dédiée.
- **ST-SNMP-03.3** [=] Retrouver le profil dans la bibliothèque et l'affecter à un dispositif.
- **ST-SNMP-03.4** [=] L'affectation remplace l'ancien profil du dispositif.
- **ST-SNMP-03.5** [+] Bilan de génération (nombre d'items) et annonce du remplacement avant affectation.
- **ST-SNMP-03.6** [recette] Génération complète.
- **ST-SNMP-03.7** [recette] Affectation à un autre dispositif compatible.
- **ST-SNMP-03.8** [recette] Remplacement de profil puis redémarrage de la surveillance.

### ST-SNMP-04 — Régler intervalle et historisation par OID, individuellement ou en masse
Destination : Atelier Réseaux et GTB › Bibliothèque de profils › Supervision
- **ST-SNMP-04.1** [=] Tableau : OID, nom, intervalle, historisation.
- **ST-SNMP-04.2** [=] Recherche par nom.
- **ST-SNMP-04.3** [=] Modifier l'intervalle ou l'historisation d'un point.
- **ST-SNMP-04.4** [=] Appliquer l'intervalle ou l'historisation aux lignes affichées après filtre.
- **ST-SNMP-04.5** [=] Intervalles par défaut : Non surveillé (-1), COV (0), 5 s, 30 s, 1 min, 5 min, 30 min, 1 h.
- **ST-SNMP-04.6** [=] Les intervalles déjà présents dans le profil sont aussi proposés.
- **ST-SNMP-04.7** [=] Résultat : items classés par intervalle et `info.saveTimeSeries` sur chaque item.
- **ST-SNMP-04.8** [!] La recherche n'ajoute plus de copie factice `Copy of <oid>` : seuls les vrais résultats sont affichés et enregistrés.
- **ST-SNMP-04.9** [+] Intervalle personnalisé possible, comme en OPC UA (aujourd'hui non exposé en SNMP).
- **ST-SNMP-04.10** [+] L'action groupée affiche le nombre de lignes touchées et exclut les lignes masquées par le filtre.
- **ST-SNMP-04.11** [recette] Filtre puis action groupée : seules les vraies lignes filtrées sont touchées.
- **ST-SNMP-04.12** [recette] Lignes non filtrées inchangées.
- **ST-SNMP-04.13** [recette] Réouverture : valeurs conservées.
- **ST-SNMP-04.14** [recette] Chaque périodicité, de Non surveillé à 1 h.
- **ST-SNMP-04.15** [recette] Aucun faux endpoint `Copy of <oid>` proposé ni enregistré.

### ST-SNMP-05 — Piloter la surveillance des dispositifs SNMP
Destination : Atelier Réseaux et GTB › Connecteurs › Surveillance (SNMP)
- **ST-SNMP-05.1** [=] Dispositifs d'un réseau ou un dispositif seul.
- **ST-SNMP-05.2** [=] États : Sans profil · Surveillé · Arrêté.
- **ST-SNMP-05.3** [=] Démarrer, arrêter, redémarrer, un par un ou tous.
- **ST-SNMP-05.4** [=] Redémarrer = arrêter, attendre 1 s, relancer.
- **ST-SNMP-05.5** [=] Crée ou réutilise un `SpinalSNMPListener` ; écrit `monitored`.
- **ST-SNMP-05.6** [=] L'historisation SNMP se règle par point dans le profil (ST-SNMP-04), pas par dispositif.
- **ST-SNMP-05.7** [?] Colonne « Historiser » de l'onglet Surveillance commun : masquer pour SNMP, ou la faire agir sur `info.saveTimeSeries` de tous les items du profil (avec annonce).
- **ST-SNMP-05.8** [+] Intention de surveillance distinguée des mesures effectivement reçues.
- **ST-SNMP-05.9** [recette] Aucun profil : démarrage indisponible, raison affichée.
- **ST-SNMP-05.10** [recette] Premier démarrage : listener créé.
- **ST-SNMP-05.11** [recette] Arrêt puis reprise.
- **ST-SNMP-05.12** [recette] Profil changé puis reprise.
- **ST-SNMP-05.13** [recette] Acquisitions réelles contrôlées.

### ST-ORG-01 — Créer manuellement réseau et dispositif BMS
Destination : Atelier Réseaux et GTB › Connecteurs › Organisation manuelle
- **ST-ORG-01.1** [=] Depuis un contexte `Network` : créer un réseau nommé (`SpinalBmsNetwork`).
- **ST-ORG-01.2** [=] Depuis un `BmsNetwork` : créer un dispositif nommé (`SpinalBmsDevice`).
- **ST-ORG-01.3** [=] Nœud et élément créés, liens `PtrLst` dans le contexte.
- **ST-ORG-01.4** [=] `idNetwork` du dispositif initialisé à son identifiant de nœud.
- **ST-ORG-01.5** [+] Texte : « Cet identifiant n'est pas une adresse matérielle découverte ».
- **ST-ORG-01.6** [!] Nom vide ou fait d'espaces refusé.
- **ST-ORG-01.7** [recette] Réouverture : objets présents.
- **ST-ORG-01.8** [recette] Nom vide refusé.
- **ST-ORG-01.9** [recette] Type, élément et relations cohérents.
- **ST-ORG-01.10** [recette] Objets créés utilisables par les autres outils BMS (surveillance, déplacement, profils).

### ST-ORG-02 — Créer un endpoint typé avec regroupement optionnel
Destination : Atelier Réseaux et GTB › Connecteurs › Organisation manuelle
- **ST-ORG-02.1** [=] Disponible sous un dispositif ou un groupe d'endpoints.
- **ST-ORG-02.2** [=] Champs : nom, chemin, type de donnée, valeur courante, unité.
- **ST-ORG-02.3** [=] Option : groupe d'endpoints nommé (existant ou nouveau).
- **ST-ORG-02.4** [=] Crée un `SpinalBmsEndpoint`, son nœud et la relation d'endpoint ; le parent est trouvé ou créé (`_getParentNode`).
- **ST-ORG-02.5** [=] Type numérique : valeur convertie en nombre.
- **ST-ORG-02.6** [=] Type booléen : accepte true/false, yes/no et nombres.
- **ST-ORG-02.7** [!] Valeur invalide refusée au lieu de devenir `NaN` ou un booléen inattendu ; message sous le champ.
- **ST-ORG-02.8** [!] `0`, `false` et chaîne vide conservés tels quels (pas de confusion avec « absent »).
- **ST-ORG-02.9** [+] Texte : « Un endpoint créé à la main n'est relié à aucun protocole d'acquisition ».
- **ST-ORG-02.10** [recette] Chaque famille de type de donnée utilisée.
- **ST-ORG-02.11** [recette] Valeur `0`, `false`, chaîne vide, valeur invalide.
- **ST-ORG-02.12** [recette] Unité enregistrée.
- **ST-ORG-02.13** [recette] Regroupement dans un groupe existant, puis dans un nouveau.

### ST-ORG-03 — Déplacer plusieurs dispositifs entre réseaux/organs
Destination : Atelier Réseaux et GTB › Connecteurs › Organisation manuelle › « Déplacer des dispositifs »
- **ST-ORG-03.1** [=] Depuis un organ BACnet, un organ OPC UA ou un réseau BMS.
- **ST-ORG-03.2** [=] Arbre source : réseaux et dispositifs.
- **ST-ORG-03.3** [=] Sélection multiple des dispositifs.
- **ST-ORG-03.4** [=] Destination : un réseau parmi les organs du même contexte.
- **ST-ORG-03.5** [=] Déplacement par `moveChildInContext` ; identité et sous-arbre du dispositif conservés.
- **ST-ORG-03.6** [!] Après déplacement, les listeners sont reconfigurés vers le nouvel organ et le nouveau réseau (ou l'interface demande de redémarrer la surveillance).
- **ST-ORG-03.7** [+] Destinations filtrées par protocole compatible ; les incompatibles sont grisées avec la raison.
- **ST-ORG-03.8** [+] Confirmation de portée : nombre de dispositifs, ancien et nouveau parent, effet sur la surveillance.
- **ST-ORG-03.9** [+] Bilan par dispositif dans le plateau, avec « Relancer les échecs ».
- **ST-ORG-03.10** [recette] Identités, endpoints et historiques inchangés.
- **ST-ORG-03.11** [recette] Ancien parent retiré, nouveau parent présent.
- **ST-ORG-03.12** [recette] Acquisition rétablie sur le bon organ.
- **ST-ORG-03.13** [recette] Déplacement partiellement échoué.
- **ST-ORG-03.14** [recette] Destination identique à la source : rien ne change.

### ST-CP-01 — Créer et organiser les bibliothèques de points de contrôle
Destination : Atelier Points de contrôle › Bibliothèques
- **ST-CP-01.1** [=] Créer un contexte nommé de points de contrôle.
- **ST-CP-01.2** [=] Organiser catégories et groupes avec le sélecteur partagé.
- **ST-CP-01.3** [=] Créer un profil sous le groupe choisi.
- **ST-CP-01.4** [=] Le sélecteur d'affectation crée à la volée contexte, catégorie et groupe manquants.
- **ST-CP-01.5** [=] Bibliothèque persistante, indépendante des protocoles physiques.
- **ST-CP-01.6** [!] Le bouton « Créer » de la colonne des profils crée bien un profil (aujourd'hui il appelle `createGroup`).
- **ST-CP-01.7** [!] Nom vide ou fait d'espaces refusé.
- **ST-CP-01.8** [recette] Plusieurs catégories et groupes.
- **ST-CP-01.9** [recette] Nom non vide exigé.
- **ST-CP-01.10** [recette] Profil créé, puis retrouvé dans le sélecteur d'affectation.

### ST-CP-02 — Définir les champs d'un profil de points de contrôle
Destination : Atelier Points de contrôle › Éditeur de profil
- **ST-CP-02.1** [=] Tableau des points : ajouter et supprimer des lignes.
- **ST-CP-02.2** [=] Colonnes : nom, alias, type de donnée, type métier, unité, commande (oui/non), historisation (oui/non).
- **ST-CP-02.3** [=] Types métier : Temperature, Hygrometry, Power, Occupation, Light, Alarm, Other, Consigne, co2.
- **ST-CP-02.4** [+] Types métier affichés en français (Température, Hygrométrie, Puissance, Occupation, Lumière, Alarme, Consigne, CO₂, Autre), valeurs stockées inchangées.
- **ST-CP-02.5** [=] Types de données : Null, Float, Boolean, Unsigned, Unsigned8, Unsigned16, Unsigned32, Integer, Integer16, Real, Double.
- **ST-CP-02.6** [=] Types de données (suite) : OctetString, CharacterString, BitString, Date, Time, Array, DateTime, Long, String, Duration, Enum.
- **ST-CP-02.7** [=] Nom, alias et type obligatoires par ligne.
- **ST-CP-02.8** [=] Au moins une ligne valide pour enregistrer.
- **ST-CP-02.9** [=] Lignes invalides abandonnées seulement après confirmation explicite.
- **ST-CP-02.10** [+] Les lignes invalides sont signalées dans le tableau (champ manquant), avant la confirmation.
- **ST-CP-02.11** [+] Colonnes « Nom » et « Alias » clairement distinguées (infobulle sur leur rôle).
- **ST-CP-02.12** [recette] Chaque champ enregistré puis relu.
- **ST-CP-02.13** [recette] Ligne invalide mêlée à des lignes valides.
- **ST-CP-02.14** [recette] Annulation : rien n'est écrit.
- **ST-CP-02.15** [recette] Identifiants de définition stables après réédition.
- **ST-CP-02.16** [recette] Aucune confusion entre alias et nom.

### ST-CP-03 — Configurer les couleurs et seuils d'affichage
Destination : Atelier Points de contrôle › Éditeur de profil (affichage d'un point)
- **ST-CP-03.1** [=] Nombres : minimum, milieu, maximum, avec une couleur chacun.
- **ST-CP-03.2** [=] Nombres : aperçu du dégradé.
- **ST-CP-03.3** [=] Booléens : une couleur par valeur.
- **ST-CP-03.4** [=] Énumérations : liste de libellés avec une couleur chacun.
- **ST-CP-03.5** [=] Configuration proposée seulement pour certains types numériques, Boolean et Enum.
- **ST-CP-03.6** [=] Changer de type réinitialise la configuration (`getConfig`).
- **ST-CP-03.7** [+] Changer de type demande confirmation, car la configuration d'affichage sera réinitialisée.
- **ST-CP-03.8** [=] Configuration stockée dans la définition du point, réutilisée par la heatmap.
- **ST-CP-03.9** [!] L'aperçu gère les décimales (aujourd'hui `parseInt` à certains endroits).
- **ST-CP-03.10** [+] Seuils inversés ou égaux signalés avant enregistrement.
- **ST-CP-03.11** [recette] Valeurs aux bornes et hors bornes.
- **ST-CP-03.12** [recette] Valeurs décimales.
- **ST-CP-03.13** [recette] Intervalle inversé, intervalle nul.
- **ST-CP-03.14** [recette] Valeur d'énumération inconnue.
- **ST-CP-03.15** [recette] Enregistrer puis rouvrir.

### ST-CP-04 — Modifier un profil et propager ses changements aux instances
Destination : Atelier Points de contrôle › Éditeur de profil
- **ST-CP-04.1** [=] Ouvrir les détails d'un profil, passer en édition.
- **ST-CP-04.2** [=] Ajouter, modifier, retirer des définitions de points.
- **ST-CP-04.3** [=] Confirmer ou annuler l'édition.
- **ST-CP-04.4** [=] À l'enregistrement, `editControlPointProfil` calcule créations, mises à jour et suppressions.
- **ST-CP-04.5** [=] Le différentiel est appliqué aux profils déjà instanciés sur les membres des groupes.
- **ST-CP-04.6** [=] Un événement rafraîchit les heatmaps ouvertes.
- **ST-CP-04.7** [+] Avant d'appliquer : effet sur les instances (« 3 créations, 1 suppression, sur 240 objets »).
- **ST-CP-04.8** [+] La propagation est une tâche du plateau avec bilan par objet.
- **ST-CP-04.9** [+] Texte : modifier le profil modifie les points métier existants, pas seulement la bibliothèque.
- **ST-CP-04.10** [recette] Sur un profil lié à plusieurs groupes : ajouter un point.
- **ST-CP-04.11** [recette] Renommer un point.
- **ST-CP-04.12** [recette] Changer la configuration d'affichage.
- **ST-CP-04.13** [recette] Supprimer un point.
- **ST-CP-04.14** [recette] Points conservés : identité, valeurs, liens physiques et séries intacts.

### ST-CP-05 — Affecter un profil à des groupes et suivre l'évolution de leurs membres
Destination : Atelier Points de contrôle › Affecter
- **ST-CP-05.1** [=] Choisir contexte, catégorie, groupe et profil de points de contrôle.
- **ST-CP-05.2** [=] Périmètre d'application : contexte, catégorie ou groupe de groupes.
- **ST-CP-05.3** [=] Action limitée aux contextes de groupes dont le type sous-jacent est géographique, équipements compris.
- **ST-CP-05.4** [=] Pas d'affectation directe depuis la géographie (`isShown` ne l'active pas).
- **ST-CP-05.5** [=] Pour chaque groupe : liaisons réciproques `linkedItems` mémorisées.
- **ST-CP-05.6** [=] Pour chaque membre : création du groupe de points référencé via `hasControlPoints` et des endpoints du profil via la relation BMS d'endpoint.
- **ST-CP-05.7** [=] Le service suit les ajouts et retraits de membres et crée ou retire les instances correspondantes.
- **ST-CP-05.8** [+] Confirmation de portée : nombre de groupes et d'objets, profils déjà présents.
- **ST-CP-05.9** [+] Texte : « Les nouveaux membres du groupe recevront ce profil automatiquement ».
- **ST-CP-05.10** [!] Aucune instance en double pour un objet présent dans plusieurs groupes ou pour une affectation répétée.
- **ST-CP-05.11** [recette] Groupe existant.
- **ST-CP-05.12** [recette] Membre ajouté après l'affectation : instance créée.
- **ST-CP-05.13** [recette] Membre retiré : instance retirée.
- **ST-CP-05.14** [recette] Plusieurs profils sur un même groupe.
- **ST-CP-05.15** [recette] Même objet dans plusieurs groupes : pas de doublon.

### ST-CP-06 — Détacher un profil de points de contrôle d'un groupe
Destination : Atelier Points de contrôle › Détacher
- **ST-CP-06.1** [=] Lister les profils rattachés au groupe.
- **ST-CP-06.2** [=] Retirer le profil choisi (`unLinkControlPointToGroup`).
- **ST-CP-06.3** [=] Retire les relations vers les instances pour les membres du groupe.
- **ST-CP-06.4** [=] Nettoie les références réciproques groupe/profil (`removeItemSaved`).
- **ST-CP-06.5** [+] Confirmation de portée : objets touchés ; les historiques ne sont pas supprimés.
- **ST-CP-06.6** [+] État vide : « Aucun profil rattaché à ce groupe ».
- **ST-CP-06.7** [recette] Un profil parmi plusieurs : les autres restent.
- **ST-CP-06.8** [recette] Groupe vide.
- **ST-CP-06.9** [recette] Objet partagé entre groupes : ses instances des autres groupes restent.
- **ST-CP-06.10** [recette] État vide et erreur.
- **ST-CP-06.11** [recette] Associations relues après rechargement.

### ST-CP-07 — Afficher une heatmap dynamique des points de contrôle
Destination : Atelier Points de contrôle › Heatmap (légende flottante sur le viewer)
- **ST-CP-07.1** [=] Disponible sur un groupe géographique compatible (type reconnu par `getGroupType`).
- **ST-CP-07.2** [=] Choisir le profil et le point.
- **ST-CP-07.3** [=] Colorer les objets de référence 3D selon la valeur courante et les seuils et couleurs du profil.
- **ST-CP-07.4** [=] Plusieurs groupes peuvent avoir chacun leur légende.
- **ST-CP-07.5** [=] Valeurs suivies en direct ; un changement de configuration du profil rafraîchit la heatmap.
- **ST-CP-07.6** [=] Visualisation seule : aucune valeur modifiée.
- **ST-CP-07.7** [=] Fermer une légende désabonne ses points et rend les couleurs transparentes.
- **ST-CP-07.8** [!] Fermer une légende ne retire pas les couleurs d'une autre légende sur les mêmes objets.
- **ST-CP-07.9** [+] Quitter l'atelier, le jumeau ou l'app libère tous les abonnements et toutes les couleurs.
- **ST-CP-07.10** [+] Heatmap annoncée uniquement pour les groupes compatibles ; les autres n'ont pas l'action.
- **ST-CP-07.11** [recette] Valeur qui change : couleur mise à jour.
- **ST-CP-07.12** [recette] Plusieurs maquettes.
- **ST-CP-07.13** [recette] Point booléen, énumération, numérique.
- **ST-CP-07.14** [recette] Groupe sans profil : message clair.
- **ST-CP-07.15** [recette] Fermeture d'une seule légende parmi plusieurs.
- **ST-CP-07.16** [recette] Changement d'app : aucun abonnement ni couleur résiduels.

### ST-LINK-01 — Explorer et créer des liens de graphe génériques
Destination : Fiche de l'objet › Relations › « Créer un lien »
- **ST-LINK-01.1** [=] Disponible depuis tout nœud sélectionné.
- **ST-LINK-01.2** [=] Explorateur de tous les contextes, enfants chargés à la demande.
- **ST-LINK-01.3** [=] Recherche dans l'arbre chargé.
- **ST-LINK-01.4** [=] Nom de relation, `hasEndPoint` par défaut.
- **ST-LINK-01.5** [+] Liste des noms de relation existants proposée à la saisie.
- **ST-LINK-01.6** [=] Mode avec contexte (`addChildInContext`) ou sans contexte (`addChild`).
- **ST-LINK-01.7** [=] Type de relation `PtrLst`.
- **ST-LINK-01.8** [?] Sélecteur de type de relation (`Ref`, `LstPtr`) : non démontré dans l'existant ; à décider pour le mode expert.
- **ST-LINK-01.9** [=] Liens existants indiqués dans l'explorateur ; ceux du contexte courant distingués.
- **ST-LINK-01.10** [+] Lien déjà présent : action désactivée avec la raison.
- **ST-LINK-01.11** [recette] Cible d'un autre contexte.
- **ST-LINK-01.12** [recette] Lien déjà présent.
- **ST-LINK-01.13** [recette] Relation nommée autrement que `hasEndPoint`.
- **ST-LINK-01.14** [recette] Rechargement : lien présent.
- **ST-LINK-01.15** [recette] Arbre contenant plusieurs occurrences d'un même objet.

### ST-LINK-02 — Inspecter et retirer des liens génériques en masse
Destination : Fiche de l'objet › Relations › « Retirer des liens »
- **ST-LINK-02.1** [=] Afficher les cibles liées.
- **ST-LINK-02.2** [=] Deux listes : liens du contexte courant, autres liens.
- **ST-LINK-02.3** [=] Sélection unitaire ou de tout un ensemble.
- **ST-LINK-02.4** [=] Retirer un ou plusieurs liens (`removeChild`), puis rafraîchir.
- **ST-LINK-02.5** [!] Le retrait annonce sa portée réelle : la relation est retirée au niveau du parent pour ce nom et ce type, dans tous les contextes, même en mode « dans le contexte ».
- **ST-LINK-02.6** [?] Proposer un vrai retrait limité au contexte courant, ou garder seulement le retrait global annoncé.
- **ST-LINK-02.7** [!] Une cible présente dans les deux listes n'est retirée qu'une fois.
- **ST-LINK-02.8** [!] Le rafraîchissement attend la fin de chaque retrait ; bilan par lien (réussi, erreur).
- **ST-LINK-02.9** [+] Confirmation de portée : « Retirer 5 liens », objets conservés, effet sur les autres contextes.
- **ST-LINK-02.10** [recette] Lien partagé entre contextes.
- **ST-LINK-02.11** [recette] Sélection dans les deux listes.
- **ST-LINK-02.12** [recette] Échec partiel.
- **ST-LINK-02.13** [recette] Cohérence après relecture du graphe.

### ST-CP-08 — Rattacher la série temporelle d'un endpoint physique à un point métier
Destination : Atelier Points de contrôle › « Rattacher des séries » (assistant)
- **ST-CP-08.1** [=] Disponible dans un contexte dont le type finit par `GroupContext`.
- **ST-CP-08.2** [=] Périmètre : catégories, groupes ou objets sélectionnés.
- **ST-CP-08.3** [=] Nom exact du profil métier.
- **ST-CP-08.4** [=] Point métier : nom exact ou expression régulière.
- **ST-CP-08.5** [=] Expression régulière du nom de l'endpoint physique.
- **ST-CP-08.6** [=] Taille de lot : 20 par défaut, strictement positive.
- **ST-CP-08.7** [=] Parcours des objets feuilles, traitement par lots, progression et erreurs par objet.
- **ST-CP-08.8** [=] Endpoint physique cherché via `hasBmsDevice`, `hasBmsEndpoint`, `hasBmsEndpointGroup`.
- **ST-CP-08.9** [=] Série de l'endpoint obtenue ou créée.
- **ST-CP-08.10** [=] Le même nœud `hasTimeSeries` est rattaché au point métier trouvé sous `hasControlPoints` / `hasBmsEndpoint`.
- **ST-CP-08.11** [=] Si le point avait une autre série, son lien est retiré puis remplacé ; l'ancienne série n'est pas effacée.
- **ST-CP-08.12** [=] Si la série est déjà la même, rien n'est modifié.
- **ST-CP-08.13** [=] Aucun transfert de valeur courante, aucune copie ni fusion d'historique, aucune propagation de commande : seul le lien de série est partagé.
- **ST-CP-08.14** [+] Texte : « L'historique est partagé, pas copié ».
- **ST-CP-08.15** [+] Aperçu des couples (objet, endpoint, point, série actuelle) avant exécution, avec les remplacements signalés.
- **ST-CP-08.16** [+] Exécution en tâche du plateau, avec bilan par objet et « Relancer les échecs ».
- **ST-CP-08.17** [!] Plusieurs endpoints ou points correspondants : ambiguïté signalée dans l'aperçu (aujourd'hui première correspondance sans alerte).
- **ST-CP-08.18** [!] Objets feuilles dédupliqués et parcours protégé contre les cycles.
- **ST-CP-08.19** [!] En mode « nom exact », le nom n'est pas compilé en expression régulière.
- **ST-CP-08.20** [!] Expression régulière invalide refusée avant lancement, avec le message d'erreur.
- **ST-CP-08.21** [!] Les deux progressions (collecte des objets, rattachement) sont réellement affichées.
- **ST-CP-08.22** [+] Les lots sont traités sans modification partielle invisible : chaque objet a un résultat (fait, inchangé, erreur).
- **ST-CP-08.23** [recette] Série absente, existante, déjà commune, différente.
- **ST-CP-08.24** [recette] Expression régulière invalide.
- **ST-CP-08.25** [recette] Profil, point ou endpoint manquant.
- **ST-CP-08.26** [recette] Plusieurs correspondances.
- **ST-CP-08.27** [recette] Objet sélectionné via plusieurs groupes : traité une fois.
- **ST-CP-08.28** [recette] Lot partiellement en erreur.
- **ST-CP-08.29** [recette] Ancienne série conservée après remplacement.

### Contrats de données du §7
- **ST-NET-CTR.1** [=] Identités distinctes préservées : identifiant de nœud, identifiant réseau (`idNetwork`, OID, `nodeId` OPC UA), BIM (`bimFileId`, `dbId`, `externalId`) et IDX du profil.
- **ST-NET-CTR.2** [=] Conversion `IDX = idNetwork - 1` et son inverse dans les profils BACnet : testée, et jamais généralisée aux autres protocoles.
- **ST-NET-CTR.3** [=] Cinq opérations distinctes : créer un objet, référencer un objet existant, déplacer une relation, détacher, supprimer du graphe.
- **ST-NET-CTR.4** [!] Les fonctions qui agissent hors contexte tout en affichant un contexte annoncent leur portée réelle.
- **ST-NET-CTR.5** [=] Points d'un profil métier instanciés sur les membres de groupe, avec propagation des modifications.
- **ST-NET-CTR.6** [=] Profils de surveillance référencés par des listeners ; jamais ramenés à une copie JSON.
- **ST-NET-CTR.7** [=] Découverte, lecture BACnet, création des nœuds et redémarrage d'organ sont des demandes persistantes exécutées par l'organ : états, résultats partiels et reprise conservés.
- **ST-NET-CTR.8** [+] « Demande enregistrée » toujours distinguée de « tâche terminée ».
- **ST-NET-CTR.9** [+] Édition en masse : le périmètre (objets, groupe, réseau, contexte, filtre) est toujours explicite ; aucune action sur des éléments masqués sans l'annoncer.
- **ST-NET-CTR.10** [=] Trois actes différents : arrêter l'acquisition, arrêter l'enregistrement, détacher ou remplacer un lien de série.
- **ST-NET-CTR.11** [=] Aucune de ces actions ne purge les séries.
- **ST-NET-CTR.12** [=] Sélection 3D, association BIM, couleurs et heatmap utilisables avec plusieurs maquettes.
- **ST-NET-CTR.13** [=] Couleurs, sprites et abonnements nettoyés à la fermeture de l'atelier ou du jumeau.
- **ST-NET-CTR.14** [=] Imports et exports conservés, avec validation de format : XML GFX, BOG, XLSX BACnet, XLSX OPC UA, JSON `item_list`.
- **ST-NET-CTR.15** [non] Import JSON réciproque de `item_list.json` et import XLSX SNMP : non démontrés dans l'existant.
- **ST-NET-CTR.16** [=] Les organs BACnet, OPC UA et SNMP ne font pas partie des services Docker standards : l'atelier le dit et ne présume pas d'un connecteur actif.
- **ST-NET-CTR.17** [recette] Recette matérielle avec organs configurés et équipements de test.
- **ST-NET-CTR.18** [=] Les options « commande » des profils et les listes de supervision définissent des points commandables, sans déclencher de commande ; le pilotage effectif relève de ST-MES-02.
- **ST-NET-CTR.19** [!] NET rapprochement : collisions du dictionnaire indexé par valeur signalées, résultat de normalisation affiché ; plus d'`eval` de fonctions libres sans contrôle.
- **ST-NET-CTR.20** [recette] NET rapprochement : valeurs dupliquées et absentes.
- **ST-NET-CTR.21** [!] NET nettoyage : la relation réseau est déterminée pour chaque enfant (pas la première trouvée pour tous).
- **ST-NET-CTR.22** [recette] NET nettoyage : parent combinant réseaux et objets BIM.
- **ST-NET-CTR.23** [!] PROF XML : `getXmlContent` résout ou rejette sa promesse ; fin et erreur affichées.
- **ST-NET-CTR.24** [recette] PROF XML : fin affichée, XML en erreur, reprise.
- **ST-NET-CTR.25** [!] PROF supervision globale : les modifications d'alarmes sont enregistrées, pas seulement les mesures.
- **ST-NET-CTR.26** [recette] PROF supervision globale : persistance réelle des alarmes.
- **ST-NET-CTR.27** [!] PROF retrait de commande : n'utilise plus la variable liée aux alarmes.
- **ST-NET-CTR.28** [recette] PROF retrait de commande : sans exception ni mauvaise suppression.
- **ST-NET-CTR.29** [!] PROF mise à jour : pas de `removeFromGraph` à tort sur les items cochés ; propriétés des items inchangés actualisées.
- **ST-NET-CTR.30** [recette] PROF mise à jour : liens existants conservés, changements de nom et d'unité appliqués.
- **ST-NET-CTR.31** [!] OPC intervalles : un intervalle supprimé figure dans le différentiel persistant (voir ST-OPC-04.12).
- **ST-NET-CTR.32** [!] OPC liaison de profil : promesses attendues ensemble avant le succès (voir ST-OPC-05.8).
- **ST-NET-CTR.33** [!] OPC/SNMP découverte : désabonnement sur `progress`, garde à la destruction (voir ST-OPC-02.11, ST-SNMP-02.6).
- **ST-NET-CTR.34** [!] SNMP formulaire : plus d'accès à `serverInfo.name` (voir ST-SNMP-01.8).
- **ST-NET-CTR.35** [!] SNMP recherche de profil : plus de lignes `Copy of <oid>` (voir ST-SNMP-04.8).
- **ST-NET-CTR.36** [!] ORG déplacement : listeners reconfigurés (voir ST-ORG-03.6).
- **ST-NET-CTR.37** [!] CP sélecteur : création de profil réellement accessible (voir ST-CP-01.6).
- **ST-NET-CTR.38** [!] LINK retrait : effet sur tous les contextes annoncé et maîtrisé (voir ST-LINK-02.5).
- **ST-NET-CTR.39** [!] TSCP correspondance : ambiguïtés, objets partagés, résultat partiel et ancienne série conservée traités (voir ST-CP-08.17 à 22).
- **ST-NET-CTR.40** [recette] Recette complète : inspection après rechargement du graphe.
- **ST-NET-CTR.41** [recette] Recette complète : contrôle des effets sur les autres contextes.
- **ST-NET-CTR.42** [recette] Recette complète : réception réelle des mesures observée.
- **ST-NET-CTR.43** [recette] Recette complète : abonnements nettoyés au changement de micro-app ou d'atelier.
- **ST-NET-CTR.44** [=] La simplification peut réunir les dialogues, mais garde les imports industriels, la correction manuelle des associations, les opérations de masse et la distinction profil / instance / point physique.

## 9. Tickets, événements, Mission, mesures, dashboards

### ST-TIC-01 — Définir un contexte de tickets et son cycle de traitement
Destination : Atelier Tickets › Configuration — 04 §5.6
- **ST-TIC-01.1** [=] Créer un contexte de tickets depuis l'atelier Tickets › Configuration (historiquement : commande de la barre supérieure du gestionnaire de graphe).
- **ST-TIC-01.2** [=] Nom du contexte obligatoire et non vide ; validation refusée sinon, avec le message en clair.
- **ST-TIC-01.3** [=] Saisir la liste des étapes du cycle : chaque étape a un nom, une couleur et un ordre.
- **ST-TIC-01.4** [=] Ajouter, retirer et réordonner les étapes avant validation (glisser, monter, descendre).
- **ST-TIC-01.5** [=] Au moins une étape est obligatoire : sans étape, le bouton de création reste désactivé et le dit.
- **ST-TIC-01.6** [=] La création enregistre le nom et les étapes ordonnées dans le graphe (`createContext`).
- **ST-TIC-01.7** [=] Le contexte sert de référence aux processus, aux tickets et aux sorties d'analyses de type ticket ou alarme.
- **ST-TIC-01.8** [=] Chaque nouveau processus du contexte instancie les étapes du contexte (`createTicketProcess`) et reçoit en plus une étape d'archive.
- **ST-TIC-01.9** [+] L'étape d'archive est gérée par le système : ni éditable, ni supprimable, ni proposée comme référence.
- **ST-TIC-01.10** [+] Un seul formulaire sur une page au lieu de l'ancien dialogue en deux pages.
- **ST-TIC-01.11** [=] Les couleurs d'étapes sont reprises telles quelles dans la liste, le tableau en colonnes et la coloration 3D.
- **ST-TIC-01.12** [=] Tickets et événements restent deux modèles distincts (processus/étape/priorité/logs d'un côté, dates/série/groupe de l'autre), même s'ils sont voisins dans la navigation.
- **ST-TIC-01.13** [=] Rééditer un contexte existant ne doit effacer aucun champ non affiché par le nouvel écran.
- **ST-TIC-01.14** [recette] Les contextes existants s'affichent avec leurs étapes dans le bon ordre et avec leurs couleurs.
- **ST-TIC-01.15** [recette] Créer un cycle de plusieurs étapes, puis un processus : le processus reprend toutes les étapes et ajoute l'archive.
- **ST-TIC-01.16** [recette] Tenter de valider sans nom ou sans étape : aucune création.

### ST-TIC-02 — Créer des processus et insérer des étapes
Destination : Atelier Tickets › Configuration — 04 §5.6
- **ST-TIC-02.1** [=] Créer un processus dans un contexte de tickets, à partir de son seul nom.
- **ST-TIC-02.2** [=] Un contexte peut porter plusieurs processus, listés sous lui.
- **ST-TIC-02.3** [=] Insérer une étape dans un processus : nom, couleur, position « avant » ou « après » une étape existante choisie comme référence.
- **ST-TIC-02.4** [=] Ordre enregistré : celui de l'étape de référence pour « avant », celui de la référence + 1 pour « après ».
- **ST-TIC-02.5** [=] L'étape d'archive (`order = -1`) n'est jamais proposée comme référence d'insertion.
- **ST-TIC-02.6** [=] La gestion des étapes d'un processus reste séparée de la modification d'un ticket individuel (pas dans la fiche ticket).
- **ST-TIC-02.7** [?] Vérifier si les étapes suivantes sont renumérotées à l'insertion ; sinon deux étapes de même ordre cassent la transition « ordre + 1 » (ST-TIC-07). Décider de renuméroter.
- **ST-TIC-02.8** [recette] Insérer au début, au milieu et à la fin d'un processus.
- **ST-TIC-02.9** [recette] Les tickets déjà dans une étape y restent après une insertion.
- **ST-TIC-02.10** [recette] Après insertion, suivant/précédent passent bien par la nouvelle étape.

### ST-TIC-03 — Maintenir une bibliothèque d'incidents usuels
Destination : Atelier Tickets › Configuration — 04 §5.6
- **ST-TIC-03.1** [=] Ajouter un incident usuel à un processus : nom non vide et processus cible (`addCommonIncident`).
- **ST-TIC-03.2** [=] Lister les incidents usuels par processus.
- **ST-TIC-03.3** [=] À la déclaration d'un ticket, proposer les incidents usuels du processus choisi ; en choisir un préremplit le titre.
- **ST-TIC-03.4** [=] Priorité, message et pièces jointes restent propres à chaque ticket, jamais hérités de l'incident.
- **ST-TIC-03.5** [non] Pas de bibliothèque de modèles complets (priorité, texte, fichiers) : l'existant ne saisit que le nom.
- **ST-TIC-03.6** [recette] Déclarer un ticket à partir d'un incident existant, puis un ticket à titre libre ; le processus reste identifié dans les deux cas.

### ST-TIC-04 — Déclarer un ticket localisé sur le jumeau
Destination : Fiche › Tickets ; atelier Tickets — 04 §3.6, §5.6
- **ST-TIC-04.1** [=] Déclarer un ticket depuis la fiche (action principale « Déclarer un ticket » pour une pièce), le navigateur et le clic droit sur un objet 3D (historique : menu du graphe et menu circulaire 3D).
- **ST-TIC-04.2** [=] Choix en cascade : contexte de tickets, puis processus, puis incident usuel facultatif.
- **ST-TIC-04.3** [=] Titre obligatoire (libre ou prérempli par l'incident usuel).
- **ST-TIC-04.4** [=] Priorité parmi `occasionally` (« Occasionnelle »), `normal` (« Normale »), `urgent` (« Urgente ») ; valeur par défaut `occasionally`.
- **ST-TIC-04.5** [=] Message initial facultatif.
- **ST-TIC-04.6** [=] Pièces jointes : sélection multiple, liste visible, retrait d'un fichier avant envoi.
- **ST-TIC-04.7** [=] Taille cumulée des fichiers (nouvelle sélection + fichiers déjà ajoutés) limitée à 25 000 000 octets ; dépassement refusé avec la taille en clair.
- **ST-TIC-04.8** [!] Retirer une pièce jointe par son entrée de liste et non par son nom (l'existant retire tous les homonymes).
- **ST-TIC-04.9** [=] Auteur = utilisateur connecté ; l'objet concerné est enregistré avec le ticket.
- **ST-TIC-04.10** [=] Création par `addTicket(ticket, processId, contextId, nodeId)` : ticket placé à la première étape, relié à l'objet, log de création ajouté.
- **ST-TIC-04.11** [=] Objet 3D pas encore dans le jumeau : création du `BIMObject` à partir du `dbId`, du modèle et du nom, avant le ticket.
- **ST-TIC-04.12** [+] Le toast dit que le nœud BIM a été créé en plus du ticket (effet sur le graphe au-delà du ticket).
- **ST-TIC-04.13** [=] Indicateur d'envoi, puis succès ou échec, puis rafraîchissement des listes de tickets.
- **ST-TIC-04.14** [!] Garantir que le message initial et les pièces jointes sont réellement enregistrés au premier envoi (note + dépôt explicites) : le service moderne ne les enregistre pas visiblement. Vérification prioritaire.
- **ST-TIC-04.15** [=] Les contrôles du formulaire (titre, taille) ne remplacent pas la validation à l'écriture : un refus du hub est affiché tel quel.
- **ST-TIC-04.16** [recette] Ticket sur une pièce et sur un équipement.
- **ST-TIC-04.17** [recette] Objet BIM déjà présent, puis objet 3D sans nœud (nœud créé une seule fois).
- **ST-TIC-04.18** [recette] Titre libre et titre prédéfini ; les trois priorités.
- **ST-TIC-04.19** [recette] Message seul ; plusieurs fichiers ; deux fichiers homonymes dont un retiré ; dépassement de 25 000 000 octets.
- **ST-TIC-04.20** [recette] Annuler le formulaire : aucune création ; échec simulé : message lisible et aucun doublon.

### ST-TIC-05 — Parcourir et rechercher les tickets
Destination : Atelier Tickets › Tableau — 04 §5.6
- **ST-TIC-05.1** [=] Parcourir les tickets par contexte, puis processus, puis étape (filtres).
- **ST-TIC-05.2** [=] Afficher toutes les étapes d'un processus ensemble.
- **ST-TIC-05.3** [+] Vue en colonnes par étape (kanban) : lecture, et glisser vers l'étape suivante ou précédente seulement.
- **ST-TIC-05.4** [+] Vue liste : nom, étape (pastille couleur), date de création, priorité, auteur.
- **ST-TIC-05.5** [=] Ouverture depuis un nœud : contexte, processus et étape du nœud de départ présélectionnés.
- **ST-TIC-05.6** [=] Recherche par sous-chaîne dans le nom, sans distinction de casse.
- **ST-TIC-05.7** [=] Tri par nom, date de création et priorité.
- **ST-TIC-05.8** [=] État vide explicite (« Aucun ticket dans cette étape »), distinct de « Aucun résultat » pour une recherche.
- **ST-TIC-05.9** [=] Tout changement de ticket (création, transition, archive) recharge la vue.
- **ST-TIC-05.10** [=] Les tickets des étapes spéciales (archive) restent accessibles.
- **ST-TIC-05.11** [=] Filtres = état d'interface ; aucune sauvegarde durable historique.
- **ST-TIC-05.12** [?] Garder contexte, processus et étape filtrés dans l'URL (comme `contexte`/`atelier`) pour recharger au même endroit ?
- **ST-TIC-05.13** [recette] Le même ensemble de tickets apparaît depuis le navigateur et depuis le tableau.
- **ST-TIC-05.14** [recette] Recherche et tri sur un gros volume de tickets restent fluides.
- **ST-TIC-05.15** [recette] Après une transition, la vue garde le contexte et le processus choisis.

### ST-TIC-06 — Consulter une fiche, commenter et lire la chronologie
Destination : Fiche › Tickets ; atelier Tickets — 04 §3.6, §5.6
- **ST-TIC-06.1** [=] Fiche du ticket en panneau superposé : titre, étape actuelle, priorité, auteur, date de création.
- **ST-TIC-06.2** [=] Chronologie = logs métier (`getLogs`) + commentaires, dans l'ordre des événements.
- **ST-TIC-06.3** [=] Commentaires et pièces jointes via le même composant de notes que les fiches d'objet ; ils sont rattachés au ticket.
- **ST-TIC-06.4** [=] « Ajouter un commentaire » depuis la liste ouvre ce même fil.
- **ST-TIC-06.5** [=] Un changement d'étape met à jour l'étape affichée et ajoute l'entrée à la chronologie.
- **ST-TIC-06.6** [!] Lire les propriétés du ticket dans `ticket.info` **et** dans les attributs documentaires (forme écrite par le service moderne) ; vérifier la relecture des tickets créés par les deux générations.
- **ST-TIC-06.7** [non] Bouton autonome « voir les logs » (`seeLogs`, vide) : non repris, la chronologie de la fiche le remplace.
- **ST-TIC-06.8** [non] Modifier titre ou priorité, affecter un responsable, rechercher dans les commentaires : non démontrés, non promis.
- **ST-TIC-06.9** [non] Notifications générales et export global des tickets : non démontrés, non promis.
- **ST-TIC-06.10** [recette] Auteurs, dates, pièces jointes et ordre des événements conservés.
- **ST-TIC-06.11** [recette] Anciens commentaires accessibles après archivage puis réactivation.
- **ST-TIC-06.12** [recette] Le log métier n'est jamais remplacé par la seule date de dernière modification.

### ST-TIC-07 — Faire avancer ou reculer un ticket
Destination : Fiche › Tickets ; atelier Tickets — 04 §3.6, §5.6
- **ST-TIC-07.1** [=] « Étape suivante » et « Étape précédente » dans le même processus, depuis la fiche, la liste, le tableau en colonnes et le navigateur.
- **ST-TIC-07.2** [=] Le service reçoit contexte, processus, ticket et utilisateur connecté.
- **ST-TIC-07.3** [=] « Précédente » active seulement si l'ordre courant est strictement positif ; « Suivante » seulement si l'ordre est positif ou nul (jamais depuis l'archive).
- **ST-TIC-07.4** [=] L'étape suivante est celle d'ordre exactement courant + 1 (`getNextStepNode`).
- **ST-TIC-07.5** [=] À la dernière étape, pas d'archivage automatique : « Suivante » est désactivée.
- **ST-TIC-07.6** [=] Chaque transition écrit un log : acteur, étape source, étape cible.
- **ST-TIC-07.7** [=] Relations d'étape et informations du ticket mises à jour, puis rafraîchissement de toutes les vues.
- **ST-TIC-07.8** [?] Confirmation avant transition : historique seulement dans le graphe ; à décider (proposition : pas de confirmation, action réversible).
- **ST-TIC-07.9** [recette] Première et dernière étape (boutons désactivés aux bornes).
- **ST-TIC-07.10** [recette] Aller-retour suivant puis précédent : couleur, compteurs et logs à jour, acteur conservé.
- **ST-TIC-07.11** [recette] Aucune duplication des rattachements d'étape après plusieurs transitions.

### ST-TIC-08 — Archiver et réactiver un ticket
Destination : Fiche › Tickets ; atelier Tickets — 04 §3.6, §5.6
- **ST-TIC-08.1** [=] Bouton « Archiver » ou « Réactiver » selon l'étape courante.
- **ST-TIC-08.2** [=] Archivage (`ArchiveTickets`, avec contexte, processus, ticket, acteur) : cherche ou crée l'étape d'archive, y déplace le ticket, écrit un log.
- **ST-TIC-08.3** [=] Un ticket est reconnu archivé par l'ordre de l'étape d'archive (`ARCHIVED_STEP.order`, -1).
- **ST-TIC-08.4** [=] Réactivation (`unarchiveTicket`) : le ticket repart à la **première étape**, log de réactivation.
- **ST-TIC-08.5** [+] La confirmation de réactivation dit « Le ticket repart à la première étape ».
- **ST-TIC-08.6** [=] Archiver n'est pas supprimer : libellé et couleur d'un retrait réversible, jamais ceux d'une suppression.
- **ST-TIC-08.7** [non] Partition d'archives et suppression physique des versions récentes du service : aucun écran historique, non repris sans décision.
- **ST-TIC-08.8** [recette] Cycle archivage puis réactivation : commentaires, fichiers, logs, objet associé et identité conservés.

### ST-TIC-09 — Situer les incidents dans la maquette
Destination : Atelier Tickets › Voir dans la 3D — 04 §5.6
- **ST-TIC-09.1** [=] « Voir dans la 3D » : sélectionner, isoler, cadrer les objets associés à un ticket.
- **ST-TIC-09.2** [=] Colorer les objets des tickets d'un contexte, d'un processus ou d'une étape avec la couleur de l'étape ; « Restaurer les couleurs ».
- **ST-TIC-09.3** [=] Résolution des objets par les relations du graphe : remontée aux parents géographiques, puis références 3D.
- **ST-TIC-09.4** [=] Fonctionne sur plusieurs maquettes chargées.
- **ST-TIC-09.5** [=] L'état visuel n'est pas enregistré dans le ticket.
- **ST-TIC-09.6** [=] Une transition de ticket met à jour la coloration en cours.
- **ST-TIC-09.7** [=] Un ticket sans objet 3D reste visible dans la gestion métier.
- **ST-TIC-09.8** [+] Objets sans géométrie : message « N tickets sans objet 3D », au lieu d'un échec muet.
- **ST-TIC-09.9** [!] Libellé historique trompeur « Select Object » remplacé par « Colorer par étape » (le comportement est coloration/restauration).
- **ST-TIC-09.10** [+] Couleurs et isolations libérées en quittant l'atelier ou le jumeau.
- **ST-TIC-09.11** [recette] Ticket sur un espace et sur un équipement ; plusieurs maquettes ; plusieurs tickets sur le même objet.
- **ST-TIC-09.12** [recette] Restauration des couleurs et isolation sans modifier aucune donnée.

### ST-EVT-01 — Structurer les événements en contextes, catégories et groupes
Destination : Atelier Planning — 04 §5.7
- **ST-EVT-01.1** [=] Créer un contexte d'événements nommé.
- **ST-EVT-01.2** [=] Dans le parcours de création d'événement, choisir ou créer une catégorie, puis un groupe (création à la volée).
- **ST-EVT-01.3** [=] Le groupe donne sa couleur aux événements du calendrier.
- **ST-EVT-01.4** [=] Contexte, catégorie et groupe sont tous trois obligatoires avant d'accéder au formulaire de l'événement.
- **ST-EVT-01.5** [=] Création de catégorie et de groupe avec le même sélecteur que les groupes d'objets.
- **ST-EVT-01.6** [=] Le modèle de groupe d'événements reste basé sur `SpinalEvent`.
- **ST-EVT-01.7** [recette] Hiérarchie existante et couleurs retrouvées à l'identique.
- **ST-EVT-01.8** [recette] Créer catégorie et groupe depuis le sélecteur : ils sont immédiatement sélectionnables.
- **ST-EVT-01.9** [recette] Annuler le parcours : aucun événement parasite créé.

### ST-EVT-02 — Créer un événement localisé, ponctuel ou récurrent
Destination : Fiche › Événements ; atelier Planning — 04 §3.7, §5.7
- **ST-EVT-02.1** [=] Créer un événement depuis la fiche d'un objet, le navigateur ou un objet 3D.
- **ST-EVT-02.2** [=] Champs : groupe (contexte, catégorie, groupe), nom, description, début, fin, ponctuel ou répété.
- **ST-EVT-02.3** [=] Valeurs par défaut : début = maintenant, fin = début + 1 h.
- **ST-EVT-02.4** [=] À la création, la fin est bornée à la journée du début.
- **ST-EVT-02.5** [?] Garder cette borne « même jour » ou autoriser des événements sur plusieurs jours ?
- **ST-EVT-02.6** [=] Répétition : « tous les N » avec N entier ≥ 1, unité jour, semaine, mois ou année, et date de fin de répétition (« jusqu'au… »).
- **ST-EVT-02.7** [=] Auteur = utilisateur connecté.
- **ST-EVT-02.8** [=] Objet 3D sans nœud : création du `BIMObject`, signalée dans le toast.
- **ST-EVT-02.9** [=] L'événement est relié au groupe et à l'objet par `hasEvent`.
- **ST-EVT-02.10** [=] Une récurrence crée **un nœud par occurrence**, tous avec la même `reference` et la même durée.
- **ST-EVT-02.11** [=] Attributs documentaires de catégorie `default` : nom, dates disponibles et périodicité.
- **ST-EVT-02.12** [=] Récurrence en durées fixes : jour 86 400 000 ms, semaine 604 800 000 ms, mois 2 629 800 000 ms, année 31 557 600 000 ms.
- **ST-EVT-02.13** [?] Passer à une récurrence calendaire (même jour du mois, même heure locale au changement d'heure) ? Si oui, traiter explicitement les séries anciennes.
- **ST-EVT-02.14** [?] Créer le nœud avec le constructeur `SpinalEvent` (initialise `done` et `creationDate`) au lieu du `Model` générique de l'existant ?
- **ST-EVT-02.15** [non] Affectation (`assignedTo`) et réalisation (`done`) : présentes dans le modèle, jamais gérées par l'écran ; non reprises.
- **ST-EVT-02.16** [recette] Durée de chaque occurrence, bornes inclusives, nombre d'occurrences attendu pour chaque unité.
- **ST-EVT-02.17** [recette] Même `reference` sur toute la série ; parent, groupe et auteur corrects.

### ST-EVT-03 — Consulter les plannings et événements hérités
Destination : Fiche › Événements ; atelier Planning — 04 §3.7, §5.7
- **ST-EVT-03.1** [=] Sur un objet : afficher ses propres événements.
- **ST-EVT-03.2** [=] Dans un contexte d'événements : afficher les événements sous le nœud choisi.
- **ST-EVT-03.3** [=] Option « Inclure les événements des parents directs ».
- **ST-EVT-03.4** [=] Option « Seulement ceux des parents ».
- **ST-EVT-03.5** [!] Le mot historique « partagés » disparaît : il s'agit des parents directs, pas d'un partage entre comptes ni d'une gestion de droits.
- **ST-EVT-03.6** [=] Chaque événement montre horaires, nom et couleur de son groupe (avec le nom du groupe, la couleur n'est jamais seule).
- **ST-EVT-03.7** [+] Fiche : agenda compact, liste par date.
- **ST-EVT-03.8** [=] Atelier : calendrier jour, semaine, mois, liste ; vue mensuelle à l'ouverture.
- **ST-EVT-03.9** [?] Vue annuelle avec compteur d'événements (existante) : la reprendre ?
- **ST-EVT-03.10** [non] Vue pluriannuelle : désactivée dans l'existant, non reprise.
- **ST-EVT-03.11** [=] Double-clic (et `Entrée`) sur un événement ouvre son détail.
- **ST-EVT-03.12** [=] Consultation seule : aucune écriture.
- **ST-EVT-03.13** [non] Calendrier partagé entre utilisateurs : non démontré, non promis.
- **ST-EVT-03.14** [recette] Objet sans événement ; événements propres et des parents, sans doublon.
- **ST-EVT-03.15** [recette] Changement de période, passage d'année, fuseaux horaires.

### ST-EVT-04 — Consulter et modifier un événement
Destination : Fiche › Événements ; atelier Planning — 04 §3.7, §5.7
- **ST-EVT-04.1** [=] Détail d'un événement : nom, dates, description, répétition, groupe, objet associé.
- **ST-EVT-04.2** [=] Localiser l'objet de l'événement dans la 3D depuis le détail.
- **ST-EVT-04.3** [=] Modifier : nom, dates, description.
- **ST-EVT-04.4** [=] La modification remplace les attributs du **seul nœud sélectionné** (`updateEvent`).
- **ST-EVT-04.5** [+] Portée affichée : « Cette occurrence uniquement ».
- **ST-EVT-04.6** [non] « Modifier toute la série » : non proposé (aucune régénération des autres occurrences dans l'existant).
- **ST-EVT-04.7** [?] Réglages de répétition dans la modification (sans effet sur les autres occurrences) : les masquer ou les montrer en lecture seule ?
- **ST-EVT-04.8** [=] Identité, relations et `reference` de l'occurrence conservées.
- **ST-EVT-04.9** [recette] Modifier une occurrence d'une série : les autres occurrences sont inchangées, la `reference` est conservée.

### ST-EVT-05 — Annuler une occurrence ou un sous-ensemble de série
Destination : Fiche › Événements ; atelier Planning — 04 §3.7, §5.7
- **ST-EVT-05.1** [=] Portée « Cette occurrence ».
- **ST-EVT-05.2** [=] Portée « Celle-ci et les précédentes » (même `reference`).
- **ST-EVT-05.3** [=] Portée « Celle-ci et les suivantes ».
- **ST-EVT-05.4** [=] Portée « Toute la série » (toutes les occurrences de cette `reference`).
- **ST-EVT-05.5** [=] La série est cherchée sur l'objet associé ; le tri se fait sur la date de début, borne incluse.
- **ST-EVT-05.6** [=] Pour chaque occurrence retenue : retrait des relations vers le groupe et vers l'objet (pas de destruction physique prouvée).
- **ST-EVT-05.7** [+] La confirmation affiche le nombre d'occurrences touchées ; bouton « Annuler 12 occurrences ».
- **ST-EVT-05.8** [+] La confirmation dit ce qui n'est pas touché : autres séries, autres objets, tickets.
- **ST-EVT-05.9** [=] Calendrier et agenda actualisés après l'annulation.
- **ST-EVT-05.10** [recette] Les quatre portées, borne incluse.
- **ST-EVT-05.11** [recette] Série contenant deux occurrences au même horaire.
- **ST-EVT-05.12** [recette] Aucune incidence sur une autre `reference` ou sur un autre objet.
- **ST-EVT-05.13** [recette] Ticket et événement récurrent sur le même équipement : annuler l'événement ne touche pas le ticket.

### ST-EVT-06 — Actions en lot sur la période visible
Destination : Atelier Planning › Actions sur la période — 04 §5.7
- **ST-EVT-06.1** [=] « Sélectionner les objets dans la 3D » : tous les objets des événements de la période visible.
- **ST-EVT-06.2** [=] « Supprimer des événements… » : liste des événements de la période visible.
- **ST-EVT-06.3** [=] Les événements hérités des parents sont exclus du lot, et la confirmation le dit.
- **ST-EVT-06.4** [=] Les événements hors période visible ne font jamais partie du lot.
- **ST-EVT-06.5** [!] Seuls les événements cochés sont supprimés (l'existant supprimait tout sans regarder les cases).
- **ST-EVT-06.6** [+] Confirmation de portée (nombre, liste dépliable, exclus avec raison), puis résultat par événement dans le plateau des tâches.
- **ST-EVT-06.7** [?] Effet exact de la suppression en lot (retrait des liens comme ST-EVT-05 ou suppression des nœuds) : à vérifier et à dire dans la confirmation.
- **ST-EVT-06.8** [recette] Lot vide ; période partielle ; événements propres et hérités mêlés.
- **ST-EVT-06.9** [recette] Annuler : rien supprimé ; décocher des lignes : elles restent.

### ST-EVT-07 — Localiser et colorer les événements
Destination : Atelier Planning › Voir dans la 3D — 04 §5.7
- **ST-EVT-07.1** [=] Sélectionner, isoler, cadrer les objets d'un événement.
- **ST-EVT-07.2** [=] Même chose pour un ensemble (groupe ou contexte d'événements).
- **ST-EVT-07.3** [=] Colorer les objets d'après la couleur de leur groupe ; « Restaurer les couleurs ».
- **ST-EVT-07.4** [=] Résolution partagée avec tickets et notes : parents géographiques, références BIM, regroupement par maquette.
- **ST-EVT-07.5** [=] C'est une capacité de navigation, pas une fonction de prise de notes.
- **ST-EVT-07.6** [+] Objet sans représentation 3D : message explicite.
- **ST-EVT-07.7** [+] Couleurs libérées en quittant l'atelier ou le jumeau.
- **ST-EVT-07.8** [recette] Du calendrier vers la 3D ; d'un groupe vers la 3D ; plusieurs maquettes.
- **ST-EVT-07.9** [recette] Objet sans représentation ; rétablissement de la vue.

### ST-MIS-01 — Associer un contexte de tickets à un organ Mission
Destination : Atelier Tickets › Mission — 04 §5.6
- **ST-MIS-01.1** [=] Action « Lier et gérer Mission », visible seulement sur la racine d'un contexte de tickets.
- **ST-MIS-01.2** [=] Choix d'un organ existant, listé depuis `/etc/Organs/ticket`.
- **ST-MIS-01.3** [=] Choix du contexte spatial (ou d'un autre contexte).
- **ST-MIS-01.4** [=] Identifiant API Mission.
- **ST-MIS-01.5** [=] Mot de passe masqué, avec bouton afficher/masquer.
- **ST-MIS-01.6** [=] Appelant.
- **ST-MIS-01.7** [=] Préfixe bâtiment.
- **ST-MIS-01.8** [=] Intervalle de récupération en millisecondes, défaut 300 000 (5 min) ; l'unité est affichée.
- **ST-MIS-01.9** [=] Date de dernière synchronisation.
- **ST-MIS-01.10** [=] Enregistrement : pointeur `element` du contexte vers le modèle de configuration de l'organ, avec chemin du jumeau, `contextId`, `spatialContextID` et champs `mission.*`.
- **ST-MIS-01.11** [=] L'enregistrement demande un redémarrage de l'organ (`restart = true`).
- **ST-MIS-01.12** [=] L'écran dit qu'il configure un organ existant et ne le déploie pas.
- **ST-MIS-01.13** [=] Rouvrir une configuration existante sans effacer de champ, y compris ceux non affichés.
- **ST-MIS-01.14** [+] Changer d'organ ou de contexte demande une confirmation.
- **ST-MIS-01.15** [+] Le mot de passe n'apparaît jamais dans un toast, un journal ou une erreur copiable.
- **ST-MIS-01.16** [recette] Reprise d'une configuration existante ; dates et unités de temps conservées.
- **ST-MIS-01.17** [recette] Sauvegarde affichée comme « Demande envoyée », distincte du traitement effectif par Mission.
- **ST-MIS-01.18** [recette] Aucun secret réel dans la documentation ni les jeux de test.

### ST-MIS-02 — Superviser et commander l'organ
Destination : Atelier Tickets › Mission — 04 §5.6
- **ST-MIS-02.1** [=] Le panneau suit le modèle de l'organ en direct.
- **ST-MIS-02.2** [=] États affichés : non lié, en attente, synchronisation spatiale, synchronisation des processus, en fonctionnement, synchronisation équipements, redémarrage.
- **ST-MIS-02.3** [=] « Exécuter » écrit `organStatus = 3`.
- **ST-MIS-02.4** [=] « Arrêter » écrit `organStatus = 0`.
- **ST-MIS-02.5** [=] « Synchroniser le spatial » écrit `organStatus = 1`.
- **ST-MIS-02.6** [=] « Synchroniser les processus » écrit `organStatus = 2`.
- **ST-MIS-02.7** [=] « Synchroniser les équipements » écrit `organStatus = 4` (voir ST-MIS-03).
- **ST-MIS-02.8** [=] « Redémarrer » écrit `restart = true`.
- **ST-MIS-02.9** [=] Commandes désactivées tant que le contexte n'est pas lié et pendant une opération en cours.
- **ST-MIS-02.10** [+] Distinguer « Demande envoyée » et état rapporté par l'organ ; au-delà du délai, « Sans réponse de l'organ ».
- **ST-MIS-02.11** [?] Valeur du délai avant « Sans réponse de l'organ » pour Mission.
- **ST-MIS-02.12** [!] Ne pas reprendre les actions vides de l'existant (`start()`, `syncEquipMission()`) : chaque bouton écrit réellement sa demande.
- **ST-MIS-02.13** [+] Pas de double demande : le bouton reste désactivé tant que la demande précédente n'a pas de réponse.
- **ST-MIS-02.14** [+] Organ Mission absent : carte « Indisponible » qui nomme la cause ; le reste de l'atelier Tickets marche.
- **ST-MIS-02.15** [recette] Les états externes sont reflétés ; erreurs et déconnexions visibles ; aucune double demande involontaire.

### ST-MIS-03 — Choisir les contextes d'équipements envoyés à Mission
Destination : Atelier Tickets › Mission — 04 §5.6
- **ST-MIS-03.1** [=] Lister les contextes de type `BIMObjectGroupContext` du jumeau.
- **ST-MIS-03.2** [=] Sélection multiple des contextes à envoyer.
- **ST-MIS-03.3** [=] Enregistrer la sélection dans `mission.contextsEquip` de la configuration de l'organ désigné par son identifiant serveur.
- **ST-MIS-03.4** [=] Demander la synchronisation en écrivant `mission.organStatus = 4`.
- **ST-MIS-03.5** [=] Ce périmètre reste distinct du contexte spatial et du contexte de tickets (trois réglages séparés).
- **ST-MIS-03.6** [recette] Zéro, un et plusieurs contextes ; réouverture fidèle ; contextes non choisis exclus.

### ST-MES-01 — Explorer les points d'un objet
Destination : Fiche › Mesures — 04 §3.5
- **ST-MES-01.1** [=] Onglet « Mesures » de la fiche, affiché seulement si l'objet a des points, avec compteur.
- **ST-MES-01.2** [=] Deux blocs séparés : « Points de la GTB » (endpoints BMS) et « Points de contrôle », trouvés par leurs relations métier.
- **ST-MES-01.3** [=] Accessible depuis le navigateur et la 3D pour les types compatibles : équipement, pièce, appareil, réseau.
- **ST-MES-01.4** [=] Carte : nom, valeur courante, unité.
- **ST-MES-01.5** [+] Carte : horodatage de la dernière valeur et type (nombre, texte, booléen).
- **ST-MES-01.6** [=] Valeur mise à jour en direct par abonnement au modèle.
- **ST-MES-01.7** [=] Recherche par texte dans les points.
- **ST-MES-01.8** [=] Sélection d'une carte.
- **ST-MES-01.9** [?] Réglage du nombre de colonnes : le reprendre ou le remplacer par une grille adaptative ?
- **ST-MES-01.10** [=] Disposition non enregistrée.
- **ST-MES-01.11** [+] `0`, `false` et valeur absente distingués : « 0 », « Non », « — ».
- **ST-MES-01.12** [=] Abonnements détachés au changement d'objet, de jumeau ou à la fermeture.
- **ST-MES-01.13** [=] Ce domaine (points existants) reste distinct des dashboards standards (ST-DASH) et des analyses.
- **ST-MES-01.14** [recette] Équipement, pièce, appareil ou réseau compatible, objet sans point.
- **ST-MES-01.15** [recette] Points numérique, texte et booléen ; rafraîchissement des valeurs ; aucun abonnement résiduel.

### ST-MES-02 — Modifier une valeur et transmettre une commande terrain
Destination : Fiche › Mesures — 04 §3.5
- **ST-MES-02.1** [=] « Modifier la valeur » sur chaque carte.
- **ST-MES-02.2** [=] Saisie selon le type : interrupteur OFF/ON pour un booléen, champ nombre, champ texte.
- **ST-MES-02.3** [=] Saisie de la priorité.
- **ST-MES-02.4** [=] Recherche des parents réseau/appareil, puis de l'organ BACnet, OPC UA ou SNMP.
- **ST-MES-02.5** [+] Le dialogue dit **avant** l'envoi : « Envoyé au terrain par <organ> » ou « Écrit seulement dans le jumeau ».
- **ST-MES-02.6** [=] Organ trouvé : création d'un modèle de pilotage dans le graphe.
- **ST-MES-02.7** [=] Aucun pilotage possible : mise à jour directe du point dans le graphe.
- **ST-MES-02.8** [=] BACnet : une requête par appareil avec adresse, identifiant appareil, SADR éventuel, type et instance d'objet, valeur, priorité (défaut 16).
- **ST-MES-02.9** [=] OPC UA : identifiant réseau / chemin du point, informations serveur de l'appareil, valeur.
- **ST-MES-02.10** [=] SNMP : OID, type de donnée, adresse, valeur.
- **ST-MES-02.11** [=] États affichés : Envoi · Accepté par l'organ · Échec (attente de `success` ou `error` sur le modèle de pilotage).
- **ST-MES-02.12** [=] Sur succès : mise à jour du graphe, suppression du modèle de commande, détachement de l'écouteur.
- **ST-MES-02.13** [=] `directModificationDate` mis à jour si l'attribut existe.
- **ST-MES-02.14** [=] Texte incompatible avec un point numérique ou booléen : refusé avant envoi.
- **ST-MES-02.15** [=] `0` et `false` envoyés tels quels, jamais pris pour une valeur vide.
- **ST-MES-02.16** [=] Historisation : endpoint ordinaire mis à jour avec conservation de la série ; point de contrôle selon son `saveTimeSeries`.
- **ST-MES-02.17** [+] Pas de délai maximal dans l'existant : au-delà du délai prévu, afficher « Sans réponse de l'organ ».
- **ST-MES-02.18** [?] Retirer aussi le modèle de commande sur échec ou expiration (pas de commande orpheline) ?
- **ST-MES-02.19** [=] Une écriture dans le jumeau n'est jamais présentée comme un acquittement du terrain.
- **ST-MES-02.20** [=] Un refus de droit du hub est affiché ; le bouton visible ne vaut pas autorisation.
- **ST-MES-02.21** [recette] Les trois protocoles avec organ ; point sans organ ; succès et erreur ; organ arrêté.
- **ST-MES-02.22** [recette] Valeur `0` et `false` ; texte invalide ; priorité transmise ; historisation activée puis désactivée.
- **ST-MES-02.23** [recette] Aucune commande orpheline dans le graphe après succès, échec ou fermeture.

### ST-MES-03 — Ouvrir la documentation d'un point
Destination : Fiche › Mesures — 04 §3.5
- **ST-MES-03.1** [=] « Documentation du point » ouvre la fiche du nœud endpoint (attributs, documents, notes), avec les mêmes fonctions que tout objet.
- **ST-MES-03.2** [=] L'identité du point reste distincte de celle de son équipement.
- **ST-MES-03.3** [recette] Après navigation entre plusieurs objets, la documentation ouverte est celle du bon point.

### ST-MES-04 — Supprimer un point ou seulement dissocier un réseau
Destination : Fiche › Mesures — 04 §3.5
- **ST-MES-04.1** [=] « Supprimer le point » : confirmation, puis retrait du graphe (`removeFromGraph(endpointId)`).
- **ST-MES-04.2** [=] « Dissocier un réseau » : liste des nœuds BMS directement liés à l'objet ; retire seulement la relation avec l'objet courant.
- **ST-MES-04.3** [=] Relation déterminée selon le type du nœud BMS : réseau, appareil, groupe, endpoint ; variantes `PtrLst` et `LstPtr` prises en charge.
- **ST-MES-04.4** [+] Deux actions séparées, deux couleurs (« Supprimer » en rouge), deux confirmations différentes.
- **ST-MES-04.5** [+] La confirmation de dissociation dit « Le réseau reste accessible depuis ses autres parents ».
- **ST-MES-04.6** [recette] Annuler l'une ou l'autre : aucun effet.
- **ST-MES-04.7** [recette] Réseau partagé : après dissociation, il reste accessible depuis ses autres parents.

### ST-MES-05 — Exporter les séries d'un point en Excel
Destination : Fiche › Mesures — 04 §3.5
- **ST-MES-05.1** [=] « Exporter l'historique (Excel) » sur chaque carte, fichier `.xlsx`.
- **ST-MES-05.2** [=] Colonnes : date, valeur, unité.
- **ST-MES-05.3** [=] Horodatages convertis en dates lisibles.
- **ST-MES-05.4** [=] Unité lue dans l'attribut documentaire `default/unit`.
- **ST-MES-05.5** [=] Nom du fichier : nom de l'objet + nom du point.
- **ST-MES-05.6** [=] Feuille nommée `endpoint_controlpoint`.
- **ST-MES-05.7** [+] Choix de la période (début, fin) avant export ; l'existant n'en proposait pas.
- **ST-MES-05.8** [!] Série absente ou vide : message « Pas de données sur la période » au lieu d'un fichier cassé.
- **ST-MES-05.9** [!] Unité absente : colonne unité vide, export quand même.
- **ST-MES-05.10** [+] Gros volume : export en tâche dans le plateau.
- **ST-MES-05.11** [non] Ne pas promettre « tout l'historique » tant que le service de lecture n'est pas vérifié.
- **ST-MES-05.12** [recette] Unités et dates fidèles ; `0` et `false` exportés ; point vide ; unité manquante ; gros volume.

### ST-MES-06 — Superposer des historiques de plusieurs points
Destination : Dock Courbes — 04 §5.8
- **ST-MES-06.1** [=] Ajouter un point aux courbes depuis une carte de mesure ou le navigateur.
- **ST-MES-06.2** [=] Rajouter un point déjà présent le retire et coupe son abonnement.
- **ST-MES-06.3** [=] Plusieurs points superposés en même temps.
- **ST-MES-06.4** [=] Tracé depuis les séries temporelles des points numériques ou booléens.
- **ST-MES-06.5** [=] Noms et valeurs courantes suivis en direct.
- **ST-MES-06.6** [+] Dock repliable sous le viewer, au lieu d'un panneau flottant.
- **ST-MES-06.7** [+] Bibliothèque uPlot au lieu de Plotly.
- **ST-MES-06.8** [+] Un axe par unité, deux axes au plus ; au-delà, courbes normalisées, et c'est indiqué.
- **ST-MES-06.9** [!] Ouvrir une courbe ne crée plus de série temporelle absente (décision O-3 : une lecture n'écrit rien ; la série vient de l'acquisition ou d'une écriture explicite).
- **ST-MES-06.10** [=] Point sans historique : « Pas de données sur la période ».
- **ST-MES-06.11** [=] Point texte : non tracé, avec la raison.
- **ST-MES-06.12** [=] Abonnements libérés à la fermeture du dock et au changement de jumeau.
- **ST-MES-06.13** [recette] Ajout, retrait et superposition ; point sans données ; point texte.
- **ST-MES-06.14** [recette] Ouvrir la courbe d'un point sans série : aucune série créée dans le graphe.
- **ST-MES-06.15** [recette] Séries existantes inchangées ; aucun abonnement résiduel après fermeture.

### ST-MES-07 — Choisir la période des courbes
Destination : Dock Courbes › Période — 04 §5.8
- **ST-MES-07.1** [=] Raccourci « 1 h ».
- **ST-MES-07.2** [=] Raccourci « 3 h ».
- **ST-MES-07.3** [=] Raccourci « 24 h » glissantes.
- **ST-MES-07.4** [=] Raccourci « Hier » = journée civile précédente, distincte des 24 h glissantes.
- **ST-MES-07.5** [=] Raccourci « 3 jours ».
- **ST-MES-07.6** [=] Raccourci « 7 jours ».
- **ST-MES-07.7** [=] « Personnalisée » : début et fin.
- **ST-MES-07.8** [?] « 3 jours » et « 7 jours » : glissants ou en journées civiles ? Vérifier l'existant.
- **ST-MES-07.9** [=] Dates disponibles lues dans les archives des séries, réunies pour tous les points, et proposées au choix ; une autre date peut être saisie.
- **ST-MES-07.10** [=] La période s'applique à tous les points superposés.
- **ST-MES-07.11** [=] La dernière période personnalisée est retenue tant que le dock est ouvert.
- **ST-MES-07.12** [=] Pas de mémorisation durable de la période.
- **ST-MES-07.13** [=] Début après la fin : refusé avec message.
- **ST-MES-07.14** [recette] « Hier » ≠ « 24 h » ; bornes personnalisées cohérentes.
- **ST-MES-07.15** [recette] Fuseau horaire et changement d'heure ; données manquantes ; points aux archives disjointes.

### ST-MES-08 — Configurer la présentation d'un graphique
Destination : Dock Courbes › Réglages — 04 §5.8
- **ST-MES-08.1** [=] Mode de tracé : lignes, points, lignes + points.
- **ST-MES-08.2** [=] Curseur de plage (activer / désactiver).
- **ST-MES-08.3** [=] Légende : afficher ou masquer.
- **ST-MES-08.4** [=] Légende : orientation horizontale ou verticale.
- **ST-MES-08.5** [=] Légende : position et ancrage X/Y.
- **ST-MES-08.6** [?] Garder le placement libre X/Y de la légende ou le remplacer par quelques positions prédéfinies ?
- **ST-MES-08.7** [=] Axe temporel ; nom de chaque courbe = nom du point.
- **ST-MES-08.8** [=] Réglages appliqués à toutes les séries.
- **ST-MES-08.9** [=] Deux messages distincts : « Aucun point ajouté » et « Pas de données sur la période ».
- **ST-MES-08.10** [=] Le graphique suit le redimensionnement du dock.
- **ST-MES-08.11** [+] « Réinitialiser le zoom ».
- **ST-MES-08.12** [+] Valeur au survol, en chiffres tabulaires, avec unité.
- **ST-MES-08.13** [non] Sauvegarde ou export de préréglages de graphique : non démontrés, non prévus.
- **ST-MES-08.14** [recette] Chaque mode, légende lisible, navigation temporelle et réinitialisation de vue.

### ST-DASH-01 — Créer et modifier des modèles de dashboard
Destination : Atelier Dashboards — 04 §5.9
- **ST-DASH-01.1** [=] Créer un contexte de dashboards nommé.
- **ST-DASH-01.2** [=] Nom de contexte déjà existant : création refusée avec message.
- **ST-DASH-01.3** [=] Créer un modèle dans le contexte : nom, type géographique, mesures standards.
- **ST-DASH-01.4** [=] Types géographiques : site, bâtiment, étage, zone, pièce, équipement.
- **ST-DASH-01.5** [=] Mesure Température : °C, numérique.
- **ST-DASH-01.6** [=] Mesure Hygrométrie : %, numérique.
- **ST-DASH-01.7** [=] Mesure Puissance : W, numérique.
- **ST-DASH-01.8** [=] Mesure Occupation : booléen.
- **ST-DASH-01.9** [=] Mesure Éclairage : %, numérique.
- **ST-DASH-01.10** [=] Mesure Alarme : booléen.
- **ST-DASH-01.11** [=] Enregistrement : `AbstractElement` avec liste `sensor`, nœud relié au contexte par `hasDashBoard`.
- **ST-DASH-01.12** [=] Modifier un modèle depuis son nœud.
- **ST-DASH-01.13** [+] La modification dit « Les objets déjà équipés ne sont pas mis à jour » (l'existant ne propage pas).
- **ST-DASH-01.14** [?] Proposer une propagation explicite des modifications aux objets déjà équipés ?
- **ST-DASH-01.15** [=] Les dashboards standards restent distincts du panneau des points (ST-MES) et des analyses.
- **ST-DASH-01.16** [recette] Créer et relire un modèle de chaque type avec chaque mesure.
- **ST-DASH-01.17** [recette] Modifier un modèle sans perte de champ ; comportement envers les instances conforme au message.

### ST-DASH-02 — Appliquer un dashboard à un objet
Destination : Atelier Dashboards — 04 §5.9
- **ST-DASH-02.1** [=] Depuis un objet compatible : choisir le contexte de dashboards, puis un modèle.
- **ST-DASH-02.2** [=] Seuls les modèles du même type que l'objet sont proposés.
- **ST-DASH-02.3** [=] L'application relie le modèle à l'objet (`hasConnected`).
- **ST-DASH-02.4** [=] Elle crée sous l'objet un endpoint par mesure (`hasDashEndpoint`), avec nom, unité, type et valeur initiale du modèle.
- **ST-DASH-02.5** [=] Dashboard déjà présent : ses anciens endpoints sont retirés et l'association remplacée.
- **ST-DASH-02.6** [+] La confirmation dit que les points existants seront **remplacés** et donne le nombre créé et retiré.
- **ST-DASH-02.7** [=] Action présentée comme création d'objets métier, pas comme une préférence d'affichage.
- **ST-DASH-02.8** [?] Que deviennent les historiques des anciens endpoints remplacés ? À vérifier et à dire.
- **ST-DASH-02.9** [recette] Compatibilité de type ; choix entre plusieurs modèles ; remplacement explicite ; données attendues préservées.

### ST-DASH-03 — Appliquer des dashboards à une arborescence
Destination : Atelier Dashboards — 04 §5.9
- **ST-DASH-03.1** [=] Lister les types descendants compatibles du nœud de départ.
- **ST-DASH-03.2** [=] Pour chaque type : choisir un contexte et un modèle, ou « Aucun ».
- **ST-DASH-03.3** [=] Les équipements sont exclus de la liste des types.
- **ST-DASH-03.4** [=] Parcours des relations géographiques de la sous-arborescence, application du modèle aux objets du type retenu.
- **ST-DASH-03.5** [=] Un type laissé à « Aucun » n'est pas modifié.
- **ST-DASH-03.6** [+] Aperçu du nombre d'objets touchés par type avant application, dont ceux déjà équipés (remplacement).
- **ST-DASH-03.7** [+] Exécution en tâche, avec bilan par objet dans le plateau.
- **ST-DASH-03.8** [recette] Périmètre limité à la sous-arborescence ; types à « Aucun » intacts.
- **ST-DASH-03.9** [recette] Remplacements annoncés avant ; bilan du nombre d'objets juste.

### ST-DASH-04 — Configurer les règles de calcul et références de mesure
Destination : Atelier Dashboards — 04 §5.9
- **ST-DASH-04.1** [=] Sur un objet équipé : choisir le point de sortie, puis la règle.
- **ST-DASH-04.2** [=] Règles : somme, moyenne, maximum, minimum, référence.
- **ST-DASH-04.3** [=] Règle « référence » : choix du nœud parmi les descendants disponibles.
- **ST-DASH-04.4** [=] Enregistrement `dash_cal_rule = {rule, ref}` sur l'endpoint du dashboard.
- **ST-DASH-04.5** [=] Codes conservés : `sum=0`, `average=1`, `max=2`, `min=3`, `reference=4`.
- **ST-DASH-04.6** [=] Sur un équipement : associer chaque type de mesure du dashboard à un endpoint BMS existant.
- **ST-DASH-04.7** [=] Association enregistrée dans `info.reference[type]` du `BIMObject`.
- **ST-DASH-04.8** [+] Le texte dit que la règle est **enregistrée** et que son calcul dépend du moteur déployé ; aucun recalcul instantané annoncé.
- **ST-DASH-04.9** [+] Référence vers un nœud supprimé : signalée « Référence introuvable ».
- **ST-DASH-04.10** [recette] Règle et référence relues à l'identique ; suppression d'une référence détectée.
- **ST-DASH-04.11** [recette] Codes de règles compatibles avec les données existantes.

### ST-DASH-05 — Définir des calculs en lot
Destination : Atelier Dashboards — 04 §5.9
- **ST-DASH-05.1** [=] Lister les éléments qui ont un dashboard ; les autres sont ignorés.
- **ST-DASH-05.2** [=] Choisir des objets, un type de point et une règle : somme, moyenne, maximum ou minimum.
- **ST-DASH-05.3** [=] « Référence » exclue en lot.
- **ST-DASH-05.4** [=] Construire une table d'affectations ; chaque ligne est retirable avant enregistrement.
- **ST-DASH-05.5** [=] Appliquer les règles aux seules lignes retenues.
- **ST-DASH-05.6** [+] Confirmation de portée (nombre d'objets), puis résultat par objet dans le plateau.
- **ST-DASH-05.7** [recette] Objets sans dashboard ignorés ; seuls des points compatibles proposés.
- **ST-DASH-05.8** [recette] Retirer une ligne avant validation ; règles enregistrées seulement pour le lot validé.

## 10. Analyses

### ST-ANA-01 — Structurer les analyses par familles d'entités
Destination : Atelier Analyses (04 §5.10), plein cadre par défaut, arbre de gauche
- **ST-ANA-01.1** [=] Ouvrir l'atelier Analyses en plein cadre par défaut, avec l'arbre contextes → familles → analyses.
- **ST-ANA-01.2** [=] Créer un contexte d'analyses de type `analysisContext`.
- **ST-ANA-01.3** [=] Gérer plusieurs contextes d'analyses dans le même jumeau, chacun avec ses familles.
- **ST-ANA-01.4** [=] Créer une famille d'entités avec trois champs : nom, nom standard, type d'entité.
- **ST-ANA-01.5** [=] Proposer les types d'entité : bâtiment, étage, pièce, équipement BIM, groupe d'étages, groupe de pièces, groupe d'équipements, organ de monitoring, autre.
- **ST-ANA-01.6** [=] Dans le dialogue de création du contexte, ajouter d'un coup les familles « standards » (entités standards prédéfinies).
- **ST-ANA-01.7** [=] Dans ce même dialogue, gérer la liste des familles à créer : ajouter, retirer, réordonner.
- **ST-ANA-01.8** [=] Ajouter une famille à un contexte déjà créé.
- **ST-ANA-01.9** [=] Persister le graphe contexte → `hasEntity` → famille → `hasAnalytics` → analyse.
- **ST-ANA-01.10** [=] Conserver le type d'entité et le nom standard de chaque famille : ils déterminent la population de travail des analyses (ST-ANA-03).
- **ST-ANA-01.11** [+] Afficher sur chaque analyse de l'arbre un statut « Active » ou « Inactive » (icône + libellé).
- **ST-ANA-01.12** [+] Afficher les types d'entité en français métier ; le type technique reste visible en mode expert.
- **ST-ANA-01.13** [recette] Plusieurs contextes d'analyses : chaque famille et chaque analyse sont créées sous le bon parent.
- **ST-ANA-01.14** [recette] Ajout d'une famille après création du contexte : rattachée par `hasEntity` au bon contexte, type et nom standard relus à l'identique.

### ST-ANA-02 — Définir une analyse et son état d'exploitation
Destination : Atelier Analyses, éditeur, section 1 « Général »
- **ST-ANA-02.1** [=] Champ nom de l'analyse.
- **ST-ANA-02.2** [=] Champ description.
- **ST-ANA-02.3** [=] Interrupteur « Active » / « Inactive ».
- **ST-ANA-02.4** [=] Option « Exécuter au démarrage de l'organ ».
- **ST-ANA-02.5** [=] Option « Rattraper les exécutions manquées » (`analyticShouldCatchUpPastExecutions`).
- **ST-ANA-02.6** [=] Champ facultatif « cron d'agrégation » des exécutions.
- **ST-ANA-02.7** [=] À la création, préparer les nœuds inputs, outputs, tracking et config de l'analyse.
- **ST-ANA-02.8** [=] Persister la configuration en catégories d'attributs sur ces nœuds.
- **ST-ANA-02.9** [=] Initialiser la date de dernière exécution à l'instant de la création.
- **ST-ANA-02.10** [!] Enregistrer réellement `analyticShouldCatchUpPastExecutions` : l'ancien dialogue l'affichait sans l'écrire.
- **ST-ANA-02.11** [!] Valider la sauvegarde sur la configuration multi-algorithmes réelle, et non sur les anciens champs `algorithm` et `intervalTime`.
- **ST-ANA-02.12** [+] Éditeur en sections sur une seule page, avec un sommaire à gauche et une validation par section, au lieu de l'assistant fermé.
- **ST-ANA-02.13** [+] La synthèse finale avant sauvegarde devient l'état de validation affiché par section dans le sommaire.
- **ST-ANA-02.14** [+] Aide sous le cron d'agrégation : validation de l'expression et les 5 prochaines échéances (même composant que ST-ANA-06).
- **ST-ANA-02.15** [recette] Sauvegarder puis relire : tous les paramètres généraux identiques, y compris la description et l'horodatage de création.
- **ST-ANA-02.16** [recette] Une analyse inactive n'est exécutée par aucun moteur ; l'activation est une action volontaire de l'utilisateur.
- **ST-ANA-02.17** [recette] Rattrapage activé : vérifier auprès de l'organ d'analyse déployé (service `analysis`) qu'il lit bien l'option.

### ST-ANA-03 — Choisir une ancre et la population d'analyse
Destination : Atelier Analyses, éditeur, section 2 « Population »
- **ST-ANA-03.1** [=] Rattacher chaque analyse à une famille d'entités.
- **ST-ANA-03.2** [=] Ancre de type groupe : choisir contexte de groupes, puis catégorie, puis groupe.
- **ST-ANA-03.3** [=] Ancre spatiale : choisir un bâtiment, un étage ou une pièce.
- **ST-ANA-03.4** [=] Ancre de type contexte : choisir un contexte.
- **ST-ANA-03.5** [=] Résolution : ancre du même type que la famille → l'ancre elle-même.
- **ST-ANA-03.6** [=] Résolution : ancre groupe → enfants par la relation `groupHas<type>`.
- **ST-ANA-03.7** [=] Résolution : ancre contexte → recherche des nœuds du type de la famille dans ce contexte.
- **ST-ANA-03.8** [=] Résolution directe : bâtiment → étages, étage → pièces, pièce → objets BIM.
- **ST-ANA-03.9** [=] Toute autre combinaison ne lance aucun parcours géographique arbitraire et peut donner une liste vide.
- **ST-ANA-03.10** [=] Une même définition s'applique à toutes les entités résolues, sans dupliquer l'analyse.
- **ST-ANA-03.11** [=] Persister le lien depuis le nœud inputs vers l'entité suivie (l'ancre).
- **ST-ANA-03.12** [+] Afficher l'aperçu des entités suivies (nombre et liste) dès le choix de l'ancre.
- **ST-ANA-03.13** [+] Population vide : le dire avec la raison (« ancre Étage et famille Équipement BIM : aucune correspondance directe »).
- **ST-ANA-03.14** [+] Distinguer visuellement le nœud de définition « famille » et les objets du jumeau réellement suivis.
- **ST-ANA-03.15** [recette] Groupe évolutif : un objet ajouté au groupe entre dans la population.
- **ST-ANA-03.16** [recette] Ancre contexte, pièce isolée et arbre spatial (bâtiment, étage) : populations attendues.
- **ST-ANA-03.17** [recette] Réouverture : les références existantes sont conservées ; une ancre disparue du graphe est signalée.

### ST-ANA-04 — Définir les entrées et leur recherche dans le graphe
Destination : Atelier Analyses, éditeur, section 3 « Entrées »
- **ST-ANA-04.1** [=] Ajouter et retirer plusieurs entrées nommées `I0`, `I1`, … `In`.
- **ST-ANA-04.2** [=] Méthode de suivi par entrée : endpoint, point de contrôle, ou attribut filtré par nom.
- **ST-ANA-04.3** [=] Filtre endpoint et point de contrôle : expression régulière sensible à la casse.
- **ST-ANA-04.4** [=] Filtre attribut au format `catégorie:attribut`.
- **ST-ANA-04.5** [=] Paramètre profondeur de recherche.
- **ST-ANA-04.6** [=] Option profondeur stricte (oui / non).
- **ST-ANA-04.7** [=] Noms des relations à parcourir, séparés par des virgules.
- **ST-ANA-04.8** [=] Option « capture multiple » : tous les modèles correspondants au lieu du premier, selon la méthode.
- **ST-ANA-04.9** [=] Endpoint et point de contrôle : intervalle temporel, `0` signifiant la valeur courante.
- **ST-ANA-04.10** [=] Option « réinjecter au début de l'intervalle la dernière valeur connue ».
- **ST-ANA-04.11** [=] Type d'entrée obtenu : scalaire, liste de modèles, ou série de couples date/valeur.
- **ST-ANA-04.12** [=] Persister une catégorie de tracking par identifiant d'entrée (`I0`…), avec les attributs méthode, profondeur, profondeur stricte, relations, filtre, série.
- **ST-ANA-04.13** [=] Ne jamais reconstruire une entrée depuis son seul nom d'affichage.
- **ST-ANA-04.14** [!] Refuser à la saisie la combinaison capture multiple + intervalle positif, avec le sens du message moteur `Timeseries and multiple input capture is not compatible`.
- **ST-ANA-04.15** [!] Refuser à la saisie un intervalle négatif (rejeté par le moteur).
- **ST-ANA-04.16** [+] Avertir qu'en rattrapage avec intervalle `0`, la valeur courante est réutilisée pour chaque instant rejoué, sans reconstruction historique.
- **ST-ANA-04.17** [+] Éditeur CodeMirror pour l'expression régulière, avec vérification de syntaxe.
- **ST-ANA-04.18** [recette] Recherche à plusieurs profondeurs, stricte et non stricte, avec et sans relations explicites.
- **ST-ANA-04.19** [recette] Casse : un filtre en minuscules ne trouve pas un endpoint en majuscules.
- **ST-ANA-04.20** [recette] Zéro correspondance, une, plusieurs (avec et sans capture multiple).
- **ST-ANA-04.21** [recette] Début d'intervalle sans mesure, avec et sans réinjection de la dernière valeur.
- **ST-ANA-04.22** [recette] Valeurs `0` et `false` transmises telles quelles, jamais confondues avec « absent ».
- **ST-ANA-04.23** [recette] Ajout et retrait d'entrées : les indices `I*` restent stables et les références des calculs ne glissent pas.

### ST-ANA-05 — Prévisualiser le périmètre des entrées
Destination : Atelier Analyses, éditeur, section 3 « Entrées », bouton « Prévisualiser »
- **ST-ANA-05.1** [=] Avant sauvegarde, scanner les relations accessibles à la profondeur prévue.
- **ST-ANA-05.2** [=] Afficher les données disponibles pour la méthode choisie (endpoints, points de contrôle, attributs).
- **ST-ANA-05.3** [=] Prévisualiser, pour chaque entité de travail, les modèles ou attributs capturés par le filtre.
- **ST-ANA-05.4** [=] Résultat structuré, indexé par nom d'entité.
- **ST-ANA-05.5** [=] Signaler les entités sans correspondance (`Not found`), affiché « Introuvable ».
- **ST-ANA-05.6** [=] La prévisualisation porte sur les entrées seulement, pas sur l'exécution des sorties métier.
- **ST-ANA-05.7** [=] Aucun effet : ni ticket, ni écriture, ni commande, ni message (§9.2).
- **ST-ANA-05.8** [non] Prévisualisation globale de l'analyse : désactivée historiquement (`isGlobalPreviewDisabled` renvoie toujours vrai), donc absente et non annoncée.
- **ST-ANA-05.9** [recette] Même configuration : résultat de la prévisualisation identique aux entrées collectées par le moteur.
- **ST-ANA-05.10** [recette] Prévisualiser une analyse avec sortie ticket, SMS et Google Chat : aucun envoi, aucune écriture dans le graphe.

### ST-ANA-06 — Définir plusieurs déclencheurs
Destination : Atelier Analyses, éditeur, section 4 « Déclencheurs »
- **ST-ANA-06.1** [=] Plusieurs déclencheurs nommés par analyse, ajoutés et retirés un par un.
- **ST-ANA-06.2** [=] Type intervalle : durée en millisecondes.
- **ST-ANA-06.3** [=] Type changement de valeur : choix de l'entrée surveillée.
- **ST-ANA-06.4** [=] Type changement de valeur avec seuil : choix de l'entrée + seuil.
- **ST-ANA-06.5** [=] Type cron : expression cron.
- **ST-ANA-06.6** [=] Aide sur la syntaxe cron.
- **ST-ANA-06.7** [=] Sérialiser chaque déclencheur avec son type, son entrée ou intervalle ou expression, et son seuil éventuel.
- **ST-ANA-06.8** [=] Les déclencheurs sont indépendants du graphe de calcul.
- **ST-ANA-06.9** [=] Créer ou modifier un déclencheur n'envoie rien vers l'extérieur.
- **ST-ANA-06.10** [+] Valider l'expression cron (`cron-parser`) et afficher les 5 prochaines exécutions.
- **ST-ANA-06.11** [+] Refuser un intervalle nul ou négatif.
- **ST-ANA-06.12** [+] Signaler un déclencheur qui référence une entrée supprimée, et bloquer l'enregistrement de la section.
- **ST-ANA-06.13** [+] Saisie de l'intervalle en unité lisible (s, min, h), stockée en millisecondes.
- **ST-ANA-06.14** [recette] Expression cron invalide : refusée avec message.
- **ST-ANA-06.15** [recette] Combinaison de plusieurs déclencheurs relue à l'identique.
- **ST-ANA-06.16** [recette] Redémarrage de l'organ d'analyse : déclencheurs toujours pris en compte (organ déployé non vérifié par l'inventaire).

### ST-ANA-07 — Composer une chaîne de calculs ordonnée
Destination : Atelier Analyses, éditeur, section 5 « Calculs »
- **ST-ANA-07.1** [=] Ajouter et retirer plusieurs algorithmes `A0`, `A1`, … `An`.
- **ST-ANA-07.2** [=] Choisir l'opération de chaque algorithme dans le registre des 41 opérations (ST-ANA-08).
- **ST-ANA-07.3** [=] Saisir les paramètres typés et documentés de l'opération.
- **ST-ANA-07.4** [=] Choisir les dépendances de chaque algorithme parmi les entrées `I*` et les sorties d'autres `A*`.
- **ST-ANA-07.5** [=] Réordonner les dépendances par glisser-déposer (et au clavier).
- **ST-ANA-07.6** [=] Désigner le résultat final `R` par une sélection distincte.
- **ST-ANA-07.7** [=] L'ordre des dépendances a un effet métier (division, soustraction, copie, autres opérations non commutatives) : l'afficher comme tel.
- **ST-ANA-07.8** [=] Persister la catégorie « Algorithm index mapping ».
- **ST-ANA-07.9** [=] Persister la catégorie « Algorithm parameters », paramètres préfixés par l'indice de l'algorithme.
- **ST-ANA-07.10** [=] Persister la catégorie « IO dependencies », dépendances sérialisées par virgules.
- **ST-ANA-07.11** [=] Résolution récursive des dépendances à l'exécution, avec erreurs « entrée introuvable » et « résultat indéfini », et arrêt volontaire `EXIT` intercepté.
- **ST-ANA-07.12** [+] Graphe des dépendances entre `I*`, `A*` et `R`.
- **ST-ANA-07.13** [+] Détecter et signaler les cycles (absents des anciens écrans).
- **ST-ANA-07.14** [+] Signaler les références orphelines (algorithme ou entrée supprimés mais encore référencés).
- **ST-ANA-07.15** [+] Signaler les types incompatibles (série attendue, scalaire fourni, booléen attendu…).
- **ST-ANA-07.16** [recette] Sortie intermédiaire réutilisée par plusieurs algorithmes.
- **ST-ANA-07.17** [recette] Même entrée utilisée dans plusieurs algorithmes.
- **ST-ANA-07.18** [recette] Ordre des dépendances conservé après enregistrement et réouverture.
- **ST-ANA-07.19** [recette] Suppression d'un algorithme référencé : détectée avant l'enregistrement.

### ST-ANA-08 — Registre complet des 41 opérations de calcul
Destination : Atelier Analyses, éditeur, section 5 « Calculs », choix et documentation de l'opération ; `lib/domaines` (un test Vitest par identifiant)
- **ST-ANA-08.1** [=] Garder les 41 identifiants historiques de l'objet `ALGORITHMS`, interprétables pour toutes les configurations existantes.
- **ST-ANA-08.2** [=] Les opérations numériques simples aplatissent les tableaux imbriqués ; les opérations temporelles manipulent les valeurs de leurs points.
- **ST-ANA-08.3** [=] `PUTVALUE` — paramètre `p1` valeur ; retourne la constante sans dépendre des entrées.
- **ST-ANA-08.4** [=] `COPY` — sans paramètre ; première entrée après aplatissement ; erreur si vide.
- **ST-ANA-08.5** [=] `DIVIDE` — sans paramètre ; première entrée / seconde ; au moins deux entrées ; division par zéro refusée.
- **ST-ANA-08.6** [=] `DIVIDE_BY` — `p1` diviseur ; première entrée / constante ; diviseur numérique non nul.
- **ST-ANA-08.7** [=] `MULTIPLY` — sans paramètre ; produit des deux premières entrées seulement, pas de toutes.
- **ST-ANA-08.8** [=] `MULTIPLY_BY` — `p1` facteur ; première entrée × constante numérique.
- **ST-ANA-08.9** [=] `SUBTRACT` — sans paramètre ; première moins seconde ; ordre déterminant.
- **ST-ANA-08.10** [=] `SUBTRACT_BY` — `p1` constante ; première entrée moins constante.
- **ST-ANA-08.11** [=] `SUM` — sans paramètre ; somme de toutes les entrées ; liste vide → `0`.
- **ST-ANA-08.12** [=] `AVERAGE` — sans paramètre ; moyenne arithmétique ; liste vide refusée.
- **ST-ANA-08.13** [=] `STANDARD_DEVIATION` — sans paramètre ; écart-type de population (division par N).
- **ST-ANA-08.14** [=] `THRESHOLD_ABOVE` — `p1` seuil ; vrai si au moins une valeur est strictement supérieure.
- **ST-ANA-08.15** [=] `THRESHOLD_BELOW` — `p1` seuil ; vrai si au moins une valeur est strictement inférieure.
- **ST-ANA-08.16** [=] `THRESHOLD_BETWEEN_IN` — `p1`, `p2` bornes ; vrai si au moins une valeur est entre min et max, bornes incluses.
- **ST-ANA-08.17** [=] `THRESHOLD_BETWEEN_OUT` — `p1`, `p2` bornes ; vrai si au moins une valeur ≤ min ou ≥ max, bornes incluses : pas le complément exact de `THRESHOLD_BETWEEN_IN` (le dire dans la documentation de l'opération).
- **ST-ANA-08.18** [=] `DIFFERENCE_THRESHOLD` — `p1` seuil ; vrai si l'écart absolu entre la première valeur et une autre dépasse le seuil.
- **ST-ANA-08.19** [=] `EQUAL_TO` — `p1` valeur ; vrai si toutes les entrées sont strictement égales à la constante, types distingués (`"1"` ≠ `1`).
- **ST-ANA-08.20** [=] `IS_EMPTY` — sans paramètre ; tableau aplati vide → vrai.
- **ST-ANA-08.21** [=] `AND` — sans paramètre ; vrai si le tableau est non vide et ne contient aucun booléen `false`.
- **ST-ANA-08.22** [=] `OR` — sans paramètre ; vrai si au moins un booléen `true`.
- **ST-ANA-08.23** [=] `NOT` — sans paramètre ; vrai si aucune entrée n'est égale à `true` ; porte sur l'ensemble, pas seulement la première.
- **ST-ANA-08.24** [=] `CONV_BOOLEAN_TO_NUMBER` — sans paramètre ; première valeur évaluée vraie → `1`, sinon `0`.
- **ST-ANA-08.25** [=] `CONV_NUMBER_TO_BOOLEAN` — sans paramètre ; première valeur différente de zéro → vrai.
- **ST-ANA-08.26** [=] `CURRENT_EPOCH_TIME` — sans paramètre ; heure courante `Date.now()` en ms, pas l'instant historique rejoué (le dire dans la documentation).
- **ST-ANA-08.27** [=] `RANDOM_NUMBER` — `p1` min, `p2` max ; `Math.random() × (max − min) + min`, borne supérieure exclue si min < max ; tester par intervalle, jamais par égalité stricte.
- **ST-ANA-08.28** [=] `RANDOM_INTEGER` — `p1` min, `p2` max ; entier aléatoire bornes incluses pour des paramètres entiers min ≤ max ; vérifier bornes et types des paramètres des configurations migrées.
- **ST-ANA-08.29** [=] `RANDOM_BOOLEAN_NUMBER` — sans paramètre ; `0` ou `1` aléatoire.
- **ST-ANA-08.30** [=] `RANDOM_BOOLEAN` — sans paramètre ; booléen aléatoire.
- **ST-ANA-08.31** [=] `EXIT` — sans paramètre ; retourne la première entrée ; si ce résultat est vrai, le moteur arrête volontairement l'exécution.
- **ST-ANA-08.32** [=] `FLOOR_NUMBER` — sans paramètre ; arrondi inférieur de la première valeur.
- **ST-ANA-08.33** [=] `CEIL_NUMBER` — sans paramètre ; arrondi supérieur de la première valeur.
- **ST-ANA-08.34** [=] `ROUND_NUMBER` — sans paramètre ; arrondi standard de la première valeur.
- **ST-ANA-08.35** [=] `TIMESERIES_IS_EMPTY` — sans paramètre ; vrai si la concaténation des séries ne contient aucun point.
- **ST-ANA-08.36** [=] `TIMESERIES_AVERAGE` — sans paramètre ; moyenne des échantillons, non pondérée par le temps.
- **ST-ANA-08.37** [=] `TIMESERIES_MAX_VALUE` — sans paramètre ; maximum des valeurs ; série vide refusée.
- **ST-ANA-08.38** [=] `TIMESERIES_MIN_VALUE` — sans paramètre ; minimum des valeurs ; série vide refusée.
- **ST-ANA-08.39** [=] `TIMESERIES_SUM` — sans paramètre ; somme des échantillons, pas une intégrale temporelle.
- **ST-ANA-08.40** [=] `TIMESERIES_EDGE_SUBSTRACT` — sans paramètre ; dernière valeur moins première ; au moins deux points ; orthographe historique `SUBSTRACT` conservée.
- **ST-ANA-08.41** [=] `TIMESERIES_TIME_WEIGHTED_AVERAGE` — `p1` `normal` ou `linear` ; tri par date, moyenne pondérée par la durée, maintien de la dernière valeur (`normal`) ou interpolation linéaire (`linear`) ; au moins deux points et durée positive.
- **ST-ANA-08.42** [=] `TIMESERIES_BOOLEAN_RATE` — `p1` `Ratio` ou `Percentage` ; durée pondérée des valeurs 0/1 divisée par la durée totale, ×100 si `Percentage`.
- **ST-ANA-08.43** [=] `TIMESERIES_THRESHOLD_ZSCORE` — `p1` seuil ; z-score de la dernière valeur par rapport à toute la série, comparaison strictement supérieure, sans valeur absolue.
- **ST-ANA-08.44** [+] Documentation française de chaque opération dans le sélecteur : paramètres, type attendu des entrées, comportement exact y compris ses particularités.
- **ST-ANA-08.45** [+] Paramètres saisis par champs typés (nombre, énumération `normal`/`linear`, `Ratio`/`Percentage`) au lieu de texte libre.
- **ST-ANA-08.46** [!] Variance nulle dans `TIMESERIES_THRESHOLD_ZSCORE` : traiter explicitement le cas (pas de division par zéro silencieuse), correction visible et testée.
- **ST-ANA-08.47** [!] `TIMESERIES_BOOLEAN_RATE` sur série d'un seul point ou à dates identiques : comportement figé par test, puis correction explicite si résultat non défini.
- **ST-ANA-08.48** [=] Toute correction d'opération est distinguée d'une conversion automatique silencieuse : comportement historique figé par test avant correction, puis correction testée et signalée (§9.3, point 9).
- **ST-ANA-08.49** [recette] Un test Vitest par identifiant (41), avec cas limites : vide, un élément, `0`, `false`, types mélangés, ordre des opérandes.
- **ST-ANA-08.50** [recette] Chaque opération utilisée dans la base de test rejouée avec ses paramètres, types et ordre : mêmes résultats qu'avant.

### ST-ANA-09 — Produire un ticket ou une alarme
Destination : Atelier Analyses, éditeur, section 6 « Sortie », type Ticket / Alarme
- **ST-ANA-09.1** [=] Type de sortie : ticket ou alarme.
- **ST-ANA-09.2** [=] Champs : nom du résultat, contexte de tickets, processus, priorité d'alarme.
- **ST-ANA-09.3** [=] Nom de l'incident produit = nom du résultat + nom de l'entité.
- **ST-ANA-09.4** [=] Le moteur relie l'analyse, l'entité concernée et le résultat.
- **ST-ANA-09.5** [=] Avant création, rechercher un incident déjà déclaré pour éviter les doublons.
- **ST-ANA-09.6** [=] Incident existant à la première étape : incrémenter son attribut `Occurrence number` et le point associé.
- **ST-ANA-09.7** [=] Incident existant à une autre étape : le ramener à la première étape et remettre le compteur à `1`.
- **ST-ANA-09.8** [=] Aucun incident existant : créer l'incident et ses liens.
- **ST-ANA-09.9** [=] Résultat égal à `false` : aucun incident créé.
- **ST-ANA-09.10** [+] Le formulaire dit que cette sortie modifie le graphe métier (tickets), pas seulement une notification visuelle.
- **ST-ANA-09.11** [+] Signaler un contexte ou un processus absent du jumeau.
- **ST-ANA-09.12** [?] Priorité : saisie et stockée, mais non appliquée par `addTicketAlarm` dans le service consulté ; vérifier le service effectif, puis appliquer ou l'indiquer.
- **ST-ANA-09.13** [recette] Condition fausse : aucun ticket.
- **ST-ANA-09.14** [recette] Premier déclenchement : ticket créé et lié à l'entité et à l'analyse.
- **ST-ANA-09.15** [recette] Répétition : compteur `Occurrence number` incrémenté, pas de doublon.
- **ST-ANA-09.16** [recette] Incident déplacé à une autre étape ou archivé : retour à la première étape et compteur à `1`.
- **ST-ANA-09.17** [recette] Contexte ou processus absent : erreur explicite.
- **ST-ANA-09.18** [recette] Traçabilité du résultat sur le ticket ; aucun ticket pendant une prévisualisation.

### ST-ANA-10 — Écrire un résultat dans un endpoint ou point de contrôle
Destination : Atelier Analyses, éditeur, section 6 « Sortie », type Endpoint / Point de contrôle
- **ST-ANA-10.1** [=] Type de sortie : endpoint ou point de contrôle.
- **ST-ANA-10.2** [=] Champ nom du point cible.
- **ST-ANA-10.3** [=] Écrire la valeur courante et le point de série correspondant, à l'instant d'exécution.
- **ST-ANA-10.4** [=] Option « modifier un attribut au lieu de la valeur courante », visant un attribut du modèle cible.
- **ST-ANA-10.5** [=] Endpoint : option « créer s'il manque », avec unité et durée maximale de conservation des séries.
- **ST-ANA-10.6** [=] Point cible résolu sur l'entité suivie, ou créé seulement si la création est autorisée.
- **ST-ANA-10.7** [=] Un point de contrôle manquant n'est pas créé automatiquement.
- **ST-ANA-10.8** [+] Les champs unité et durée de conservation n'apparaissent que si la création est cochée.
- **ST-ANA-10.9** [+] Le formulaire dit que c'est une écriture dans le graphe, pas une commande BACnet, OPC UA ou SNMP (§9.2).
- **ST-ANA-10.10** [recette] Valeur courante mise à jour et point inséré dans l'historique.
- **ST-ANA-10.11** [recette] Conservation et rotation des séries selon la durée maximale.
- **ST-ANA-10.12** [recette] Point manquant, avec et sans création autorisée ; point de contrôle manquant non créé.
- **ST-ANA-10.13** [recette] Attribut de modèle cible absent : erreur explicite.
- **ST-ANA-10.14** [recette] Résultat `0` et `false` écrits tels quels.

### ST-ANA-11 — Écrire un résultat dans un attribut documentaire
Destination : Atelier Analyses, éditeur, section 6 « Sortie », type Attribut
- **ST-ANA-11.1** [=] Type de sortie `attributeCreateOrModification`.
- **ST-ANA-11.2** [=] Champs : nom du résultat (nom de l'attribut), catégorie, autorisation de créer l'attribut absent.
- **ST-ANA-11.3** [=] Modifier l'attribut documentaire de l'entité suivie.
- **ST-ANA-11.4** [=] Sans catégorie, la sortie échoue explicitement.
- **ST-ANA-11.5** [+] Catégorie obligatoire dès la saisie : la section ne valide pas sans elle.
- **ST-ANA-11.6** [recette] Catégorie et attribut existants : valeur modifiée.
- **ST-ANA-11.7** [recette] Attribut absent avec création autorisée : créé ; création interdite : erreur, rien écrit.
- **ST-ANA-11.8** [recette] Types du résultat (nombre, booléen, texte, `0`, `false`) conservés.
- **ST-ANA-11.9** [recette] Aucune catégorie créée en double.

### ST-ANA-12 — Produire un log, un SMS ou une sortie Google Chat
Destination : Atelier Analyses, éditeur, section 6 « Sortie », types Journal / SMS / Google Chat
- **ST-ANA-12.1** [=] Sortie journal (log) avec les informations du résultat.
- **ST-ANA-12.2** [non] Pas d'écran d'historique des logs ni de conservation durable promise : non établis.
- **ST-ANA-12.3** [=] Sortie SMS : numéro et message.
- **ST-ANA-12.4** [=] Insertion de valeurs d'entrées dans le message SMS.
- **ST-ANA-12.5** [=] L'envoi SMS dépend du gestionnaire Twilio initialisé par le moteur avec ses identifiants.
- **ST-ANA-12.6** [=] Sortie Google Chat : nom ou identifiant d'espace, et message.
- **ST-ANA-12.7** [=] Format Google Chat : message, ou carte de monitoring d'organ.
- **ST-ANA-12.8** [=] Le gestionnaire construit des résultats structurés pour la couche consommatrice ; aucun envoi direct par le navigateur.
- **ST-ANA-12.9** [non] `gChatPlatformCard` : présent dans l'énumération mais sans branche dans `applyResult` (renvoie « type non reconnu ») ; pas proposé comme sortie, inscrit au registre des écarts.
- **ST-ANA-12.10** [+] Une configuration existante avec `gChatPlatformCard` est relue et conservée, avec un avertissement « sortie non traitée par le moteur ».
- **ST-ANA-12.11** [+] Identifiants Twilio et secrets jamais affichés ni exportés dans l'atelier.
- **ST-ANA-12.12** [+] Avertir que SMS et Google Chat dépendent de services externes non vérifiés (Twilio, Google).
- **ST-ANA-12.13** [recette] Configuration journal, SMS et Google Chat rechargée à l'identique.
- **ST-ANA-12.14** [recette] Substitution des valeurs d'entrées dans le message.
- **ST-ANA-12.15** [recette] Résultat faux, destinataire absent, service externe indisponible : pas de faux succès.
- **ST-ANA-12.16** [recette] Simple édition ou prévisualisation : aucune notification envoyée.

### ST-ANA-13 — Recharger, modifier, supprimer et réinitialiser la date d'exécution
Destination : Atelier Analyses, arbre (actions sur une analyse) et éditeur
- **ST-ANA-13.1** [=] Action « Modifier » sur une analyse : ouvre l'éditeur.
- **ST-ANA-13.2** [=] Recharger depuis le graphe : ancre, entrées, déclencheurs, opérations, dépendances, paramètres de sortie, paramètres généraux.
- **ST-ANA-13.3** [=] Enregistrer : remplacer le nœud de configuration, réécrire les attributs de tracking, ajuster le lien à l'ancre.
- **ST-ANA-13.4** [!] Le renommage est enregistré sur le nœud analyse (l'ancien enregistrement ne renommait pas).
- **ST-ANA-13.5** [!] Le rattrapage rechargé est réécrit à l'enregistrement (oublié par l'ancien `getAnalyticAttributes`).
- **ST-ANA-13.6** [!] Une entrée retirée disparaît vraiment du tracking (l'ancienne méthode ajoutait les attributs au nœud existant sans retirer).
- **ST-ANA-13.7** [+] Les champs inconnus de l'éditeur sont conservés à l'enregistrement (§9.3, point 6).
- **ST-ANA-13.8** [=] Action « Supprimer l'analyse ».
- **ST-ANA-13.9** [+] La confirmation de suppression dit ce qui est supprimé (configuration) et ce qui est conservé (tickets, valeurs, attributs déjà produits).
- **ST-ANA-13.10** [=] Action « Réinitialiser la date d'exécution » : remplace la date de dernière exécution par l'instant présent.
- **ST-ANA-13.11** [+] Le libellé et la confirmation disent que cette réinitialisation ne lance aucun calcul.
- **ST-ANA-13.12** [non] Pas de bouton « Exécuter maintenant » : aucun lancement manuel complet n'est attesté.
- **ST-ANA-13.13** [recette] Configurations anciennes et multi-algorithmes rouvertes puis réenregistrées sans différence (lot 8).
- **ST-ANA-13.14** [recette] Sorties déjà produites jamais supprimées par une modification.
- **ST-ANA-13.15** [recette] Abandon de l'édition : aucune écriture.
- **ST-ANA-13.16** [recette] Ouverture d'une analyse multi-algorithmes en 300 ms au plus (lot 8).

### ST-ANA-14 — Préserver l'exécution, le rattrapage et les erreurs du moteur
Destination : organ d'analyse (service `analysis`) ; Atelier Analyses, bandeau d'état
- **ST-ANA-14.1** [=] L'exécution reste le rôle de l'organ d'analyse ; l'atelier est un outil de configuration.
- **ST-ANA-14.2** [=] Contrats conservés : exécution sur une entité et sur toutes les entités de travail.
- **ST-ANA-14.3** [=] Calcul des instants manqués pour les déclencheurs cron et intervalle, avec instants de référence.
- **ST-ANA-14.4** [=] Collecte des entrées et application du résultat entité par entité.
- **ST-ANA-14.5** [=] Retours distincts : succès, absence d'entités ou de configuration, données introuvables, résultat indéfini, arrêt volontaire `EXIT`.
- **ST-ANA-14.6** [!] Écart moteur à signaler : `applyResult` transforme en succès des échecs de gestionnaires (ticket, endpoint, point de contrôle, attribut) ; les erreurs doivent être propagées.
- **ST-ANA-14.7** [!] Écart moteur à signaler : `handleTicketResult` lance `addTicketAlarm` sans l'attendre ; un succès global ne prouve pas l'écriture.
- **ST-ANA-14.8** [+] Afficher l'état de l'organ d'analyse s'il est déployé ; sinon « L'organ d'analyse ne tourne pas : cette analyse ne s'exécutera pas ».
- **ST-ANA-14.9** [+] Distinguer « configuration enregistrée » et « état rapporté par l'organ » (« Sans réponse de l'organ » au-delà du délai).
- **ST-ANA-14.10** [?] Correction de `applyResult` et `handleTicketResult` : dans `spinal-organ-analysis` ou hors périmètre de la refonte ?
- **ST-ANA-14.11** [recette] Mêmes entrées et mêmes instants : mêmes sorties.
- **ST-ANA-14.12** [recette] Rattrapage : pas d'envoi externe en double.
- **ST-ANA-14.13** [recette] Erreurs rattachées à l'entité concernée.
- **ST-ANA-14.14** [recette] Heure courante distinguée de l'heure rejouée en rattrapage.

### Frontières du portage
Destination : registre des écarts et revue de lot (06-tracabilite, 07-lots-recette)
- **ST-ANA-FRT.1** [=] Dashboard de points (consulter et piloter des endpoints), dashboards standards (modèles de points et règles géographiques) et module d'analyse (calcul configurable) restent trois mécanismes distincts.
- **ST-ANA-FRT.2** [=] Tickets (processus, étape, priorité, commentaires, logs) et événements (dates, série éventuelle, groupe) restent deux modèles distincts, même rapprochés dans l'interface.
- **ST-ANA-FRT.3** [=] Mission, Twilio et organs terrain sont des dépendances externes : leurs écrans existent, leur disponibilité n'est pas promise ; l'interface affiche leur état réel.
- **ST-ANA-FRT.4** [non] Affectation de tickets, notifications générales, export global de tickets, calendrier partagé et exécution manuelle de toute analyse : non démontrés, pas annoncés.
- **ST-ANA-FRT.5** [non] Éléments incomplets inscrits au registre des écarts, pas parmi les fonctions testées : prévisualisation globale désactivée, ancien `configuration.vue` (remplacé par `algorithmConfiguration.vue` et `resultConfiguration.vue`), `gChatPlatformCard` sans traitement, `seeLogs` vide, méthodes Mission vides, cases du retrait groupé d'événements ignorées.
- **ST-ANA-FRT.6** [=] Conserver identifiants et relations, unités et horodatages, valeurs `0` et `false`, historiques et pièces jointes, références multi-maquettes, et configurations de calcul existantes.
- **ST-ANA-FRT.7** [=] Détacher listeners et liaisons à chaque changement d'atelier, de jumeau ou de section.
- **ST-ANA-FRT.8** [+] Distinguer dans l'interface consultation, simulation (prévisualisation), écriture dans le graphe et commande d'un système externe.
- **ST-ANA-FRT.9** [+] Raccourcis de menu, panneaux flottants et assistants multiétapes repensés entièrement (éditeur sur une page à sections).
- **ST-ANA-FRT.10** [=] Fonctions personnalisées saisies (ST-ANA) exécutées dans le navigateur dans un Worker isolé, sans DOM ni connecteur, avec avertissement explicite.
- **ST-ANA-FRT.11** [recette] Compatibilité des calculs (§9.3, point 9) : identifiants d'algorithmes, types de paramètres, ordre des opérandes et conventions temporelles inchangés sur toutes les analyses de la base de test.
- **ST-ANA-FRT.12** [recette] Scénario « Points de contrôle et calcul » : mesures `0`, `false`, valeurs absentes, série irrégulière ; bonnes agrégations et sorties, prévisualisation sans effet externe.

## 11. Modules techniques sans capacité propre

Modules présents dans le build du Studio mais absents de l'inventaire, car ils n'ont pas de fonction visible pour l'utilisateur.

- **M-1** [non] `spinal-env-viewer-panel-manager-service_spinalforgeextention` : cadre qui permettait aux plugins d'ajouter un bouton à la barre du viewer et un panneau Vue 2. Il est remplacé par le registre d'actions, la fiche et les ateliers. Les fonctions de ces panneaux sont couvertes par leurs capacités respectives.
- **M-2** [=] `spinal-env-viewer-plugin-bimobjectservice` (`createGraphBimObject`) : crée à la demande le nœud `BIMObject` d'un objet 3D. C'est repris dans le comportement de ST-BIM-08 : création à la première écriture, signalée.
- **M-3** [non] `spinal-env-viewer-plugin-circular-menu` et son service : menu circulaire autour de l'objet 3D. Il est remplacé par le clic droit du viewer, la fiche et `Ctrl K` ; ses actions restent disponibles.
- **M-4** [=] `spinal-env-viewer-context-menu-service` : enregistrement des actions et filtrage par profil. Il est remplacé par le registre d'actions, avec les mêmes conditions (ST-SOC-02).

## 12. Ce qu'on ne fait pas (sauf avis contraire)

- **N-1** Toucher au viewer-rs.
- **N-2** Modifier le hub, l'API BOS, les organs ou le format des données.
- **N-3** Reprendre l'ancien SpinalTwin (« ST App list »).
- **N-4** Corbeille dans le Drive (n'existe pas aujourd'hui, question O-5).
- **N-5** Archive ZIP d'un dossier du Drive, dépôt d'un dossier entier depuis le poste.
- **N-6** Modifier toute une série d'événements d'un coup.
- **N-7** Version téléphone (le portail s'en charge).
- **N-8** Traduction dans d'autres langues.
