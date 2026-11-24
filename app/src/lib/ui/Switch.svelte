<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Switch } from 'bits-ui';
  let { checked = $bindable(false), label, description, disabled = false }:
    { checked?: boolean; label: string; description?: string; disabled?: boolean } = $props();
</script>

<label class="sc-switch" class:desactive={disabled}>
  <Switch.Root bind:checked {disabled} class="piste"><Switch.Thumb class="pouce" /></Switch.Root>
  <span class="txt"><span class="sc-label">{label}</span>{#if description}<span class="sc-caption">{description}</span>{/if}</span>
</label>

<style>
  .sc-switch { display: inline-flex; align-items: flex-start; gap: 10px; cursor: pointer; }
  .desactive { color: var(--sc-muted); cursor: not-allowed; }
  .desactive :global(.piste) { opacity: .5; }
  .txt { display: flex; flex-direction: column; gap: 2px; padding-top: 2px; }
  .sc-switch :global(.piste) { width: 34px; height: 20px; flex: none; border-radius: 999px; border: 0; padding: 2px; background: var(--sc-line-field);
    transition: background-color var(--sc-in) var(--sc-ease); display: inline-flex; }
  .sc-switch :global(.piste[data-state='checked']) { background: var(--sc-ink); }
  .sc-switch :global(.pouce) { width: 16px; height: 16px; border-radius: 50%; background: var(--sc-sheet); box-shadow: var(--sc-shadow-1);
    transition: transform var(--sc-in) var(--sc-ease); display: block; }
  .sc-switch :global(.pouce[data-state='checked']) { transform: translateX(14px); background: var(--sc-accent); }
  :global([data-theme='dark']) .sc-switch :global(.piste[data-state='checked']) { background: var(--sc-ink-3); }
</style>
