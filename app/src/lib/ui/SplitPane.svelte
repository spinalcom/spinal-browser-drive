<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  /** Deux panneaux, poignée de 6 px (souris et clavier ← →), bornes, mémorisation par clé (localStorage, tolérant). */
  let { cle, initial = 320, min = 200, max = 640, cote = 'gauche', premier, second }:
    { cle: string; initial?: number; min?: number; max?: number; cote?: 'gauche' | 'droite'; premier: Snippet; second: Snippet } = $props();
  function lire() { try { const v = Number(localStorage.getItem('sc-split-' + cle)); return v >= min && v <= max ? v : initial; } catch { return initial; } }
  let taille = $state(lire());
  function borne(v: number) { taille = Math.max(min, Math.min(max, v)); try { localStorage.setItem('sc-split-' + cle, String(taille)); } catch {} }
  function tirer(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement; el.setPointerCapture(e.pointerId);
    const x0 = e.clientX, t0 = taille;
    const bouger = (m: PointerEvent) => borne(t0 + (cote === 'gauche' ? m.clientX - x0 : x0 - m.clientX));
    const finir = () => { el.removeEventListener('pointermove', bouger); el.removeEventListener('pointerup', finir); };
    el.addEventListener('pointermove', bouger); el.addEventListener('pointerup', finir);
  }
  function clavier(e: KeyboardEvent) {
    const s = cote === 'gauche' ? 1 : -1;
    if (e.key === 'ArrowLeft') { e.preventDefault(); borne(taille - 16 * s); }
    if (e.key === 'ArrowRight') { e.preventDefault(); borne(taille + 16 * s); }
  }
</script>

<div class="sc-split" style:grid-template-columns={cote === 'gauche' ? `${taille}px 6px minmax(0,1fr)` : `minmax(0,1fr) 6px ${taille}px`}>
  <div class="p">{@render premier()}</div>
  <!-- Motif APG « Window Splitter » : un separator focusable avec valeur est interactif. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
  <div class="poignee" role="separator" tabindex="0" aria-orientation="vertical" aria-valuenow={taille} aria-valuemin={min} aria-valuemax={max}
    aria-label="Redimensionner le panneau" onpointerdown={tirer} onkeydown={clavier}></div>
  <div class="p">{@render second()}</div>
</div>

<style>
  .sc-split { display: grid; height: 100%; min-height: 0; }
  .p { min-width: 0; min-height: 0; overflow: hidden; display: flex; flex-direction: column; }
  .poignee { cursor: col-resize; position: relative; touch-action: none; }
  .poignee::after { content: ''; position: absolute; top: 0; bottom: 0; left: 2px; width: 2px; background: transparent; transition: background-color var(--sc-in); }
  .poignee:hover::after, .poignee:focus-visible::after { background: var(--sc-focus); }
</style>
