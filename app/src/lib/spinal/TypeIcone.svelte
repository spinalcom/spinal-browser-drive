<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Icon from '$lib/ui/Icon.svelte';
  import { typeNoeud } from './types-noeuds';
  let { type, size = 16, tuile = false }: { type: string; size?: number; tuile?: boolean } = $props();
  const t = $derived(typeNoeud(type));
</script>

<span class="ti" class:tuile title={t.connu ? t.label : `Type : ${type}`}><Icon icon={t.icone} {size} label={t.label} /></span>

<style>
  .ti { display: inline-grid; place-items: center; color: var(--sc-text-2); flex: none; }
  .tuile { width: 28px; height: 28px; border-radius: 8px; background: var(--sc-ground-2); }
</style>
