<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { toasts, fermerToast } from './toasts.svelte';
  import Icon from './Icon.svelte';
  import IconButton from './IconButton.svelte';
  import CircleCheck from '@lucide/svelte/icons/circle-check';
  import Info from '@lucide/svelte/icons/info';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import X from '@lucide/svelte/icons/x';
  const ICONES = { succes: CircleCheck, info: Info, erreur: CircleAlert };
</script>

<div class="sc-toasts" role="region" aria-label="Notifications">
  {#each toasts as t (t.id)}
    <div class="toast {t.genre}" role={t.genre === 'erreur' ? 'alert' : 'status'}>
      <Icon icon={ICONES[t.genre]} />
      <span class="msg">{t.message}</span>
      {#if t.action}<button class="act" onclick={() => { t.action?.executer(); fermerToast(t.id); }}>{t.action.label}</button>{/if}
      <IconButton icon={X} label="Fermer la notification" size="sm" variant="on-ink" onclick={() => fermerToast(t.id)} />
    </div>
  {/each}
</div>

<style>
  .sc-toasts { position: fixed; left: 16px; bottom: 16px; z-index: 85; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
  .toast { pointer-events: auto; display: flex; align-items: center; gap: 10px; min-width: 320px; max-width: 440px; padding: 8px 8px 8px 14px;
    border-radius: var(--sc-r-card); background: var(--sc-ink); color: var(--sc-on-ink); box-shadow: var(--sc-shadow-3); font-size: 13px;
    animation: sc-in var(--sc-in) var(--sc-ease); }
  .succes > :global(.sc-icon) { color: var(--sc-toast-ok); }
  .erreur > :global(.sc-icon) { color: var(--sc-toast-err); }
  .info > :global(.sc-icon) { color: var(--sc-on-ink-2); }
  .msg { flex: 1; }
  .act { border: 0; background: none; color: var(--sc-accent); font: 600 13px/1 var(--sc-sans); padding: 8px; border-radius: 6px; }
  .act:hover { background: var(--sc-ink-2); }
</style>
