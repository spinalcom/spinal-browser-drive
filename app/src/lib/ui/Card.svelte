<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { dateLisible, dateExacte } from './format';
  /** Carte de contenu. Variante mesure : nom, lecture en grand, unité, horodatage. */
  let { children, mesure, interactive = false, onclick }:
    { children?: Snippet; mesure?: { nom: string; valeur: number | string | boolean | null; unite?: string; date?: number; ton?: 'ok' | 'warn' | 'danger' }; interactive?: boolean; onclick?: () => void } = $props();
  const lecture = $derived(mesure ? (mesure.valeur === null ? '—' : typeof mesure.valeur === 'boolean' ? (mesure.valeur ? 'Vrai' : 'Faux') : typeof mesure.valeur === 'number' ? mesure.valeur.toLocaleString('fr-FR') : mesure.valeur) : '');
</script>

{#if interactive}
  <button class="sc-card interactive" {onclick}>{@render children?.()}</button>
{:else if mesure}
  <div class="sc-card m">
    <div class="sc-caption">{mesure.nom}</div>
    <div class="sc-readout {mesure.ton ?? ''}">{lecture}{#if mesure.unite && mesure.valeur !== null}<small>&nbsp;{mesure.unite}</small>{/if}</div>
    {#if mesure.date}<div class="sc-caption" title={dateExacte(mesure.date)}>{dateLisible(mesure.date)}</div>{/if}
  </div>
{:else}
  <div class="sc-card">{@render children?.()}</div>
{/if}

<style>
  .sc-card { display: block; background: var(--sc-sheet); border-radius: var(--sc-r-card); box-shadow: var(--sc-shadow-1); border: 1px solid var(--sc-line); padding: 16px; text-align: left; color: inherit; font: inherit; }
  .interactive { cursor: pointer; transition: border-color var(--sc-in) var(--sc-ease), box-shadow var(--sc-in) var(--sc-ease); width: 100%; }
  .interactive:hover { border-color: var(--sc-line-3); box-shadow: var(--sc-shadow-2); }
  .m { display: flex; flex-direction: column; gap: 4px; }
  small { font: 400 13px var(--sc-sans); color: var(--sc-muted); }
  .ok { color: var(--sc-ok); } .warn { color: var(--sc-warn); } .danger { color: var(--sc-danger); }
</style>
