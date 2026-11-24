<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Tabs } from 'bits-ui';
  import type { Snippet } from 'svelte';
  let { value = $bindable(''), onglets, label, contenu }:
    { value?: string; onglets: { id: string; label: string; compteur?: number }[]; label: string; contenu?: Snippet<[string]> } = $props();
</script>

<Tabs.Root bind:value class="sc-tabs">
  <Tabs.List class="liste" aria-label={label}>
    {#each onglets as o (o.id)}
      <Tabs.Trigger value={o.id} class="ong">{o.label}{#if o.compteur !== undefined}<span class="n">{o.compteur}</span>{/if}</Tabs.Trigger>
    {/each}
  </Tabs.List>
  {#if contenu}
    {#each onglets as o (o.id)}<Tabs.Content value={o.id} class="contenu">{@render contenu(o.id)}</Tabs.Content>{/each}
  {/if}
</Tabs.Root>

<style>
  :global(.sc-tabs .liste) { display: flex; gap: 2px; padding: 0 12px; border-bottom: 1px solid var(--sc-line); overflow-x: auto; scrollbar-width: none; }
  :global(.sc-tabs .ong) { position: relative; height: 40px; padding: 0 10px; border: 0; background: none; color: var(--sc-muted); font: 500 13px/1 var(--sc-sans);
    display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  :global(.sc-tabs .ong:hover) { color: var(--sc-text); }
  :global(.sc-tabs .ong[data-state='active']) { color: var(--sc-text); }
  :global(.sc-tabs .ong[data-state='active'])::after { content: ''; position: absolute; left: 8px; right: 8px; bottom: -1px; height: 2px; border-radius: 2px; background: var(--sc-accent); }
  .n { font: 500 11px/1 var(--sc-mono); padding: 3px 5px; border-radius: 4px; background: var(--sc-ground-2); color: var(--sc-text-2); }
  :global(.sc-tabs .contenu) { outline: none; }
</style>
