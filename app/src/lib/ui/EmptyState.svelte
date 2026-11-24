<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { IconeComposant } from './types';
  import Icon from './Icon.svelte';
  /** Dit pourquoi c'est vide, et propose l'action utile. */
  let { icone, titre, texte, actions, compact = false }: { icone: IconeComposant; titre: string; texte?: string; actions?: Snippet; compact?: boolean } = $props();
</script>

<div class="sc-empty" class:compact>
  <span class="ico"><Icon icon={icone} size={compact ? 18 : 22} /></span>
  <div class="sc-subtitle">{titre}</div>
  {#if texte}<p class="sc-caption">{texte}</p>{/if}
  {#if actions}<div class="acts">{@render actions()}</div>{/if}
</div>

<style>
  .sc-empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; padding: 40px 24px; max-width: 420px; margin: 0 auto; }
  .compact { padding: 20px 16px; }
  .ico { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; background: var(--sc-ground-2); color: var(--sc-text-2); margin-bottom: 6px; }
  .compact .ico { width: 36px; height: 36px; border-radius: 10px; }
  p { font-size: 13px; line-height: 18px; }
  .acts { display: flex; gap: 8px; margin-top: 10px; }
</style>
