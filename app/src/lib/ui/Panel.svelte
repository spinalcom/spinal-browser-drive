<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { titre, sousTitre, actions, pied, children, plat = false }:
    { titre?: string; sousTitre?: string; actions?: Snippet; pied?: Snippet; children: Snippet; plat?: boolean } = $props();
</script>

<section class="sc-panel" class:plat>
  {#if titre || actions}
    <header><div class="tt">{#if titre}<h2 class="sc-title">{titre}</h2>{/if}{#if sousTitre}<p class="sc-caption">{sousTitre}</p>{/if}</div>{@render actions?.()}</header>
  {/if}
  <div class="corps">{@render children()}</div>
  {#if pied}<footer>{@render pied()}</footer>{/if}
</section>

<style>
  .sc-panel { display: flex; flex-direction: column; min-height: 0; height: 100%; background: var(--sc-sheet); border-radius: var(--sc-r-card); box-shadow: var(--sc-shadow-1); border: 1px solid var(--sc-line); overflow: hidden; }
  .plat { border-radius: 0; box-shadow: none; border: 0; }
  header { display: flex; align-items: center; gap: 8px; padding: 14px 16px 10px; }
  .tt { flex: 1; min-width: 0; }
  .corps { flex: 1; min-height: 0; overflow: auto; }
  footer { padding: 10px 16px; border-top: 1px solid var(--sc-line); display: flex; gap: 8px; justify-content: flex-end; }
</style>
