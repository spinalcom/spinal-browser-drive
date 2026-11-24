<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Tooltip } from 'bits-ui';
  import type { Snippet } from 'svelte';
  /** Infobulle marine, délai 400 ms, aussi au focus clavier. Le déclencheur est rendu par le snippet trigger (props à étaler). */
  let { texte, cote = 'top', trigger }: { texte: string; cote?: 'top' | 'bottom' | 'left' | 'right'; trigger: Snippet<[Record<string, unknown>]> } = $props();
</script>

<Tooltip.Provider delayDuration={400}>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}{@render trigger(props)}{/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content side={cote} sideOffset={6} class="sc-tooltip">{texte}</Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>

<style>
  :global(.sc-tooltip) { z-index: 90; max-width: 280px; padding: 6px 8px; border-radius: 6px; background: var(--sc-ink); color: var(--sc-on-ink);
    font: 400 12px/16px var(--sc-sans); box-shadow: var(--sc-shadow-2); animation: sc-fade var(--sc-in) var(--sc-ease); }
</style>
