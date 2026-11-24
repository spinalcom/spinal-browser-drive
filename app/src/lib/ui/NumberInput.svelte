<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Taille } from './types';
  /** La saisie brute reste affichée même invalide ; value ne change que si elle est valide. */
  let { value = $bindable<number | null>(null), unite, min, max, step = 1, size = 'md', id, disabled = false, label }:
    { value?: number | null; unite?: string; min?: number; max?: number; step?: number; size?: Taille; id?: string; disabled?: boolean; label?: string } = $props();
  let brut = $state(value === null ? '' : String(value).replace('.', ','));
  let erreur = $state<string | null>(null);
  $effect(() => {
    const v = value;
    const courant = brut.trim() === '' ? null : Number(brut.replace(',', '.').replace(/\s/g, ''));
    if (courant !== v) brut = v === null ? '' : String(v).replace('.', ',');
  });
  function saisir(e: Event) {
    brut = (e.currentTarget as HTMLInputElement).value;
    const t = brut.trim().replace(',', '.').replace(/\s/g, '');
    if (t === '') { erreur = null; value = null; return; }
    const n = Number(t);
    if (!Number.isFinite(n)) { erreur = 'Nombre attendu'; return; }
    if (min !== undefined && n < min) { erreur = `Minimum ${min}`; return; }
    if (max !== undefined && n > max) { erreur = `Maximum ${max}`; return; }
    erreur = null; value = n;
  }
  function pas(sens: 1 | -1) {
    const n = (value ?? 0) + sens * step;
    if ((min !== undefined && n < min) || (max !== undefined && n > max)) return;
    value = Math.round(n * 1e6) / 1e6; erreur = null;
  }
</script>

<div class="sc-control {size}" class:invalide={!!erreur} class:desactive={disabled} title={erreur ?? undefined}>
  <input {id} inputmode="decimal" value={brut} oninput={saisir} {disabled} aria-label={label} aria-invalid={!!erreur || undefined}
    onkeydown={(e) => { if (e.key === 'ArrowUp') { e.preventDefault(); pas(1); } if (e.key === 'ArrowDown') { e.preventDefault(); pas(-1); } }} />
  {#if unite}<span class="affixe">{unite}</span>{/if}
</div>
{#if erreur}<span class="sc-visually-hidden" role="alert">{erreur}</span>{/if}

<style>
  input { font-family: var(--sc-mono); font-variant-numeric: tabular-nums; font-size: 12.5px; text-align: right; }
</style>
