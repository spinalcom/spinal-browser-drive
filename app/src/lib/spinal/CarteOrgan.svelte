<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Statut from '$lib/ui/Statut.svelte';
  import Button from '$lib/ui/Button.svelte';
  import Icon from '$lib/ui/Icon.svelte';
  import { dateLisible, dateExacte } from '$lib/ui/format';
  import Server from '@lucide/svelte/icons/server';
  import type { Etat } from '$lib/ui/types';
  /**
   * État d'un organ (02-ux §6) : on distingue la demande écrite par l'interface et l'état rapporté par l'organ.
   * Au-delà du délai, l'état affiché devient « Sans réponse de l'organ ».
   */
  let { nom, version, enLigne, dernierSignal, demande, rapporte, delaiMs = 60_000, maintenant = Date.now(), commandes = [] }: {
    nom: string; version?: string; enLigne: boolean; dernierSignal?: number;
    demande?: { libelle: string; date: number }; rapporte?: { etat: Etat; libelle?: string; date: number };
    delaiMs?: number; maintenant?: number; commandes?: { label: string; executer: () => void; desactive?: boolean; raison?: string }[];
  } = $props();
  const silencieux = $derived(!!demande && (!rapporte || rapporte.date < demande.date) && maintenant - demande.date > delaiMs);
</script>

<div class="organ">
  <div class="tete">
    <span class="ic"><Icon icon={Server} /></span>
    <div class="t"><div class="sc-label">{nom}</div>{#if version}<div class="sc-caption">version {version}</div>{/if}</div>
    <span class="ligne" class:off={!enLigne}><i></i>{enLigne ? 'En ligne' : 'Hors ligne'}</span>
  </div>
  <dl>
    {#if dernierSignal}<div><dt>Dernier signal</dt><dd title={dateExacte(dernierSignal)}>{dateLisible(dernierSignal, maintenant)}</dd></div>{/if}
    {#if demande}<div><dt>Demande envoyée</dt><dd>{demande.libelle} · <span title={dateExacte(demande.date)}>{dateLisible(demande.date, maintenant)}</span></dd></div>{/if}
    <div><dt>État rapporté</dt><dd>
      {#if silencieux}<Statut etat="sans-reponse" detail="Aucune réponse depuis {Math.round((maintenant - (demande?.date ?? 0)) / 1000)} s" />
      {:else if rapporte}<Statut etat={rapporte.etat} label={rapporte.libelle} /> <span class="sc-caption" title={dateExacte(rapporte.date)}>{dateLisible(rapporte.date, maintenant)}</span>
      {:else}<span class="sc-muted">—</span>{/if}
    </dd></div>
  </dl>
  {#if commandes.length}<div class="acts">{#each commandes as c}<Button size="sm" disabled={c.desactive} raison={c.raison} onclick={c.executer}>{c.label}</Button>{/each}</div>{/if}
</div>

<style>
  .organ { border: 1px solid var(--sc-line); border-radius: var(--sc-r-card); background: var(--sc-sheet); padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
  .tete { display: flex; align-items: center; gap: 10px; }
  .ic { width: 32px; height: 32px; border-radius: 8px; display: grid; place-items: center; background: var(--sc-ground-2); color: var(--sc-text-2); }
  .t { flex: 1; }
  .ligne { display: inline-flex; align-items: center; gap: 6px; font: 500 12px/1 var(--sc-sans); color: var(--sc-ok); }
  .ligne i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
  .ligne.off { color: var(--sc-danger); }
  dl { margin: 0; display: flex; flex-direction: column; gap: 6px; }
  dl > div { display: grid; grid-template-columns: 130px 1fr; gap: 10px; align-items: center; min-height: 24px; }
  dt { color: var(--sc-text-2); font-size: 12.5px; }
  dd { margin: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .acts { display: flex; gap: 6px; }
</style>
