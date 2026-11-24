<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Select } from 'bits-ui';
  import type { Option, Taille } from './types';
  import Icon from './Icon.svelte';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import Check from '@lucide/svelte/icons/check';
  import Search from '@lucide/svelte/icons/search';

  let { value = $bindable(''), options, placeholder = 'Choisir…', label, size = 'md', id, disabled = false }:
    { value?: string; options: Option[]; placeholder?: string; label: string; size?: Taille; id?: string; disabled?: boolean } = $props();
  let filtre = $state('');
  const choisi = $derived(options.find((o) => o.value === value));
  const visibles = $derived(filtre ? options.filter((o) => o.label.toLowerCase().includes(filtre.toLowerCase())) : options);
</script>

<Select.Root type="single" bind:value {disabled} items={options.map((o) => ({ value: o.value, label: o.label, disabled: o.desactive }))}
  onOpenChange={(o) => { if (!o) filtre = ''; }}>
  <Select.Trigger {id} aria-label={label} class="sc-control sc-select-trigger {size}">
    {#if choisi?.icone}<Icon icon={choisi.icone} size={16} />{/if}
    <span class="v" class:ph={!choisi}>{choisi?.label ?? placeholder}</span>
    <ChevronDown size={16} class="sc-muted" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content class="sc-menu-surface" sideOffset={4}>
      {#if options.length > 8}
        <div class="filtre"><Search size={14} /><input placeholder="Filtrer" bind:value={filtre} aria-label="Filtrer les options" /></div>
      {/if}
      <Select.Viewport>
        {#each visibles as o (o.value)}
          <Select.Item value={o.value} label={o.label} disabled={o.desactive} class="sc-menu-item">
            {#snippet children({ selected })}
              {#if o.icone}<Icon icon={o.icone} size={16} />{/if}
              <span class="l">{o.label}{#if o.description}<span class="sc-caption d">{o.description}</span>{/if}</span>
              {#if selected}<Check size={14} class="ok" />{/if}
            {/snippet}
          </Select.Item>
        {:else}
          <div class="vide sc-caption">Aucune option pour « {filtre} »</div>
        {/each}
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>

<style>
  :global(.sc-select-trigger) { width: 100%; text-align: left; cursor: pointer; }
  .v { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ph { color: var(--sc-muted); }
  .l { flex: 1; display: flex; flex-direction: column; }
  .d { margin-top: 1px; }
  .filtre { display: flex; align-items: center; gap: 6px; padding: 4px 8px 8px; margin-bottom: 4px; border-bottom: 1px solid var(--sc-line); color: var(--sc-muted); }
  .filtre input { border: 0; outline: none; background: transparent; flex: 1; color: var(--sc-text); }
  .vide { padding: 8px 10px; }
</style>
