<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { initiales, teinteDe } from './format';
  let { nom, taille = 28 }: { nom: string; taille?: number } = $props();
</script>

<span class="sc-avatar" title={nom} style:width="{taille}px" style:height="{taille}px" style:font-size="{Math.max(11, Math.round(taille * 0.4))}px"
  style:background="color-mix(in oklab, var(--sc-data-{teinteDe(nom)}) 72%, #000)">{initiales(nom)}</span>

<style>
  .sc-avatar { display: inline-grid; place-items: center; flex: none; border-radius: 50%; color: #fff; font-weight: 600; line-height: 1; }
</style>
