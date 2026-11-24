<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Dialog } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import type { IconeComposant, Ton } from './types';
  import Icon from './Icon.svelte';
  import IconButton from './IconButton.svelte';
  import X from '@lucide/svelte/icons/x';
  /** Boîte modale. Le pied reçoit les boutons (principal à droite, libellé = verbe, jamais « OK »). */
  let { open = $bindable(false), titre, description, icone, ton = 'neutre', largeur = 560, fermable = true, children, pied }:
    { open?: boolean; titre: string; description?: string; icone?: IconeComposant; ton?: Ton; largeur?: number; fermable?: boolean; children?: Snippet; pied?: Snippet } = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="sc-scrim" />
    <Dialog.Content class="sc-dialog" style="width:min({largeur}px, calc(100vw - 32px))"
      interactOutsideBehavior={fermable ? 'close' : 'ignore'} escapeKeydownBehavior={fermable ? 'close' : 'ignore'}>
      <header>
        {#if icone}<span class="ico {ton}"><Icon icon={icone} size={20} /></span>{/if}
        <div class="tt">
          <Dialog.Title class="sc-title">{titre}</Dialog.Title>
          {#if description}<Dialog.Description class="sc-caption desc">{description}</Dialog.Description>{/if}
        </div>
        {#if fermable}<Dialog.Close>{#snippet child({ props })}<IconButton {...props} icon={X} label="Fermer" size="sm" />{/snippet}</Dialog.Close>{/if}
      </header>
      {#if children}<div class="corps">{@render children()}</div>{/if}
      {#if pied}<footer>{@render pied()}</footer>{/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.sc-scrim) { position: fixed; inset: 0; z-index: 70; background: var(--sc-scrim); animation: sc-fade var(--sc-in) var(--sc-ease); }
  :global(.sc-dialog) { position: fixed; z-index: 71; left: 50%; top: 50%; transform: translate(-50%, -50%); max-height: calc(100vh - 48px);
    display: flex; flex-direction: column; background: var(--sc-sheet); border-radius: var(--sc-r-sheet); box-shadow: var(--sc-shadow-3); overflow: hidden; }
  header { display: flex; gap: 12px; align-items: flex-start; padding: 20px 20px 8px 24px; }
  .tt { flex: 1; min-width: 0; }
  :global(.sc-dialog .desc) { margin-top: 4px; font-size: 13px; line-height: 18px; }
  .ico { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; flex: none; background: var(--sc-ground-2); color: var(--sc-text-2); }
  .ico.danger { background: var(--sc-danger-soft); color: var(--sc-danger); }
  .ico.warn { background: var(--sc-warn-soft); color: var(--sc-warn); }
  .ico.info { background: var(--sc-info-soft); color: var(--sc-info); }
  .ico.accent { background: var(--sc-accent-soft); color: var(--sc-accent-ink); }
  .corps { padding: 8px 24px 20px; overflow: auto; }
  footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 24px; background: var(--sc-ground); border-top: 1px solid var(--sc-line); }
</style>
