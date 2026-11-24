<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { RadioGroup } from 'bits-ui';
  import type { Option } from './types';
  let { value = $bindable(''), options, label, orientation = 'vertical' }:
    { value?: string; options: Option[]; label: string; orientation?: 'vertical' | 'horizontal' } = $props();
</script>

<RadioGroup.Root bind:value {orientation} aria-label={label} class="sc-radios {orientation}">
  {#each options as o (o.value)}
    <label class="opt" class:desactive={o.desactive}>
      <RadioGroup.Item value={o.value} disabled={o.desactive} class="rond" />
      <span class="txt"><span>{o.label}</span>{#if o.description}<span class="sc-caption">{o.description}</span>{/if}</span>
    </label>
  {/each}
</RadioGroup.Root>

<style>
  :global(.sc-radios) { display: flex; gap: 10px; }
  :global(.sc-radios.vertical) { flex-direction: column; }
  .opt { display: inline-flex; gap: 8px; align-items: flex-start; cursor: pointer; }
  .desactive { color: var(--sc-muted); cursor: not-allowed; }
  .desactive :global(.rond) { opacity: .5; }
  .txt { display: flex; flex-direction: column; gap: 2px; }
  .opt :global(.rond) { width: 16px; height: 16px; margin-top: 2px; flex: none; border-radius: 50%; border: 1.5px solid var(--sc-line-field); background: var(--sc-sheet); padding: 0; }
  .opt :global(.rond[data-state='checked']) { border: 5px solid var(--sc-accent); }
</style>
