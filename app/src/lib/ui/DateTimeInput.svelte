<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  /** datetime-local natif habillé ; le fuseau est affiché s'il diffère de celui du navigateur. */
  let { value = $bindable(''), id, fuseau, label, min, max }:
    { value?: string; id?: string; fuseau?: string; label?: string; min?: string; max?: string } = $props();
  const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
</script>

<div class="sc-control">
  <input type="datetime-local" {id} bind:value aria-label={label} {min} {max} />
  {#if fuseau && fuseau !== local}<span class="affixe">{fuseau}</span>{/if}
</div>

<style>
  input { font-family: var(--sc-mono); font-size: 12.5px; font-variant-numeric: tabular-nums; }
  input::-webkit-calendar-picker-indicator { opacity: .6; cursor: pointer; }
  :global([data-theme='dark']) input::-webkit-calendar-picker-indicator { filter: invert(1); }
</style>
