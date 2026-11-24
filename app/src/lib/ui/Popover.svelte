<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Popover } from 'bits-ui';
  import type { Snippet } from 'svelte';
  let { open = $bindable(false), trigger, children, cote = 'bottom', align = 'start', largeur = 320 }:
    { open?: boolean; trigger: Snippet<[Record<string, unknown>]>; children: Snippet; cote?: 'top' | 'bottom' | 'left' | 'right'; align?: 'start' | 'center' | 'end'; largeur?: number } = $props();
</script>

<Popover.Root bind:open>
  <Popover.Trigger>{#snippet child({ props })}{@render trigger(props)}{/snippet}</Popover.Trigger>
  <Popover.Portal>
    <Popover.Content side={cote} {align} sideOffset={6} class="sc-menu-surface sc-popover" style="width:{largeur}px">{@render children()}</Popover.Content>
  </Popover.Portal>
</Popover.Root>

<style>
  :global(.sc-popover) { padding: 12px; max-width: 92vw; max-height: none; }
</style>
