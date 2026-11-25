<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<!-- Administration du hub (ADM-01 à 03) : état en direct depuis /etc/Status, maintenance, comptes. -->
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { charger, session } from '$lib/hub/session.svelte';
  import { compteurs } from '$lib/hub/suivre.svelte';
  import type { Modele } from '$lib/hub/connecteur';
  import { nombre, dateLisible, dateExacte } from '$lib/ui/format';
  import Button from '$lib/ui/Button.svelte';
  import Badge from '$lib/ui/Badge.svelte';
  import Avatar from '$lib/ui/Avatar.svelte';
  import Dialog from '$lib/ui/Dialog.svelte';
  import ErrorState from '$lib/ui/ErrorState.svelte';
  import Skeleton from '$lib/ui/Skeleton.svelte';
  import Icon from '$lib/ui/Icon.svelte';
  import Spinner from '$lib/ui/Spinner.svelte';
  import TextInput from '$lib/ui/TextInput.svelte';
  import { notifier } from '$lib/ui/toasts.svelte';
  import HardDrive from '@lucide/svelte/icons/hard-drive';
  import Recycle from '@lucide/svelte/icons/recycle';
  import Database from '@lucide/svelte/icons/database';
  import Search from '@lucide/svelte/icons/search';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';
  import Info from '@lucide/svelte/icons/info';

  interface Mesure { cle: string; label: string; unite: 'nb' | 'ko'; valeur: number | null; serie: number[] }
  interface Etat { mesures: Mesure[]; boot: number | null; backup: number; gc: number; sessions: { id: number; type: string; actif: boolean }[] }
  const MESURES: { cle: string; label: string; unite: 'nb' | 'ko' }[] = [
    { cle: 'count_models', label: 'Modèles', unite: 'nb' }, { cle: 'count_sessions', label: 'Sessions', unite: 'nb' },
    { cle: 'count_users', label: 'Utilisateurs', unite: 'nb' }, { cle: 'ram_usage_res', label: 'Mémoire résidente', unite: 'ko' },
    { cle: 'ram_usage_virt', label: 'Mémoire virtuelle', unite: 'ko' },
  ];

  let statut: Modele | null = null;
  let lien: unknown = null;
  let etat = $state<Etat | null>(null);
  let erreur = $state<string | null>(null);
  let prevu = 0;

  function lire(s: Modele): Etat {
    const v = (m: any) => (m && typeof m.get === 'function' ? m.get() : undefined);
    const serie = (k: string) => String(v(s.data?.[k]) ?? '').split(';').map(Number).filter((x) => Number.isFinite(x));
    const sessions: Etat['sessions'] = [];
    for (let i = 0; i < (s.sessions?.length ?? 0); i++) sessions.push({ id: Number(v(s.sessions[i].id)), type: String(v(s.sessions[i].type)), actif: !!v(s.sessions[i].actif) });
    return {
      mesures: MESURES.map((m) => ({ ...m, valeur: Number.isFinite(Number(v(s[m.cle]))) ? Number(v(s[m.cle])) : null, serie: serie(m.cle) })),
      boot: Number(v(s.boot_timestamp)) || null, backup: Number(v(s.btn?.backup) ?? 0), gc: Number(v(s.btn?.garbageCollector) ?? 0), sessions,
    };
  }
  $effect(() => {
    charger<Modele>('/etc/Status').then((s) => {
      statut = s;
      etat = lire(s);
      lien = s.bind(() => { if (!prevu) prevu = requestAnimationFrame(() => { prevu = 0; etat = lire(s); }); }, false);
      compteurs.liensActifs++;
    }).catch((e) => (erreur = `Le hub n'expose pas son état (/etc/Status) : ${(e as Error).message}`));
  });
  onDestroy(() => { if (statut && lien) { statut.unbind(lien); compteurs.liensActifs--; } cancelAnimationFrame(prevu); });

  function lisible(m: Mesure): { v: string; u: string } {
    if (m.valeur === null) return { v: '—', u: '' };
    if (m.unite === 'ko') return m.valeur >= 1024 * 1024 ? { v: nombre(m.valeur / 1024 / 1024, 2), u: 'Go' } : { v: nombre(m.valeur / 1024, 0), u: 'Mo' };
    return m.valeur >= 1e6 ? { v: nombre(m.valeur / 1e6, 2), u: 'M' } : { v: nombre(m.valeur), u: '' };
  }
  function trace(serie: number[], l = 100, h = 30): string {
    if (serie.length < 2) return '';
    const min = Math.min(...serie), max = Math.max(...serie), e = max - min || 1;
    return serie.map((x, i) => `${i ? 'L' : 'M'}${((i / (serie.length - 1)) * l).toFixed(1)} ${(h - 3 - ((x - min) / e) * (h - 6)).toFixed(1)}`).join(' ');
  }

  // ---- courbe détaillée ----
  let choisie = $state('ram_usage_res');
  const m = $derived(etat?.mesures.find((x) => x.cle === choisie));
  let survol = $state<number | null>(null);
  const W = 640, H = 200, G = 52;
  const bornes = $derived.by(() => {
    const s = m?.serie ?? [];
    if (!s.length) return { min: 0, max: 1 };
    const min = Math.min(...s), max = Math.max(...s);
    const pad = (max - min) * 0.1 || Math.max(1, max * 0.05);
    return { min: Math.max(0, min - pad), max: max + pad };
  });
  const xy = (i: number, x: number, n: number) => [G + (i / Math.max(1, n - 1)) * (W - G - 8), 10 + (1 - (x - bornes.min) / (bornes.max - bornes.min)) * (H - 34)] as const;
  const chemin = $derived((m?.serie ?? []).map((x, i, a) => { const [px, py] = xy(i, x, a.length); return `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`; }).join(' '));
  const graduations = $derived([0, 0.5, 1].map((t) => bornes.min + t * (bornes.max - bornes.min)));
  const fmt = (x: number) => (m ? lisible({ ...m, valeur: x }) : { v: '', u: '' });

  // ---- maintenance (ADM-02) ----
  let confirmer = $state<null | 'backup' | 'gc' | 'clean'>(null);
  const v410 = $derived((() => { const v = session.identite?.version?.split('.').map(Number) ?? []; return v[0] > 4 || (v[0] === 4 && (v[1] > 1 || (v[1] === 1 && (v[2] ?? 0) >= 0))); })());
  const TEXTES = {
    backup: { titre: 'Sauvegarder la base maintenant ?', texte: 'Le hub écrit une copie de dump.db dans dump.bkp. Comptez de quelques secondes à quelques minutes selon la taille de la base ; le hub reste utilisable.', bouton: 'Sauvegarder' },
    gc: { titre: 'Lancer le ramasse-miettes ?', texte: 'Le hub libère les objets qui ne sont plus référencés. Il peut ralentir pendant l’opération (quelques minutes sur une grosse base).', bouton: 'Lancer le ramasse-miettes' },
    clean: { titre: 'Nettoyer data.db ?', texte: 'Supprime de data.db les données en vrac qui ne sont plus utilisées par aucun modèle. Opération longue sur une grosse base, sans retour arrière.', bouton: 'Nettoyer data.db' },
  };
  function lancer() {
    if (!statut || !confirmer) return;
    if (confirmer === 'backup') statut.btn.backup.set(1);
    else if (confirmer === 'gc') statut.btn.garbageCollector.set(1);
    else statut.btn.backup.set(2);
    notifier(`${TEXTES[confirmer].bouton} : demande envoyée au hub`, 'info');
    confirmer = null;
  }

  // ---- comptes (ADM-03, lecture) ----
  let comptes = $state<{ nom: string; id: number; type: number }[] | null>(null);
  let recherche = $state('');
  $effect(() => {
    charger<Modele>('/etc/users').then((u) => {
      const out = [];
      for (let i = 0; i < u.length; i++) out.push({ nom: String(u[i].name.get()), id: Number(u[i].id.get()), type: Number(u[i].type.get()) });
      comptes = out;
    }).catch(() => (comptes = []));
  });
  const comptesVus = $derived((comptes ?? []).filter((c) => !recherche || c.nom.toLowerCase().includes(recherche.toLowerCase()) || String(c.id).startsWith(recherche)));
  const sessionsDe = (id: number) => etat?.sessions.filter((s) => s.id === id && s.actif).length ?? 0;
