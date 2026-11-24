<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Avatar from './Avatar.svelte';
  import { dateLisible, dateExacte } from './format';
  let { entrees }: { entrees: { auteur: string; action: string; date: number; contenu?: string }[] } = $props();
</script>

<ol class="sc-timeline">
  {#each entrees as e}
    <li>
      <Avatar nom={e.auteur} taille={24} />
      <div class="c">
        <div><b>{e.auteur}</b> <span class="sc-text-2">{e.action}</span> · <span class="sc-caption" title={dateExacte(e.date)}>{dateLisible(e.date)}</span></div>
        {#if e.contenu}<p>{e.contenu}</p>{/if}
      </div>
    </li>
  {/each}
</ol>

<style>
  .sc-timeline { list-style: none; margin: 0; padding: 0; position: relative; }
  .sc-timeline::before { content: ''; position: absolute; left: 11px; top: 12px; bottom: 12px; width: 1px; background: var(--sc-line); }
  li { display: grid; grid-template-columns: 24px 1fr; gap: 10px; padding: 6px 0; position: relative; }
  b { font-weight: 600; }
  p { margin-top: 6px; padding: 8px 10px; border-radius: 8px; background: var(--sc-ground); color: var(--sc-text-2); }
</style>
