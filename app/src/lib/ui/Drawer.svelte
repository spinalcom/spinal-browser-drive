<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Dialog } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import IconButton from './IconButton.svelte';
  import X from '@lucide/svelte/icons/x';
  let { open = $bindable(false), titre, largeur = 440, children }: { open?: boolean; titre: string; largeur?: number; children: Snippet } = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="sc-scrim" />
    <Dialog.Content class="sc-drawer" style="width:min({largeur}px, 100vw)">
      <header><Dialog.Title class="sc-title">{titre}</Dialog.Title>
        <Dialog.Close>{#snippet child({ props })}<IconButton {...props} icon={X} label="Fermer" size="sm" />{/snippet}</Dialog.Close></header>
      <div class="corps">{@render children()}</div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.sc-drawer) { position: fixed; z-index: 71; top: 0; right: 0; bottom: 0; background: var(--sc-sheet); box-shadow: var(--sc-shadow-3); display: flex; flex-direction: column;
    animation: tiroir var(--sc-in) var(--sc-ease); }
  @keyframes tiroir { from { transform: translateX(24px); opacity: 0; } }
  header { display: flex; align-items: center; justify-content: space-between; padding: 14px 12px 12px 20px; border-bottom: 1px solid var(--sc-line); }
  .corps { flex: 1; overflow: auto; padding: 16px 20px; }
</style>
