<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { fenetre, defilementPour } from './virtualisation';
  /** Liste virtualisée à hauteur fixe. Base de Tree et DataTable. */
  let { items, hauteurLigne = 36, ligne, cle, role = 'list', label, vue = $bindable() }:
    { items: T[]; hauteurLigne?: number; ligne: Snippet<[T, number]>; cle: (t: T, i: number) => string | number; role?: string; label?: string; vue?: HTMLElement } = $props();
  let defilement = $state(0);
  let hauteur = $state(400);
  const f = $derived(fenetre(items.length, hauteurLigne, defilement, hauteur));
  const tranche = $derived(items.slice(f.debut, f.fin));
  export function scrollToIndex(i: number) {
    if (!vue) return;
    const d = defilementPour(i, hauteurLigne, vue.scrollTop, vue.clientHeight);
    if (d !== null) vue.scrollTop = d;
  }
</script>

<div class="sc-vlist" bind:this={vue} bind:clientHeight={hauteur} onscroll={(e) => (defilement = e.currentTarget.scrollTop)} {role} aria-label={label}>
  <div style:height="{f.avant}px" aria-hidden="true"></div>
  {#each tranche as t, k (cle(t, f.debut + k))}{@render ligne(t, f.debut + k)}{/each}
  <div style:height="{f.apres}px" aria-hidden="true"></div>
</div>

<style>
  .sc-vlist { overflow: auto; height: 100%; min-height: 0; contain: strict; outline: none; }
</style>
