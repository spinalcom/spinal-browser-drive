<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import VirtualList from './VirtualList.svelte';
  import Spinner from './Spinner.svelte';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import { aplatir, touche, type NoeudArbre, type LigneArbre } from './arbre';

  /**
   * Arbre virtualisé, chargement à la demande, navigation clavier APG, recherche avec surlignage.
   * renderRow reçoit la ligne et le terme recherché ; l'arbre gère indentation, chevron, sélection, focus.
   */
  let {
    racines, selection = $bindable<string[]>([]), multiple = false, charger, renderRow, filtre = '', label, hauteurLigne = 32, onactivate,
    ouverts = new SvelteSet<string>(),
  }: {
    racines: NoeudArbre[]; selection?: string[]; multiple?: boolean; charger?: (n: NoeudArbre) => Promise<void>;
    renderRow: Snippet<[LigneArbre, string]>; filtre?: string; label: string; hauteurLigne?: number; onactivate?: (n: NoeudArbre) => void;
    ouverts?: SvelteSet<string>;
  } = $props();

  const enCharge = new SvelteSet<string>();
  let focus = $state(0);
  let vue = $state<HTMLElement>();
  let liste = $state<{ scrollToIndex: (i: number) => void }>();
  const terme = $derived(filtre.trim().toLowerCase());
  const lignes = $derived(aplatir(racines, ouverts, terme ? (n) => n.label.toLowerCase().includes(terme) : undefined));

  async function ouvrir(n: NoeudArbre) {
    if (!n.enfants && charger) { enCharge.add(n.id); try { await charger(n); } finally { enCharge.delete(n.id); } }
    ouverts.add(n.id);
  }
  function basculer(l: LigneArbre) { if (l.feuille) return; if (l.ouvert) ouverts.delete(l.noeud.id); else ouvrir(l.noeud); }
  function choisir(l: LigneArbre, e?: MouseEvent | KeyboardEvent) {
    const id = l.noeud.id;
    if (multiple && e && (e.ctrlKey || e.metaKey)) selection = selection.includes(id) ? selection.filter((x) => x !== id) : [...selection, id];
    else if (multiple && e?.shiftKey && selection.length) {
      const a = lignes.findIndex((x) => x.noeud.id === selection[selection.length - 1]); const b = lignes.indexOf(l);
      const [i, j] = a < b ? [a, b] : [b, a];
      selection = Array.from(new Set([...selection, ...lignes.slice(i, j + 1).map((x) => x.noeud.id)]));
    } else selection = [id];
    focus = lignes.indexOf(l);
  }
  function clavier(e: KeyboardEvent) {
    if (multiple && (e.ctrlKey || e.metaKey) && e.key === 'a') { e.preventDefault(); selection = lignes.map((l) => l.noeud.id); return; }
    const c = touche(lignes, focus, e.key);
    if (!c) return;
    e.preventDefault();
    if (c.type === 'focus') { focus = c.index; liste?.scrollToIndex(c.index); if (!multiple) selection = [lignes[c.index].noeud.id]; }
    else if (c.type === 'ouvrir') { const l = lignes[focus]; ouvrir(l.noeud); }
    else if (c.type === 'fermer') ouverts.delete(c.id);
    else if (c.type === 'activer') { const l = lignes[focus]; choisir(l, e); onactivate?.(l.noeud); }
  }
</script>

<div class="sc-tree" role="tree" aria-label={label} aria-multiselectable={multiple || undefined} tabindex="0" onkeydown={clavier}
  aria-activedescendant={lignes[focus] ? 'arbre-' + lignes[focus].noeud.id : undefined}>
  <VirtualList bind:this={liste} bind:vue items={lignes} {hauteurLigne} cle={(l) => l.noeud.id} role="presentation">
    {#snippet ligne(l, i)}
      <!-- Focus « roving » via aria-activedescendant sur la racine (motif APG) : les lignes ne sont pas des arrêts de tabulation. -->
      <!-- Le clavier est géré sur la racine role=tree. -->
      <!-- svelte-ignore a11y_interactive_supports_focus, a11y_click_events_have_key_events -->
      <div id="arbre-{l.noeud.id}" class="row" class:sel={selection.includes(l.noeud.id)} class:focus={i === focus}
        role="treeitem" aria-level={l.niveau} aria-setsize={l.taille} aria-posinset={l.position}
        aria-expanded={l.feuille ? undefined : l.ouvert} aria-selected={selection.includes(l.noeud.id)}
        style:height="{hauteurLigne}px" style:padding-left="{(l.niveau - 1) * 16 + 4}px"
        onclick={(e) => choisir(l, e)} ondblclick={() => onactivate?.(l.noeud)}>
        <button class="chev" class:vide={l.feuille} tabindex="-1" aria-hidden="true" onclick={(e) => { e.stopPropagation(); basculer(l); }}>
          {#if enCharge.has(l.noeud.id)}<Spinner size={12} />{:else if !l.feuille}<ChevronRight size={14} class={l.ouvert ? 'ouvert' : ''} />{/if}
        </button>
        {@render renderRow(l, terme)}
      </div>
    {/snippet}
  </VirtualList>
</div>

<style>
  .sc-tree { height: 100%; min-height: 0; outline: none; }
  .row { display: flex; align-items: center; gap: 4px; padding-right: 8px; border-radius: 6px; margin: 0 6px; cursor: default; user-select: none; }
  .row:hover { background: var(--sc-sheet-hover); }
  .sel { background: var(--sc-accent-soft); color: var(--sc-accent-ink); }
  .sel:hover { background: var(--sc-accent-soft); }
  .sc-tree:focus-visible .focus { box-shadow: inset 0 0 0 2px var(--sc-focus); }
  .chev { width: 18px; height: 18px; flex: none; display: grid; place-items: center; border: 0; background: none; color: var(--sc-muted); padding: 0; border-radius: 4px; }
  .chev:hover { background: var(--sc-ground-2); }
  .chev.vide { pointer-events: none; }
  .chev :global(svg) { transition: transform var(--sc-in) var(--sc-ease); }
  .chev :global(svg.ouvert) { transform: rotate(90deg); }
</style>
