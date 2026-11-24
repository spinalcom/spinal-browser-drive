<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  let { keys, onInk = false }: { keys: string; onInk?: boolean } = $props();
  const touches = $derived(keys.split(' '));
</script>

<span class="sc-kbd" class:on-ink={onInk}>{#each touches as t, i}{#if i > 0}<span class="plus" aria-hidden="true"></span>{/if}<kbd>{t}</kbd>{/each}</span>

<style>
  .sc-kbd { display: inline-flex; gap: 2px; align-items: center; }
  kbd { font: 500 11px/1 var(--sc-mono); padding: 3px 5px; border-radius: 4px; background: var(--sc-ground-2); color: var(--sc-text-2);
    box-shadow: inset 0 -1px 0 var(--sc-line-2); }
  .on-ink kbd { background: var(--sc-ink-3); color: var(--sc-on-ink-2); box-shadow: none; }
</style>
