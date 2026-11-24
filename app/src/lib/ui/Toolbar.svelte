<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Action, ElementMenu } from './types';
  import { ORDRE_GROUPES } from './types';
  import Button from './Button.svelte';
  import IconButton from './IconButton.svelte';
  import Menu from './Menu.svelte';
  import Ellipsis from '@lucide/svelte/icons/ellipsis';
  /** 3 actions visibles (la principale d'abord), le reste dans « Plus », dans l'ordre des groupes de 02-ux §5. */
  let { actions, visibles = 3 }: { actions: Action[]; visibles?: number } = $props();
  const triees = $derived([...actions].sort((a, b) => Number(!!b.principale) - Number(!!a.principale) || ORDRE_GROUPES.indexOf(a.groupe) - ORDRE_GROUPES.indexOf(b.groupe)));
  const destructrice = (a: Action) => a.groupe === 'retirer' || a.groupe === 'supprimer';
  const enTete = $derived(triees.filter((a) => !destructrice(a)).slice(0, visibles));
  const reste = $derived(triees.filter((a) => !enTete.includes(a)).sort((a, b) => ORDRE_GROUPES.indexOf(a.groupe) - ORDRE_GROUPES.indexOf(b.groupe)));
  // Un seul filet : entre les actions courantes et les actions de retrait / suppression.
  const elements = $derived.by(() => {
    const out: ElementMenu[] = [];
    reste.forEach((a, i) => {
      if (i > 0 && destructrice(a) && !destructrice(reste[i - 1])) out.push({ type: 'separateur' });
      out.push({ id: a.id, label: a.label, icone: a.icone, raccourci: a.raccourci, danger: a.groupe === 'supprimer', desactive: a.desactive, raison: a.raison, executer: a.executer });
    });
    return out;
  });
</script>

<div class="sc-toolbar" role="toolbar">
  {#each enTete as a (a.id)}
    <Button size="sm" variant={a.principale ? 'primary' : 'secondary'} icon={a.icone} disabled={a.desactive} raison={a.raison} onclick={a.executer}>{a.label}</Button>
  {/each}
  {#if reste.length}
    <Menu {elements} align="end">{#snippet trigger(props)}<IconButton {...props} icon={Ellipsis} label="Plus d’actions" size="sm" variant="secondary" />{/snippet}</Menu>
  {/if}
</div>

<style>
  .sc-toolbar { display: flex; align-items: center; gap: 6px; }
</style>
