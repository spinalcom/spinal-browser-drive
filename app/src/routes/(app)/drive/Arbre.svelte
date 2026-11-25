<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<!-- Arborescence des dossiers (DR-02) : dépliage à la demande, dossier courant en surbrillance, dépôt de fichiers sur un dossier (DR-08). -->
<script lang="ts">
  import Tree from '$lib/ui/Tree.svelte';
  import Icon from '$lib/ui/Icon.svelte';
  import type { NoeudArbre } from '$lib/ui/arbre';
  import { SvelteSet } from 'svelte/reactivity';
  import { chargerPtr } from '$lib/hub/session.svelte';
  import type { Modele } from '$lib/hub/connecteur';
  import Folder from '@lucide/svelte/icons/folder';
  import FolderOpen from '@lucide/svelte/icons/folder-open';
  import FolderSync from '@lucide/svelte/icons/folder-sync';
  import House from '@lucide/svelte/icons/house';
  import Users from '@lucide/svelte/icons/users';

  let { racine, utilisateur, cheminCourant, onouvrir, ondepot }: {
    racine: Modele; utilisateur: string; cheminCourant: string[];
    onouvrir: (noms: string[]) => void; ondepot: (noms: string[], fichiers: File[]) => void;
  } = $props();

  // Chaque nœud de l'arbre porte le chemin de noms depuis la racine (clé de navigation de l'URL).
  interface N extends NoeudArbre { noms: string[]; sync: boolean; modele?: Modele }
  const dossiersDe = (d: Modele, noms: string[]): N[] => {
    const out: N[] = [];
    for (let i = 0; i < d.length; i++) {
      const f = d[i];
      const t = f._info?.model_type?.get();
      if (t !== 'Directory' && t !== 'Synchronized Directory') continue;
      const nom = f.name.get();
      out.push({ id: noms.concat(nom).join('\u0000'), label: nom, noms: noms.concat(nom), aEnfants: true, sync: t === 'Synchronized Directory', modele: f });
    }
    return out.sort((a, b) => a.label.localeCompare(b.label, 'fr', { numeric: true }));
  };
  let racines = $state<N[]>([]);
  const ouverts = new SvelteSet<string>(['']);
  $effect(() => {
    racines = [{ id: '', label: utilisateur, noms: [], enfants: dossiersDe(racine, []), sync: false }];
  });

  async function charger(n: NoeudArbre) {
    const nn = n as N;
    if (!nn.modele) return;
    const d = await chargerPtr(nn.modele);
    nn.enfants = dossiersDe(d, nn.noms);
    if (!nn.enfants.length) nn.aEnfants = false;
    racines = [...racines];
  }

  // Ouvre automatiquement les ancêtres du dossier courant.
  $effect(() => {
    const c = cheminCourant;
    (async () => {
      let liste: N[] = racines;
      for (let i = 0; i < c.length; i++) {
        const id = c.slice(0, i + 1).join('\u0000');
        const parentId = c.slice(0, i).join('\u0000');
        ouverts.add(parentId);
        const n = liste.find((x) => x.id === parentId) ?? findDeep(racines, parentId);
        if (n && !n.enfants) await charger(n);
        liste = (findDeep(racines, parentId)?.enfants as N[]) ?? [];
        if (!liste.some((x) => x.id === id)) break;
      }
    })();
  });
  function findDeep(l: N[], id: string): N | undefined {
    for (const n of l) { if (n.id === id) return n; const r = n.enfants && findDeep(n.enfants as N[], id); if (r) return r; }
  }
  const courant = $derived(cheminCourant.join('\u0000'));
  let selection = $state<string[]>([]);
  $effect(() => { selection = [courant]; });
  let survol = $state<string | null>(null);
</script>

<div class="arbre">
  <Tree {racines} bind:selection {charger} {ouverts} label="Dossiers" hauteurLigne={32}
    onactivate={(n) => onouvrir((n as N).noms)}>
    {#snippet renderRow(l)}
      {@const n = l.noeud as N}
      <!-- Ligne d'arbre : le clavier est géré par la racine role=tree (Entrée ouvre). Zone de dépôt de fichiers. -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span class="ligne" class:survol={survol === n.id}
        ondragover={(e) => { if (e.dataTransfer?.types.includes('Files')) { e.preventDefault(); survol = n.id; } }}
        ondragleave={() => (survol = null)}
        ondrop={(e) => { e.preventDefault(); survol = null; const f = Array.from(e.dataTransfer?.files ?? []); if (f.length) ondepot(n.noms, f); }}
        onclick={() => onouvrir(n.noms)} onkeydown={() => {}}>
        <Icon icon={n.id === '' ? House : n.sync ? FolderSync : n.id === courant ? FolderOpen : Folder} size={16} />
        <span class="nom">{n.label}</span>
      </span>
    {/snippet}
  </Tree>
  <div class="partages"><Icon icon={Users} size={16} /><span>Partagés avec moi</span><span class="sc-caption">dans « shared_with_me »</span></div>
</div>

<style>
  .arbre { display: flex; flex-direction: column; height: 100%; min-height: 0; padding: 8px 0; }
  .arbre > :global(.sc-tree) { flex: 1; }
  .ligne { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; height: 100%; border-radius: 6px; }
  .ligne.survol { outline: 2px solid var(--sc-accent); outline-offset: -2px; background: var(--sc-accent-soft); }
  .nom { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .partages { display: none; }
</style>
