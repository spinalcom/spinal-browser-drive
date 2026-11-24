<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  let { forme = 'ligne', lignes = 3, largeur }: { forme?: 'ligne' | 'carte' | 'tableau'; lignes?: number; largeur?: string } = $props();
</script>

<div class="sc-skel {forme}" role="status" aria-busy="true" aria-label="Chargement">
  {#if forme === 'carte'}
    <span class="b" style="height:120px"></span><span class="b" style="width:60%"></span><span class="b" style="width:35%"></span>
  {:else}
    {#each Array(lignes) as _, i}
      <span class="b" style:width={largeur ?? (forme === 'tableau' ? '100%' : `${90 - ((i * 17) % 40)}%`)}></span>
    {/each}
  {/if}
</div>

<style>
  .sc-skel { display: flex; flex-direction: column; gap: 10px; }
  .tableau { gap: 1px; }
  .b { display: block; height: 12px; border-radius: 6px; background: var(--sc-ground-2); }
  .tableau .b { height: var(--sc-row); border-radius: 0; }
  .carte .b:first-child { border-radius: var(--sc-r-card); }
</style>
