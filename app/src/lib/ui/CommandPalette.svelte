<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import { Command, Dialog } from 'bits-ui';
  import type { IconeComposant } from './types';
  import Icon from './Icon.svelte';
  import Kbd from './Kbd.svelte';
  import Search from '@lucide/svelte/icons/search';
  import CornerDownLeft from '@lucide/svelte/icons/corner-down-left';

  export interface Commande { id: string; label: string; section: string; icone?: IconeComposant; raccourci?: string; detail?: string; motsCles?: string; executer: () => void }
  /** Ctrl K : recherche floue sur actions, objets, dossiers et ateliers. Sections, raccourcis, récents en tête. */
  let { open = $bindable(false), commandes, recents = [] }: { open?: boolean; commandes: Commande[]; recents?: string[] } = $props();
  let saisie = $state('');
  const sections = $derived.by(() => {
    const m = new Map<string, Commande[]>();
    const recentes = recents.map((id) => commandes.find((c) => c.id === id)).filter(Boolean) as Commande[];
    if (!saisie && recentes.length) m.set('Récents', recentes);
    for (const c of commandes) { if (!saisie && recents.includes(c.id)) continue; (m.get(c.section) ?? m.set(c.section, []).get(c.section)!).push(c); }
    return [...m];
  });
  $effect(() => {
    const f = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open = !open; } };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  });
  function lancer(c: Commande) { open = false; saisie = ''; c.executer(); }
</script>

<Dialog.Root bind:open onOpenChange={(o) => { if (!o) saisie = ''; }}>
  <Dialog.Portal>
    <Dialog.Overlay class="sc-scrim" />
    <Dialog.Content class="sc-palette" aria-label="Palette de commandes">
      <Dialog.Title class="sc-visually-hidden">Palette de commandes</Dialog.Title>
      <Command.Root class="cmd" loop>
        <div class="champ"><Icon icon={Search} size={18} /><Command.Input bind:value={saisie} placeholder="Rechercher un fichier, un objet, une action…" class="in" /><Kbd keys="Échap" /></div>
        <Command.List class="liste">
          <Command.Viewport>
            <Command.Empty class="vide">Aucun résultat pour « {saisie} ».</Command.Empty>
            {#each sections as [nom, items] (nom)}
              <Command.Group value={nom}>
                <Command.GroupHeading class="sc-menu-titre">{nom}</Command.GroupHeading>
                <Command.GroupItems>
                  {#each items as c (c.id)}
                    <Command.Item value={c.id} keywords={[c.label, c.motsCles ?? '', c.detail ?? '']} onSelect={() => lancer(c)} class="sc-menu-item it">
                      {#if c.icone}<Icon icon={c.icone} />{/if}
                      <span class="l">{c.label}{#if c.detail}<span class="sc-caption"> · {c.detail}</span>{/if}</span>
                      {#if c.raccourci}<span class="raccourci"><Kbd keys={c.raccourci} /></span>{/if}
                    </Command.Item>
                  {/each}
                </Command.GroupItems>
              </Command.Group>
            {/each}
          </Command.Viewport>
        </Command.List>
        <div class="pied sc-caption"><span><Kbd keys="↑ ↓" /> parcourir</span><span><Icon icon={CornerDownLeft} size={12} /> lancer</span><span><Kbd keys="?" /> raccourcis</span></div>
      </Command.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.sc-palette) { position: fixed; z-index: 81; left: 50%; top: 12vh; transform: translateX(-50%); width: min(640px, calc(100vw - 32px));
    background: var(--sc-sheet); border-radius: var(--sc-r-sheet); box-shadow: var(--sc-shadow-3); overflow: hidden; animation: sc-in var(--sc-in) var(--sc-ease); }
  .champ { display: flex; align-items: center; gap: 10px; padding: 0 16px; height: 52px; border-bottom: 1px solid var(--sc-line); color: var(--sc-muted); }
  :global(.sc-palette .in) { flex: 1; border: 0; outline: none; background: none; font-size: 15px; color: var(--sc-text); }
  :global(.sc-palette .liste) { max-height: min(420px, 60vh); overflow: auto; padding: 6px; }
  :global(.sc-palette .it[data-selected]) { background: var(--sc-ground-2); }
  :global(.sc-palette .vide) { padding: 24px; text-align: center; color: var(--sc-muted); }
  .l { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pied { display: flex; gap: 16px; padding: 8px 16px; border-top: 1px solid var(--sc-line); background: var(--sc-ground); }
  .pied span { display: inline-flex; align-items: center; gap: 6px; }
</style>
