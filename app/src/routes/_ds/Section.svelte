<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { id, titre, contrat, children }: { id: string; titre: string; contrat?: string; children: Snippet } = $props();
</script>

<section {id} class="sec">
  <header><h2 class="sc-title">{titre}</h2>{#if contrat}<p class="sc-caption">{contrat}</p>{/if}</header>
  <div class="demo">{@render children()}</div>
</section>

<style>
  .sec { scroll-margin-top: 64px; padding: 28px 0; border-top: 1px solid var(--sc-line); }
  header { margin-bottom: 14px; display: flex; flex-direction: column; gap: 4px; }
  header p { font-size: 13px; max-width: 80ch; }
  .demo { display: flex; flex-direction: column; gap: 16px; }
  .demo :global(.rang) { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
  .demo :global(.etiq) { font: 500 11px/14px var(--sc-sans); letter-spacing: .06em; text-transform: uppercase; color: var(--sc-muted); width: 110px; flex: none; }
  .demo :global(.boite) { background: var(--sc-sheet); border: 1px solid var(--sc-line); border-radius: var(--sc-r-card); padding: 16px; }
  .demo :global(.grille) { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; align-items: start; }
</style>
