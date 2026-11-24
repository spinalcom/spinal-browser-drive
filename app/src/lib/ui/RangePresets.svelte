<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Segmented from './Segmented.svelte';
  let { value = $bindable('24h') }: { value?: string } = $props();
  const OPTIONS = [
    { value: '1h', label: '1 h' }, { value: '3h', label: '3 h' }, { value: '24h', label: '24 h' }, { value: 'hier', label: 'Hier' },
    { value: '3j', label: '3 j' }, { value: '7j', label: '7 j' }, { value: 'perso', label: 'Personnalisée' },
  ];
</script>

<Segmented bind:value options={OPTIONS} label="Période" size="sm" />
