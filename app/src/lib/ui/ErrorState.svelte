<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Icon from './Icon.svelte';
  import Button from './Button.svelte';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import Unplug from '@lucide/svelte/icons/unplug';
  import RefreshCw from '@lucide/svelte/icons/refresh-cw';
  import Copy from '@lucide/svelte/icons/copy';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  /** Erreur claire + détail technique repliable et copiable. Variante « indisponible » : la cause est nommée, le reste marche. */
  let { titre, message, detail, indisponible = false, onretry }:
    { titre: string; message: string; detail?: string; indisponible?: boolean; onretry?: () => void } = $props();
  let copie = $state(false);
  async function copier() { if (!detail) return; await navigator.clipboard?.writeText(detail); copie = true; setTimeout(() => (copie = false), 1500); }
</script>

<div class="sc-error" class:indispo={indisponible} role="alert">
  <span class="ico"><Icon icon={indisponible ? Unplug : CircleAlert} size={20} /></span>
  <div class="corps">
    <div class="sc-subtitle">{titre}</div>
    <p>{message}</p>
    {#if detail}
      <details><summary><ChevronRight size={14} />Détail technique</summary><pre>{detail}</pre></details>
    {/if}
    <div class="acts">
      {#if onretry}<Button size="sm" icon={RefreshCw} onclick={onretry}>Réessayer</Button>{/if}
      {#if detail}<Button size="sm" variant="ghost" icon={Copy} onclick={copier}>{copie ? 'Copié' : 'Copier le détail'}</Button>{/if}
    </div>
  </div>
</div>

<style>
  .sc-error { display: flex; gap: 12px; padding: 16px; border-radius: var(--sc-r-card); background: var(--sc-danger-soft); color: var(--sc-text); }
  .indispo { background: var(--sc-ground-2); }
  .ico { color: var(--sc-danger); padding-top: 1px; }
  .indispo .ico { color: var(--sc-text-2); }
  .corps { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  p { color: var(--sc-text-2); font-size: 13px; }
  summary { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; font: 500 12px/16px var(--sc-sans); color: var(--sc-text-2); margin-top: 4px; list-style: none; }
  details[open] summary :global(svg) { transform: rotate(90deg); }
  pre { margin: 6px 0 0; padding: 8px 10px; border-radius: 6px; background: var(--sc-sheet); font: 400 12px/16px var(--sc-mono); white-space: pre-wrap; word-break: break-all; max-height: 180px; overflow: auto; }
  .acts { display: flex; gap: 6px; margin-top: 8px; }
</style>
