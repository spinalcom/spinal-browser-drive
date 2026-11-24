<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { ToggleGroup } from 'bits-ui';
  import type { Option, Taille } from './types';
  import Icon from './Icon.svelte';
  /** 2 à 5 options courtes (vues, périodes). Une valeur est toujours sélectionnée. */
  let { value = $bindable(''), options, label, size = 'md', iconesSeules = false }:
    { value?: string; options: Option[]; label: string; size?: Taille; iconesSeules?: boolean } = $props();
</script>

<ToggleGroup.Root type="single" {value} onValueChange={(v) => { if (v) value = v; }} aria-label={label} class="sc-seg {size}">
  {#each options as o (o.value)}
    <ToggleGroup.Item value={o.value} disabled={o.desactive} class="it" aria-label={iconesSeules ? o.label : undefined} title={iconesSeules ? o.label : undefined}>
      {#if o.icone}<Icon icon={o.icone} size={14} />{/if}{#if !iconesSeules}<span>{o.label}</span>{/if}
    </ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>

<style>
  :global(.sc-seg) { display: inline-flex; width: max-content; max-width: 100%; overflow-x: auto; scrollbar-width: none; align-self: flex-start; padding: 3px; gap: 2px; border-radius: 9px; background: var(--sc-ground-2); }
  :global(.sc-seg .it) { height: 26px; padding: 0 10px; border: 0; border-radius: 6px; background: transparent; color: var(--sc-text-2);
    font: 500 12.5px/1 var(--sc-sans); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  :global(.sc-seg .it:hover) { color: var(--sc-text); }
  :global(.sc-seg .it[data-state='on']) { background: var(--sc-sheet); color: var(--sc-text); box-shadow: 0 1px 2px rgba(20,32,44,.14); }
  :global(.sc-seg.sm .it) { height: 22px; padding: 0 8px; font-size: 12px; }
  :global(.sc-seg.lg .it) { height: 32px; padding: 0 14px; }
</style>
