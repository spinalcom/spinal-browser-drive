<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { IconeComposant, Taille } from './types';
  import Icon from './Icon.svelte';
  import IconButton from './IconButton.svelte';
  import Eye from '@lucide/svelte/icons/eye';
  import EyeOff from '@lucide/svelte/icons/eye-off';
  import X from '@lucide/svelte/icons/x';

  type Props = Omit<HTMLInputAttributes, 'size' | 'prefix' | 'type'> & {
    value?: string;
    type?: 'text' | 'search' | 'password' | 'email' | 'url';
    size?: Taille;
    icon?: IconeComposant;
    prefixe?: string;
    suffixe?: string;
    clearable?: boolean;
    invalide?: boolean;
    /** Élément <input> (pour lui donner le focus). */ champ?: HTMLInputElement | null;
  };
  let { value = $bindable(''), type = 'text', size = 'md', icon, prefixe, suffixe, clearable = false, invalide = false, disabled, id, class: cls = '', champ = $bindable(null), ...rest }: Props = $props();
  let visible = $state(false);
  const typeEffectif = $derived(type === 'password' && visible ? 'text' : type);
</script>

<div class="sc-control {size} {cls}" class:invalide class:desactive={disabled}>
  {#if icon}<Icon {icon} size={16} class="sc-muted" />{/if}
  {#if prefixe}<span class="affixe">{prefixe}</span>{/if}
  <input bind:this={champ} {...rest} {id} type={typeEffectif} bind:value {disabled} aria-invalid={invalide || undefined}
    aria-describedby={id ? (invalide ? id + '-err' : id + '-desc') : undefined} />
  {#if suffixe}<span class="affixe">{suffixe}</span>{/if}
  {#if clearable && value}
    <IconButton icon={X} label="Effacer" size="sm" onclick={() => (value = '')} />
  {/if}
  {#if type === 'password'}
    <IconButton icon={visible ? EyeOff : Eye} label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} size="sm"
      pressed={visible} onclick={() => (visible = !visible)} />
  {/if}
</div>

<style>
  .sc-control :global(.sc-ibtn) { margin-right: -6px; }
</style>
