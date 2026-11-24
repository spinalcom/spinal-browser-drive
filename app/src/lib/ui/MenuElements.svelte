<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { DropdownMenu, ContextMenu } from 'bits-ui';
  import type { ElementMenu } from './types';
  import Icon from './Icon.svelte';
  import Kbd from './Kbd.svelte';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import MenuElements from './MenuElements.svelte';
  /** Rendu commun des éléments de Menu et ContextMenu (mêmes groupes, raccourcis, raisons de désactivation). */
  let { elements, contexte = false }: { elements: ElementMenu[]; contexte?: boolean } = $props();
  const M = $derived(contexte ? ContextMenu : DropdownMenu);
</script>

{#each elements as e, i (i)}
  {#if e.type === 'separateur'}
    <M.Separator class="sc-menu-sep" />
  {:else if e.type === 'titre'}
    <div class="sc-menu-titre">{e.label}</div>
  {:else if e.type === 'sous-menu'}
    <M.Sub>
      <M.SubTrigger class="sc-menu-item">{#if e.icone}<Icon icon={e.icone} />{/if}<span>{e.label}</span><ChevronRight size={14} class="raccourci" /></M.SubTrigger>
      <M.SubContent class="sc-menu-surface" sideOffset={4}><MenuElements elements={e.elements} {contexte} /></M.SubContent>
    </M.Sub>
  {:else}
    <M.Item class="sc-menu-item {e.danger ? 'danger' : ''}" disabled={e.desactive} onSelect={e.executer} title={e.desactive ? e.raison : undefined}>
      {#if e.icone}<Icon icon={e.icone} />{/if}
      <span class="lbl">{e.label}{#if e.desactive && e.raison}<span class="sc-caption raison">{e.raison}</span>{/if}</span>
      {#if e.raccourci}<span class="raccourci"><Kbd keys={e.raccourci} /></span>{/if}
    </M.Item>
  {/if}
{/each}

<style>
  .lbl { display: flex; flex-direction: column; }
  .raison { margin-top: 1px; }
</style>
