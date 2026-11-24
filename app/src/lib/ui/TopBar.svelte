<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Kbd from './Kbd.svelte';
  import Icon from './Icon.svelte';
  import Search from '@lucide/svelte/icons/search';
  /** Barre supérieure marine (02-ux §3). sections : Drive, Studio (si jumeau ouvert), Admin (si administrateur). */
  let { sections, active, centre, ouvrirPalette, droite }:
    { sections: { id: string; label: string; href: string; desactive?: boolean }[]; active: string; centre?: Snippet; ouvrirPalette: () => void; droite?: Snippet } = $props();
</script>

<header class="sc-topbar">
  <a class="marque" href={sections[0]?.href}><span class="logo" aria-hidden="true"></span>SpinalCore</a>
  <nav aria-label="Sections">
    {#each sections as s (s.id)}
      <a href={s.desactive ? undefined : s.href} class:on={s.id === active} aria-current={s.id === active ? 'page' : undefined} aria-disabled={s.desactive || undefined}>{s.label}</a>
    {/each}
  </nav>
  {#if centre}<div class="centre">{@render centre()}</div>{/if}
  <button class="cmdk" onclick={ouvrirPalette} aria-keyshortcuts="Control+K">
    <Icon icon={Search} /><span>Rechercher un fichier, un objet, une action…</span><Kbd keys="Ctrl K" onInk />
  </button>
  <div class="droite">{@render droite?.()}</div>
</header>

<style>
  .sc-topbar { height: var(--sc-h-topbar); flex: none; display: flex; align-items: center; gap: 8px; padding: 0 12px 0 16px;
    background: var(--sc-ink); color: var(--sc-on-ink); position: relative; z-index: 30; }
  .marque { display: flex; align-items: center; gap: 10px; color: var(--sc-on-ink); text-decoration: none; font-weight: 600; letter-spacing: -.01em; margin-right: 12px; white-space: nowrap; }
  .logo { width: 22px; height: 22px; border-radius: 6px; background: var(--sc-accent); position: relative; }
  .logo::after { content: ''; position: absolute; inset: 6px; border-radius: 2px; background: var(--sc-ink); }
  nav { display: flex; gap: 2px; }
  nav a { position: relative; padding: 6px 12px; border-radius: 8px; color: var(--sc-on-ink-2); text-decoration: none; font: 500 13px/20px var(--sc-sans); }
  nav a:hover { background: var(--sc-ink-2); color: var(--sc-on-ink); }
  nav a.on { background: var(--sc-ink-3); color: var(--sc-on-ink); }
  nav a.on::after { content: ''; position: absolute; left: 12px; right: 12px; bottom: -8px; height: 2px; border-radius: 2px; background: var(--sc-accent); }
  nav a[aria-disabled] { opacity: .45; pointer-events: none; }
  .centre { display: flex; align-items: center; min-width: 0; margin-left: 8px; }
  .cmdk { margin: 0 auto; width: min(460px, 36vw); height: 32px; display: flex; align-items: center; gap: 8px; padding: 0 8px 0 10px;
    border-radius: 8px; border: 1px solid var(--sc-ink-3); background: var(--sc-ink-2); color: var(--sc-on-ink-2); text-align: left; }
  .cmdk:hover { border-color: var(--sc-on-ink-2); }
  .cmdk span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
  .droite { display: flex; align-items: center; gap: 4px; }
</style>
