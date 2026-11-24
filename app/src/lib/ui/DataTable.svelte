<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import VirtualList from './VirtualList.svelte';
  import Checkbox from './Checkbox.svelte';
  import ArrowUp from '@lucide/svelte/icons/arrow-up';
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import { trier } from './tableau';
  import type { Colonne } from './types';

  /** Tableau virtualisé : tri, redimensionnement, masquage, en-tête collant, sélection de lignes, état vide. Pas de pagination. */
  let {
    lignes, colonnes = $bindable(), cle, selection = $bindable<string[]>([]), selectionnable = false, actions, vide, label,
    tri = $bindable<{ id: string; sens: 'asc' | 'desc' } | null>(null), onactivate,
  }: {
    lignes: T[]; colonnes: Colonne<T>[]; cle: (t: T) => string; selection?: string[]; selectionnable?: boolean;
    actions?: Snippet<[T]>; vide?: Snippet; label: string; tri?: { id: string; sens: 'asc' | 'desc' } | null; onactivate?: (t: T) => void;
  } = $props();

  const visibles = $derived(colonnes.filter((c) => !c.masquee));
  const triees = $derived.by(() => {
    const c = tri && colonnes.find((x) => x.id === tri!.id);
    return c?.valeur ? trier(lignes, c.valeur, tri!.sens) : lignes;
  });
  const gabarit = $derived([selectionnable ? '40px' : '', ...visibles.map((c) => (c.largeur ? c.largeur + 'px' : `minmax(${c.min ?? 160}px, 1fr)`)), actions ? '44px' : ''].filter(Boolean).join(' '));
  const tout = $derived(lignes.length > 0 && selection.length === lignes.length);
  const partiel = $derived(selection.length > 0 && !tout);

  function trierPar(c: Colonne<T>) {
    if (c.triable === false || !c.valeur) return;
    tri = tri?.id !== c.id ? { id: c.id, sens: 'asc' } : tri.sens === 'asc' ? { id: c.id, sens: 'desc' } : null;
  }
  function redim(e: PointerEvent, c: Colonne<T>) {
    e.preventDefault(); e.stopPropagation();
    const th = (e.currentTarget as HTMLElement).parentElement!; const x0 = e.clientX; const l0 = th.getBoundingClientRect().width;
    const el = e.currentTarget as HTMLElement; el.setPointerCapture(e.pointerId);
    const bouger = (m: PointerEvent) => { c.largeur = Math.max(c.min ?? 60, Math.round(l0 + m.clientX - x0)); colonnes = [...colonnes]; };
    const fin = () => { el.removeEventListener('pointermove', bouger); el.removeEventListener('pointerup', fin); };
    el.addEventListener('pointermove', bouger); el.addEventListener('pointerup', fin);
  }
  function cliquer(t: T, e: MouseEvent) {
    if (!selectionnable) return;
    const id = cle(t);
    if (e.ctrlKey || e.metaKey) selection = selection.includes(id) ? selection.filter((x) => x !== id) : [...selection, id];
    else if (e.shiftKey && selection.length) {
      const ids = triees.map(cle); const a = ids.indexOf(selection[selection.length - 1]); const b = ids.indexOf(id);
      selection = Array.from(new Set([...selection, ...ids.slice(Math.min(a, b), Math.max(a, b) + 1)]));
    } else selection = [id];
  }
</script>