</script>

<svelte:head><title>Administration du hub</title></svelte:head>

<div class="admin">
  <header class="tete">
    <div>
      <div class="sc-caption etat"><span class="pt" class:off={!!erreur}></span>{erreur ? 'Hub injoignable' : `Hub en ligne · SpinalHub ${session.identite?.version ?? '?'}`}{#if etat?.boot} · démarré <span title={dateExacte(etat.boot)}>{dateLisible(etat.boot)}</span>{/if}</div>
      <h1 class="sc-display">Administration du hub</h1>
    </div>
    <span class="sc-caption">Abonnements actifs : <span class="sc-value">{compteurs.liensActifs}</span></span>
  </header>

  {#if erreur}
    <ErrorState titre="État du hub indisponible" message={erreur} onretry={() => location.reload()} />
  {:else if !etat}
    <Skeleton forme="carte" />
  {:else}
    <div class="kpis">
      {#each etat.mesures as k (k.cle)}
        {@const l = lisible(k)}
        <button class="kpi" class:on={choisie === k.cle} onclick={() => (choisie = k.cle)} aria-pressed={choisie === k.cle}>
          <span class="sc-caption">{k.label}</span>
          <span class="sc-readout">{l.v}{#if l.u}<small>&nbsp;{l.u}</small>{/if}</span>
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d={trace(k.serie)} fill="none" stroke={k.unite === 'ko' ? 'var(--sc-accent)' : 'var(--sc-info)'} stroke-width="1.6" vector-effect="non-scaling-stroke" /></svg>
        </button>
      {/each}
    </div>

    <div class="grille">
      <section class="carte courbe">
        <div class="ct"><h2 class="sc-subtitle">{m?.label}</h2><span class="sc-caption">{m?.serie.length ?? 0} relevés du hub · valeur au survol</span></div>
        {#if (m?.serie.length ?? 0) < 2}
          <p class="sc-caption vide">Pas encore assez de mesures.</p>
        {:else}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <svg viewBox="0 0 {W} {H}" class="graphe" role="img" aria-label="Historique de {m?.label}"
            onmousemove={(e) => { const r = (e.currentTarget as SVGElement).getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * W; const n = m!.serie.length; survol = Math.max(0, Math.min(n - 1, Math.round(((x - G) / (W - G - 8)) * (n - 1)))); }}
            onmouseleave={() => (survol = null)}>
            {#each graduations as g}
              {@const y = xy(0, g, 2)[1]}
              <line x1={G} x2={W - 8} y1={y} y2={y} class="grad" /><text x={G - 6} y={y + 4} text-anchor="end" class="axe">{fmt(g).v} {fmt(g).u}</text>
            {/each}
            <path d="{chemin} L{W - 8} {H - 24} L{G} {H - 24}Z" class="aire" />
            <path d={chemin} class="ligne" />
            {#if survol !== null && m}
              {@const [px, py] = xy(survol, m.serie[survol], m.serie.length)}
              {@const f = fmt(m.serie[survol])}
              <line x1={px} x2={px} y1="10" y2={H - 24} class="curseur" /><circle cx={px} cy={py} r="4.5" class="pt-c" />
              <g transform="translate({Math.min(px + 8, W - 120)} 14)"><rect width="110" height="26" rx="6" class="bulle" /><text x="10" y="17" class="bulle-t">{f.v} {f.u}</text></g>
            {/if}
            <text x={G} y={H - 6} class="axe">plus ancien</text><text x={W - 8} y={H - 6} text-anchor="end" class="axe">maintenant</text>
          </svg>
        {/if}
      </section>

      <section class="carte maint">
        <h2 class="sc-subtitle pad">Maintenance</h2>
        <div class="op">
          <span class="ic"><Icon icon={HardDrive} /></span>
          <div><div class="sc-label">Sauvegarde</div><div class="sc-caption">{etat.backup === 1 ? 'En cours…' : 'Copie de la base dans dump.bkp'}</div></div>
          <Button size="sm" disabled={etat.backup !== 0} raison="Une opération est déjà en cours" onclick={() => (confirmer = 'backup')}>{#if etat.backup === 1}<Spinner size={12} />En cours{:else}Sauvegarder{/if}</Button>
        </div>
        <div class="op">
          <span class="ic"><Icon icon={Recycle} /></span>
          <div><div class="sc-label">Ramasse-miettes</div><div class="sc-caption">{etat.gc ? 'En cours…' : 'Libère les objets non référencés'}</div></div>
          <Button size="sm" disabled={etat.gc !== 0} raison="Le ramasse-miettes tourne déjà" onclick={() => (confirmer = 'gc')}>{#if etat.gc}<Spinner size={12} />En cours{:else}Lancer{/if}</Button>
        </div>
        {#if v410}
          <div class="op">
            <span class="ic"><Icon icon={Database} /></span>
            <div><div class="sc-label">Nettoyer data.db</div><div class="sc-caption">{etat.backup === 2 ? 'En cours…' : 'Données en vrac orphelines (hub 4.1.0+)'}</div></div>
            <Button size="sm" disabled={etat.backup !== 0} raison="Une opération est déjà en cours" onclick={() => (confirmer = 'clean')}>{#if etat.backup === 2}<Spinner size={12} />En cours{:else}Nettoyer…{/if}</Button>
          </div>
        {/if}
        <p class="sc-caption pad note"><Icon icon={Info} size={14} />Le bouton reste bloqué tant que le hub n'a pas remis son drapeau à zéro : on ne peut pas lancer deux fois la même opération.</p>
      </section>
    </div>

    <section class="carte comptes">
      <div class="ct pad"><h2 class="sc-subtitle">Comptes du hub · {comptes?.length ?? '…'}</h2>
        <div class="rech"><TextInput type="search" icon={Search} bind:value={recherche} placeholder="Rechercher un compte" size="sm" clearable /></div></div>
      <div class="lc entete" role="row"><span></span><span>Compte</span><span>Type</span><span>Sessions ouvertes</span></div>
      {#if comptes === null}<div class="pad"><Skeleton lignes={3} /></div>{/if}
      {#each comptesVus as c (c.id)}
        <div class="lc" role="row">
          <Avatar nom={c.nom} />
          <div><div class="sc-label">{c.nom}{#if c.nom === 'admin'} <Badge icon={ShieldCheck}>système</Badge>{/if}</div><div class="sc-caption">id {c.id}{c.nom === 'admin' ? ' · mot de passe géré par le déploiement' : ''}</div></div>
          <span>{c.type === 0 ? 'Administrateur' : 'Utilisateur'}</span>
          <span class="sc-value">{sessionsDe(c.id) || '—'}</span>
        </div>
      {/each}
      <p class="sc-caption pad">Création, suppression et droits des comptes : à décider (O-2). Le hub expose déjà les routes nécessaires.</p>
    </section>
  {/if}
</div>

{#if confirmer}
  <Dialog open={true} titre={TEXTES[confirmer].titre} icone={confirmer === 'backup' ? HardDrive : confirmer === 'gc' ? Recycle : Database} ton={confirmer === 'clean' ? 'warn' : 'neutre'}>
    <p class="sc-text-2">{TEXTES[confirmer].texte}</p>
    {#snippet pied()}<Button variant="ghost" onclick={() => (confirmer = null)}>Annuler</Button><Button variant="primary" onclick={lancer}>{TEXTES[confirmer!].bouton}</Button>{/snippet}
  </Dialog>
{/if}

<style>
  .admin { flex: 1; overflow: auto; padding: 24px 32px 48px; max-width: 1280px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
  .tete { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
  .etat { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
  .pt { width: 8px; height: 8px; border-radius: 50%; background: var(--sc-ok); } .pt.off { background: var(--sc-danger); }
  .kpis { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
  .kpi { display: flex; flex-direction: column; gap: 6px; padding: 14px 16px; text-align: left; border-radius: var(--sc-r-card); border: 1px solid var(--sc-line); background: var(--sc-sheet); box-shadow: var(--sc-shadow-1); color: inherit; font: inherit; }
  .kpi:hover { border-color: var(--sc-line-3); }
  .kpi.on { border-color: var(--sc-accent); box-shadow: 0 0 0 1px var(--sc-accent); }
  .kpi small { font: 400 13px var(--sc-sans); color: var(--sc-muted); }
  .kpi svg { width: 100%; height: 30px; }
  .grille { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 20px; align-items: start; }
  .carte { background: var(--sc-sheet); border: 1px solid var(--sc-line); border-radius: var(--sc-r-card); box-shadow: var(--sc-shadow-1); }
  .courbe { padding: 16px 18px; }
  .ct { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .graphe { width: 100%; height: auto; margin-top: 8px; display: block; }
  .grad { stroke: var(--sc-line); }
  .axe { font: 400 11px var(--sc-mono); fill: var(--sc-muted); }
  .aire { fill: var(--sc-accent); fill-opacity: .1; }
  .ligne { fill: none; stroke: var(--sc-accent); stroke-width: 2; }
  .curseur { stroke: var(--sc-text-2); stroke-dasharray: 3 3; }
  .pt-c { fill: var(--sc-sheet); stroke: var(--sc-accent); stroke-width: 2; }
  .bulle { fill: var(--sc-ink); } .bulle-t { font: 500 12.5px var(--sc-mono); fill: var(--sc-on-ink); }
  .vide { padding: 40px 0; text-align: center; }
  .pad { padding: 14px 18px 6px; }
  .op { display: grid; grid-template-columns: 36px 1fr auto; gap: 12px; align-items: center; padding: 12px 18px; border-top: 1px solid var(--sc-line); }
  .ic { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; background: var(--sc-ground-2); color: var(--sc-text-2); }
  .note { display: flex; gap: 6px; align-items: flex-start; padding-bottom: 14px; }
  .rech { width: 260px; }
  .lc { display: grid; grid-template-columns: 36px 1fr 160px 150px; gap: 12px; align-items: center; padding: 10px 18px; border-top: 1px solid var(--sc-line); }
  .entete { font: 500 12px var(--sc-sans); color: var(--sc-muted); padding-top: 8px; padding-bottom: 8px; }
  @media (max-width: 1100px) { .kpis { grid-template-columns: repeat(3, 1fr); } .grille { grid-template-columns: 1fr; } }
</style>
