<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  let { value = $bindable(''), maxlength, lignes = 3, invalide = false, ...rest }: HTMLTextareaAttributes & { value?: string; lignes?: number; invalide?: boolean } = $props();
  let el = $state<HTMLTextAreaElement>();
  $effect(() => { value; if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } });
</script>

<div class="sc-control area" class:invalide>
  <textarea bind:this={el} {...rest} bind:value {maxlength} rows={lignes}></textarea>
</div>
{#if maxlength}<div class="sc-caption compte">{value.length} / {maxlength}</div>{/if}

<style>
  .area { height: auto; padding: 8px 10px; align-items: stretch; }
  textarea { resize: none; line-height: 20px; overflow: hidden; }
  .compte { text-align: right; margin-top: 4px; font-family: var(--sc-mono); }
</style>
