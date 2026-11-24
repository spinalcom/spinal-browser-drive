<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { ContextMenu } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import type { ElementMenu } from './types';
  import MenuElements from './MenuElements.svelte';
  let { elements, children }: { elements: ElementMenu[]; children: Snippet } = $props();
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger class="sc-ctx-zone">{@render children()}</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content class="sc-menu-surface"><MenuElements {elements} contexte /></ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>

<style>
  :global(.sc-ctx-zone) { display: contents; }
</style>
