<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { label, description, erreur, requis = false, id, children }:
    { label: string; description?: string; erreur?: string; requis?: boolean; id: string; children: Snippet } = $props();
</script>

<div class="sc-field">
  <label for={id} class="sc-label">{label}{#if requis}<span class="req" aria-hidden="true"> *</span>{/if}</label>
  {@render children()}
  {#if erreur}
    <p class="err" id="{id}-err" role="alert">{erreur}</p>
  {:else if description}
    <p class="sc-caption" id="{id}-desc">{description}</p>
  {/if}
</div>

<style>
  .sc-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .req { color: var(--sc-danger); }
  .err { font: 400 12px/16px var(--sc-sans); color: var(--sc-danger); }
</style>
