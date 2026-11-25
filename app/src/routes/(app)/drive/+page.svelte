<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<!-- Drive (DR-02 à DR-12) : arbre, contenu du dossier, détails. Le chemin est dans l'URL (?d=Projets/Tour A). -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { onDestroy } from 'svelte';
  import { session, chargerPtr } from '$lib/hub/session.svelte';
  import { EtatDrive } from '$lib/etat/drive.svelte';
  import { ajouterTache, majTache, plateau } from '$lib/etat/taches.svelte';
  import { palette } from '$lib/etat/palette.svelte';
  import { notifier } from '$lib/ui/toasts.svelte';
  import { dateLisible, dateExacte, taille as tailleLisible } from '$lib/ui/format';
  import { creerDossier, renommer, supprimer, deplacer, deposer, validerNom, journaliser, actionLisible, LIBELLE_GENRE, type Ligne } from '$lib/domaines/drive/fichiers';
  import { urlStudio } from '$lib/domaines/drive/studio';
  import type { Action, Colonne } from '$lib/ui/types';
  import SplitPane from '$lib/ui/SplitPane.svelte';
  import DataTable from '$lib/ui/DataTable.svelte';
  import Breadcrumb from '$lib/ui/Breadcrumb.svelte';
  import TextInput from '$lib/ui/TextInput.svelte';
  import Button from '$lib/ui/Button.svelte';
  import IconButton from '$lib/ui/IconButton.svelte';
  import Menu from '$lib/ui/Menu.svelte';
  import ContextMenu from '$lib/ui/ContextMenu.svelte';
  import SelectionBar from '$lib/ui/SelectionBar.svelte';
  import ConfirmerPortee from '$lib/ui/ConfirmerPortee.svelte';
  import Dialog from '$lib/ui/Dialog.svelte';
  import Field from '$lib/ui/Field.svelte';
  import EmptyState from '$lib/ui/EmptyState.svelte';
  import ErrorState from '$lib/ui/ErrorState.svelte';
  import Skeleton from '$lib/ui/Skeleton.svelte';
  import Statut from '$lib/ui/Statut.svelte';
  import Progress from '$lib/ui/Progress.svelte';
  import Icon from '$lib/ui/Icon.svelte';
  import TypeIcone from '$lib/spinal/TypeIcone.svelte';
  import Arbre from './Arbre.svelte';
  import Details from './Details.svelte';
  import Upload from '@lucide/svelte/icons/upload';
  import FolderPlus from '@lucide/svelte/icons/folder-plus';
  import Plus from '@lucide/svelte/icons/plus';
  import Download from '@lucide/svelte/icons/download';
  import Pencil from '@lucide/svelte/icons/pencil';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import Move from '@lucide/svelte/icons/move';
  import Search from '@lucide/svelte/icons/search';
  import PanelRight from '@lucide/svelte/icons/panel-right';
  import FolderOpen from '@lucide/svelte/icons/folder-open';
  import Ellipsis from '@lucide/svelte/icons/ellipsis';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Boxes from '@lucide/svelte/icons/boxes';
  import Folder from '@lucide/svelte/icons/folder';
  import CornerLeftUp from '@lucide/svelte/icons/corner-left-up';

  const drive = new EtatDrive();
  onDestroy(() => drive.debrancher());

  const noms = $derived((page.url.searchParams.get('d') ?? '').split('/').filter(Boolean));
  $effect(() => { drive.ouvrirChemin(noms); });
  const aller = (n: string[]) => goto(`${base}/drive${n.length ? `?d=${n.map(encodeURIComponent).join('/')}` : ''}`, { keepFocus: true });

  let filtre = $state('');
  let champFiltre = $state<HTMLInputElement | null>(null);
  let detailsOuverts = $state((() => { try { return localStorage.getItem('sc-drive-details') !== '0'; } catch { return true; } })());
  $effect(() => { try { localStorage.setItem('sc-drive-details', detailsOuverts ? '1' : '0'); } catch {} });
  let survolDepot = $state(false);
  let tri = $state<{ id: string; sens: 'asc' | 'desc' } | null>({ id: 'nom', sens: 'asc' });

  // Dossiers d'abord, puis tri de la colonne.
  const visibles = $derived.by(() => {
    const f = filtre.trim().toLowerCase();
    const l = f ? drive.lignes.filter((x) => x.nom.toLowerCase().includes(f)) : drive.lignes;
    return [...l].sort((a, b) => Number(!a.genre.startsWith('dossier')) - Number(!b.genre.startsWith('dossier')));
  });
  const choisies = $derived(drive.lignes.filter((l) => drive.selection.includes(l.id)));
  const seule = $derived(choisies.length === 1 ? choisies[0] : null);
  const cheminTexte = $derived(drive.chemin.map((s) => s.nom).join(' › '));

  // ---------- opérations ----------
  const C = () => drive.C!;
  const qui = () => session.identite!.utilisateur;

  function ouvrir(l: Ligne) {
    if (l.genre === 'dossier' || l.genre === 'dossier-sync') return aller([...noms, l.nom]);
    if (l.genre === 'jumeau') return ouvrirStudio(l);
    if (l.modelType === 'Path') return telecharger(l);
    detailsOuverts = true;
  }
  async function ouvrirStudio(l: Ligne) {
    window.open(await urlStudio(qui(), noms, l.nom), '_blank', 'noopener');
  }
  function telecharger(l: Ligne) {
    if (l.transfert !== null) return notifier(`« ${l.nom} » est encore en transfert`, 'info');
    if (!l.cible) return notifier('Fichier sans contenu sur le hub', 'erreur');
    const a = document.createElement('a');
    a.href = `/sceen/_?u=${l.cible}`;
    a.download = l.nom;
    a.click();
    const f = drive.fichier(l.id);
    if (f) journaliser(C(), f, qui(), 'download');
  }

  // Nouveau dossier (DR-05)
  let nouveau = $state<{ open: boolean; nom: string }>({ open: false, nom: 'Nouveau dossier' });
  const erreurNom = $derived(validerNom(nouveau.nom));
  function creer() {
    try {
      const n = creerDossier(C(), drive.dossier, nouveau.nom);
      notifier(n === nouveau.nom.trim() ? `Dossier « ${n} » créé` : `Dossier créé sous le nom « ${n} » (nom déjà pris)`);
      nouveau.open = false;
    } catch (e) { notifier((e as Error).message, 'erreur'); }
  }

  // Renommer en ligne (DR-07)
  let edition = $state<{ id: number; nom: string } | null>(null);
  function commencerRenommage(l: Ligne) { edition = { id: l.id, nom: l.nom }; }
  function validerRenommage() {
    if (!edition) return;
    const f = drive.fichier(edition.id);
    const e = edition;
    edition = null;
    if (!f) return;
    try {
      const ancien = renommer(drive.dossier, f, e.nom);
      if (ancien === null) return;
      journaliser(C(), f, qui(), 'rename');
      notifier(`« ${ancien} » renommé en « ${e.nom.trim()} »`, 'succes', { label: 'Annuler', executer: () => { try { renommer(drive.dossier, f, ancien); } catch (er) { notifier((er as Error).message, 'erreur'); } } });
    } catch (er) { notifier((er as Error).message, 'erreur'); }
  }

  // Supprimer (DR-09)
  let confirmer = $state(false);
  function demanderSuppression() { if (choisies.length) confirmer = true; }
  const exclus = $derived(choisies.filter((l) => !l.supprimable).map((l) => ({ nom: l.nom, raison: l.genre === 'lien' ? 'lien HTTP : non supprimable ici' : 'dossier synchronisé : non supprimable ici' })));
  function supprimerSelection() {
    const fichiers = choisies.filter((l) => l.supprimable).map((l) => drive.fichier(l.id)).filter(Boolean);
    const r = supprimer(drive.dossier, fichiers);
    drive.selection = [];
    notifier(`${r.retires.length} élément${r.retires.length > 1 ? 's' : ''} retiré${r.retires.length > 1 ? 's' : ''} de « ${drive.chemin.at(-1)?.nom} »`);
  }

  // Déplacer vers… (DR-08)
  let deplacement = $state<{ open: boolean; cible: string[] }>({ open: false, cible: [] });
  let sousDossiers = $state<{ nom: string }[]>([]);
  $effect(() => {
    if (!deplacement.open) return;
    const c = deplacement.cible;
    (async () => {
      let d = drive.racine!;
      for (const n of c) { let f = null; for (let i = 0; i < d.length; i++) if (d[i].name.get() === n) f = d[i]; if (!f) return; d = await chargerPtr(f); }
      const out: { nom: string }[] = [];
      for (let i = 0; i < d.length; i++) if (d[i]._info?.model_type?.get() === 'Directory') out.push({ nom: d[i].name.get() });
      sousDossiers = out.sort((a, b) => a.nom.localeCompare(b.nom, 'fr', { numeric: true }));
    })();
  });
  async function deplacerVers(cibleNoms: string[]) {
    const fichiers = choisies.map((l) => drive.fichier(l.id)).filter(Boolean);
    let d = drive.racine!;
    const ids = [d._server_id];
    for (const n of cibleNoms) { let f = null; for (let i = 0; i < d.length; i++) if (d[i].name.get() === n) f = d[i]; if (!f) return notifier('Dossier cible introuvable', 'erreur'); d = await chargerPtr(f); ids.push(d._server_id); }
    const r = deplacer(drive.dossier, d, fichiers, ids);
    for (const f of fichiers) journaliser(C(), f, qui(), 'move');
    drive.selection = [];
    deplacement.open = false;
    if (r.ignores.length) {
      ajouterTache({ id: `dep-${Date.now()}`, titre: `Déplacement de ${fichiers.length} élément${fichiers.length > 1 ? 's' : ''}`, etat: r.deplaces.length ? 'reserves' : 'erreur', icone: Move,
        resultats: { ok: r.deplaces.length, ignores: r.ignores } });
      plateau.ouvert = true;
    } else notifier(`${r.deplaces.length} élément${r.deplaces.length > 1 ? 's' : ''} déplacé${r.deplaces.length > 1 ? 's' : ''} vers « ${cibleNoms.at(-1) ?? qui()} »`);
  }

  // Dépôt (DR-06) : un Path par fichier, progression lue sur le modèle (remaining / to_upload).
  async function deposerDans(cibleNoms: string[], fichiers: File[]) {
    let d = drive.racine!;
    for (const n of cibleNoms) { let f = null; for (let i = 0; i < d.length; i++) if (d[i].name.get() === n) f = d[i]; if (!f) return; d = await chargerPtr(f); }
    const tacheId = `depot-${Date.now()}`;
    const total = fichiers.reduce((s, f) => s + f.size, 0);
    ajouterTache({ id: tacheId, titre: `Dépôt de ${fichiers.length} fichier${fichiers.length > 1 ? 's' : ''} dans « ${cibleNoms.at(-1) ?? qui()} »`, etat: 'cours', icone: Upload, progression: 0, contexte: `0 / ${tailleLisible(total)}` });
    const noms: string[] = [];
    for (const f of fichiers) noms.push(deposer(C(), d, f));
    // Suivi : le hub met remaining à 0 quand le binaire est reçu.
    const debut = performance.now();
    const suivi = setInterval(() => {
      let restant = 0, envoye = 0;
      for (let i = 0; i < d.length; i++) {
        if (!noms.includes(d[i].name.get())) continue;
        const info = d[i]._info;
        const tu = info?.to_upload?.get() ?? 0, rem = info?.remaining?.get() ?? 0;
        restant += rem; envoye += tu - rem;
      }
      const pct = total ? Math.round((envoye / total) * 100) : 100;
      const s = (performance.now() - debut) / 1000;
      majTache(tacheId, { progression: pct, contexte: `${tailleLisible(envoye)} / ${tailleLisible(total)}`, duree: `${Math.round(s)} s` });
      if (restant === 0) {
        clearInterval(suivi);
        majTache(tacheId, { etat: 'termine', progression: 100, detail: `${noms.length} fichier${noms.length > 1 ? 's' : ''} déposé${noms.length > 1 ? 's' : ''}` });
        for (let i = 0; i < d.length; i++) if (noms.includes(d[i].name.get())) journaliser(C(), d[i], qui(), 'upload');
        notifier(`${noms.length} fichier${noms.length > 1 ? 's' : ''} déposé${noms.length > 1 ? 's' : ''}${noms.some((n, i) => n !== fichiers[i].name) ? ' (certains renommés : nom déjà pris)' : ''}`);
      }
    }, 400);
  }
  let input = $state<HTMLInputElement>();

  // ---------- actions ----------
  const actionsSelection = $derived<Action[]>([
    { id: 'tel', label: 'Télécharger', icone: Download, groupe: 'exporter', desactive: !seule || seule.modelType !== 'Path', raison: seule ? 'Seuls les fichiers se téléchargent' : 'Un seul élément à la fois', executer: () => seule && telecharger(seule) },
    { id: 'dep', label: 'Déplacer vers…', icone: Move, groupe: 'modifier', executer: () => (deplacement = { open: true, cible: [] }) },
    { id: 'ren', label: 'Renommer', icone: Pencil, groupe: 'modifier', desactive: !seule, raison: 'Un seul élément à la fois', executer: () => seule && commencerRenommage(seule) },
    { id: 'sup', label: 'Supprimer', icone: Trash2, groupe: 'supprimer', executer: demanderSuppression },
  ]);
  function menuLigne(l: Ligne) {
    return [
      { id: 'o', label: l.genre === 'jumeau' ? 'Ouvrir dans le Studio' : l.genre.startsWith('dossier') ? 'Ouvrir' : 'Télécharger', icone: l.genre === 'jumeau' ? ArrowUpRight : l.genre.startsWith('dossier') ? FolderOpen : Download, raccourci: 'Entrée', executer: () => ouvrir(l) },
      { id: 'r', label: 'Renommer', icone: Pencil, raccourci: 'F2', executer: () => commencerRenommage(l) },
      { id: 'm', label: 'Déplacer vers…', icone: Move, executer: () => { drive.selection = [l.id]; deplacement = { open: true, cible: [] }; } },
      { id: 'd', label: 'Détails', icone: PanelRight, executer: () => { drive.selection = [l.id]; detailsOuverts = true; } },
      { type: 'separateur' as const },
      { id: 's', label: 'Supprimer', icone: Trash2, danger: true, raccourci: 'Suppr', desactive: !l.supprimable, raison: 'Non supprimable ici', executer: () => { drive.selection = [l.id]; demanderSuppression(); } },
    ];
  }

  // ---------- clavier ----------
  function clavier(e: KeyboardEvent) {
    const t = e.target as HTMLElement;
    if (/INPUT|TEXTAREA/.test(t.tagName) || document.querySelector('[role=dialog]')) return;
    if (e.key === '/') { e.preventDefault(); champFiltre?.focus(); }
    else if (e.key === 'F2' && seule) { e.preventDefault(); commencerRenommage(seule); }
    else if (e.key === 'Delete' && choisies.length) { e.preventDefault(); demanderSuppression(); }
    else if (e.key === 'Enter' && seule) { e.preventDefault(); ouvrir(seule); }
    else if (e.key === 'Escape' && drive.selection.length) drive.selection = [];
    else if (e.key === 'Backspace' && noms.length) { e.preventDefault(); aller(noms.slice(0, -1)); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') { e.preventDefault(); drive.selection = visibles.map((l) => l.id); }
  }

  // ---------- palette ----------
  $effect(() => {
    palette.commandes = [
      { id: 'nd', label: 'Nouveau dossier', section: 'Actions', icone: FolderPlus, executer: () => (nouveau = { open: true, nom: 'Nouveau dossier' }) },
      { id: 'dep', label: 'Déposer des fichiers', section: 'Actions', icone: Upload, executer: () => input?.click() },
      { id: 'haut', label: 'Dossier parent', section: 'Actions', icone: CornerLeftUp, raccourci: 'Retour', executer: () => aller(noms.slice(0, -1)) },
      ...drive.lignes.slice(0, 400).map((l) => ({ id: `f${l.id}`, label: l.nom, section: l.genre.startsWith('dossier') ? 'Dossiers ici' : 'Fichiers ici', icone: l.genre === 'jumeau' ? Boxes : l.genre.startsWith('dossier') ? Folder : undefined, detail: LIBELLE_GENRE[l.genre], executer: () => ouvrir(l) })),
    ];
  });

  // ---------- tableau ----------
  const typeIcone = (l: Ligne) => (l.genre === 'jumeau' ? 'jumeau' : l.genre === 'maquette' ? 'maquette' : l.genre.startsWith('dossier') ? 'dossier' : 'document');
  let colonnes = $state<Colonne<Ligne>[]>([
  { id: 'nom', label: 'Nom', min: 260, valeur: (l) => l.nom, cellule: cNom },
  { id: 'type', label: 'Type', largeur: 150, valeur: (l) => LIBELLE_GENRE[l.genre] },
  { id: 'taille', label: 'Taille', largeur: 100, align: 'droite', mono: true, valeur: (l) => l.taille, texte: (l) => (l.taille ? tailleLisible(l.taille) : '—') },
  { id: 'activite', label: 'Dernière activité', largeur: 210, valeur: (l) => l.activite?.date ?? l.creeLe, cellule: cActivite },
  { id: 'etat', label: 'État', largeur: 150, valeur: (l) => l.transfert, cellule: cEtat },
  ]);
</script>

{#snippet cNom(l: Ligne)}
  <TypeIcone type={typeIcone(l)} size={16} />
  {#if edition?.id === l.id}
    <!-- svelte-ignore a11y_autofocus -->
    <input class="renommer" value={edition.nom} oninput={(e) => edition && (edition.nom = e.currentTarget.value)} autofocus aria-label="Nouveau nom"
      onfocus={(e) => { const i = e.currentTarget; const p = i.value.lastIndexOf('.'); i.setSelectionRange(0, p > 0 && !l.genre.startsWith('dossier') ? p : i.value.length); }}
      onkeydown={(e) => { e.stopPropagation(); if (e.key === 'Enter') validerRenommage(); if (e.key === 'Escape') edition = null; }}
      onblur={validerRenommage} onclick={(e) => e.stopPropagation()} />
  {:else}
    <span class="nom" title={l.nom}>{l.nom}</span>
  {/if}
{/snippet}
{#snippet cEtat(l: Ligne)}
  {#if l.transfert !== null}
    <div class="transfert"><Progress value={l.transfert * 100} label="Transfert de {l.nom}" tone="info" /><span class="sc-value sc-muted">{Math.round(l.transfert * 100)} %</span></div>
  {:else if l.genre === 'jumeau'}<span class="sc-caption">Jumeau</span>
  {:else}<span class="sc-muted">—</span>{/if}
{/snippet}
{#snippet cActivite(l: Ligne)}
  {#if l.activite}<span title="{actionLisible(l.activite.action)} · {dateExacte(l.activite.date)}">{dateLisible(l.activite.date)} · {l.activite.qui}</span>
  {:else if l.creeLe}<span class="sc-muted" title="Ajouté le {dateExacte(l.creeLe)}">{dateLisible(l.creeLe)}</span>
  {:else}<span class="sc-muted">—</span>{/if}
{/snippet}
{#snippet aLigne(l: Ligne)}
  <Menu elements={menuLigne(l)} align="end">{#snippet trigger(props)}<IconButton {...props} icon={Ellipsis} label="Actions sur {l.nom}" size="sm" />{/snippet}</Menu>
{/snippet}

<svelte:window onkeydown={clavier} />
<svelte:head><title>{drive.chemin.at(-1)?.nom ?? 'Drive'} — Drive</title></svelte:head>


<div class="drive">
  <SplitPane cle="drive-arbre" initial={260} min={200} max={420}>
    {#snippet premier()}
      <nav class="gauche" aria-label="Dossiers">
        {#if drive.racine}
          <Arbre racine={drive.racine} utilisateur={session.identite!.utilisateur} cheminCourant={noms} onouvrir={aller}
            ondepot={(n, f) => deposerDans(n, f)} />
        {:else}<div class="pad"><Skeleton lignes={8} /></div>{/if}
      </nav>
    {/snippet}
    {#snippet second()}
      <div class="centre" class:avec-details={detailsOuverts && seule}>
        <section class="contenu" aria-label="Contenu du dossier"
          ondragover={(e) => { if (e.dataTransfer?.types.includes('Files')) { e.preventDefault(); survolDepot = true; } }}
          ondragleave={(e) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) survolDepot = false; }}
          ondrop={(e) => { e.preventDefault(); survolDepot = false; const f = Array.from(e.dataTransfer?.files ?? []); if (f.length) deposerDans(noms, f); }}>
          <header class="barre">
            <Breadcrumb segments={drive.chemin.map((s, i) => ({ label: s.nom, onclick: () => aller(noms.slice(0, i)) }))} />
            <span class="espace"></span>
            <Menu elements={[
              { id: 'd', label: 'Dossier', icone: FolderPlus, executer: () => (nouveau = { open: true, nom: 'Nouveau dossier' }) },
              { id: 'j', label: 'Jumeau numérique…', icone: Boxes, desactive: true, raison: 'Assistant au lot 2 (DR-DT-01)', executer: () => {} },
            ]}>{#snippet trigger(props)}<Button {...props} icon={Plus}>Nouveau</Button>{/snippet}</Menu>
            <Button variant="primary" icon={Upload} onclick={() => input?.click()}>Déposer</Button>
            <IconButton icon={PanelRight} label={detailsOuverts ? 'Masquer les détails' : 'Afficher les détails'} pressed={detailsOuverts} onclick={() => (detailsOuverts = !detailsOuverts)} />
            <input bind:this={input} type="file" multiple hidden onchange={(e) => { const f = Array.from(e.currentTarget.files ?? []); if (f.length) deposerDans(noms, f); e.currentTarget.value = ''; }} />
          </header>
          <div class="outils">
            <div class="filtre"><TextInput type="search" icon={Search} bind:value={filtre} placeholder="Filtrer ce dossier" clearable size="sm"
              onkeydown={(e: KeyboardEvent) => { if (e.key === 'Escape') { filtre = ''; (e.currentTarget as HTMLElement).blur(); } }}
              aria-keyshortcuts="/" bind:champ={champFiltre} /></div>
            <span class="sc-caption compte">{visibles.length}{filtre ? ` sur ${drive.lignes.length}` : ''} élément{visibles.length > 1 ? 's' : ''}{drive.lignes.some((l) => l.taille) ? ` · ${tailleLisible(drive.lignes.reduce((s, l) => s + (l.taille ?? 0), 0))}` : ''}</span>
          </div>
          <div class="table" class:survol={survolDepot}>
            {#if drive.charge && !drive.lignes.length}
              <div class="pad"><Skeleton forme="tableau" lignes={10} /></div>
            {:else if drive.erreur}
              <div class="pad"><ErrorState titre="Impossible d'ouvrir ce dossier" message={drive.erreur} onretry={() => drive.ouvrirChemin(noms)} /></div>
            {:else}
              <ContextMenu elements={seule ? menuLigne(seule) : [{ id: 'nd', label: 'Nouveau dossier', icone: FolderPlus, executer: () => (nouveau = { open: true, nom: 'Nouveau dossier' }) }, { id: 'dp', label: 'Déposer des fichiers', icone: Upload, executer: () => input?.click() }]}>
                <DataTable lignes={visibles} bind:colonnes cle={(l) => String(l.id)} selection={drive.selection.map(String)}
                  onselection={(s) => (drive.selection = s.map(Number))} selectionnable bind:tri actions={aLigne} label="Contenu de {drive.chemin.at(-1)?.nom ?? 'Drive'}"
                  onactivate={ouvrir}>
                  {#snippet vide()}
                    {#if filtre}
                      <EmptyState icone={Search} titre="Aucun élément ne contient « {filtre} »" texte="Le filtre ne porte que sur ce dossier." compact>
                        {#snippet actions()}<Button size="sm" onclick={() => (filtre = '')}>Effacer le filtre</Button>{/snippet}</EmptyState>
                    {:else}
                      <EmptyState icone={FolderOpen} titre="Ce dossier est vide" texte="Déposez des fichiers ici, ou créez un dossier." compact>
                        {#snippet actions()}<Button size="sm" variant="primary" icon={Upload} onclick={() => input?.click()}>Déposer</Button><Button size="sm" icon={FolderPlus} onclick={() => (nouveau = { open: true, nom: 'Nouveau dossier' })}>Nouveau dossier</Button>{/snippet}</EmptyState>
                    {/if}
                  {/snippet}
                </DataTable>
              </ContextMenu>
            {/if}
            {#if survolDepot}<div class="voile"><Icon icon={Upload} size={22} /><span>Déposer dans « {drive.chemin.at(-1)?.nom} »</span></div>{/if}
          </div>
          {#if choisies.length > 1}
            <div class="selbar"><SelectionBar nombre={choisies.length} actions={actionsSelection} ondeselect={() => (drive.selection = [])} /></div>
          {/if}
        </section>
        {#if detailsOuverts && seule && drive.fichier(seule.id)}
          {#key seule.id}
            <Details ligne={seule} fichier={drive.fichier(seule.id)!} chemin={cheminTexte} onfermer={() => (detailsOuverts = false)}
              ontelecharger={() => telecharger(seule!)} onouvrirStudio={() => ouvrirStudio(seule!)} />
          {/key}
        {/if}
      </div>
    {/snippet}
  </SplitPane>
</div>

<Dialog bind:open={nouveau.open} titre="Nouveau dossier" icone={FolderPlus} description="Dans « {drive.chemin.at(-1)?.nom} »" largeur={460}>
  <form id="f-nd" onsubmit={(e) => { e.preventDefault(); if (!erreurNom) creer(); }}>
    <Field id="nd" label="Nom" erreur={erreurNom ?? undefined}
      description={!erreurNom && drive.lignes.some((l) => l.nom === nouveau.nom.trim()) ? 'Ce nom existe déjà : un suffixe « (2) » sera ajouté.' : 'Lettres accentuées et espaces acceptés.'}>
      <TextInput id="nd" bind:value={nouveau.nom} invalide={!!erreurNom} autofocus /></Field>
  </form>
  {#snippet pied()}<Button variant="ghost" onclick={() => (nouveau.open = false)}>Annuler</Button><Button variant="primary" type="submit" form="f-nd" disabled={!!erreurNom} raison={erreurNom ?? ''}>Créer le dossier</Button>{/snippet}
</Dialog>

<ConfirmerPortee bind:open={confirmer} genre="suppression" verbe="Supprimer" nom="élément" nomPluriel="éléments" irreversible
  elements={choisies.filter((l) => l.supprimable).map((l) => `${l.nom} · ${LIBELLE_GENRE[l.genre]}`)}
  inchange="Il n'y a pas de corbeille. Un fichier partagé reste accessible depuis ses autres emplacements et chez les comptes avec qui il est partagé."
  {exclus} onconfirm={supprimerSelection} />

<Dialog bind:open={deplacement.open} titre="Déplacer {choisies.length} élément{choisies.length > 1 ? 's' : ''}" icone={Move} largeur={520}>
  <div class="dep">
    <Breadcrumb segments={[{ label: qui(), onclick: () => (deplacement.cible = []) }, ...deplacement.cible.map((n, i) => ({ label: n, onclick: () => (deplacement.cible = deplacement.cible.slice(0, i + 1)) }))]} />
    <ul class="choix">
      {#each sousDossiers as s (s.nom)}
        <li><button onclick={() => (deplacement.cible = [...deplacement.cible, s.nom])}><Folder size={16} />{s.nom}</button></li>
      {:else}<li class="sc-caption vide">Aucun sous-dossier</li>{/each}
    </ul>
  </div>
  {#snippet pied()}
    <Button variant="ghost" onclick={() => (deplacement.open = false)}>Annuler</Button>
    <Button variant="primary" disabled={deplacement.cible.join('/') === noms.join('/')} raison="C'est le dossier actuel" onclick={() => deplacerVers(deplacement.cible)}>Déplacer ici</Button>
  {/snippet}
</Dialog>

<style>
  .drive { flex: 1; min-height: 0; }
  .gauche { height: 100%; background: var(--sc-sheet); border-right: 1px solid var(--sc-line); }
  .centre { display: grid; grid-template-columns: minmax(0, 1fr); height: 100%; min-height: 0; }
  .centre.avec-details { grid-template-columns: minmax(0, 1fr) minmax(320px, 360px); }
  .contenu { position: relative; display: flex; flex-direction: column; min-height: 0; padding: 12px 20px 0; }
  .barre { display: flex; align-items: center; gap: 8px; min-height: 40px; }
  .barre > :global(.sc-crumbs) { min-width: 0; overflow: hidden; }
  .espace { flex: 1; }
  .outils { display: flex; align-items: center; gap: 12px; margin: 10px 0; }
  .filtre { width: min(320px, 50%); }
  .compte { margin-left: auto; white-space: nowrap; }
  .table { position: relative; flex: 1; min-height: 0; margin-bottom: 16px; border: 1px solid var(--sc-line); border-radius: var(--sc-r-card); overflow: hidden; background: var(--sc-sheet); }
  .table.survol { border-color: var(--sc-accent); }
  .voile { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 8px; background: var(--sc-accent-soft); color: var(--sc-accent-ink); font-weight: 600; pointer-events: none; }
  .pad { padding: 16px; }
  .nom { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .renommer { flex: 1; min-width: 0; height: 26px; padding: 0 6px; border: 1px solid var(--sc-focus); border-radius: 6px; outline: none; box-shadow: 0 0 0 3px var(--sc-accent-soft); background: var(--sc-sheet); }
  .transfert { display: flex; align-items: center; gap: 8px; width: 100%; }
  .selbar { position: absolute; left: 50%; bottom: 32px; transform: translateX(-50%); z-index: 5; }
  .dep { display: flex; flex-direction: column; gap: 10px; }
  .choix { list-style: none; margin: 0; padding: 4px; max-height: 320px; overflow: auto; border: 1px solid var(--sc-line); border-radius: 10px; }
  .choix button { width: 100%; display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 10px; border: 0; background: none; border-radius: 6px; text-align: left; }
  .choix button:hover { background: var(--sc-ground-2); }
  .vide { padding: 10px; }
</style>
