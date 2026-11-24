<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Ton } from './types';
  let { value, max = 100, label, tone = 'accent' }: { value?: number; max?: number; label: string; tone?: Ton } = $props();
  const pct = $derived(value === undefined ? undefined : Math.max(0, Math.min(100, (value / max) * 100)));
</script>

<div class="sc-progress {tone}" class:indet={pct === undefined} role="progressbar" aria-label={label}
  aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
  <i style:width={pct === undefined ? undefined : pct + '%'}></i>
</div>

<style>
  .sc-progress { height: 4px; border-radius: 4px; background: var(--sc-ground-2); overflow: hidden; width: 100%; }
  i { display: block; height: 100%; border-radius: 4px; background: var(--sc-accent); transition: width var(--sc-in) var(--sc-ease); }
  .ok i { background: var(--sc-ok); } .info i { background: var(--sc-info); } .danger i { background: var(--sc-danger); } .warn i { background: var(--sc-warn); }
  .indet i { width: 30%; animation: indet 1.2s var(--sc-ease) infinite; }
  @keyframes indet { from { transform: translateX(-100%); } to { transform: translateX(340%); } }
</style>
