<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import IconButton from './IconButton.svelte';
  import Copy from '@lucide/svelte/icons/copy';
  import Check from '@lucide/svelte/icons/check';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  export interface Propriete { label: string; valeur: string | number | boolean | null | undefined; unite?: string; mono?: boolean }
  /** Libellé / valeur ; valeur absente « — » ; 0 et false affichés tels quels ; copie au survol ; groupes repliables. */
  let { groupes }: { groupes: { titre?: string; proprietes: Propriete[]; replie?: boolean }[] } = $props();
  let copiee = $state<string | null>(null);
  function texte(p: Propriete) {
    if (p.valeur === null || p.valeur === undefined || p.valeur === '') return null;
    if (typeof p.valeur === 'boolean') return p.valeur ? 'Vrai' : 'Faux';
    return typeof p.valeur === 'number' ? p.valeur.toLocaleString('fr-FR') : p.valeur;
  }
  async function copier(cle: string, v: string) { await navigator.clipboard?.writeText(v); copiee = cle; setTimeout(() => (copiee = null), 1200); }
</script>

<div class="sc-props">
  {#each groupes as g, gi}
    <details open={!g.replie}>
      {#if g.titre}<summary class="sc-group"><ChevronRight size={12} />{g.titre}<span class="n">{g.proprietes.length}</span></summary>{/if}
      <dl>
        {#each g.proprietes as p, pi}
          {@const v = texte(p)}
          {@const cle = gi + '-' + pi}
          <div class="row">
            <dt>{p.label}</dt>
            <dd>
              <span class="v" class:mono={p.mono || typeof p.valeur === 'number'} class:absent={v === null}>{#if v === null}—{:else}{v}{#if p.unite}<span class="u">&nbsp;{p.unite}</span>{/if}{/if}</span>
              {#if v !== null}<span class="cp"><IconButton icon={copiee === cle ? Check : Copy} label="Copier « {p.label} »" size="sm" onclick={() => copier(cle, String(v))} /></span>{/if}
            </dd>
          </div>
        {/each}
      </dl>
    </details>
  {/each}
</div>

<style>
  details + details { margin-top: 8px; }
  summary { display: flex; align-items: center; gap: 4px; padding: 8px 16px 4px; cursor: pointer; list-style: none; }
  details[open] > summary :global(svg) { transform: rotate(90deg); }
  .n { margin-left: 4px; font-family: var(--sc-mono); letter-spacing: 0; }
  dl { margin: 0; }
  .row { display: grid; grid-template-columns: minmax(110px, 40%) 1fr; align-items: center; gap: 12px; min-height: 32px; padding: 0 8px 0 16px; }
  .row:hover { background: var(--sc-sheet-hover); }
  dt { color: var(--sc-text-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  dd { margin: 0; min-width: 0; display: flex; align-items: center; gap: 6px; }
  .v { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .mono { font: 400 12.5px/18px var(--sc-mono); font-variant-numeric: tabular-nums; }
  .absent { color: var(--sc-muted); }
  .u { color: var(--sc-muted); font-family: var(--sc-sans); font-size: 12px; }
  .cp { opacity: 0; transition: opacity var(--sc-in); }
  .row:hover .cp, .cp:focus-within { opacity: 1; }
</style>
