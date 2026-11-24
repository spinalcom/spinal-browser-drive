<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { IconeComposant } from './types';
  let { icon: I, size = 16, label, class: cls = '' }: { icon: IconeComposant; size?: number; label?: string; class?: string } = $props();
</script>

<span class="sc-icon {cls}" style:width="{size}px" style:height="{size}px" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}>
  <I {size} strokeWidth={1.75} />
</span>

<style>
  .sc-icon { display: inline-grid; place-items: center; flex: none; line-height: 0; }
  .sc-icon :global(svg) { stroke-linecap: round; stroke-linejoin: round; }
</style>
