<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { IconeComposant } from './types';
  import Icon from './Icon.svelte';
  /** Barre verticale d'icônes (ateliers du Studio). Libellé en infobulle, témoin orange sur l'actif, pastille d'état. */
  let { elements, active = $bindable('') }:
    { elements: { id: string; label: string; icone: IconeComposant; pastille?: 'erreur' | 'cours' }[]; active?: string } = $props();
</script>

<nav class="sc-rail" aria-label="Ateliers">
  {#each elements as e (e.id)}
    <button class:on={e.id === active} aria-label={e.label} title={e.label} aria-current={e.id === active ? 'true' : undefined} onclick={() => (active = e.id)}>
      <Icon icon={e.icone} size={20} />{#if e.pastille}<i class="p {e.pastille}"></i>{/if}
    </button>
  {/each}
</nav>

<style>
  .sc-rail { width: 48px; flex: none; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 0; background: var(--sc-ink); }
  button { position: relative; width: 36px; height: 36px; border-radius: 9px; border: 0; background: transparent; color: var(--sc-on-ink-2); display: grid; place-items: center; }
  button:hover { background: var(--sc-ink-2); color: var(--sc-on-ink); }
  .on { background: var(--sc-ink-3); color: var(--sc-on-ink); }
  .on::before { content: ''; position: absolute; left: -6px; top: 8px; bottom: 8px; width: 3px; border-radius: 0 3px 3px 0; background: var(--sc-accent); }
  .p { position: absolute; right: 5px; top: 5px; width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 0 2px var(--sc-ink); }
  .erreur { background: var(--sc-danger); } .cours { background: var(--sc-info); }
</style>
