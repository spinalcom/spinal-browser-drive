<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  let { vertical = false }: { vertical?: boolean } = $props();
</script>

<span class="sc-sep" class:vertical role="separator" aria-orientation={vertical ? 'vertical' : 'horizontal'}></span>

<style>
  .sc-sep { display: block; height: 1px; width: 100%; background: var(--sc-line); flex: none; }
  .vertical { width: 1px; height: auto; align-self: stretch; }
</style>
