<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<!-- Page de démonstration du design system (05-design-system §3) : chaque composant et ses états, clair et sombre. -->
<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity';
  import Section from './Section.svelte';
  import Button from '$lib/ui/Button.svelte';
  import IconButton from '$lib/ui/IconButton.svelte';
  import Icon from '$lib/ui/Icon.svelte';
  import Kbd from '$lib/ui/Kbd.svelte';
  import Badge from '$lib/ui/Badge.svelte';
  import Statut from '$lib/ui/Statut.svelte';
  import Pastille from '$lib/ui/Pastille.svelte';
  import Avatar from '$lib/ui/Avatar.svelte';
  import Separateur from '$lib/ui/Separateur.svelte';
  import Field from '$lib/ui/Field.svelte';
  import TextInput from '$lib/ui/TextInput.svelte';
  import NumberInput from '$lib/ui/NumberInput.svelte';
  import Textarea from '$lib/ui/Textarea.svelte';
  import Select from '$lib/ui/Select.svelte';
  import Combobox from '$lib/ui/Combobox.svelte';
  import Checkbox from '$lib/ui/Checkbox.svelte';
  import Switch from '$lib/ui/Switch.svelte';
  import RadioGroup from '$lib/ui/RadioGroup.svelte';
  import Segmented from '$lib/ui/Segmented.svelte';
  import Slider from '$lib/ui/Slider.svelte';
  import DateTimeInput from '$lib/ui/DateTimeInput.svelte';
  import ColorInput from '$lib/ui/ColorInput.svelte';
  import FileDrop from '$lib/ui/FileDrop.svelte';
  import TopBar from '$lib/ui/TopBar.svelte';
  import Rail from '$lib/ui/Rail.svelte';
  import SplitPane from '$lib/ui/SplitPane.svelte';
  import Panel from '$lib/ui/Panel.svelte';
  import Drawer from '$lib/ui/Drawer.svelte';
  import Tabs from '$lib/ui/Tabs.svelte';
  import Breadcrumb from '$lib/ui/Breadcrumb.svelte';
  import Etapes from '$lib/ui/Etapes.svelte';
  import Toolbar from '$lib/ui/Toolbar.svelte';
  import SelectionBar from '$lib/ui/SelectionBar.svelte';
  import Tree from '$lib/ui/Tree.svelte';
  import Surligne from '$lib/ui/Surligne.svelte';
  import DataTable from '$lib/ui/DataTable.svelte';
  import PropertyList from '$lib/ui/PropertyList.svelte';
  import Card from '$lib/ui/Card.svelte';
  import Timeline from '$lib/ui/Timeline.svelte';
  import DiffList from '$lib/ui/DiffList.svelte';
  import RangePresets from '$lib/ui/RangePresets.svelte';
  import Tooltip from '$lib/ui/Tooltip.svelte';
  import Popover from '$lib/ui/Popover.svelte';
  import Menu from '$lib/ui/Menu.svelte';
  import ContextMenu from '$lib/ui/ContextMenu.svelte';
  import Dialog from '$lib/ui/Dialog.svelte';
  import ConfirmerPortee from '$lib/ui/ConfirmerPortee.svelte';
  import Toasts from '$lib/ui/Toasts.svelte';
  import { notifier } from '$lib/ui/toasts.svelte';
  import TaskTray from '$lib/ui/TaskTray.svelte';
  import Banner from '$lib/ui/Banner.svelte';
  import Progress from '$lib/ui/Progress.svelte';
  import Spinner from '$lib/ui/Spinner.svelte';
  import Skeleton from '$lib/ui/Skeleton.svelte';
  import EmptyState from '$lib/ui/EmptyState.svelte';
  import ErrorState from '$lib/ui/ErrorState.svelte';
  import CommandPalette from '$lib/ui/CommandPalette.svelte';
  import ShortcutHelp from '$lib/ui/ShortcutHelp.svelte';
  import TypeIcone from '$lib/spinal/TypeIcone.svelte';
  import NoeudChip from '$lib/spinal/NoeudChip.svelte';
  import CarteOrgan from '$lib/spinal/CarteOrgan.svelte';
  import { TYPES } from '$lib/spinal/types-noeuds';
  import type { Action, Colonne, ElementMenu, Tache } from '$lib/ui/types';
  import type { NoeudArbre } from '$lib/ui/arbre';
  import { taille } from '$lib/ui/format';

  import Plus from '@lucide/svelte/icons/plus';
  import Upload from '@lucide/svelte/icons/upload';
  import Download from '@lucide/svelte/icons/download';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import Pencil from '@lucide/svelte/icons/pencil';
  import Share2 from '@lucide/svelte/icons/share-2';
  import FolderPlus from '@lucide/svelte/icons/folder-plus';
  import Move from '@lucide/svelte/icons/move';
  import Search from '@lucide/svelte/icons/search';
  import Settings from '@lucide/svelte/icons/settings';
  import Sun from '@lucide/svelte/icons/sun';
  import Moon from '@lucide/svelte/icons/moon';
  import Rows3 from '@lucide/svelte/icons/rows-3';
  import List from '@lucide/svelte/icons/list';
  import LayoutGrid from '@lucide/svelte/icons/layout-grid';
  import Building from '@lucide/svelte/icons/building';
  import Layers from '@lucide/svelte/icons/layers';
  import Network from '@lucide/svelte/icons/network';
  import Ticket from '@lucide/svelte/icons/ticket';
  import ChartLine from '@lucide/svelte/icons/chart-line';
  import Gauge from '@lucide/svelte/icons/gauge';
  import FolderOpen from '@lucide/svelte/icons/folder-open';
  import Activity from '@lucide/svelte/icons/activity';
  import RefreshCw from '@lucide/svelte/icons/refresh-cw';
  import Unlink from '@lucide/svelte/icons/unlink';
  import Eye from '@lucide/svelte/icons/eye';
  import Scan from '@lucide/svelte/icons/scan';
  import Copy from '@lucide/svelte/icons/copy';
  import FileBox from '@lucide/svelte/icons/file-box';
  import Boxes from '@lucide/svelte/icons/boxes';
  import Folder from '@lucide/svelte/icons/folder';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';

  // ---------- thème et densité ----------
  let theme = $state<'clair' | 'sombre'>(document.documentElement.dataset.theme === 'dark' ? 'sombre' : 'clair');
  let densite = $state<'confort' | 'compact'>('confort');
  $effect(() => {
    document.documentElement.dataset.theme = theme === 'sombre' ? 'dark' : 'light';
    try { localStorage.setItem('sc-theme', document.documentElement.dataset.theme); } catch {}
  });
  $effect(() => { document.documentElement.dataset.density = densite === 'compact' ? 'compact' : ''; });

  // ---------- démo ----------
  let texte = $state('Tour Horizon');
  let mdp = $state('secret-123');
  let recherche = $state('');
  let nombreVal = $state<number | null>(21.5);
  let note = $state('Contrôle annuel prévu le 12 décembre.');
  let periode = $state('24h');
  let vue = $state('liste');
  let choix = $state('geographicRoom');
  let groupe = $state('');
  let groupes = $state([
    { value: 'bureaux', label: 'Bureaux' }, { value: 'salles', label: 'Salles de réunion' }, { value: 'techniques', label: 'Locaux techniques' },
  ]);
  let coche = $state(true);
  let indet = $state(true);
  let interrupteur = $state(true);
  let radio = $state('noeud');
  let curseur = $state(40);
  let quand = $state('2026-11-24T14:30');
  let couleur = $state('#4a79c6');
  let fichiersDeposes = $state<string[]>([]);
  let atelier = $state('geo');
  let onglet = $state('infos');
  let etape = $state(1);
  let dialogue = $state(false);
  let confirmer = $state(false);
  let confirmerRetrait = $state(false);
  let perimetre = $state('noeud');
  let tiroir = $state(false);
  let palette = $state(false);
  let aide = $state(false);
  let popover = $state(false);
  let selArbre = $state<string[]>(['p-102']);
  let filtreArbre = $state('');
  let selTable = $state<string[]>(['f2', 'f3']);

  const ouverts = new SvelteSet(['ctx', 'bat-a', 'et-1']);
  let racines = $state<NoeudArbre[]>([
    { id: 'ctx', label: 'Espaces', enfants: [
      { id: 'bat-a', label: 'Tour Horizon', enfants: [
        { id: 'et-1', label: 'R+1', enfants: Array.from({ length: 8 }, (_, i) => ({ id: `p-1${String(i + 1).padStart(2, '0')}`, label: i % 3 === 0 ? `Bureau 1${String(i + 1).padStart(2, '0')}` : `Salle 1${String(i + 1).padStart(2, '0')}`, enfants: [] })) },
        { id: 'et-2', label: 'R+2', aEnfants: true },
        { id: 'et-3', label: 'R+3', aEnfants: true },
      ] },
      { id: 'bat-b', label: 'Parking', enfants: [] },
    ] },
  ]);
  const typeDe: Record<string, string> = { ctx: 'geographicContext', 'bat-a': 'geographicBuilding', 'bat-b': 'geographicBuilding' };
  const typeArbre = (id: string) => typeDe[id] ?? (id.startsWith('et-') ? 'geographicFloor' : 'geographicRoom');
  async function chargerArbre(n: NoeudArbre) {
    await new Promise((r) => setTimeout(r, 600));
    n.enfants = Array.from({ length: 40 }, (_, i) => ({ id: `${n.id}-p${i}`, label: `Pièce ${n.label.slice(2)}${String(i + 1).padStart(2, '0')}`, enfants: [] }));
    racines = [...racines];
  }

  interface Fichier { id: string; nom: string; type: string; taille: number; modifie: string; etat: 'pret' | 'conv' | 'echec' | 'aucun'; version?: number }
  const fichiers: Fichier[] = [
    { id: 'f1', nom: 'Anciennes versions', type: 'dossier', taille: 0, modifie: '12 nov.', etat: 'aucun' },
    { id: 'f2', nom: 'TOUR_HORIZON_ARC.rvt', type: 'maquette', taille: 412_000_000, modifie: 'il y a 2 h', etat: 'pret', version: 4 },
    { id: 'f3', nom: 'TOUR_HORIZON_STR.rvt', type: 'maquette', taille: 96_000_000, modifie: '18 nov.', etat: 'pret', version: 2 },
    { id: 'f4', nom: 'TOUR_HORIZON_CVC.ifc', type: 'maquette', taille: 186_000_000, modifie: 'il y a 5 min', etat: 'conv' },
    { id: 'f5', nom: 'Parking_v0.nwd', type: 'maquette', taille: 1_100_000_000, modifie: '10 nov.', etat: 'echec' },
    { id: 'f6', nom: 'Jumeau Tour Horizon', type: 'jumeau', taille: 0, modifie: 'il y a 2 h', etat: 'pret' },
    ...Array.from({ length: 1994 }, (_, i): Fichier => ({ id: `g${i}`, nom: `Photo_chantier_${String(i + 1).padStart(4, '0')}.jpg`, type: 'document', taille: 2_000_000 + ((i * 7919) % 6_000_000), modifie: `${(i % 28) + 1} oct.`, etat: 'aucun' })),
  ];
  let colonnes = $state<Colonne<Fichier>[]>([
    { id: 'nom', label: 'Nom', min: 260, valeur: (f) => f.nom, cellule: cellNom },
    { id: 'taille', label: 'Taille', largeur: 110, align: 'droite', mono: true, valeur: (f) => f.taille || null, texte: (f) => (f.taille ? taille(f.taille) : '—') },
    { id: 'modifie', label: 'Dernière activité', largeur: 160, valeur: (f) => f.modifie },
    { id: 'etat', label: 'État', largeur: 170, valeur: (f) => f.etat, cellule: cellEtat },
  ]);
  let tri = $state<{ id: string; sens: 'asc' | 'desc' } | null>({ id: 'nom', sens: 'asc' });

  const actionsFichier: Action[] = [
    { id: 'deposer', label: 'Déposer', icone: Upload, groupe: 'creer', principale: true, executer: () => notifier('Choisissez des fichiers à déposer', 'info') },
    { id: 'dossier', label: 'Nouveau dossier', icone: FolderPlus, groupe: 'creer', executer: () => {} },
    { id: 'telecharger', label: 'Télécharger', icone: Download, groupe: 'exporter', executer: () => {} },
    { id: 'renommer', label: 'Renommer', icone: Pencil, groupe: 'modifier', raccourci: 'F2', executer: () => {} },
    { id: 'partager', label: 'Partager', icone: Share2, groupe: 'relier', executer: () => {} },
    { id: 'deplacer', label: 'Déplacer vers…', icone: Move, groupe: 'modifier', executer: () => {} },
    { id: 'retirer', label: 'Retirer du jumeau', icone: Unlink, groupe: 'retirer', executer: () => (confirmerRetrait = true) },
    { id: 'supprimer', label: 'Supprimer', icone: Trash2, groupe: 'supprimer', raccourci: 'Suppr', executer: () => (confirmer = true) },
  ];
  const actionsSelection: Action[] = [
    { id: 'tel', label: 'Télécharger', icone: Download, groupe: 'exporter', executer: () => {} },
    { id: 'dep', label: 'Déplacer vers…', icone: Move, groupe: 'modifier', executer: () => {} },
    { id: 'par', label: 'Partager', icone: Share2, groupe: 'relier', executer: () => {} },
    { id: 'ren', label: 'Renommer', icone: Pencil, groupe: 'modifier', desactive: true, raison: 'Un seul élément à la fois', executer: () => {} },
    { id: 'sup', label: 'Supprimer', icone: Trash2, groupe: 'supprimer', executer: () => (confirmer = true) },
  ];
  const menuElements: ElementMenu[] = [
    { type: 'titre', label: 'Fichier' },
    { id: 'o', label: 'Ouvrir', icone: FolderOpen, raccourci: 'Entrée', executer: () => {} },
    { id: 'r', label: 'Renommer', icone: Pencil, raccourci: 'F2', executer: () => {} },
    { id: 'c', label: 'Copier le lien', icone: Copy, executer: () => notifier('Lien copié') },
    { type: 'sous-menu', label: 'Voir dans la 3D', icone: Eye, elements: [
      { id: 'i', label: 'Isoler', icone: Scan, raccourci: 'I', executer: () => {} },
      { id: 'f', label: 'Cadrer', raccourci: 'F', executer: () => {} },
    ] },
    { id: 'v', label: 'Convertir à nouveau', icone: RefreshCw, desactive: true, raison: 'Une conversion est déjà en cours', executer: () => {} },
    { type: 'separateur' },
    { id: 'd', label: 'Supprimer', icone: Trash2, danger: true, raccourci: 'Suppr', executer: () => (confirmer = true) },
  ];
  const t0 = Date.now();
  let taches = $state<Tache[]>([
    { id: 't1', titre: 'Dépôt de 9 fichiers dans Maquettes', contexte: '612 / 1 330 Mo · 48 Mo/s', etat: 'cours', icone: Upload, progression: 46, duree: '~ 15 s', annuler: () => {} },
    { id: 't2', titre: 'Conversion TOUR_HORIZON_CVC.ifc', contexte: 'Jumeau Tour Horizon · v2', etat: 'cours', icone: RefreshCw,
      etapes: [{ nom: 'Envoi', etat: 'fait' }, { nom: 'Téléchargement', etat: 'fait' }, { nom: 'Forge', etat: 'fait' }, { nom: 'Conversion', etat: 'cours' }, { nom: 'Récupération', etat: 'attente' }, { nom: 'Prête', etat: 'attente' }],
      detail: 'État écrit par l’organ forge · il y a 3 s', duree: '4 min 12 s' },
    { id: 't3', titre: 'Conversion Parking_v0.nwd', etat: 'erreur', icone: RefreshCw, detail: 'Forge : format NWD non accepté par ce compte APS · étape 3/6', relancer: () => notifier('Conversion relancée', 'info') },
    { id: 't4', titre: 'Déplacement de 14 éléments', etat: 'reserves', icone: Move,
      resultats: { ok: 12, ignores: [{ nom: 'GED synchronisée', raison: 'dossier synchronisé' }, { nom: 'Archives 2024', raison: 'dossier synchronisé' }] }, relancer: () => {} },
    { id: 't5', titre: 'Conversion TOUR_HORIZON_ARC.rvt v4', etat: 'termine', icone: RefreshCw, detail: 'Prête · il y a 2 h', duree: '3 min 40 s' },
  ]);

  const commandes = [
    { id: 'c1', label: 'Nouveau jumeau', section: 'Actions', icone: Boxes, executer: () => notifier('Assistant « Nouveau jumeau »', 'info') },
    { id: 'c2', label: 'Déposer des fichiers', section: 'Actions', icone: Upload, raccourci: 'Ctrl U', executer: () => {} },
    { id: 'c3', label: 'Nouveau dossier', section: 'Actions', icone: FolderPlus, executer: () => {} },
    { id: 'c4', label: 'Basculer le thème', section: 'Actions', icone: Moon, executer: () => (theme = theme === 'clair' ? 'sombre' : 'clair') },
    { id: 'c5', label: 'TOUR_HORIZON_ARC.rvt', section: 'Fichiers', icone: FileBox, detail: 'Projets › Tour Horizon › Maquettes', executer: () => {} },
    { id: 'c6', label: 'Jumeau Tour Horizon', section: 'Fichiers', icone: Boxes, detail: 'Projets › Tour Horizon', executer: () => {} },
    { id: 'c7', label: 'Projets', section: 'Dossiers', icone: Folder, executer: () => {} },
    { id: 'c8', label: 'Géographie', section: 'Ateliers', icone: Building, executer: () => {} },
  ];
  const raccourcis = [
    { titre: 'Partout', raccourcis: [{ touches: 'Ctrl K', effet: 'Palette de commandes' }, { touches: '?', effet: 'Cette aide' }, { touches: 'Échap', effet: 'Fermer, puis désélectionner' }] },
    { titre: 'Listes et arbres', raccourcis: [{ touches: '/', effet: 'Rechercher' }, { touches: '↑ ↓ ← →', effet: 'Parcourir, déplier' }, { touches: 'F2', effet: 'Renommer' }, { touches: 'Suppr', effet: 'Retirer ou supprimer' }] },
    { titre: 'Viewer', raccourcis: [{ touches: 'F', effet: 'Cadrer la sélection' }, { touches: 'I', effet: 'Isoler' }, { touches: 'H', effet: 'Masquer' }, { touches: 'Maj H', effet: 'Tout afficher' }] },
  ];

  const sommaire = [
    ['jetons', 'Jetons'], ['typo', 'Typographie'], ['boutons', 'Boutons'], ['badges', 'Badges et statuts'], ['saisie', 'Champs'],
    ['bascules', 'Bascules et choix'], ['speciaux', 'Valeurs spéciales'], ['depot', 'Dépôt'], ['navigation', 'Barre et rail'],
    ['structure', 'Panneaux et onglets'], ['assistant', 'Étapes'], ['actions', 'Actions et sélection'], ['arbre', 'Arbre'],
    ['tableau', 'Tableau'], ['proprietes', 'Propriétés et cartes'], ['diff', 'Différences'], ['superpositions', 'Menus et bulles'],
    ['dialogues', 'Dialogues'], ['taches', 'Tâches'], ['retours', 'Retours et états'], ['spinal', 'Composants Spinal'],
  ];
  const couleursJetons = ['ink', 'ink-2', 'ink-3', 'ground', 'ground-2', 'sheet', 'line', 'line-2', 'line-field', 'text', 'text-2', 'muted', 'accent', 'accent-ink', 'accent-soft', 'focus', 'danger', 'danger-soft', 'ok', 'ok-soft', 'warn', 'warn-soft', 'info', 'info-soft'];
