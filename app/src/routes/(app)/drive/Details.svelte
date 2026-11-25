<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<!-- Détails d'un fichier (DR-11, DR-12, DR-VER) : Infos, Versions, Partage, Journal. Lecture à l'ouverture de l'onglet. -->
<script lang="ts">
  import Tabs from '$lib/ui/Tabs.svelte';
  import PropertyList from '$lib/ui/PropertyList.svelte';
  import Button from '$lib/ui/Button.svelte';
  import IconButton from '$lib/ui/IconButton.svelte';
  import Badge from '$lib/ui/Badge.svelte';
  import Statut from '$lib/ui/Statut.svelte';
  import Timeline from '$lib/ui/Timeline.svelte';
  import EmptyState from '$lib/ui/EmptyState.svelte';
  import Skeleton from '$lib/ui/Skeleton.svelte';
  import Checkbox from '$lib/ui/Checkbox.svelte';
  import Combobox from '$lib/ui/Combobox.svelte';
  import Icon from '$lib/ui/Icon.svelte';
  import TypeIcone from '$lib/spinal/TypeIcone.svelte';
  import { notifier } from '$lib/ui/toasts.svelte';
  import { dateLisible, dateExacte, taille as tailleLisible } from '$lib/ui/format';
  import { chargerPtr, charger, fs, session } from '$lib/hub/session.svelte';
  import { connecteur, type Modele } from '$lib/hub/connecteur';
  import { LIBELLE_GENRE, ETATS_CONVERSION, lireJournal, lireVersions, actionLisible, drapeau, journaliser, type Ligne, type Version, type EntreeJournal, type Classes } from '$lib/domaines/drive/fichiers';
  import X from '@lucide/svelte/icons/x';
  import Download from '@lucide/svelte/icons/download';
  import Share2 from '@lucide/svelte/icons/share-2';
  import RefreshCw from '@lucide/svelte/icons/refresh-cw';
  import Info from '@lucide/svelte/icons/info';
  import History from '@lucide/svelte/icons/history';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';

  let { ligne, fichier, chemin, onfermer, ontelecharger, onouvrirStudio }: {
    ligne: Ligne; fichier: Modele; chemin: string; onfermer: () => void; ontelecharger: () => void; onouvrirStudio: () => void;
  } = $props();

  let onglet = $state('infos');
  let versions = $state<Version[] | null>(null);
  let journal = $state<EntreeJournal[] | null>(null);
  let erreurVersions = $state<string | null>(null);

  $effect(() => {
    // Changement de fichier : on relit ce qui dépend de lui.
    ligne.id;
    versions = null; journal = null; erreurVersions = null;
    if (onglet === 'partage' && !ligne.versions && ligne.genre === 'dossier') onglet = 'infos';
  });
  $effect(() => { if (onglet === 'versions' && versions === null) lireLesVersions(); });
  $effect(() => { if (onglet === 'journal' && journal === null) lireLeJournal(); });

  async function lireLesVersions() {
    const v = fichier._info?.version;
    if (!v) { versions = []; return; }
    try { versions = lireVersions(await chargerPtr(v)); } catch (e) { erreurVersions = (e as Error).message; versions = []; }
  }
  async function lireLeJournal() {
    const l = fichier._info?.log;
    if (!l || !l.data?.value) { journal = []; return; }
    try { journal = lireJournal(await chargerPtr(l)); } catch { journal = []; }
  }

  // ---- Partage (DR-11) ----
  let utilisateurs = $state<{ value: string; label: string }[]>([]);
  let destinataires = $state<string[]>([]);
  let choix = $state('');
  let droits = $state({ lecture: true, ecriture: false, partage: false });
  $effect(() => {
    if (onglet !== 'partage' || utilisateurs.length) return;
    charger<Modele>('/etc/users').then((u) => {
      const out: { value: string; label: string }[] = [];
      for (let i = 0; i < u.length; i++) {
        const nom = u[i].name.get();
        if (nom && nom !== session.identite?.utilisateur) out.push({ value: nom, label: `${nom} · id ${u[i].id.get()}` });
      }
      utilisateurs = out;
    }).catch(() => notifier('Impossible de lire la liste des comptes du hub', 'erreur'));
  });
  $effect(() => { if (choix && !destinataires.includes(choix)) { destinataires = [...destinataires, choix]; } choix = ''; });
  async function partager() {
    const f = drapeau(droits);
    const cible = await chargerPtr(fichier);
    const { spinalCore } = await connecteur();
    for (const d of destinataires) spinalCore.share_model(fs(), cible as never, ligne.nom, f, d);
    journaliser((await connecteur()) as unknown as Classes, fichier, session.identite!.utilisateur, 'share');
    notifier(`« ${ligne.nom} » partagé avec ${destinataires.length} compte${destinataires.length > 1 ? 's' : ''}`);
    destinataires = [];
  }

  const onglets = $derived([
    { id: 'infos', label: 'Infos' },
    ...(ligne.versions ? [{ id: 'versions', label: 'Versions', compteur: versions?.length }] : []),
    ...(ligne.genre !== 'dossier-sync' ? [{ id: 'partage', label: 'Partage' }] : []),
    { id: 'journal', label: 'Journal', compteur: journal?.length },
  ]);
  const proprietes = $derived([
    { label: 'Type', valeur: LIBELLE_GENRE[ligne.genre] + (ligne.genre === 'autre' ? ` (${ligne.modelType})` : '') },
    { label: 'Taille', valeur: ligne.taille ? tailleLisible(ligne.taille) : null },
    { label: 'Ajouté le', valeur: ligne.creeLe ? dateExacte(ligne.creeLe) : null },
    { label: 'Dernière activité', valeur: ligne.activite ? `${actionLisible(ligne.activite.action)} · ${ligne.activite.qui} · ${dateLisible(ligne.activite.date)}` : null },
    { label: 'Emplacement', valeur: chemin },
    { label: 'Identifiant', valeur: String(ligne.id), mono: true },
    { label: 'Modèle pointé', valeur: ligne.cible ? String(ligne.cible) : null, mono: true },
  ]);
