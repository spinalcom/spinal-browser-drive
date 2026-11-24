<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import type { ElementMenu } from './types';
  import MenuElements from './MenuElements.svelte';
  let { elements, trigger, align = 'start', open = $bindable(false) }:
    { elements: ElementMenu[]; trigger: Snippet<[Record<string, unknown>]>; align?: 'start' | 'end'; open?: boolean } = $props();
</script>

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger>{#snippet child({ props })}{@render trigger(props)}{/snippet}</DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content class="sc-menu-surface" {align} sideOffset={4}><MenuElements {elements} /></DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
