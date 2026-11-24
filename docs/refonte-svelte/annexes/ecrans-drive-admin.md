<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# 03 — Drive, préparation des jumeaux, inspecteurs, administration

> **Statut : v1 écran par écran, provisoire.** Elle sera refondue avec les maquettes. Références : parcours [03-parcours.md](../03-parcours.md), recette [08-tests.md](../08-tests.md).

Les identifiants entre crochets renvoient aux capacités de l'inventaire.

## 1. Connexion — `/studio/connexion` [DR-01]

- Champs « Identifiant » et « Mot de passe », bouton « Se connecter ». Une case « Administration du hub » passe par `/get_admin_id`.
- Messages distincts : identifiant ou mot de passe incorrect ; compte valide mais non administrateur (pour la case Administration) ; hub injoignable.
- Après connexion : retour à l'URL demandée au départ, sinon au Drive, sur `/__users__/<utilisateur>`.
- Aucune déconnexion implicite à l'ouverture de la page (contrairement à l'historique). Si une session existe, la page propose « Continuer en tant que JD » ou « Changer de compte ».

## 2. Drive — `/studio/drive/<chemin>`

### 2.1 Disposition

```
┌ Barre supérieure ──────────────────────────────────────────────────────────────┐
├──────────────┬─────────────────────────────────────────────┬──────────────────┤
│ DOSSIERS     │ Mes fichiers › Projets › Tour A        ⋯    │ Détails          │
│ ▾ Mes fichiers│ [Rechercher dans ce dossier] [+ Nouveau ▾] │ ┌──────────────┐ │
│   ▾ Projets  │ [Déposer] [Vue double]                      │ │ aperçu/icône │ │
│     ▸ Tour A │─────────────────────────────────────────────│ └──────────────┘ │
│     ▸ Tour B │ ☐ Nom ▲            Type      Modifié   État │ Tour A.rvt       │
│   ▸ Partagés │ ☐ 📁 Plans         Dossier   il y a 2 j     │ Infos · Versions │
│              │ ☐ ◆ Jumeau Tour A  Jumeau    hier           │ Partage · Journal│
│ PARTAGÉS     │ ☑ ▦ Tour A.rvt     Maquette  12 nov.  ●Conv │                  │
│ CORBEILLE ✗  │ ☐ 📄 CCTP.pdf      Document  3 nov.         │ …                │
└──────────────┴─────────────────────────────────────────────┴──────────────────┘
```

- **Gauche, l'arborescence des dossiers** [DR-02] : dossiers ordinaires et synchronisés, dépliage à la demande, dossier courant en surbrillance. On peut déposer des fichiers sur un dossier de l'arbre [DR-08]. Largeur réglable, repliable.
- **Centre, le contenu du dossier** :
  - fil d'Ariane cliquable [DR-02] ;
  - recherche locale (filtre instantané sur le nom) ;
  - bouton « Nouveau » (Dossier, Jumeau numérique) ;
  - bouton « Déposer » (sélecteur de fichiers), en plus du glisser-déposer sur toute la zone [DR-06] ;
  - bouton « Vue double » [DR-13].
