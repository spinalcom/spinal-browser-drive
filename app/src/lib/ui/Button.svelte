<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { IconeComposant, Taille } from './types';
  import Icon from './Icon.svelte';
  import Spinner from './Spinner.svelte';

  type Props = HTMLButtonAttributes & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost' | 'ink';
    size?: Taille;
    icon?: IconeComposant;
    iconEnd?: IconeComposant;
    loading?: boolean;
    /** Raison affichée en infobulle quand le bouton est désactivé (jamais un bouton grisé muet). */
    raison?: string;
    href?: string;
    children?: Snippet;
  };
  let { variant = 'secondary', size = 'md', icon, iconEnd, loading = false, disabled = false, raison, href, children, class: cls = '', ...rest }: Props = $props();
  const taille = $derived(size === 'sm' ? 14 : size === 'lg' ? 18 : 16);
</script>

{#if href && !disabled}
  <a {href} class="sc-btn {variant} {size} {cls}">
    {#if icon}<Icon icon={icon} size={taille} />{/if}{@render children?.()}{#if iconEnd}<Icon icon={iconEnd} size={taille} />{/if}
  </a>
{:else}
  <button
    {...rest}
    class="sc-btn {variant} {size} {cls}"
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    title={disabled && raison ? raison : rest.title}
  >
    {#if loading}<Spinner size={taille} />{:else if icon}<Icon icon={icon} size={taille} />{/if}{@render children?.()}{#if iconEnd}<Icon icon={iconEnd} size={taille} />{/if}
  </button>
{/if}

<style>
  .sc-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; text-decoration: none;
    height: var(--sc-h-control); padding: 0 12px; border-radius: var(--sc-r-control);
    border: 1px solid var(--sc-line-2); background: var(--sc-sheet); color: var(--sc-text);
    font: 500 13px/1 var(--sc-sans);
    transition: background-color var(--sc-in) var(--sc-ease), border-color var(--sc-in) var(--sc-ease);
  }
  .sc-btn:hover { background: var(--sc-sheet-hover); border-color: var(--sc-line-3); }
  .sc-btn:active { transform: translateY(0.5px); }
  .primary { background: var(--sc-accent); border-color: var(--sc-accent); color: var(--sc-on-accent); }
  .primary:hover { background: var(--sc-accent-hover); border-color: var(--sc-accent-hover); }
  .ink { background: var(--sc-ink); border-color: var(--sc-ink); color: var(--sc-on-ink); }
  .ink:hover { background: var(--sc-ink-3); border-color: var(--sc-ink-3); }
  .ghost { background: transparent; border-color: transparent; color: var(--sc-text-2); }
  .ghost:hover { background: var(--sc-ground-2); border-color: transparent; color: var(--sc-text); }
  .danger { background: var(--sc-danger); border-color: var(--sc-danger); color: var(--sc-on-danger); }
  .danger:hover { background: var(--sc-danger-hover); border-color: var(--sc-danger-hover); }
  .danger-ghost { background: transparent; border-color: transparent; color: var(--sc-danger); }
  .danger-ghost:hover { background: var(--sc-danger-soft); border-color: transparent; }
  .sm { height: var(--sc-h-control-sm); padding: 0 10px; font-size: 12.5px; }
  .lg { height: var(--sc-h-control-lg); padding: 0 16px; font-size: 14px; }
  .sc-btn:disabled { opacity: .45; cursor: not-allowed; }
  .sc-btn:disabled:active { transform: none; }
</style>
