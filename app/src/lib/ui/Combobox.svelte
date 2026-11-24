<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Combobox } from 'bits-ui';
  import type { Option, Taille } from './types';
  import Icon from './Icon.svelte';
  import Check from '@lucide/svelte/icons/check';
  import Plus from '@lucide/svelte/icons/plus';
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';

  /** Recherche + choix. Avec creatable, la dernière option propose « Créer « xyz » » et appelle oncreate. */
  let { value = $bindable(''), options, label, placeholder = 'Rechercher…', creatable = false, oncreate, size = 'md', id }:
    { value?: string; options: Option[]; label: string; placeholder?: string; creatable?: boolean; oncreate?: (texte: string) => void; size?: Taille; id?: string } = $props();
  let saisie = $state('');
  let ouvert = $state(false);
  const CREER = '__creer__';
  const filtrees = $derived(saisie ? options.filter((o) => o.label.toLowerCase().includes(saisie.trim().toLowerCase())) : options);
  const exacte = $derived(options.some((o) => o.label.toLowerCase() === saisie.trim().toLowerCase()));
  const proposerCreation = $derived(creatable && saisie.trim() !== '' && !exacte);
  const choisi = $derived(options.find((o) => o.value === value));
</script>

<Combobox.Root type="single" bind:open={ouvert} {value}
  onValueChange={(v) => { if (v === CREER) { oncreate?.(saisie.trim()); saisie = ''; } else { value = v; saisie = ''; } }}
  onOpenChange={(o) => { if (!o) saisie = ''; }}>
  <div class="sc-control {size}">
    <Combobox.Input {id} aria-label={label} {placeholder} defaultValue={choisi?.label} oninput={(e) => { saisie = e.currentTarget.value; ouvert = true; }} />
    <Combobox.Trigger class="trig" aria-label="Afficher les options"><ChevronsUpDown size={14} /></Combobox.Trigger>
  </div>
  <Combobox.Portal>
    <Combobox.Content class="sc-menu-surface" sideOffset={4}>
      {#each filtrees as o (o.value)}
        <Combobox.Item value={o.value} label={o.label} class="sc-menu-item" disabled={o.desactive}>
          {#snippet children({ selected })}
            {#if o.icone}<Icon icon={o.icone} size={16} />{/if}<span>{o.label}</span>{#if selected}<Check size={14} class="ok" />{/if}
          {/snippet}
        </Combobox.Item>
      {:else}
        {#if !proposerCreation}<div class="sc-caption vide">Aucun résultat pour « {saisie} »</div>{/if}
      {/each}
      {#if proposerCreation}
        {#if filtrees.length}<div class="sc-menu-sep"></div>{/if}
        <Combobox.Item value={CREER} label={saisie} class="sc-menu-item creer"><Plus size={16} /><span>Créer « {saisie.trim()} »</span></Combobox.Item>
      {/if}
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>

<style>
  :global(.trig) { border: 0; background: none; color: var(--sc-muted); padding: 0; display: grid; place-items: center; margin-right: -2px; }
  :global(.sc-menu-item.creer) { color: var(--sc-accent-ink); font-weight: 500; }
  .vide { padding: 8px 10px; }
</style>