- **Tableau virtualisé** [DR-03] avec les colonnes : sélection, icône + nom, type lisible (Dossier, Dossier synchronisé, Jumeau, Maquette, Document, Image, Lien HTTP…), **première visite** (et non « création » : voir DR-03), dernière activité, état (transfert, conversion, visa en pourcentage s'il existe). Tri par colonne. Colonnes affichables, mémorisées.
- **Droite, les détails de la sélection** : onglets Infos, Versions, Partage, Journal. Repliable. Sans sélection, ce sont les détails du dossier courant.

### 2.2 Ouvrir

Double-clic ou `Entrée`, avec une action adaptée au type [DR-02, DR-DT-06] :

| Type | Ouvrir fait… |
|---|---|
| Dossier, dossier synchronisé | entrer dans le dossier |
| Jumeau | ouvrir le Studio sur ce jumeau (`/studio/jumeau/<id>`) |
| Maquette (BIM Project) | ouvrir l'aperçu 3D du fichier (viewer seul, sans graphe) ; « Ouvrir dans un jumeau… » en action secondaire |
| Image, PDF | aperçu dans un panneau de prévisualisation |
| Autre `Path` | télécharger, après confirmation |
| Lien HTTP | ouvrir dans un nouvel onglet, après affichage de l'URL |

### 2.3 Actions sur les fichiers

| Action | Où | Règles |
|---|---|---|
| **Nouveau dossier** [DR-05] | « Nouveau », clic droit sur le fond ou sur l'arbre | Champ de nom en ligne, directement dans le tableau. Collision : suffixe « (2) » proposé et visible avant validation, pour **tous** les points d'entrée (corrige l'incohérence entre arbre et explorateur). `Échap` annule sans rien créer. Unicode accepté (lettres accentuées, espaces) ; seuls `/` et les caractères de contrôle sont refusés, avec un message. |
| **Déposer** [DR-06] | glisser-déposer, bouton, dépôt sur une ligne de dossier | Une tâche par fichier dans le plateau (octets transférés, débit, annulation). Collision : boîte « Remplacer · Garder les deux · Ignorer », avec « Appliquer à tous ». La ligne est en état « Transfert » jusqu'à disponibilité réelle, et ne peut pas être téléchargée avant. Le dépôt sur une ligne de dossier fonctionne (corrige DR-08). Le dépôt d'un dossier local est **refusé avec un message** (non pris en charge historiquement ; amélioration possible plus tard). |
| **Renommer** [DR-07] | `F2`, clic droit, détails | Édition en ligne. Pas de changement : aucune écriture. Collision : refus avec message. Toast « Annuler ». |
| **Déplacer** [DR-08] | glisser vers un dossier (arbre, ligne, autre volet de la vue double), ou « Déplacer vers… » (choix d'un dossier) | Refus d'un cycle (dossier dans sa descendance) avec message. Homonyme dans la cible : même boîte que pour le dépôt. L'ajout dans la cible est fait **avant** le retrait de la source : en cas d'échec, la source est conservée. Toast « Annuler ». |
| **Supprimer** [DR-09] | `Suppr`, clic droit, barre de sélection | Confirmation de portée : « Retirer 4 éléments de « Projets » ». Le texte précise que les objets partagés ailleurs restent accessibles depuis leurs autres emplacements. Exclusions affichées : dossiers synchronisés, liens HTTP, fichiers en validation (visa), racine. La sélection multiple fonctionne (corrige l'anomalie « Delete Selected »). Pas de corbeille : la confirmation le dit. |
| **Télécharger** [DR-10] | clic droit, détails | Pour les `Path` seulement. Nom d'origine. Contenu de la **version courante**. Indisponible (transfert inachevé, binaire absent) : message, jamais de fichier vide. Plusieurs fichiers : téléchargements successifs (pas d'archive ZIP, non prise en charge historiquement). |
| **Partager** [DR-11] | onglet Partage, clic droit | Voir 2.5. |
| **Inspecter le modèle** [GI-01] | clic droit (mode expert) | Ouvre `/studio/inspecteur/<id>`. |

La barre de sélection, qui remplace la barre d'outils quand des lignes sont cochées, affiche « 3 éléments sélectionnés » et seulement les actions valables pour **toute** la sélection (Déplacer, Supprimer). Les actions qui ne portent que sur un élément sont désactivées, avec la raison en infobulle [DR-04].

### 2.4 Versions — onglet « Versions » [DR-VER-01 à 04]

- Liste chronologique inversée : numéro, date (relative et exacte), auteur s'il est connu, description, taille, état de conversion. La version courante porte le badge « Courante ».
- **Ajouter une version** [DR-VER-02] : sélecteur de fichier ou dépôt sur l'onglet. Le transfert est suivi dans le plateau. La nouvelle version devient courante (comportement historique), ce qui est indiqué avant l'envoi.
- **Rendre courante** [DR-VER-03] : confirmation « Passer de la v4 à la v2 ». Si la version est déjà courante, l'action est absente. Le texte rappelle que les jumeaux qui utilisent ce fichier chargeront la v2 et qu'une réconciliation peut être nécessaire (lien vers ST-BIM-04).
- **Description** [DR-VER-04] : édition en ligne, enregistrée à la perte du focus.
- **Aperçu** des images GIF, JPG, PNG : vignette, clic pour agrandir.
- **Supprimer la version** : impossible pour la version courante (action absente, avec une infobulle qui explique pourquoi). Confirmation qui dit l'irréversibilité.

### 2.5 Partage — onglet « Partage » [DR-11]

- Champ de recherche d'utilisateurs du hub (préfixe du nom ou de l'identifiant), qui exclut ceux déjà choisis. Les destinataires apparaissent en jetons.
- Trois droits à cocher, avec un libellé et une phrase d'explication chacun : Lecture (`RD`), Écriture (`WR`), Partage et administration (`AD`). Il faut au moins un utilisateur et un droit pour valider.
- Bouton « Partager avec 2 utilisateurs ».
- Mention explicite : « Le partage donne accès au même fichier, sans copie. La liste des accès existants et leur révocation ne sont pas disponibles. » C'est la limite historique, affichée honnêtement. La lecture des droits existants sera ajoutée si le hub l'expose : décision ouverte O-1, voir [06-tracabilite.md](../06-tracabilite.md).

### 2.6 Journal — onglet « Journal » [DR-12]

- Chronologie : action, utilisateur, date. Tri du plus récent au plus ancien.
- Instantané : bouton « Actualiser », sans abonnement permanent.
- Journal vide : « Aucune entrée de journal pour ce fichier. »
- Une note discrète signale que la première visite d'un fichier peut créer l'entrée « 1st visit ».

### 2.7 Vue double [DR-13]

« Vue double » partage le centre en deux explorateurs indépendants. Chacun a son dossier, son fil d'Ariane et sa sélection. Le volet actif a un liseré orange, et l'arborescence de gauche pilote le volet actif. Le glisser-déposer entre volets déplace les fichiers. Une fermeture rend toute la largeur au volet restant. La disposition est mémorisée dans les préférences.

## 3. Jumeau dans le Drive — préparation [DR-DT-01 à 06]

### 3.1 Créer [DR-DT-01]

« Nouveau → Jumeau numérique » ouvre un **assistant en 3 étapes** (`Etapes`) :

1. **Nom** du jumeau, dans le dossier courant.
2. **Sources** : choix des fichiers du Drive ou dépôt de nouveaux fichiers. Les formats reconnus sont marqués « Maquette » ; les autres sont listés à part, en grisé, avec la raison « Format non reconnu » [DR-DT-02, DR-DT-03].
3. **Conversion** : cases cochées par défaut pour chaque maquette à convertir, puis « Créer le jumeau et lancer les conversions ».

À la fin, le jumeau s'ouvre dans les détails avec ses conversions en cours, et un bouton « Ouvrir dans le Studio ». On peut sortir de l'assistant à toute étape : ce qui est déjà créé est conservé, et c'est dit.

### 3.2 Détails d'un jumeau

Pour un fichier Jumeau, le panneau de droite remplace « Versions » par l'onglet **« Maquettes »** :

- une ligne par asset : nom, version courante utilisée, date, description, **état de conversion** (Initialisation · Commande envoyée · Téléchargement par l'organ · Envoi à Forge · En file d'attente · Conversion · Récupération · Prête · Échec ; plus Détection et Décompression pour les archives `.svf.zip`) [DR-DT-04] ;
- **Ajouter des maquettes** [DR-DT-02] : choix de fichiers du Drive. L'anti-doublon compare l'**identité** du fichier source (`_server_id` du conteneur de versions), pas son nom (corrige la confusion entre homonymes) ;
- **Convertir** / **Reconvertir** [DR-DT-04] : désactivé pendant une conversion en cours (pas de double demande). Une tâche du plateau suit l'état écrit par l'organ ; l'erreur affiche la cause si l'organ la fournit ;
- **Retirer du jumeau** [DR-DT-05] : confirmation de portée qui précise : « Retire la maquette de ce jumeau. Le fichier, ses versions et ses conversions restent dans le Drive. Les objets de cette maquette déjà rattachés au graphe gardent leurs liens mais ne s'afficheront plus en 3D. » ;
- **Ouvrir dans le Studio** [DR-DT-06] : bouton principal.

## 4. Inspecteur de modèle — `/studio/inspecteur/<id>` [GI-01, GI-02, GI-03, ST-GRA-07]

Outil expert, accessible depuis le Drive (clic droit, mode expert) et depuis le Studio (« Inspecter le modèle » sur un nœud). Une seule page, deux vues, sélection conservée quand on change de vue.

- **Vue Structure** [GI-01] : arbre des attributs du modèle. Chaque ligne montre nom, type (`Str`, `Val`, `Bool`, `Lst`, `Ptr`, `Model`…, avec un code couleur **et** un libellé), valeur ou nombre d'éléments, et l'identifiant serveur. On déplie à la demande ; « Suivre le pointeur » charge sa cible. Un pointeur absent est marqué « Non chargé » ou « Introuvable » sans bloquer le reste. Un cycle est indiqué (« ↺ déjà affiché plus haut »).
- **Édition atomique** [GI-02] : double-clic sur une valeur `Str`, `Val` ou `Bool` donne une saisie adaptée (texte, nombre, interrupteur), validée par `Entrée`, annulée par `Échap`. Un bandeau rappelle que l'écriture est directe, sans les règles métier.
- **Vue Graphe** [GI-03] : canevas Svelte Flow. Mise en page DAG (elk) ou par forces (d3-force). On développe les enfants et parents d'un nœud au clic, et on suit les relations `Ref`, `PtrLst`, `LstPtr`. La recherche par nom porte sur les nœuds affichés (compteur, précédent/suivant) et le dit. Un panneau de droite affiche les propriétés de l'élément et de la relation (nombre d'enfants), avec copie des identifiants. Contrôles : zoom, recentrer, ajuster.
- **Partager le modèle** : même formulaire que le Drive [DR-11].

## 5. Administration du hub — `/studio/admin` [ADM-01 à 04]

Visible seulement pour une session administrateur hub.

- **État du hub** [ADM-01] : cartes de lecture (modèles, sessions, utilisateurs, mémoire résidente, mémoire virtuelle) avec unités explicites (Mo, Go) et une courbe uPlot de l'historique de chacune, valeur au survol. Données absentes : « — » et « Pas encore de mesure ». Abonnement à `/etc/Status`, libéré en quittant la page.
- **Maintenance** [ADM-02] : boutons « Sauvegarder maintenant », « Lancer le ramasse-miettes » et, si le hub est en version 4.1.0 ou plus, « Nettoyer data.db ». Chacun a sa confirmation, qui dit l'effet et la durée possible. Le bouton reste désactivé tant que le drapeau du hub est non nul (« En cours… »). La fin est déduite du retour du drapeau à 0. La restauration n'est pas proposée (non prise en charge historiquement).
- **Rôles et comptes** [ADM-03] : liste en lecture des rôles historiques (Admin, Intégrateur, Mainteneur, Asset Manager, Basic Utilisateur) et des profils par utilisateur. La gestion complète des comptes (création, suppression, droits) n'existe pas dans l'historique (l'ancien lien renvoie une erreur 404). Elle fait l'objet de la décision ouverte O-2.
- **Mot de passe** [ADM-04] : depuis le menu du compte, pour tout utilisateur : ancien mot de passe, nouveau, confirmation, règles affichées (12 à 128 caractères `[A-Za-z0-9._~-]` pour rester compatible avec la configuration Docker). Pour le compte `admin`, un avertissement bloque l'opération tant qu'elle n'est pas confirmée : son mot de passe est fixé par la configuration de déploiement (`HUB_ADMIN_PASSWORD`), et le changer ici désynchronise les services. Il faut passer par la procédure de déploiement.
