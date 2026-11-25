<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<!-- Coque des sections connectées (02-ux §3) : barre supérieure, bandeau de perte du hub, plateau des tâches, palette, raccourcis. -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { session, reprendre, deconnecter } from '$lib/hub/session.svelte';
  import { taches, plateau, effacerTerminees, enCours, enErreur } from '$lib/etat/taches.svelte';
  import { palette } from '$lib/etat/palette.svelte';
  import TopBar from '$lib/ui/TopBar.svelte';
  import TaskTray from '$lib/ui/TaskTray.svelte';
  import Banner from '$lib/ui/Banner.svelte';
  import Menu from '$lib/ui/Menu.svelte';
  import Avatar from '$lib/ui/Avatar.svelte';
  import IconButton from '$lib/ui/IconButton.svelte';
  import CommandPalette from '$lib/ui/CommandPalette.svelte';
  import ShortcutHelp from '$lib/ui/ShortcutHelp.svelte';
  import Skeleton from '$lib/ui/Skeleton.svelte';
  import MotDePasse from './MotDePasse.svelte';
  import Activity from '@lucide/svelte/icons/activity';
  import Moon from '@lucide/svelte/icons/moon';
  import Sun from '@lucide/svelte/icons/sun';
  import LogOut from '@lucide/svelte/icons/log-out';
  import KeyRound from '@lucide/svelte/icons/key-round';
  import Keyboard from '@lucide/svelte/icons/keyboard';
  import Rows3 from '@lucide/svelte/icons/rows-3';

  let { children } = $props();
  let pret = $state(false);
  let aide = $state(false);
  let mdp = $state(false);
  let sombre = $state(document.documentElement.dataset.theme === 'dark');
  let compact = $state(document.documentElement.dataset.density === 'compact');

  $effect(() => {
    if (session.etat === 'connecte') { pret = true; return; }
    reprendre().then((ok) => {
      if (ok) pret = true;
      else goto(`${base}/connexion?suite=${encodeURIComponent(page.url.pathname + page.url.search)}${page.url.pathname.startsWith(`${base}/admin`) ? '&admin=1' : ''}`, { replaceState: true });
    });
  });
  $effect(() => {
    document.documentElement.dataset.theme = sombre ? 'dark' : 'light';
    try { localStorage.setItem('sc-theme', sombre ? 'dark' : 'light'); } catch {}
  });
  $effect(() => {
    document.documentElement.dataset.density = compact ? 'compact' : '';
    try { localStorage.setItem('sc-densite', compact ? 'compact' : ''); } catch {}
  });

  const section = $derived(page.url.pathname.startsWith(`${base}/admin`) ? 'admin' : 'drive');
  const sections = $derived([
    { id: 'drive', label: 'Drive', href: `${base}/drive` },
    { id: 'studio', label: 'Studio', href: '/html/viewer/', desactive: true },
    ...(session.identite?.admin ? [{ id: 'admin', label: 'Admin', href: `${base}/admin` }] : []),
  ]);
  const raccourcis = [
    { titre: 'Partout', raccourcis: [{ touches: 'Ctrl K', effet: 'Palette de commandes' }, { touches: '?', effet: 'Cette aide' }, { touches: 'Échap', effet: 'Fermer, puis désélectionner' }] },
    { titre: 'Drive', raccourcis: [{ touches: '/', effet: 'Filtrer le dossier' }, { touches: 'Entrée', effet: 'Ouvrir' }, { touches: 'F2', effet: 'Renommer' }, { touches: 'Suppr', effet: 'Supprimer' }, { touches: 'Ctrl A', effet: 'Tout sélectionner' }, { touches: 'Retour', effet: 'Dossier parent' }] },
  ];
  const nbCours = $derived(enCours());
  const nbErreur = $derived(enErreur());
</script>

{#if !pret}
  <div class="attente"><Skeleton lignes={6} /></div>
{:else}
  <div class="app">
    <TopBar {sections} active={section} ouvrirPalette={() => (palette.ouvert = true)}>
      {#snippet droite()}
        <button class="taches" class:actif={plateau.ouvert} onclick={() => (plateau.ouvert = !plateau.ouvert)} aria-expanded={plateau.ouvert}
          aria-label="Tâches : {nbCours} en cours{nbErreur ? `, ${nbErreur} en erreur` : ''}" title="Tâches">
          <Activity size={18} />{#if nbCours}<span class="n">{nbCours}</span>{/if}{#if nbErreur}<span class="err" aria-hidden="true"></span>{/if}
        </button>
        <IconButton icon={sombre ? Sun : Moon} label={sombre ? 'Thème clair' : 'Thème sombre'} variant="on-ink" onclick={() => (sombre = !sombre)} />
        <Menu align="end" elements={[
          { type: 'titre', label: `${session.identite?.utilisateur} · id ${session.identite?.id}${session.identite?.admin ? ' · administrateur' : ''}` },
          { id: 'mdp', label: 'Changer le mot de passe…', icone: KeyRound, executer: () => (mdp = true) },
          { id: 'dens', label: compact ? 'Densité confortable' : 'Densité compacte', icone: Rows3, executer: () => (compact = !compact) },
          { id: 'aide', label: 'Raccourcis clavier', icone: Keyboard, raccourci: '?', executer: () => (aide = true) },
          { type: 'separateur' },
          { id: 'out', label: 'Se déconnecter', icone: LogOut, executer: deconnecter },
        ]}>
          {#snippet trigger(props)}<button {...props} class="compte" aria-label="Compte {session.identite?.utilisateur}"><Avatar nom={session.identite?.utilisateur ?? '?'} /></button>{/snippet}
        </Menu>
      {/snippet}
    </TopBar>
    {#if session.perdue}
      <Banner ton="danger" message="Connexion au hub perdue. Les modifications ne sont plus enregistrées ; reconnexion automatique en cours…" />
    {/if}
    <main>{@render children()}</main>
    {#if plateau.ouvert}
      <div class="plateau"><TaskTray {taches} oneffacer={effacerTerminees} /></div>
    {/if}
  </div>
  <CommandPalette bind:open={palette.ouvert} commandes={palette.commandes} recents={palette.recents} />
  <ShortcutHelp bind:open={aide} groupes={raccourcis} />
  <MotDePasse bind:open={mdp} />
{/if}

<style>
  .attente { padding: 80px; max-width: 720px; margin: 0 auto; }
  .app { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
  main { flex: 1; min-height: 0; display: flex; flex-direction: column; }
  .taches { position: relative; height: 32px; min-width: 32px; padding: 0 8px; display: inline-flex; align-items: center; gap: 6px; border: 0; border-radius: 8px;
    background: transparent; color: var(--sc-on-ink-2); }
  .taches:hover, .taches.actif { background: var(--sc-ink-2); color: var(--sc-on-ink); }
  .n { font: 500 11px/1 var(--sc-mono); background: var(--sc-accent); color: var(--sc-on-accent); border-radius: 999px; padding: 3px 6px; }
  .err { position: absolute; right: 4px; top: 4px; width: 8px; height: 8px; border-radius: 50%; background: var(--sc-danger); box-shadow: 0 0 0 2px var(--sc-ink); }
  .compte { border: 0; background: none; padding: 2px; border-radius: 50%; margin-left: 4px; }
  .plateau { position: fixed; top: 56px; right: 12px; z-index: 60; }
</style>