</script>

{#snippet cellNom(f: Fichier)}
  <TypeIcone type={f.type === 'dossier' ? 'dossier' : f.type === 'jumeau' ? 'jumeau' : f.type === 'maquette' ? 'maquette' : 'document'} size={15} />
  <span class="nom">{f.nom}</span>{#if f.version}<Badge tone={f.version === 4 ? 'accent' : 'neutre'} mono>v{f.version}</Badge>{/if}
{/snippet}
{#snippet cellEtat(f: Fichier)}
  {#if f.etat === 'pret'}<Statut etat="termine" label="Prête" />{:else if f.etat === 'conv'}<Statut etat="cours" label="Conversion 62 %" />{:else if f.etat === 'echec'}<Statut etat="erreur" label="Échec" detail="Format NWD non accepté" />{:else}<span class="sc-muted">—</span>{/if}
{/snippet}
{#snippet actionLigne(f: Fichier)}
  <Menu elements={menuElements} align="end">{#snippet trigger(props)}<IconButton {...props} icon={Settings} label="Actions sur {f.nom}" size="sm" />{/snippet}</Menu>
{/snippet}

<svelte:head><title>Design system — SpinalCore</title></svelte:head>

<div class="ds">
  <TopBar sections={[{ id: 'drive', label: 'Drive', href: '#' }, { id: 'studio', label: 'Studio', href: '#', desactive: true }, { id: 'admin', label: 'Admin', href: '#' }, { id: 'ds', label: 'Design system', href: '#' }]}
    active="ds" ouvrirPalette={() => (palette = true)}>
    {#snippet droite()}
      <IconButton icon={Activity} label="Tâches" variant="on-ink" />
      <IconButton icon={theme === 'clair' ? Moon : Sun} label={theme === 'clair' ? 'Thème sombre' : 'Thème clair'} variant="on-ink" onclick={() => (theme = theme === 'clair' ? 'sombre' : 'clair')} />
      <Avatar nom="admin" />
    {/snippet}
  </TopBar>

  <div class="page">
    <nav class="toc" aria-label="Sommaire">
      <div class="sc-group">Réglages</div>
      <Segmented bind:value={theme} label="Thème" size="sm" options={[{ value: 'clair', label: 'Clair', icone: Sun }, { value: 'sombre', label: 'Sombre', icone: Moon }]} />
      <Segmented bind:value={densite} label="Densité" size="sm" options={[{ value: 'confort', label: 'Confort' }, { value: 'compact', label: 'Compact' }]} />
      <div class="sc-group" style="margin-top:12px">Composants</div>
      {#each sommaire as [id, l]}<a href="#{id}">{l}</a>{/each}
    </nav>

    <main>
      <header class="intro">
        <h1 class="sc-display">Design system</h1>
        <p class="sc-text-2">« L'atelier du jumeau » : chrome marine, feuilles blanches sur sol bleu-gris, un seul orange pour l'actif, chiffres en Geist Mono.
          Chaque composant est montré dans ses états ; basculez le thème et la densité à gauche. Référence : <code>docs/refonte-svelte/05-design-system.md</code>.</p>
      </header>

      <Section id="jetons" titre="Jetons de couleur" contrat="Variables --sc-*, redéfinies en sombre. Couples texte/fond vérifiés AA par scripts/contraste.mjs (76 couples).">
        <div class="jetons">
          {#each couleursJetons as j}<div class="jeton"><span class="pot" style:background="var(--sc-{j})"></span><code>--sc-{j}</code></div>{/each}
        </div>
        <div class="sc-group">Palette de données (12 teintes, aucune dans l'orange d'accent)</div>
        <div class="rang">{#each Array(12) as _, i}<Pastille couleur="var(--sc-data-{i + 1})" nom="data-{i + 1}" taille={14} />{/each}</div>
      </Section>

      <Section id="typo" titre="Typographie" contrat="Geist et Geist Mono embarquées. Les valeurs chiffrées sont toujours en mono tabulaire.">
        <div class="boite typo">
          <div class="rang"><span class="etiq">display</span><span class="sc-display">Nouveau jumeau</span></div>
          <div class="rang"><span class="etiq">title</span><span class="sc-title">TOUR_HORIZON_ARC.rvt</span></div>
          <div class="rang"><span class="etiq">subtitle</span><span class="sc-subtitle">Maquettes du jumeau</span></div>
          <div class="rang"><span class="etiq">body</span><span class="sc-body">Retirer une maquette ne supprime ni le fichier, ni ses versions.</span></div>
          <div class="rang"><span class="etiq">label</span><span class="sc-label">Identifiant</span></div>
          <div class="rang"><span class="etiq">caption</span><span class="sc-caption">il y a 3 h · par admin</span></div>
          <div class="rang"><span class="etiq">group</span><span class="sc-group">Catégorie spatiale</span></div>
          <div class="rang"><span class="etiq">value</span><span class="sc-value">41 238 objets · 94827187918656</span></div>
          <div class="rang"><span class="etiq">readout</span><span class="sc-readout">21,4 <small class="sc-caption">°C</small></span></div>
        </div>
      </Section>

      <Section id="boutons" titre="Boutons" contrat="Un seul primary par zone. Libellé = verbe + objet. Désactivé = raison en infobulle. Rouge réservé à la destruction.">
        <div class="rang"><span class="etiq">variantes</span>
          <Button variant="primary" icon={Upload}>Déposer</Button><Button icon={FolderPlus}>Nouveau dossier</Button><Button variant="ghost">Annuler</Button>
          <Button variant="ink" iconEnd={Boxes}>Ouvrir dans le Studio</Button><Button variant="danger" icon={Trash2}>Supprimer 3 fichiers</Button><Button variant="danger-ghost" icon={Trash2}>Supprimer</Button>
        </div>
        <div class="rang"><span class="etiq">tailles</span><Button size="sm">Petit</Button><Button>Moyen</Button><Button size="lg" variant="primary">Grand</Button></div>
        <div class="rang"><span class="etiq">états</span><Button loading>Enregistrement…</Button><Button disabled raison="Une conversion est déjà en cours">Convertir</Button><Button variant="primary" disabled raison="Choisissez au moins un fichier">Continuer</Button></div>
        <div class="rang"><span class="etiq">icônes</span>
          <IconButton icon={Search} label="Rechercher" /><IconButton icon={Settings} label="Réglages" variant="secondary" />
          <IconButton icon={List} label="Vue liste" pressed /><IconButton icon={LayoutGrid} label="Vue grille" pressed={false} /><IconButton icon={Trash2} label="Supprimer" disabled />
          <Kbd keys="Ctrl K" /><Kbd keys="F2" /><Kbd keys="Maj H" />
        </div>
      </Section>

      <Section id="badges" titre="Badges, statuts, pastilles, avatars" contrat="Statut : 9 états normalisés (02-ux §6), icône + libellé, jamais la couleur seule.">
        <div class="rang"><span class="etiq">badges</span><Badge>Dossier</Badge><Badge tone="accent">v4 · courante</Badge><Badge tone="ok">Prête</Badge><Badge tone="warn">Partiel</Badge><Badge tone="danger">Échec</Badge><Badge tone="info">Info</Badge><Badge mono>3 / 3</Badge></div>
        <div class="rang"><span class="etiq">statuts</span>
          <Statut etat="attente" /><Statut etat="cours" /><Statut etat="termine" /><Statut etat="reserves" /><Statut etat="erreur" detail="Forge : format refusé" />
          <Statut etat="annule" /><Statut etat="arrete" /><Statut etat="envoyee" /><Statut etat="sans-reponse" /><Statut etat="termine" compact />
        </div>
        <div class="rang"><span class="etiq">pastilles</span><Pastille couleur="#bb5752" nom="Urgent" /><Pastille couleur="#348f4f" nom="Résolu" /><Pastille couleur="#4a79c6" nom="Bureaux" /></div>
        <div class="rang"><span class="etiq">séparateur</span><div style="width:240px"><Separateur /></div><div style="height:24px;display:flex"><Separateur vertical /></div></div>
        <div class="rang"><span class="etiq">avatars</span><Avatar nom="admin" /><Avatar nom="m.durand" /><Avatar nom="Julie Lopez" /><Avatar nom="Exploitant" taille={36} /></div>
      </Section>

      <Section id="saisie" titre="Champs" contrat="Tous les champs passent par Field (libellé, aide, erreur, requis). Bord des champs à 3:1 minimum.">
        <div class="grille">
          <Field id="ds-nom" label="Nom du jumeau" requis description="Visible dans le Drive et le Studio."><TextInput id="ds-nom" bind:value={texte} clearable /></Field>
          <Field id="ds-mdp" label="Mot de passe"><TextInput id="ds-mdp" type="password" bind:value={mdp} /></Field>
          <Field id="ds-err" label="Nom de dossier" erreur="Le nom ne peut pas contenir « / »."><TextInput id="ds-err" value="Plans/R+1" invalide /></Field>
          <Field id="ds-rech" label="Recherche"><TextInput id="ds-rech" type="search" icon={Search} bind:value={recherche} placeholder="Filtrer ce dossier" clearable /></Field>
          <Field id="ds-num" label="Consigne" description="Saisie libre ; invalide signalé sans perdre la frappe."><NumberInput id="ds-num" bind:value={nombreVal} unite="°C" min={5} max={35} step={0.5} /></Field>
          <Field id="ds-dis" label="Identifiant serveur"><TextInput id="ds-dis" value="94827187918656" disabled /></Field>
          <Field id="ds-sel" label="Type d'objet"><Select id="ds-sel" label="Type d'objet" bind:value={choix}
            options={Object.entries(TYPES).slice(0, 12).map(([value, t]) => ({ value, label: t.label, icone: t.icone }))} /></Field>
          <Field id="ds-cb" label="Groupe" description="Tapez un nom absent pour le créer."><Combobox id="ds-cb" label="Groupe" bind:value={groupe} options={groupes} creatable
            oncreate={(t) => { const v = t.toLowerCase().replace(/\s+/g, '-'); groupes = [...groupes, { value: v, label: t }]; groupe = v; notifier(`Groupe « ${t} » créé`); }} /></Field>
          <Field id="ds-ta" label="Note"><Textarea id="ds-ta" bind:value={note} maxlength={280} /></Field>
        </div>
      </Section>

      <Section id="bascules" titre="Bascules et choix">
        <div class="grille">
          <div class="boite col"><Checkbox bind:checked={coche} label="Retenir ce choix pour la session" /><Checkbox bind:checked={indet} indeterminate label="Tout sélectionner (partiel)" /><Checkbox label="Désactivée" disabled /></div>
          <div class="boite col"><Switch bind:checked={interrupteur} label="Convertir les maquettes" description="Lancé dès la fin du transfert." /><Switch label="Créer la scène par défaut" /></div>
          <div class="boite"><RadioGroup bind:value={radio} label="Périmètre" options={[{ value: 'noeud', label: 'Ce nœud seulement' }, { value: 'enfants', label: 'Ce nœud et ses enfants directs', description: '12 nœuds' }, { value: 'type', label: 'Tous les nœuds de ce type', desactive: true }]} /></div>
          <div class="boite col">
            <Segmented bind:value={vue} label="Vue" options={[{ value: 'liste', label: 'Liste', icone: List }, { value: 'grille', label: 'Grille', icone: LayoutGrid }, { value: 'dense', label: 'Dense', icone: Rows3 }]} />
            <Segmented bind:value={vue} label="Vue" iconesSeules options={[{ value: 'liste', label: 'Liste', icone: List }, { value: 'grille', label: 'Grille', icone: LayoutGrid }]} />
            <RangePresets bind:value={periode} />
          </div>
        </div>
      </Section>

      <Section id="speciaux" titre="Valeurs spéciales">
        <div class="grille">
          <div class="boite col"><span class="sc-label">Curseur couplé</span><Slider bind:value={curseur} label="Opacité" unite="%" /></div>
          <div class="boite col"><span class="sc-label">Date et heure</span><DateTimeInput bind:value={quand} label="Début" /><DateTimeInput value="2026-11-24T08:00" fuseau="UTC" label="Début (UTC)" /></div>
          <div class="boite col"><span class="sc-label">Couleur</span><ColorInput bind:value={couleur} label="Couleur du groupe" /><Pastille couleur={couleur} nom="Aperçu" /></div>
        </div>
      </Section>

      <Section id="depot" titre="Dépôt de fichiers" contrat="Zone de dépôt + Parcourir ; contour orange au survol. Utilisée aussi en plein écran dans le Drive.">
        <FileDrop titre="Déposez vos maquettes ici" aide="RVT, IFC, NWD, DWG, SVF.ZIP… — plusieurs fichiers à la fois" onfiles={(f) => (fichiersDeposes = f.map((x) => `${x.name} (${taille(x.size)})`))}>
          {#snippet actions()}<Button icon={Folder}>Choisir dans le Drive</Button>{/snippet}
        </FileDrop>
        {#if fichiersDeposes.length}<p class="sc-caption">Reçus : {fichiersDeposes.join(', ')}</p>{/if}
      </Section>

      <Section id="navigation" titre="Barre supérieure et rail" contrat="La barre du haut est celle de cette page. Rail : ateliers du Studio, témoin orange, pastille d'état.">
        <div class="rail-demo"><Rail bind:active={atelier} elements={[
          { id: 'geo', label: 'Géographie', icone: Building }, { id: 'bim', label: 'Maquettes et scènes', icone: Layers },
          { id: 'res', label: 'Réseaux et GTB', icone: Network, pastille: 'erreur' }, { id: 'cp', label: 'Points de contrôle', icone: Gauge },
          { id: 'tic', label: 'Tickets', icone: Ticket }, { id: 'ana', label: 'Analyses', icone: ChartLine, pastille: 'cours' },
        ]} /><div class="sc-caption" style="padding:12px">Atelier actif : <b>{atelier}</b></div></div>
      </Section>

      <Section id="structure" titre="Panneaux, onglets, fil d'Ariane" contrat="SplitPane : poignée de 6 px, ← → au clavier, taille mémorisée.">
        <Breadcrumb segments={[{ label: 'admin', href: '#' }, { label: 'Projets', href: '#' }, { label: 'Clients 2026', href: '#' }, { label: 'Tour Horizon', href: '#' }, { label: 'Maquettes', href: '#' }, { label: 'Revit' }]} />
        <div class="split-demo">
          <SplitPane cle="ds">
            {#snippet premier()}<Panel titre="Navigateur" sousTitre="Espaces"><div class="sc-caption" style="padding:0 16px 16px">Tirez la poignée, ou focus + ← →.</div></Panel>{/snippet}
            {#snippet second()}
              <Panel titre="TOUR_HORIZON_ARC.rvt" sousTitre="Maquette Revit · 412 Mo">
                {#snippet actions()}<Button size="sm" onclick={() => (tiroir = true)}>Ouvrir un tiroir</Button>{/snippet}
                <Tabs bind:value={onglet} label="Détails" onglets={[{ id: 'infos', label: 'Infos' }, { id: 'versions', label: 'Versions', compteur: 4 }, { id: 'partage', label: 'Partage', compteur: 2 }, { id: 'journal', label: 'Journal' }]}>
                  {#snippet contenu(id)}<div style="padding:16px" class="sc-text-2">Contenu de l'onglet « {id} ».</div>{/snippet}
                </Tabs>
              </Panel>
            {/snippet}
          </SplitPane>
        </div>
      </Section>

      <Section id="assistant" titre="Étapes d'un assistant" contrat="Retour possible aux étapes faites ; l'étape courante est mise en avant.">
        <div class="boite" style="max-width:320px"><Etapes bind:courante={etape} etapes={[{ titre: 'Nom et emplacement', resume: 'Tour Horizon · Projets' }, { titre: 'Maquettes', resume: '3 sur 5 retenues' }, { titre: 'Préparation', resume: 'conversion et scène' }]} /></div>
        <div class="rang"><Button size="sm" onclick={() => (etape = Math.max(0, etape - 1))}>Précédente</Button><Button size="sm" onclick={() => (etape = Math.min(2, etape + 1))}>Suivante</Button></div>
      </Section>

      <Section id="actions" titre="Barre d'actions et sélection" contrat="3 actions visibles, le reste dans « Plus » : Créer, Modifier, Relier, Voir, Exporter, puis Retirer et Supprimer.">
        <div class="rang"><Toolbar actions={actionsFichier} /></div>
        <div class="rang"><SelectionBar nombre={2} actions={actionsSelection} ondeselect={() => notifier('Sélection vidée', 'info')} /></div>
      </Section>

      <Section id="arbre" titre="Arbre" contrat="Virtualisé, chargement à la demande (R+2, R+3), clavier APG (↑ ↓ ← → Entrée, Ctrl A), Ctrl/Maj + clic, recherche surlignée.">
        <div class="arbre-demo boite">
          <TextInput type="search" icon={Search} bind:value={filtreArbre} placeholder="Rechercher dans l'arbre (ex. « bureau »)" clearable />
          <div class="arbre-zone">
            <Tree racines={racines} bind:selection={selArbre} multiple charger={chargerArbre} filtre={filtreArbre} label="Espaces" {ouverts}>
              {#snippet renderRow(l, terme)}
                <TypeIcone type={typeArbre(l.noeud.id)} size={15} />
                <span class="nom"><Surligne texte={l.noeud.label} {terme} /></span>
                {#if l.noeud.enfants?.length}<span class="sc-value sc-muted">{l.noeud.enfants.length}</span>{/if}
              {/snippet}
            </Tree>
          </div>
          <div class="sc-caption">Sélection : {selArbre.join(', ') || '—'}</div>
        </div>
      </Section>

      <Section id="tableau" titre="Tableau" contrat="2 000 lignes virtualisées, tri (vides en fin), colonnes redimensionnables, sélection Ctrl/Maj, actions au survol, état vide.">
        <div class="table-demo">
          <DataTable lignes={fichiers} bind:colonnes cle={(f) => f.id} bind:selection={selTable} selectionnable bind:tri actions={actionLigne} label="Fichiers" />
        </div>
        <div class="sc-caption">{selTable.length} sélectionné(s) sur {fichiers.length}</div>
        <div class="table-vide boite"><DataTable lignes={[]} colonnes={colonnes.slice(0, 2)} cle={(f: Fichier) => f.id} label="Dossier vide">
          {#snippet vide()}<EmptyState icone={FolderOpen} titre="Ce dossier est vide" texte="Déposez des fichiers ou créez un dossier." compact>
            {#snippet actions()}<Button size="sm" variant="primary" icon={Upload}>Déposer</Button><Button size="sm" icon={FolderPlus}>Nouveau dossier</Button>{/snippet}</EmptyState>{/snippet}
        </DataTable></div>
      </Section>

      <Section id="proprietes" titre="Propriétés, cartes, chronologie" contrat="Valeur absente « — » ; 0 et Faux affichés tels quels ; copie au survol.">
        <div class="grille">
          <div class="boite np"><PropertyList groupes={[
            { titre: 'Spatial', proprietes: [{ label: 'Surface', valeur: 24.5, unite: 'm²' }, { label: 'Occupants max', valeur: 0 }, { label: 'Climatisé', valeur: false }, { label: 'Usage', valeur: 'Bureau' }, { label: 'Code local', valeur: null }] },
            { titre: 'GTB', replie: true, proprietes: [{ label: 'Automate', valeur: 'AS-B 12' }, { label: 'Adresse', valeur: '10.0.4.12', mono: true }] },
          ]} /></div>
          <div class="col">
            <div class="cartes"><Card mesure={{ nom: 'Température', valeur: 21.4, unite: '°C', date: t0 - 120_000 }} /><Card mesure={{ nom: 'CO₂', valeur: 1240, unite: 'ppm', date: t0 - 60_000, ton: 'warn' }} /><Card mesure={{ nom: 'Présence', valeur: false, date: t0 - 30_000 }} /><Card mesure={{ nom: 'Débit', valeur: null, unite: 'm³/h' }} /></div>
            <Card interactive onclick={() => notifier('Carte ouverte', 'info')}><div class="sc-label">Carte cliquable</div><div class="sc-caption">Survol : bord et ombre.</div></Card>
          </div>
          <div class="boite"><Timeline entrees={[
            { auteur: 'm.durand', action: 'a déposé la version 4', date: t0 - 2 * 3600_000 },
            { auteur: 'admin', action: 'a partagé avec Julie Lopez', date: t0 - 26 * 3600_000 },
            { auteur: 'Julie Lopez', action: 'a commenté', date: t0 - 3 * 86400_000, contenu: 'Les gaines du R+2 ont bougé, vérifier la CVC.' },
          ]} /></div>
        </div>
      </Section>

      <Section id="diff" titre="Différences" contrat="Ajouts, suppressions, modifications, inchangés ; cases à cocher et action par ligne (révision de maquette, profils).">
        <div class="boite" style="max-width:720px"><DiffList cochable choisis={['d1', 'd3']} diffs={[
          { id: 'd1', genre: 'ajout', nom: 'Salle 214' }, { id: 'd2', genre: 'ajout', nom: 'Local technique R+2' },
          { id: 'd3', genre: 'suppression', nom: 'Bureau 207' },
          { id: 'd4', genre: 'modification', nom: 'Bureau 201 · surface', avant: '18,2 m²', apres: '19,6 m²' },
          { id: 'd5', genre: 'inchange', nom: '408 pièces' },
        ]}>{#snippet action()}<Button size="sm" variant="ghost" icon={Eye}>Voir en 3D</Button>{/snippet}</DiffList></div>
      </Section>

      <Section id="superpositions" titre="Menus, menu contextuel, bulles" contrat="Éléments désactivés avec leur raison ; rouge séparé par un filet ; raccourcis affichés.">
        <div class="rang">
          <Menu elements={menuElements}>{#snippet trigger(props)}<Button {...props}>Ouvrir le menu</Button>{/snippet}</Menu>
          <ContextMenu elements={menuElements}><div class="zone-ctx">Clic droit ici</div></ContextMenu>
          <Tooltip texte="Infobulle marine, 400 ms, aussi au clavier">{#snippet trigger(props)}<Button {...props}>Survolez-moi</Button>{/snippet}</Tooltip>
          <Popover bind:open={popover}>
            {#snippet trigger(props)}<Button {...props}>Bulle d'aide</Button>{/snippet}
            <div class="col"><span class="sc-label">Comment marche la conversion ?</span><p class="sc-caption">L'organ forge reçoit la maquette, l'envoie à Autodesk puis récupère le résultat dans le jumeau.</p><Button size="sm" onclick={() => (popover = false)}>Compris</Button></div>
          </Popover>
        </div>
      </Section>

      <Section id="dialogues" titre="Dialogues et confirmation de portée" contrat="Jamais « OK » : le bouton reprend le verbe et le nombre. Suppression en rouge, retrait neutre.">
        <div class="rang">
          <Button onclick={() => (dialogue = true)}>Dialogue simple</Button>
          <Button variant="danger-ghost" icon={Trash2} onclick={() => (confirmer = true)}>Supprimer (portée)</Button>
          <Button icon={Unlink} onclick={() => (confirmerRetrait = true)}>Retirer (portée)</Button>
          <Button onclick={() => (palette = true)}>Palette <Kbd keys="Ctrl K" /></Button>
          <Button onclick={() => (aide = true)}>Raccourcis <Kbd keys="?" /></Button>
        </div>
        <Dialog bind:open={dialogue} titre="Revenir à la version 3 ?" description="La version 3 devient la version courante. La version 4 reste dans l'historique." icone={RefreshCw} ton="accent">
          <p class="sc-text-2">Le Jumeau Tour Horizon chargera la v3 à sa prochaine ouverture.</p>
          {#snippet pied()}<Button variant="ghost" onclick={() => (dialogue = false)}>Annuler</Button><Button variant="primary" onclick={() => { dialogue = false; notifier('Version 3 rétablie', 'succes', { label: 'Annuler', executer: () => {} }); }}>Revenir à la v3</Button>{/snippet}
        </Dialog>
        <ConfirmerPortee bind:open={confirmer} genre="suppression" verbe="Supprimer" nom="fichier" nomPluriel="fichiers" irreversible
          elements={['TOUR_HORIZON_ARC.rvt (v1 à v4)', 'TOUR_HORIZON_STR.rvt (v1, v2)', 'Plans_R+1.pdf']}
          inchange="Les jumeaux qui utilisent ces maquettes gardent leur dernière conversion ; ils signaleront la maquette manquante."
          exclus={[{ nom: 'GED synchronisée', raison: 'dossier synchronisé, non supprimable ici' }]}
          onconfirm={() => notifier('3 fichiers supprimés')} />
        <ConfirmerPortee bind:open={confirmerRetrait} genre="retrait" verbe="Retirer du groupe" nom="pièce" nomPluriel="pièces"
          elements={['Bureau 101', 'Bureau 104', 'Bureau 107']} inchange="Les pièces restent dans la géographie et dans leurs autres groupes."
          perimetres={[{ value: 'noeud', label: 'Ces 3 pièces' }, { value: 'type', label: 'Toutes les pièces de ce groupe', description: '14 pièces' }]} bind:perimetre
          onconfirm={() => notifier('3 pièces retirées du groupe « Bureaux »', 'succes', { label: 'Annuler', executer: () => notifier('Retrait annulé', 'info') })} />
        <Drawer bind:open={tiroir} titre="Ticket #2214"><p class="sc-text-2">Tiroir latéral : fiche de ticket, petits écrans.</p></Drawer>
        <CommandPalette bind:open={palette} {commandes} recents={['c5', 'c1']} />
        <ShortcutHelp bind:open={aide} groupes={raccourcis} />
      </Section>

      <Section id="taches" titre="Plateau des tâches" contrat="En cours puis terminées ; étapes réelles rapportées par l'organ ; résultats par élément ; relancer les échecs.">
        <div class="rang" style="align-items:flex-start">
          <TaskTray {taches} oneffacer={() => (taches = taches.filter((t) => ['cours', 'attente', 'envoyee'].includes(t.etat)))} />
          <TaskTray taches={[]} />
        </div>
      </Section>

      <Section id="retours" titre="Retours, chargements, états vides et erreurs" contrat="Toasts en bas à gauche (3 max, Annuler 8 s, erreurs persistantes). Pas de spinner plein écran : des squelettes.">
        <div class="rang">
          <Button onclick={() => notifier('« Plans R+1 » déplacé vers Documents', 'succes', { label: 'Annuler', executer: () => notifier('Déplacement annulé', 'info') })}>Toast avec Annuler</Button>
          <Button onclick={() => notifier('Nouvelle version disponible', 'info')}>Toast info</Button>
          <Button onclick={() => notifier('Connexion au hub perdue : écritures bloquées', 'erreur')}>Toast erreur</Button>
        </div>
        <Banner ton="danger" message="Connexion au hub perdue. Les écritures sont bloquées ; reconnexion automatique…">{#snippet actions()}<Button size="sm">Réessayer maintenant</Button>{/snippet}</Banner>
        <Banner ton="info" message="Mode expert : identifiants, types et relations brutes affichés." />
        <div class="grille">
          <div class="boite col"><span class="sc-label">Progression</span><Progress value={62} label="Conversion" tone="info" /><Progress value={100} label="Terminé" tone="ok" /><Progress label="Indéterminée" /><div class="rang"><Spinner /> <span class="sc-caption">Spinner : boutons seulement</span></div></div>
          <div class="boite"><Skeleton lignes={4} /></div>
          <div class="boite"><Skeleton forme="carte" /></div>
        </div>
        <div class="grille">
          <div class="boite"><EmptyState icone={Search} titre="Aucun résultat pour « gaine »" texte="Vérifiez l'orthographe ou cherchez dans tout le Drive.">{#snippet actions()}<Button size="sm">Effacer la recherche</Button>{/snippet}</EmptyState></div>
          <ErrorState titre="Impossible d'ouvrir ce dossier" message="Le hub a refusé la lecture : votre compte n'a pas accès à « Archives 2024 »." detail={'load_ptr 94827187918656 → 403\nuser 1904 (m.durand)\nat Directory.load (connectorjs)'} onretry={() => notifier('Nouvel essai…', 'info')} />
          <ErrorState indisponible titre="Réseaux indisponibles" message="L'organ BACnet ne répond pas. Les autres modules restent utilisables." onretry={() => {}} />
        </div>
      </Section>

      <Section id="spinal" titre="Composants Spinal" contrat="Ils connaissent le domaine : icônes de types (repli générique), puces de nœuds, carte d'organ (demande envoyée ≠ état rapporté).">
        <div class="types">{#each Object.entries(TYPES) as [k, t]}<div class="type"><TypeIcone type={k} tuile /><div><div>{t.label}</div><code class="sc-caption">{k}</code></div></div>{/each}
          <div class="type"><TypeIcone type="monTypeInconnu" tuile /><div><div>Type inconnu</div><code class="sc-caption">monTypeInconnu</code></div></div></div>
        <div class="rang"><NoeudChip type="geographicRoom" nom="Bureau 101" chemin="Tour Horizon › R+1" onclick={() => {}} /><NoeudChip type="BIMObject" nom="CTA-03" couleur="#4a79c6" /><NoeudChip type="BmsDevice" nom="AS-B 12" onclick={() => {}} /></div>
        <div class="grille">
          <CarteOrgan nom="Organ forge" version="2.4.1" enLigne dernierSignal={t0 - 3000} maintenant={t0}
            demande={{ libelle: 'Convertir TOUR_HORIZON_CVC.ifc', date: t0 - 252_000 }} rapporte={{ etat: 'cours', libelle: 'Conversion · étape 4/6', date: t0 - 3000 }}
            commandes={[{ label: 'Arrêter', executer: () => {} }]} />
          <CarteOrgan nom="Organ BACnet" version="1.9.0" enLigne={false} dernierSignal={t0 - 3600_000 * 5} maintenant={t0}
            demande={{ libelle: 'Découvrir le réseau 10.0.4.0/24', date: t0 - 180_000 }}
            commandes={[{ label: 'Relancer la découverte', executer: () => {}, desactive: true, raison: 'L’organ ne répond pas' }]} />
        </div>
      </Section>
    </main>
  </div>
  <Toasts />
</div>

<style>
  .ds { min-height: 100vh; display: flex; flex-direction: column; }
  .page { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 32px; max-width: 1360px; width: 100%; margin: 0 auto; padding: 0 32px 120px; }
  .toc { position: sticky; top: 0; align-self: start; max-height: 100vh; overflow: auto; display: flex; flex-direction: column; gap: 6px; padding: 24px 0; }
  .toc a { color: var(--sc-text-2); text-decoration: none; padding: 4px 8px; border-radius: 6px; font-size: 13px; }
  .toc a:hover { background: var(--sc-ground-2); color: var(--sc-text); }
  .intro { padding: 32px 0 24px; display: flex; flex-direction: column; gap: 8px; max-width: 72ch; }
  .intro p { font-size: 14px; line-height: 22px; }
  code { font: 400 12px var(--sc-mono); }
  .jetons { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
  .jeton { display: flex; align-items: center; gap: 10px; padding: 6px; border-radius: 8px; background: var(--sc-sheet); border: 1px solid var(--sc-line); }
  .pot { width: 32px; height: 32px; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(127,127,127,.25); flex: none; }
  .typo { display: flex; flex-direction: column; gap: 10px; }
  .col { display: flex; flex-direction: column; gap: 12px; }
  .np { padding: 4px 0 8px; }
  .rail-demo { display: flex; height: 300px; border-radius: var(--sc-r-card); overflow: hidden; border: 1px solid var(--sc-line); background: var(--sc-sheet); width: 420px; }
  .split-demo { height: 300px; border-radius: var(--sc-r-card); overflow: hidden; border: 1px solid var(--sc-line); background: var(--sc-ground); }
  .split-demo :global(.sc-panel) { border-radius: 0; border: 0; }
  .arbre-demo { display: flex; flex-direction: column; gap: 10px; max-width: 460px; }
  .arbre-zone { height: 340px; border: 1px solid var(--sc-line); border-radius: 10px; padding: 4px 0; }
  .nom { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .table-demo { height: 420px; border: 1px solid var(--sc-line); border-radius: var(--sc-r-card); overflow: hidden; }
  .table-vide { height: 260px; padding: 0; overflow: hidden; }
  .cartes { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .zone-ctx { padding: 18px 24px; border: 1px dashed var(--sc-line-2); border-radius: 10px; color: var(--sc-muted); }
  .types { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
  .type { display: flex; align-items: center; gap: 10px; padding: 6px; }
</style>
