<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Ton } from './types';
  import Icon from './Icon.svelte';
  import Unplug from '@lucide/svelte/icons/unplug';
  import Info from '@lucide/svelte/icons/info';
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
  let { ton = 'warn', message, actions }: { ton?: Ton; message: string; actions?: Snippet } = $props();
  const icone = $derived(ton === 'danger' ? Unplug : ton === 'warn' ? TriangleAlert : Info);
</script>

<div class="sc-banner {ton}" role={ton === 'danger' ? 'alert' : 'status'}>
  <Icon icon={icone} /><span class="msg">{message}</span>{@render actions?.()}
</div>

<style>
  .sc-banner { display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 6px 16px; font: 500 13px/18px var(--sc-sans);
    background: var(--sc-ground-2); color: var(--sc-text); border-bottom: 1px solid var(--sc-line); }
  .msg { flex: 1; }
  .danger { background: var(--sc-danger-soft); color: var(--sc-danger); }
  .warn { background: var(--sc-warn-soft); color: var(--sc-warn); }
  .info { background: var(--sc-info-soft); color: var(--sc-info); }
  .accent { background: var(--sc-accent-soft); color: var(--sc-accent-ink); }
</style>
