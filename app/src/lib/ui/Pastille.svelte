<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  /** Couleur utilisateur (groupe, étape, contexte) : toujours avec un nom (02-ux §9). */
  let { couleur, nom, taille = 10 }: { couleur: string; nom: string; taille?: number } = $props();
</script>

<span class="sc-pastille"><span class="dot" style:background={couleur} style:width="{taille}px" style:height="{taille}px"></span><span>{nom}</span></span>

<style>
  .sc-pastille { display: inline-flex; align-items: center; gap: 6px; min-width: 0; }
  .sc-pastille > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dot { border-radius: 50%; flex: none; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); }
</style>
