<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Checkbox } from 'bits-ui';
  import Check from '@lucide/svelte/icons/check';
  import Minus from '@lucide/svelte/icons/minus';
  let { checked = $bindable(false), indeterminate = $bindable(false), label, masquerLabel = false, disabled = false, id, onchange }:
    { checked?: boolean; indeterminate?: boolean; label: string; masquerLabel?: boolean; disabled?: boolean; id?: string; onchange?: (v: boolean) => void } = $props();
</script>

<label class="sc-check" class:desactive={disabled}>
  <Checkbox.Root bind:checked bind:indeterminate {disabled} {id} onCheckedChange={(v) => onchange?.(v)} class="box" aria-label={masquerLabel ? label : undefined}>
    {#snippet children({ checked, indeterminate })}
      {#if indeterminate}<Minus size={12} strokeWidth={3} />{:else if checked}<Check size={12} strokeWidth={3} />{/if}
    {/snippet}
  </Checkbox.Root>
  {#if !masquerLabel}<span>{label}</span>{/if}
</label>

<style>
  .sc-check { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
  .desactive { color: var(--sc-muted); cursor: not-allowed; }
  .desactive :global(.box) { opacity: .5; }
  .sc-check :global(.box) { width: 16px; height: 16px; flex: none; border-radius: 4px; border: 1.5px solid var(--sc-line-field);
    background: var(--sc-sheet); display: grid; place-items: center; padding: 0; color: var(--sc-on-accent); }
  .sc-check :global(.box[data-state='checked']), .sc-check :global(.box[data-state='indeterminate']) { background: var(--sc-accent); border-color: var(--sc-accent); }
</style>
