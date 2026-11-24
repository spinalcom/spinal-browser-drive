<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# 05 — Design system (spécification)

Ce document fixe le contrat du design system.

**Réalisé le 24/11/2026** dans `app/src/lib/ui/` (54 fichiers) et `app/src/lib/spinal/` (TypeIcone, NoeudChip, CarteOrgan), avec la page de démonstration `/studio/_ds` : tous les composants de §3.1 à §3.5, dans leurs états, en clair, en sombre et en densité compacte. Contrôles :
- `bun run check` : `svelte-check` sans erreur ni avertissement (les trois exceptions d'accessibilité sont documentées dans le code : séparateur focusable de `SplitPane`, lignes de `Tree` et `DataTable` au focus géré par la racine) ;
- `bun run test:contraste` : 76 couples texte/fond AA vérifiés sur les jetons, en clair et en sombre ;
- `tests/ui/logique.test.ts` (T1) : virtualisation, aplatissement et clavier de l'arbre, tri, formats, contrastes ;
- `tests/ui/navigateur.test.ts` (T3) : interactions dans Chromium headless et axe-core (aucune violation sérieuse) sur la page `/_ds`.

Écarts avec la version initiale de ce contrat, décidés à la réalisation :
- jetons ajoutés : `--sc-line-3` (survol de bordure), `--sc-line-field` (bord des champs, 3:1 exigé par WCAG 1.4.11), `--sc-focus` (anneau de focus à 3:1 : l'orange `--sc-accent` n'atteint que 2,6:1 sur blanc), `--sc-on-accent`, `--sc-on-danger`, `--sc-danger-hover`, `--sc-scrim`, `--sc-toast-ok`, `--sc-toast-err` ;
- `--sc-ok` passe à `#17703d` et `--sc-warn` à `#8a5700` en clair (l'ancien vert et l'ancien ambre étaient sous 4,5:1 sur leurs fonds) ; les fonds « soft » du thème sombre deviennent opaques, pour que le contraste soit calculable ;
- palette de données fixée : 12 teintes OKLCH de luminosité égale (L = 0,58, C = 0,13), aucune entre 20° et 40° ;
- polices variables (Geist et Geist Mono, OFL, latin + latin étendu) servies par Vite, plus de base64.

## 1. Direction

**« L'atelier du jumeau. »** Un établi clair et précis, où la maquette et les données sont le sujet. Il reprend l'identité de viewer-rs (« l'instrument de chantier ») pour que viewer et application ne fassent qu'un produit :
- **chrome marine** : barre supérieure et rail ;
- **feuilles blanches** : panneaux, fiche, tableaux, sur un **sol bleu-gris** ;
- **un seul orange** pour ce qui est actif, sélectionné ou l'unique action principale ;
- **chiffres en Geist Mono tabulaire** pour tout ce qui se lit comme une mesure.

Ce qui est refusé :
- la table grise uniforme des anciens panneaux ;
- les dialogues en anglais ;
- les panneaux flottants vitrés ;
- les dégradés décoratifs ;
- les icônes pleines de Material.

### Règles nommées

- **Un seul signal.** L'orange signale l'actif, la sélection, le focus clavier ou l'unique action principale d'une zone. Jamais en décor, jamais deux actions principales orange côte à côte.
- **Le rouge pour détruire.** Le rouge est réservé aux suppressions et aux erreurs. Un « retrait » de lien est neutre, une « suppression » est rouge.
- **Lecture tabulaire.** Toute valeur chiffrée est en Geist Mono à chiffres tabulaires, alignée à droite. Les libellés ne le sont jamais.
- **Aucun contrôle natif du navigateur.** Choix de l'utilisateur (24/11) : tout contrôle visible est dessiné par le design system, identique sur tous les navigateurs et systèmes. Jamais de `<select>`, de case à cocher ou de bouton radio natifs, de barre de défilement native, de sélecteur de date, d'heure ou de couleur natif, de `<input type=range>`, d'infobulle `title`, ni de `alert`/`confirm`/`prompt`. Seules exceptions : la saisie de texte elle-même (`<input>`/`<textarea>` sans apparence native, entièrement habillés) et l'`<input type=file>` **caché** qui ouvre la boîte de dialogue de fichiers du système, sans équivalent possible. Les éléments natifs restent permis sous le capot quand ils sont invisibles et servent l'accessibilité (bits-ui), jamais à l'écran.
- **Densité réglable.** Deux densités : « Confort » (lignes de 36 px, par défaut) et « Compact » (28 px, préférence). Le Drive et les tableaux en profitent.

## 2. Jetons

Définis en variables CSS sur `:root` (`--sc-*`), avec un thème sombre défini dès le départ (`[data-theme=dark]` et `prefers-color-scheme`). Le thème clair est le défaut. Le sombre est livré au lot 0 parce qu'il ne coûte presque rien si les jetons sont respectés.

### 2.1 Couleurs

| Jeton | Clair | Sombre | Usage |
|---|---|---|---|
| `--sc-ink` | `#14202c` | `#0f1821` | barre supérieure, rail, infobulles, toasts |
| `--sc-ink-2` | `#1c2b39` | `#16222e` | survol sur marine |
| `--sc-ink-3` | `#263849` | `#22313f` | actif sur marine |
| `--sc-on-ink` | `#f3f6f8` | `#f3f6f8` | texte sur marine |
| `--sc-on-ink-2` | `#a9b8c6` | `#93a4b4` | texte secondaire et icônes au repos sur marine |
| `--sc-ground` | `#f4f6f8` | `#0b1219` | sol de l'application |
| `--sc-ground-2` | `#e9eef2` | `#131d27` | champs, pistes, segments, cellules en creux |
| `--sc-sheet` | `#ffffff` | `#17222d` | panneaux, fiche, tableaux, menus |
| `--sc-sheet-hover` | `#f6f8fa` | `#1d2936` | survol de ligne |
| `--sc-line` | `#e6ebf0` | `#243341` | filets entre lignes |
| `--sc-line-2` | `#cfd8e0` | `#31445a` | bordures de champs et boutons |
| `--sc-text` | `#14202c` | `#eef2f5` | texte principal |
| `--sc-text-2` | `#475665` | `#b7c4cf` | texte secondaire, libellés de propriétés |
| `--sc-muted` | `#5d6a76` | `#8d9cab` | descriptions, unités, placeholders (AA sur `sheet`) |
| `--sc-accent` | `#ff7a00` | `#ff8a1f` | actif, sélection, focus, action principale |
| `--sc-accent-hover` | `#ff8f2b` | `#ffa04d` | survol de l'action principale |
| `--sc-accent-ink` | `#ad4c00` | `#ffb067` | texte orange lisible (lien, ligne sélectionnée) |
| `--sc-accent-soft` | `#fff1e4` | `rgba(255,138,31,.16)` | fond de ligne sélectionnée |
| `--sc-danger` | `#c8321e` | `#ff6b57` | suppression, erreur |
| `--sc-danger-soft` | `#fdecea` | `rgba(255,107,87,.14)` | fond d'erreur |
| `--sc-ok` | `#1f8a4c` | `#4fcf86` | terminé, en ligne |
| `--sc-ok-soft` | `#e7f5ed` | `rgba(79,207,134,.14)` | fond de succès |
| `--sc-warn` | `#a86b00` | `#f2b84b` | réserve, attente longue |
| `--sc-warn-soft` | `#fdf4e1` | `rgba(242,184,75,.14)` | fond d'avertissement |
| `--sc-info` | `#2b6cb0` | `#6aa8ec` | en cours, information |
| `--sc-info-soft` | `#e8f1fb` | `rgba(106,168,236,.14)` | fond d'information |
| `--sc-selection-text` | `#ffd9b5` | `#6b3a10` | sélection de texte |

Chaque couple texte/fond utilisé est vérifié AA par un test (script de contraste sur les jetons).

**Palette de données** (couleurs de groupes, courbes, étapes par défaut) : 12 teintes réparties en angle, de luminosité égale, distinguables en deuteranopie, et distinctes de l'orange d'accent (aucune teinte entre 20° et 40°). Leurs valeurs seront fixées et validées par script au lot 0. Les couleurs saisies par l'utilisateur (groupes, étapes) restent libres et sont toujours accompagnées du nom.

### 2.2 Typographie

Polices embarquées (sans réseau) : **Geist** 400/500/600, **Geist Mono** 400/500. `font-synthesis: none`.

| Rôle | Police | Taille / interligne | Graisse | Usage |
|---|---|---|---|---|
| `display` | Geist | 22 / 28 | 600 | titre de page (rare : connexion, page vide) |
| `title` | Geist | 16 / 22 | 600 | titre de panneau, nom dans la fiche |
| `subtitle` | Geist | 14 / 20 | 500 | titre de section, onglets |
| `body` | Geist | 13.5 / 20 | 400 | texte courant, lignes de tableau et d'arbre |
| `label` | Geist | 13 / 16 | 500 | boutons, champs, menus |
| `caption` | Geist | 12 / 16 | 400 | descriptions, aide, dates relatives |
| `group` | Geist | 11 / 14, `+0.06em`, majuscules | 500 | intertitres de groupe (catégories d'attributs, domaines du navigateur) |
| `value` | Geist Mono | 12.5 / 18, tabulaires | 400 | valeurs, identifiants, dates exactes, compteurs |
| `readout` | Geist Mono | 20 / 24, tabulaires | 500 | lectures en grand (cartes de mesure, état du hub) |

### 2.3 Espacements, rayons, ombres, mouvement

- Grille de **4 px**. Échelle : 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48.
- Rayons : `value` 6 · `control` 8 · `card` 12 · `sheet` 16 · `pill` 999.
- Ombres :
  - `--sc-shadow-1` : `0 1px 2px rgba(20,32,44,.06)` (cartes) ;
  - `--sc-shadow-2` : `0 8px 24px -8px rgba(20,32,44,.18), 0 2px 6px rgba(20,32,44,.06)` (menus, popovers) ;
  - `--sc-shadow-3` : `0 24px 48px -12px rgba(20,32,44,.28)` (dialogues).
  En sombre, on rehausse d'un niveau et on ajoute un filet de 1 px.
- Hauteurs : barre supérieure 48 · rail 48 de large · contrôle 32 (sm 28, lg 40) · ligne 36 (compact 28).
- Mouvement : 120 ms `cubic-bezier(.2,0,0,1)` pour les apparitions, 80 ms pour les disparitions. Rien au-delà de 150 ms. Tout coupé si `prefers-reduced-motion`.
- Focus : `outline: 2px solid var(--sc-accent); outline-offset: 2px`, sur `:focus-visible` seulement.

### 2.4 Icônes

Lucide (trait 1,75, extrémités rondes, grille 24), en 16 px dans les lignes et 20 px dans les barres. **Icônes de types de nœuds** : un jeu fixe et documenté (contexte, site, bâtiment, étage, zone, pièce, équipement, référence, groupe, catégorie, réseau, automate, endpoint, point de contrôle, ticket, événement, note, document, analyse, scène, maquette, jumeau, dossier…). Elles sont centralisées dans `TypeIcone`, et un type inconnu retombe sur une icône générique avec son nom brut en infobulle.

## 3. Composants

Tous dans `src/lib/ui/`. Svelte 5, `$props()` typées, slots par `Snippet`, aucun appel Spinal. Chaque composant a dans la page `/studio/_ds` une section qui montre tous ses états : repos, survol, focus, actif, désactivé, chargement, erreur, vide, densité compacte, thème sombre.

### 3.1 Base

| Composant | Contrat |
|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'ghost' \| 'danger'`, `size: 'sm' \| 'md' \| 'lg'`, `icon?`, `loading?`, `disabled?` + raison en infobulle. Libellé = verbe + objet. Un seul `primary` par zone. |
| `IconButton` | Icône seule, `label` **obligatoire** (infobulle et `aria-label`), `pressed?` pour les bascules. |
| `Icon`, `TypeIcone` | Icône Lucide ; icône du type de nœud avec repli générique. |
| `Kbd` | Touche affichée (`Ctrl K`), en Geist Mono. |
| `Badge` | Compteur ou étiquette courte, `tone: neutral \| accent \| ok \| warn \| danger \| info`. |
| `Statut` | État normalisé (02-ux §6) : icône + libellé + couleur, `taille`, `detail?` en infobulle. |
| `Pastille` | Pastille de couleur utilisateur (groupe, étape, contexte), toujours accompagnée d'un nom. |
| `Avatar` | Initiales sur fond dérivé du nom (utilisateur, auteur). |
| `Separateur` | Filet horizontal ou vertical. |

### 3.2 Saisie

| Composant | Contrat |
|---|---|
| `Field` | Enveloppe : libellé, description, message d'erreur, indicateur requis. Tous les champs passent par lui. |
| `TextInput` | `type: text \| search \| password` (bouton révéler), `prefix?`/`suffix?` (unité), `clearable?`. |
| `NumberInput` | Nombre avec unité, min, max, pas, chiffres tabulaires. Une saisie invalide reste affichée et signalée. |
| `Textarea` | Hauteur auto, limite affichée. |
| `Select` | Liste fermée dessinée (bits-ui), jamais de `<select>` natif. Recherche si plus de 8 options. |
| `Combobox` | Recherche + choix, `creatable?` : affiche « Créer « xyz » » en dernière option. |
| `Checkbox`, `Switch`, `RadioGroup`, `Segmented` | Bascules et choix exclusifs, entièrement dessinés (case, coche, état indéterminé, focus, désactivé) : jamais de case ni de radio natives. `Segmented` pour 2 à 5 options courtes (vues, périodes). |
| `Slider` | Piste et valeur en lecture tabulaire, champ numérique couplé. |
| `DateTimeInput` | Champ date/heure dessiné + calendrier en `Popover` (mois, sélection, plage facultative), saisie clavier au format français, fuseau affiché s'il diffère. Pas de `datetime-local` natif. |
| `ColorInput` | Nuancier de la palette de données + champ hexadécimal + sélecteur libre dessiné (zone teinte/saturation, curseur de teinte) en `Popover`. Pas d'`input[type=color]` natif. |
| `FileDrop` | Zone de dépôt + bouton parcourir, `accept`, `multiple`, état survol. Utilisée aussi en plein écran (Drive). |
| `RegexInput` | Champ d'expression régulière avec options (`i`, `g`…), validation en direct, test sur des exemples. |
| `CronInput` | Expression cron, validation, 5 prochaines exécutions, aide de syntaxe. |
| `CodeEditor` | CodeMirror 6 chargé à la demande, `language: js \| json`, hauteur réglable, bandeau d'avertissement facultatif. |
| `KeyValueEditor` | Lignes libellé / valeur / unité, ajout, suppression, réordonnancement (attributs, liens). |
| `ColorScaleEditor` | Seuils min, milieu et max avec couleurs, aperçu du dégradé ; variantes booléen et énumération (points de contrôle). |

### 3.3 Navigation et structure

| Composant | Contrat |
|---|---|
| `TopBar` | Barre supérieure marine : logo, sections, emplacement central (jumeau ouvert), recherche, tâches, compte. |
| `Rail` | Barre verticale d'icônes avec libellé en infobulle, élément actif (témoin orange), pastille d'état. |
| `SplitPane` | Panneaux redimensionnables (poignée de 6 px, clavier ← →), bornes min et max, repli, mémorisation par clé. |
| `Panel` | Feuille : en-tête (titre, sous-titre, actions), corps défilant, pied facultatif. |
| `Drawer` | Panneau latéral superposé (petits écrans, fiche de ticket). |
| `Tabs` | Onglets avec compteur, défilement horizontal si trop nombreux. |
| `Breadcrumb` | Fil d'Ariane, segments cliquables, troncature au milieu avec menu. |
| `Etapes` | Étapes d'un assistant : numéro, titre, état (à faire, en cours, fait, erreur). Retour possible aux étapes faites. |
| `Toolbar` | Barre d'actions de page ou de fiche : 3 actions visibles puis « Plus », regroupement selon 02-ux §5. |
| `SelectionBar` | Remplace la `Toolbar` quand une sélection multiple existe : « 3 éléments sélectionnés », actions communes, « Tout désélectionner ». |

### 3.4 Données

| Composant | Contrat |
|---|---|
| `ScrollArea` | Défilement personnalisé en JS pour **toute** zone qui défile (panneaux, listes, menus, tableaux, page) : barre fine à la teinte des jetons, qui s'élargit au survol et en glisser, se masque à l'arrêt, piste cliquable, défilement à la molette, au clavier et tactile inchangés. La barre native est masquée (`scrollbar-width: none`), le défilement reste celui du navigateur (pas de défilement simulé), donc fluide et compatible avec `VirtualList`. |
| `VirtualList` | Liste virtualisée à hauteur de ligne fixe (implémentation maison d'environ 80 lignes : défilement, `scrollToIndex`, rendu de 2 écrans). Base de `Tree` et `DataTable`. |
| `Tree` | Arbre virtualisé, chargement à la demande (`loadChildren`), sélection simple ou multiple, navigation clavier APG, `renderRow` (icône, nom, pastille, badges, compteur), glisser-déposer facultatif (`canDrop`), groupes d'en-tête (domaines), recherche avec surlignage. |
| `DataTable` | Tableau virtualisé : colonnes triables, redimensionnables, masquables ; en-tête collant ; sélection de lignes ; cellule éditable en ligne (`editable`, avec marque de modification en attente) ; colonne d'actions ; état vide. Pas de pagination. |
| `PropertyList` | Lignes libellé / valeur (valeur en `value` mono, unité en `muted`), groupes repliables (`group`), valeurs absentes en « — », copie au survol. |
| `Card` | Carte de contenu ; variante `Mesure` (nom, `readout`, unité, horodatage, actions). |
| `Timeline` | Chronologie (journal, commentaires de ticket) : avatar, auteur, action, date relative, contenu. |
| `DiffList` | Différences groupées (Ajouts · Suppressions · Modifications · Inchangés) avec compteurs, ancienne et nouvelle valeur, cases à cocher facultatives, actions par ligne (montrer dans la 3D). Sert pour GEO-06, PROF-04, ATT-03, BIM-03, BIM-04. |
| `Chart` | Enveloppe uPlot : séries, axes par unité, survol en lecture tabulaire, zoom, réinitialisation, légende configurable. Chargé à la demande. |
| `RangePresets` | Périodes : 1 h, 3 h, 24 h, Hier, 3 j, 7 j, Personnalisée. |
| `Calendar` | Enveloppe `@event-calendar/core` habillée par les jetons. Chargé à la demande. |
| `GraphCanvas` | Enveloppe Svelte Flow pour l'inspecteur (nœuds typés, mise en page DAG ou forces). Chargé à la demande. |

### 3.5 Retour et superposition

| Composant | Contrat |
|---|---|
| `Tooltip` | Infobulle marine, délai 400 ms, au clavier aussi. |
| `Popover` | Bulle ancrée (bits-ui), fermeture par `Échap` et clic extérieur. |
| `Menu`, `ContextMenu` | Menus (bits-ui) : icône, libellé, raccourci, sous-menus, groupes séparés, éléments `danger`. Alimentés par le registre d'actions. |
| `Dialog` | Boîte modale : titre, contenu, pied d'actions (le principal à droite). Pas de « OK » : le bouton reprend le verbe. |
| `ConfirmerPortee` | Confirmation de portée (02-ux §5) : verbe, compteur, liste dépliable de ce qui est touché, encadré « Ce qui ne change pas », exclusions avec raisons, choix de périmètre facultatif, bouton `danger` ou `secondary` selon le type (suppression ou retrait). |
| `Toast` | Notifications en bas à gauche, empilées (3 au plus) : succès, info, erreur ; action facultative (« Annuler », « Voir ») ; 5 s, ou 8 s s'il y a une action ; persistantes pour les erreurs. |
| `TaskTray` | Plateau des tâches (01-architecture §7) : liste par état, progression, détail par élément, annuler, relancer les échecs, effacer les terminées. |
| `Banner` | Bandeau pleine largeur : perte du hub, mode expert, module indisponible. |
| `Progress` | Barre (déterminée ou non). `Spinner` réservé aux boutons. |
| `Skeleton` | Formes de chargement (ligne, carte, tableau). |
| `EmptyState` | Icône, phrase qui dit pourquoi, action utile. |
| `ErrorState` | Message clair, détail technique repliable et copiable, « Réessayer ». Variante « Indisponible » (cause nommée). |
| `CommandPalette` | `Ctrl K` : recherche floue sur actions, objets du jumeau, dossiers et ateliers ; sections ; raccourcis affichés ; récents. |
| `ShortcutHelp` | `?` : raccourcis groupés par zone. |

### 3.6 Composants Spinal (dans `lib/` mais hors de `lib/ui`, car ils connaissent le domaine)

| Composant | Contrat |
|---|---|
| `NoeudChip` | `TypeIcone` + nom + pastille + chemin en infobulle ; cliquable (ouvre la fiche). |
| `SelecteurGroupe` | Cascade contexte → catégorie → groupe, filtrée par type compatible, avec création à la volée à chaque niveau (`Combobox` créable). Utilisé par GRP, EVT, DOC-04, CP, TIC. |
| `SelecteurNoeud` | Explorateur de contextes à la demande + recherche, pour choisir une cible (liens, ancres d'analyse). |
| `EnsembleSelection` | Ensemble d'objets 3D ou de nœuds (02-ux §4). |
| `ViewerHost` | Conteneur de viewer-rs (01-architecture §5). |
| `FicheObjet` | Fiche (annexes/ecrans-studio §3), onglets fournis par les domaines. |
| `CarteOrgan` | État d'un organ : en ligne, sans réponse, demande envoyée, état rapporté, commandes. |

## 4. Règles d'usage

- Une zone a au plus **un** bouton `primary`.
- Les actions destructrices passent **toujours** par `ConfirmerPortee`, jamais par `confirm()`.
- Pas de valeur codée en dur (couleur, espacement, rayon) dans un écran : seulement des jetons. Un test de lint simple (recherche de `#[0-9a-f]{3,6}` et de `px` hors jetons dans `routes/`) le vérifie.
- Aucun contrôle natif visible (voir « Aucun contrôle natif du navigateur ») : un test recherche dans `app/src` les `<select`, `type="checkbox"`, `type="radio"`, `type="range"`, `type="date`, `type="time`, `datetime-local`, `type="color"`, les attributs `title=` et les appels `alert(`/`confirm(`/`prompt(`, et échoue s'il en trouve hors des exceptions déclarées.
- Pas de nouveau composant générique dans un écran : s'il manque, on l'ajoute au design system avec sa section de démonstration.
