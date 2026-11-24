<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Slider } from 'bits-ui';
  import NumberInput from './NumberInput.svelte';
  let { value = $bindable(0), min = 0, max = 100, step = 1, unite, label }:
    { value?: number; min?: number; max?: number; step?: number; unite?: string; label: string } = $props();
  let champ = $state<number | null>(value);
  $effect(() => { champ = value; });
  $effect(() => { if (champ !== null && champ !== value && champ >= min && champ <= max) value = champ; });
</script>

<div class="sc-slider">
  <Slider.Root type="single" bind:value {min} {max} {step} class="piste" aria-label={label}>
    <Slider.Range class="plage" />
    <Slider.Thumb index={0} class="pouce" aria-label={label} />
  </Slider.Root>
  <div class="num"><NumberInput bind:value={champ} {min} {max} {step} {unite} size="sm" {label} /></div>
</div>

<style>
  .sc-slider { display: flex; align-items: center; gap: 12px; }
  .num { width: 96px; flex: none; }
  .sc-slider :global(.piste) { position: relative; flex: 1; height: 16px; display: flex; align-items: center; touch-action: none; }
  .sc-slider :global(.piste)::before { content: ''; position: absolute; left: 0; right: 0; height: 4px; border-radius: 4px; background: var(--sc-ground-2); }
  .sc-slider :global(.plage) { position: absolute; height: 4px; border-radius: 4px; background: var(--sc-accent); }
  .sc-slider :global(.pouce) { display: block; width: 16px; height: 16px; border-radius: 50%; background: var(--sc-sheet);
    border: 2px solid var(--sc-accent); box-shadow: var(--sc-shadow-1); }
</style>
