<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  let { size = 16, label = 'Chargement' }: { size?: number; label?: string } = $props();
</script>

<span class="spin" style:width="{size}px" style:height="{size}px" role="status" aria-label={label}></span>

<style>
  .spin { display: inline-block; flex: none; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent;
    opacity: .8; animation: sc-spin .8s linear infinite; }
</style>
