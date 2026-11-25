<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import '$lib/ui/base.css';
  import Toasts from '$lib/ui/Toasts.svelte';
  let { children } = $props();
</script>

{@render children()}
<Toasts />
