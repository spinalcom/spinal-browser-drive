<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  $effect(() => { goto(`${base}/_ds`, { replaceState: true }); });
</script>
