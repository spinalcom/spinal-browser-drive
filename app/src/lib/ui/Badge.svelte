<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { IconeComposant, Ton } from './types';
  import Icon from './Icon.svelte';
  let { tone = 'neutre', icon, mono = false, title, children }: { tone?: Ton; icon?: IconeComposant; mono?: boolean; title?: string; children: Snippet } = $props();
</script>

<span class="sc-badge {tone}" class:mono {title}>{#if icon}<Icon {icon} size={13} />{/if}{@render children()}</span>

<style>
  .sc-badge { display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: var(--sc-r-pill);
    font: 500 12px/1 var(--sc-sans); background: var(--sc-ground-2); color: var(--sc-text-2); white-space: nowrap; }
  .mono { font: 500 11.5px/1 var(--sc-mono); font-variant-numeric: tabular-nums; }
  .accent { background: var(--sc-accent-soft); color: var(--sc-accent-ink); }
  .ok { background: var(--sc-ok-soft); color: var(--sc-ok); }
  .warn { background: var(--sc-warn-soft); color: var(--sc-warn); }
  .danger { background: var(--sc-danger-soft); color: var(--sc-danger); }
  .info { background: var(--sc-info-soft); color: var(--sc-info); }
</style>