</script>

<aside class="details" aria-label="Détails de {ligne.nom}">
  <header>
    <TypeIcone type={ligne.genre === 'jumeau' ? 'jumeau' : ligne.genre === 'maquette' ? 'maquette' : ligne.genre.startsWith('dossier') ? 'dossier' : 'document'} tuile size={18} />
    <div class="t"><div class="sc-title nom" title={ligne.nom}>{ligne.nom}</div><div class="sc-caption">{LIBELLE_GENRE[ligne.genre]}{ligne.taille ? ` · ${tailleLisible(ligne.taille)}` : ''}</div></div>
    <IconButton icon={X} label="Fermer les détails" size="sm" onclick={onfermer} />
  </header>
  {#if ligne.genre === 'jumeau'}
    <div class="principal"><Button variant="ink" iconEnd={ArrowUpRight} onclick={onouvrirStudio}>Ouvrir dans le Studio</Button></div>
  {:else if ligne.modelType === 'Path'}
    <div class="principal"><Button icon={Download} onclick={ontelecharger} disabled={ligne.transfert !== null} raison="Transfert en cours">Télécharger</Button></div>
  {/if}
  <Tabs bind:value={onglet} {onglets} label="Détails">
    {#snippet contenu(id)}
      <div class="corps">
        {#if id === 'infos'}
          {#if ligne.transfert !== null}
            <div class="note"><Statut etat="cours" label="Transfert {Math.round(ligne.transfert * 100)} %" /></div>
          {/if}
          <PropertyList groupes={[{ proprietes }]} />
        {:else if id === 'versions'}
          {#if versions === null}<div class="pad"><Skeleton lignes={3} /></div>
          {:else if erreurVersions}<p class="pad err">{erreurVersions}</p>
          {:else if !versions.length}<EmptyState icone={History} titre="Une seule version" texte="Aucun historique de versions pour ce fichier." compact />
          {:else}
            <ol class="versions">
              {#each versions as v (v.numero)}
                <li class:courante={v.courante}>
                  <span class="num">v{v.numero}</span>
                  <div class="vi">
                    <div class="l1">{#if v.courante}<Badge tone="accent">courante</Badge>{/if}
                      {#if v.etat >= 0}<Statut etat={v.etat === 10 ? 'termine' : v.etat === 11 ? 'erreur' : v.etat === 0 ? 'attente' : 'cours'} label={ETATS_CONVERSION[v.etat] ?? `état ${v.etat}`} />{/if}</div>
                    <div class="sc-caption" title={dateExacte(v.date)}>{dateLisible(v.date)}{v.nomFichier ? ` · ${v.nomFichier}` : ''}</div>
                    {#if v.description}<p class="desc">{v.description}</p>{/if}
                  </div>
                </li>
              {/each}
            </ol>
            <p class="sc-caption pad">Ajouter une version et revenir à une version précédente arrivent au prochain lot (DR-VER-02, 03).</p>
          {/if}
        {:else if id === 'partage'}
          <div class="pad partage">
            <Combobox bind:value={choix} options={utilisateurs.filter((u) => !destinataires.includes(u.value))} label="Ajouter un compte" placeholder="Nom du compte…" />
            {#if destinataires.length}
              <div class="jetons">{#each destinataires as d}<span class="jeton">{d}<button aria-label="Retirer {d}" onclick={() => (destinataires = destinataires.filter((x) => x !== d))}><X size={12} /></button></span>{/each}</div>
            {/if}
            <div class="droits">
              <Checkbox bind:checked={droits.lecture} label="Lecture" />
              <Checkbox bind:checked={droits.ecriture} label="Écriture" />
              <Checkbox bind:checked={droits.partage} label="Partage et administration" />
            </div>
            <Button variant="primary" icon={Share2} disabled={!destinataires.length || !(droits.lecture || droits.ecriture || droits.partage)}
              raison="Choisissez au moins un compte et un droit" onclick={partager}>
              Partager avec {destinataires.length || '…'} compte{destinataires.length > 1 ? 's' : ''}</Button>
            <p class="sc-caption info"><Icon icon={Info} size={14} />Le partage donne accès au même fichier, sans copie. Le hub n'expose pas la liste des accès existants : on ne peut pas encore les afficher ni les révoquer (décision O-1).</p>
          </div>
        {:else if id === 'journal'}
          {#if journal === null}<div class="pad"><Skeleton lignes={4} /></div>
          {:else if !journal.length}<EmptyState icone={History} titre="Journal vide" texte="Aucune entrée de journal pour ce fichier." compact />
          {:else}
            <div class="pad"><Timeline entrees={journal.slice(0, 50).map((j) => ({ auteur: j.qui || '?', action: actionLisible(j.action).toLowerCase(), date: j.date }))} /></div>
            {#if journal.length > 50}<p class="sc-caption pad">50 entrées les plus récentes sur {journal.length}.</p>{/if}
          {/if}
          <div class="pad"><Button size="sm" variant="ghost" icon={RefreshCw} onclick={() => { journal = null; }}>Actualiser</Button></div>
        {/if}
      </div>
    {/snippet}
  </Tabs>
</aside>

<style>
  .details { display: flex; flex-direction: column; height: 100%; min-height: 0; background: var(--sc-sheet); border-left: 1px solid var(--sc-line); }
  header { display: flex; gap: 10px; align-items: flex-start; padding: 14px 10px 10px 16px; }
  .t { flex: 1; min-width: 0; }
  .nom { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .principal { padding: 0 16px 12px; display: flex; gap: 8px; }
  .details :global(.sc-tabs) { flex: 1; min-height: 0; display: flex; flex-direction: column; }
  .details :global(.sc-tabs .contenu) { flex: 1; min-height: 0; overflow: auto; }
  .corps { padding: 8px 0 16px; }
  .pad { padding: 8px 16px; }
  .note { padding: 4px 16px 8px; }
  .err { color: var(--sc-danger); }
  .versions { list-style: none; margin: 0; padding: 0 8px; }
  .versions li { display: grid; grid-template-columns: 40px 1fr; gap: 8px; padding: 10px 8px; border-radius: 8px; }
  .versions li.courante { background: var(--sc-accent-soft); }
  .num { font: 500 13px/22px var(--sc-mono); color: var(--sc-text-2); }
  .vi { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .l1 { display: flex; gap: 6px; flex-wrap: wrap; }
  .desc { color: var(--sc-text-2); }
  .partage { display: flex; flex-direction: column; gap: 12px; }
  .jetons { display: flex; flex-wrap: wrap; gap: 6px; }
  .jeton { display: inline-flex; align-items: center; gap: 4px; height: 26px; padding: 0 4px 0 10px; border-radius: 999px; background: var(--sc-ground-2); font-size: 12.5px; }
  .jeton button { border: 0; background: none; display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; color: var(--sc-text-2); }
  .jeton button:hover { background: var(--sc-line-2); }
  .droits { display: flex; flex-direction: column; gap: 8px; }
  .info { display: flex; gap: 6px; align-items: flex-start; line-height: 17px; }
</style>
