<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Check from '@lucide/svelte/icons/check';
  import X from '@lucide/svelte/icons/x';
  /** Étapes d'un assistant. On peut revenir aux étapes faites. */
  let { etapes, courante = $bindable(0) }:
    { etapes: { titre: string; resume?: string; etat?: 'erreur' }[]; courante?: number } = $props();
</script>

<ol class="sc-etapes" aria-label="Étapes">
  {#each etapes as e, i}
    {@const fait = i < courante}
    <li class:fait class:now={i === courante} class:erreur={e.etat === 'erreur'}>
      <button disabled={!fait} onclick={() => (courante = i)} aria-current={i === courante ? 'step' : undefined}>
        <span class="n">{#if e.etat === 'erreur'}<X size={14} strokeWidth={2.5} />{:else if fait}<Check size={14} strokeWidth={2.5} />{:else}{i + 1}{/if}</span>
        <span class="t"><b>{e.titre}</b>{#if e.resume}<span class="sc-caption">{e.resume}</span>{/if}</span>
      </button>
    </li>
  {/each}
</ol>

<style>
  .sc-etapes { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
  button { width: 100%; display: grid; grid-template-columns: 28px 1fr; gap: 12px; align-items: start; padding: 10px 8px; border: 0; border-radius: 10px; background: none; text-align: left; }
  button:disabled { cursor: default; color: inherit; }
  .fait button:hover { background: var(--sc-ground-2); }
  .n { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font: 600 12px/1 var(--sc-mono); border: 1.5px solid var(--sc-line-field); color: var(--sc-muted); background: var(--sc-sheet); }
  .t { display: flex; flex-direction: column; gap: 1px; padding-top: 4px; }
  b { font-weight: 500; }
  .fait .n { background: var(--sc-ok); border-color: var(--sc-ok); color: var(--sc-sheet); }
  .now button { background: var(--sc-sheet); box-shadow: var(--sc-shadow-1); }
  .now .n { background: var(--sc-ink); border-color: var(--sc-ink); color: var(--sc-on-ink); box-shadow: 0 0 0 4px var(--sc-accent-soft); }
  .now b { font-weight: 600; }
  .erreur .n { background: var(--sc-danger); border-color: var(--sc-danger); color: var(--sc-on-danger); }
</style>
