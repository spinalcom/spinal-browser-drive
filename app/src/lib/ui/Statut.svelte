<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import type { Etat, Ton, IconeComposant } from './types';
  import Icon from './Icon.svelte';
  import Spinner from './Spinner.svelte';
  import Clock from '@lucide/svelte/icons/clock';
  import Check from '@lucide/svelte/icons/check';
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
  import CircleX from '@lucide/svelte/icons/circle-x';
  import Ban from '@lucide/svelte/icons/ban';
  import CircleStop from '@lucide/svelte/icons/circle-stop';
  import Unplug from '@lucide/svelte/icons/unplug';
  import Send from '@lucide/svelte/icons/send';

  // 02-ux §6 : mêmes libellés, icônes et couleurs partout.
  const ETATS: Record<Etat, { label: string; tone: Ton; icon?: IconeComposant }> = {
    attente: { label: 'En attente', tone: 'neutre', icon: Clock },
    cours: { label: 'En cours', tone: 'info' },
    termine: { label: 'Terminé', tone: 'ok', icon: Check },
    reserves: { label: 'Terminé avec réserves', tone: 'warn', icon: TriangleAlert },
    erreur: { label: 'Erreur', tone: 'danger', icon: CircleX },
    annule: { label: 'Annulé', tone: 'neutre', icon: Ban },
    arrete: { label: 'Arrêté', tone: 'neutre', icon: CircleStop },
    'sans-reponse': { label: 'Sans réponse de l’organ', tone: 'warn', icon: Unplug },
    envoyee: { label: 'Demande envoyée', tone: 'info', icon: Send },
  };

  let { etat, label, detail, compact = false }: { etat: Etat; label?: string; detail?: string; compact?: boolean } = $props();
  const d = $derived(ETATS[etat]);
</script>

<span class="sc-statut {d.tone}" class:compact title={detail}>
  {#if etat === 'cours'}<Spinner size={12} label={label ?? d.label} />{:else if d.icon}<Icon icon={d.icon} size={13} />{/if}
  <span class:sc-visually-hidden={compact}>{label ?? d.label}</span>
</span>

<style>
  .sc-statut { display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: var(--sc-r-pill);
    font: 500 12px/1 var(--sc-sans); white-space: nowrap; background: var(--sc-ground-2); color: var(--sc-text-2); }
  .compact { padding: 0; width: 22px; justify-content: center; }
  .ok { background: var(--sc-ok-soft); color: var(--sc-ok); }
  .warn { background: var(--sc-warn-soft); color: var(--sc-warn); }
  .danger { background: var(--sc-danger-soft); color: var(--sc-danger); }
  .info { background: var(--sc-info-soft); color: var(--sc-info); }
</style>
