<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Action } from './types';
  import Icon from './Icon.svelte';
  import IconButton from './IconButton.svelte';
  import X from '@lucide/svelte/icons/x';
  /** Remplace la barre d'actions quand une sélection multiple existe. Annonce sa cible réelle (DR-04). */
  let { nombre, nom = 'élément', nomPluriel = 'éléments', actions, ondeselect }:
    { nombre: number; nom?: string; nomPluriel?: string; actions: Action[]; ondeselect: () => void } = $props();
</script>

<div class="sc-selbar" role="toolbar" aria-label="Actions sur la sélection">
  <b aria-live="polite">{nombre} {nombre > 1 ? nomPluriel : nom}</b>
  {#each actions as a, i (a.id)}
    {#if a.groupe === 'supprimer' && i > 0}<span class="sep"></span>{/if}
    <button class:danger={a.groupe === 'supprimer'} disabled={a.desactive} title={a.desactive ? a.raison : undefined} onclick={a.executer}>
      {#if a.icone}<Icon icon={a.icone} />{/if}{a.label}
    </button>
  {/each}
  <span class="sep"></span>
  <IconButton icon={X} label="Tout désélectionner (Échap)" size="sm" variant="on-ink" onclick={ondeselect} />
</div>

<style>
  .sc-selbar { display: inline-flex; align-items: center; gap: 2px; width: max-content; max-width: calc(100vw - 32px); padding: 6px 6px 6px 14px; border-radius: 14px;
    background: var(--sc-ink); color: var(--sc-on-ink); box-shadow: var(--sc-shadow-3); animation: sc-in var(--sc-in) var(--sc-ease); }
  b { font-weight: 600; margin-right: 10px; white-space: nowrap; font-variant-numeric: tabular-nums; }
  button { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border: 0; border-radius: 8px; background: none; color: var(--sc-on-ink); font: 500 13px/1 var(--sc-sans); white-space: nowrap; }
  button:hover { background: var(--sc-ink-2); }
  button:disabled { opacity: .45; cursor: not-allowed; }
  button.danger { color: var(--sc-toast-err); }
  .sep { width: 1px; height: 20px; background: var(--sc-ink-3); margin: 0 6px; }
</style>
