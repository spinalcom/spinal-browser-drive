<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Dialog from './Dialog.svelte';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import RadioGroup from './RadioGroup.svelte';
  import type { Option } from './types';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import Unlink from '@lucide/svelte/icons/unlink';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';
  import Ban from '@lucide/svelte/icons/ban';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';

  /**
   * Confirmation de portée (02-ux §5). Le bouton reprend le verbe et le nombre (« Supprimer 12 nœuds »), jamais « OK ».
   * genre « retrait » = lien retiré (neutre) ; « suppression » = objet détruit (rouge).
   */
  let {
    open = $bindable(false), genre, verbe, nom, nomPluriel, elements, inchange, exclus = [], perimetres, perimetre = $bindable(''),
    irreversible = false, onconfirm,
  }: {
    open?: boolean; genre: 'retrait' | 'suppression'; verbe: string; nom: string; nomPluriel: string;
    elements: string[]; inchange?: string; exclus?: { nom: string; raison: string }[];
    perimetres?: Option[]; perimetre?: string; irreversible?: boolean; onconfirm: () => void;
  } = $props();
  const n = $derived(elements.length);
  const libelle = $derived(`${verbe} ${n === 1 ? '1 ' + nom : n + ' ' + nomPluriel}`);
</script>

<Dialog bind:open titre="{libelle} ?" icone={genre === 'suppression' ? Trash2 : Unlink} ton={genre === 'suppression' ? 'danger' : 'neutre'}
  description={irreversible ? 'Cette action ne peut pas être annulée.' : 'Vous pourrez annuler pendant 8 secondes.'}>
  <div class="cp">
    <details class="liste" open={n <= 5}>
      <summary><ChevronRight size={14} /><b>{n}</b>&nbsp;{n === 1 ? nom : nomPluriel} concerné{n > 1 ? 's' : ''}</summary>
      <ul>{#each elements as e}<li>{e}</li>{/each}</ul>
    </details>
    {#if inchange}<div class="encadre ok"><Icon icon={ShieldCheck} /><div><b>Ce qui ne change pas</b><p>{inchange}</p></div></div>{/if}
    {#if exclus.length}
      <div class="encadre warn"><Icon icon={Ban} /><div><b>{exclus.length} exclu{exclus.length > 1 ? 's' : ''}</b>
        <ul>{#each exclus as x}<li>{x.nom} — <span class="sc-muted">{x.raison}</span></li>{/each}</ul></div></div>
    {/if}
    {#if perimetres?.length}<div class="per"><div class="sc-group">Périmètre</div><RadioGroup bind:value={perimetre} options={perimetres} label="Périmètre" /></div>{/if}
  </div>
  {#snippet pied()}
    <Button variant="ghost" onclick={() => (open = false)}>Annuler</Button>
    <Button variant={genre === 'suppression' ? 'danger' : 'ink'} disabled={n === 0} onclick={() => { onconfirm(); open = false; }}>{libelle}</Button>
  {/snippet}
</Dialog>

<style>
  .cp { display: flex; flex-direction: column; gap: 12px; }
  summary { display: flex; align-items: center; gap: 4px; cursor: pointer; list-style: none; }
  details[open] summary :global(svg) { transform: rotate(90deg); }
  ul { margin: 6px 0 0; padding-left: 22px; max-height: 160px; overflow: auto; color: var(--sc-text-2); }
  li { line-height: 22px; }
  .encadre { display: flex; gap: 10px; padding: 12px 14px; border-radius: 10px; }
  .encadre p { color: var(--sc-text-2); margin-top: 2px; }
  .encadre ul { padding-left: 16px; }
  .ok { background: var(--sc-ok-soft); } .ok > :global(.sc-icon) { color: var(--sc-ok); }
  .warn { background: var(--sc-warn-soft); } .warn > :global(.sc-icon) { color: var(--sc-warn); }
  .per { display: flex; flex-direction: column; gap: 8px; }
</style>