<div class="sc-table" role="grid" aria-label={label} aria-rowcount={lignes.length + 1} aria-multiselectable={selectionnable || undefined}>
  <div class="tr th" role="row" style:grid-template-columns={gabarit}>
    {#if selectionnable}
      <div class="cell" role="columnheader"><Checkbox label="Tout sélectionner" masquerLabel checked={tout} indeterminate={partiel}
        onchange={() => (selection = tout ? [] : lignes.map(cle))} /></div>
    {/if}
    {#each visibles as c (c.id)}
      <div class="cell" class:droite={c.align === 'droite'} role="columnheader" aria-sort={tri?.id === c.id ? (tri.sens === 'asc' ? 'ascending' : 'descending') : undefined}>
        {#if c.valeur && c.triable !== false}
          <button class="tri" class:actif={tri?.id === c.id} onclick={() => trierPar(c)}>{c.label}
            {#if tri?.id === c.id}{#if tri.sens === 'asc'}<ArrowUp size={12} />{:else}<ArrowDown size={12} />{/if}{/if}</button>
        {:else}<span>{c.label}</span>{/if}
        <span class="redim" role="presentation" onpointerdown={(e) => redim(e, c)}></span>
      </div>
    {/each}
    {#if actions}<div class="cell" role="columnheader"><span class="sc-visually-hidden">Actions</span></div>{/if}
  </div>
  {#if !lignes.length}
    <div class="vide" role="row"><div role="gridcell" class="vide-cell">{@render vide?.()}</div></div>
  {:else}
    <div class="corps">
      <VirtualList items={triees} hauteurLigne={36} cle={(t) => cle(t)} role="rowgroup">
        {#snippet ligne(t, i)}
          {@const id = cle(t)}
          <!-- Focus géré au niveau de la grille (une ligne active), pas par ligne : évite des milliers d'arrêts de tabulation. -->
          <!-- svelte-ignore a11y_interactive_supports_focus -->
          <div class="tr" class:sel={selection.includes(id)} role="row" aria-rowindex={i + 2} aria-selected={selectionnable ? selection.includes(id) : undefined}
            style:grid-template-columns={gabarit} onclick={(e) => cliquer(t, e)} ondblclick={() => onactivate?.(t)} onkeydown={(e) => { if (e.key === 'Enter') onactivate?.(t); }}>
            {#if selectionnable}
              <!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
              <div class="cell" role="gridcell" onclick={(e) => e.stopPropagation()}>
                <Checkbox label="Sélectionner la ligne" masquerLabel checked={selection.includes(id)}
                  onchange={() => (selection = selection.includes(id) ? selection.filter((x) => x !== id) : [...selection, id])} /></div>
            {/if}
            {#each visibles as c (c.id)}
              <div class="cell" class:droite={c.align === 'droite'} class:mono={c.mono} role="gridcell">
                {#if c.cellule}{@render c.cellule(t)}{:else if c.texte}{c.texte(t)}{:else}{@const v = c.valeur?.(t)}{v === null || v === undefined || v === '' ? '—' : v instanceof Date ? v.toLocaleDateString('fr-FR') : String(v)}{/if}
              </div>
            {/each}
            {#if actions}<div class="cell act" role="gridcell">{@render actions(t)}</div>{/if}
          </div>
        {/snippet}
      </VirtualList>
    </div>
  {/if}
</div>

<style>
  .sc-table { display: flex; flex-direction: column; min-height: 0; height: 100%; background: var(--sc-sheet); }
  .corps { flex: 1; min-height: 0; }
  .tr { display: grid; align-items: center; height: var(--sc-row); border-bottom: 1px solid var(--sc-line); }
  .tr:not(.th):hover { background: var(--sc-sheet-hover); }
  .th { height: 34px; position: sticky; top: 0; z-index: 1; background: var(--sc-sheet); font: 500 12px/1 var(--sc-sans); color: var(--sc-muted); }
  .sel, .sel:not(.th):hover { background: var(--sc-accent-soft); }
  .cell { min-width: 0; padding: 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; position: relative; display: flex; align-items: center; gap: 8px; height: 100%; }
  .droite { justify-content: flex-end; text-align: right; }
  .mono { font: 400 12.5px/18px var(--sc-mono); font-variant-numeric: tabular-nums; }
  .tri { border: 0; background: none; padding: 0; color: inherit; font: inherit; display: inline-flex; align-items: center; gap: 4px; }
  .tri:hover, .tri.actif { color: var(--sc-text); }
  .redim { position: absolute; right: 0; top: 6px; bottom: 6px; width: 6px; cursor: col-resize; border-right: 1px solid transparent; }
  .th .cell:hover .redim { border-right-color: var(--sc-line-2); }
  .act { justify-content: center; padding: 0; opacity: 0; }
  .tr:hover .act, .act:focus-within, .sel .act { opacity: 1; }
  .vide { flex: 1; display: grid; place-items: center; }
  .vide-cell { display: contents; }
</style>
