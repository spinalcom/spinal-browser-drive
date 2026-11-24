<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Icon from './Icon.svelte';
  import Button from './Button.svelte';
  import Upload from '@lucide/svelte/icons/upload';
  import type { Snippet } from 'svelte';
  let { onfiles, accept, multiple = true, titre = 'Déposez vos fichiers ici', aide, actions }:
    { onfiles: (f: File[]) => void; accept?: string; multiple?: boolean; titre?: string; aide?: string; actions?: Snippet } = $props();
  let survol = $state(false);
  let input = $state<HTMLInputElement>();
  let profondeur = 0;
  function deposer(e: DragEvent) {
    e.preventDefault(); survol = false; profondeur = 0;
    const f = Array.from(e.dataTransfer?.files ?? []);
    if (f.length) onfiles(multiple ? f : f.slice(0, 1));
  }
</script>

<div class="sc-drop" class:survol role="region" aria-label={titre}
  ondragenter={(e) => { e.preventDefault(); profondeur++; survol = true; }}
  ondragover={(e) => e.preventDefault()}
  ondragleave={() => { if (--profondeur <= 0) survol = false; }}
  ondrop={deposer}>
  <span class="ico"><Icon icon={Upload} size={20} /></span>
  <div class="txt"><div class="sc-label">{titre}</div>{#if aide}<div class="sc-caption">{aide}</div>{/if}</div>
  {@render actions?.()}
  <Button onclick={() => input?.click()}>Parcourir…</Button>
  <input bind:this={input} type="file" {accept} {multiple} hidden onchange={(e) => { const f = Array.from(e.currentTarget.files ?? []); if (f.length) onfiles(f); e.currentTarget.value = ''; }} />
</div>

<style>
  .sc-drop { display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: var(--sc-r-card);
    border: 2px dashed var(--sc-line-2); background: var(--sc-ground); transition: border-color var(--sc-in) var(--sc-ease), background-color var(--sc-in) var(--sc-ease); }
  .survol { border-color: var(--sc-accent); background: var(--sc-accent-soft); }
  .ico { width: 44px; height: 44px; border-radius: 12px; background: var(--sc-ink); color: var(--sc-on-ink); display: grid; place-items: center; flex: none; }
  .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
</style>
