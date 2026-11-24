<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { IconeComposant, Taille } from './types';
  import Icon from './Icon.svelte';

  type Props = HTMLButtonAttributes & {
    icon: IconeComposant;
    /** Obligatoire : infobulle et nom accessible. */
    label: string;
    size?: Taille;
    variant?: 'ghost' | 'secondary' | 'on-ink';
    /** Bascule : rend le bouton enfoncé. */
    pressed?: boolean;
  };
  let { icon, label, size = 'md', variant = 'ghost', pressed, class: cls = '', ...rest }: Props = $props();
</script>

<button {...rest} class="sc-ibtn {variant} {size} {cls}" aria-label={label} title={label} aria-pressed={pressed}>
  <Icon {icon} size={size === 'lg' ? 20 : 16} />
</button>

<style>
  .sc-ibtn { display: inline-grid; place-items: center; flex: none; width: var(--sc-h-control); height: var(--sc-h-control);
    border-radius: var(--sc-r-control); border: 1px solid transparent; background: transparent; color: var(--sc-text-2);
    transition: background-color var(--sc-in) var(--sc-ease); }
  .sc-ibtn:hover { background: var(--sc-ground-2); color: var(--sc-text); }
  .secondary { border-color: var(--sc-line-2); background: var(--sc-sheet); }
  .secondary:hover { background: var(--sc-sheet-hover); }
  .on-ink { color: var(--sc-on-ink-2); }
  .on-ink:hover { background: var(--sc-ink-2); color: var(--sc-on-ink); }
  .sm { width: var(--sc-h-control-sm); height: var(--sc-h-control-sm); }
  .lg { width: var(--sc-h-control-lg); height: var(--sc-h-control-lg); }
  [aria-pressed='true'] { background: var(--sc-accent-soft); color: var(--sc-accent-ink); }
  .on-ink[aria-pressed='true'] { background: var(--sc-ink-3); color: var(--sc-on-ink); }
  .sc-ibtn:disabled { opacity: .45; cursor: not-allowed; }
</style>
