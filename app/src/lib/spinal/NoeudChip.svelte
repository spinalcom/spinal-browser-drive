<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import TypeIcone from './TypeIcone.svelte';
  let { type, nom, chemin, couleur, onclick }: { type: string; nom: string; chemin?: string; couleur?: string; onclick?: () => void } = $props();
</script>

<button class="chip" title={chemin ? `${chemin} › ${nom}` : nom} {onclick} disabled={!onclick}>
  <TypeIcone {type} size={14} />
  {#if couleur}<span class="dot" style:background={couleur}></span>{/if}
  <span class="n">{nom}</span>
</button>

<style>
  .chip { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; height: 26px; padding: 0 10px 0 8px; border-radius: var(--sc-r-pill);
    border: 1px solid var(--sc-line-2); background: var(--sc-sheet); color: var(--sc-text); font: 500 12.5px/1 var(--sc-sans); }
  .chip:hover:not(:disabled) { border-color: var(--sc-line-3); background: var(--sc-sheet-hover); }
  .chip:disabled { cursor: default; }
  .dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
  .n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
