<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Statut from './Statut.svelte';
  import Progress from './Progress.svelte';
  import Button from './Button.svelte';
  import IconButton from './IconButton.svelte';
  import Icon from './Icon.svelte';
  import EmptyState from './EmptyState.svelte';
  import type { Tache } from './types';
  import X from '@lucide/svelte/icons/x';
  import RefreshCw from '@lucide/svelte/icons/refresh-cw';
  import Activity from '@lucide/svelte/icons/activity';
  import Check from '@lucide/svelte/icons/check';
  import Ban from '@lucide/svelte/icons/ban';
  import CircleX from '@lucide/svelte/icons/circle-x';

  let { taches, oneffacer }: { taches: Tache[]; oneffacer?: () => void } = $props();
  const enCours = $derived(taches.filter((t) => ['attente', 'cours', 'envoyee'].includes(t.etat)));
  const finies = $derived(taches.filter((t) => !['attente', 'cours', 'envoyee'].includes(t.etat)));
</script>

{#snippet ligne(t: Tache)}
  <li class="t">
    <div class="tete">
      <span class="ti"><Icon icon={t.icone ?? Activity} /></span>
      <div class="info">
        <div class="nom">{t.titre}</div>
        {#if t.contexte}<div class="sc-caption">{t.contexte}</div>{/if}
      </div>
      <Statut etat={t.etat} compact={t.etat === 'termine'} />
      {#if t.annuler && enCours.includes(t)}<IconButton icon={X} label="Annuler « {t.titre} »" size="sm" onclick={t.annuler} />{/if}
    </div>
    {#if t.etapes}
      <ol class="etapes" aria-label="Étapes">
        {#each t.etapes as e}<li class={e.etat} title="{e.nom} : {e.etat}"><i></i><span>{e.nom}</span></li>{/each}
      </ol>
    {:else if t.progression !== undefined && enCours.includes(t)}
      <Progress value={t.progression} label="Progression de {t.titre}" tone="info" />
    {/if}
    {#if t.detail || t.duree}<div class="sous sc-caption"><span>{t.detail ?? ''}</span><span class="sc-value">{t.duree ?? ''}</span></div>{/if}
    {#if t.resultats}
      <ul class="res">
        <li class="r-ok"><Icon icon={Check} size={13} />{t.resultats.ok} réussi{t.resultats.ok > 1 ? 's' : ''}</li>
        {#each t.resultats.ignores ?? [] as x}<li class="r-ig"><Icon icon={Ban} size={13} />{x.nom} — {x.raison}</li>{/each}
        {#each t.resultats.erreurs ?? [] as x}<li class="r-er"><Icon icon={CircleX} size={13} />{x.nom} — {x.raison}</li>{/each}
      </ul>
    {/if}
    {#if t.relancer && (t.etat === 'erreur' || t.etat === 'reserves')}
      <div class="acts"><Button size="sm" icon={RefreshCw} onclick={t.relancer}>{t.etat === 'reserves' ? 'Relancer les échecs' : 'Réessayer'}</Button></div>
    {/if}
  </li>
{/snippet}

<section class="sc-tray" aria-label="Tâches">
  <header><Icon icon={Activity} /><span class="sc-subtitle">Tâches</span>
    {#if finies.length && oneffacer}<Button size="sm" variant="ghost" onclick={oneffacer}>Effacer les terminées</Button>{/if}</header>
  {#if !taches.length}
    <EmptyState icone={Activity} titre="Aucune tâche" texte="Les dépôts, conversions et opérations par lot apparaîtront ici." compact />
  {:else}
    <div class="corps">
      {#if enCours.length}<div class="sc-group gt">En cours · {enCours.length}</div><ul class="liste">{#each enCours as t (t.id)}{@render ligne(t)}{/each}</ul>{/if}
      {#if finies.length}<div class="sc-group gt">Terminées</div><ul class="liste">{#each finies as t (t.id)}{@render ligne(t)}{/each}</ul>{/if}
    </div>
  {/if}
</section>

<style>
  .sc-tray { width: 420px; max-width: calc(100vw - 24px); background: var(--sc-sheet); border-radius: var(--sc-r-sheet); box-shadow: var(--sc-shadow-3); overflow: hidden; display: flex; flex-direction: column; max-height: calc(100vh - 80px); }
  header { display: flex; align-items: center; gap: 8px; padding: 12px 12px 10px 16px; border-bottom: 1px solid var(--sc-line); }
  header .sc-subtitle { flex: 1; }
  .corps { overflow: auto; padding: 4px 8px 8px; }
  .gt { padding: 10px 8px 4px; }
  .liste { list-style: none; margin: 0; padding: 0; }
  .t { padding: 10px 8px; border-radius: 10px; display: flex; flex-direction: column; gap: 8px; }
  .t:hover { background: var(--sc-sheet-hover); }
  .tete { display: flex; align-items: center; gap: 10px; }
  .ti { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; background: var(--sc-ground-2); color: var(--sc-text-2); flex: none; }
  .info { flex: 1; min-width: 0; }
  .nom { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .etapes { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 3px; list-style: none; margin: 0 0 0 40px; padding: 0; }
  .etapes li { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--sc-muted); min-width: 0; }
  .etapes span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .etapes i { height: 4px; border-radius: 3px; background: var(--sc-ground-2); }
  .etapes .fait i { background: var(--sc-ok); }
  .etapes .cours i { background: var(--sc-info); } .etapes .cours { color: var(--sc-info); font-weight: 500; }
  .etapes .erreur i { background: var(--sc-danger); } .etapes .erreur { color: var(--sc-danger); }
  .sous { display: flex; justify-content: space-between; gap: 8px; margin-left: 40px; }
  .t > :global(.sc-progress) { margin-left: 40px; width: calc(100% - 40px); }
  .res { list-style: none; margin: 0 0 0 40px; padding: 8px 10px; border-radius: 8px; background: var(--sc-ground); display: flex; flex-direction: column; gap: 3px; font-size: 12px; }
  .res li { display: flex; gap: 6px; align-items: center; }
  .r-ok { color: var(--sc-ok); } .r-ig { color: var(--sc-warn); } .r-er { color: var(--sc-danger); }
  .acts { margin-left: 40px; }
</style>
