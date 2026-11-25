<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<!-- Connexion (DR-01) : erreurs distinguées, mot de passe gardé pour l'onglet seulement, retour à la page demandée. -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { connecter, reprendre, EchecConnexion, session } from '$lib/hub/session.svelte';
  import Button from '$lib/ui/Button.svelte';
  import Field from '$lib/ui/Field.svelte';
  import TextInput from '$lib/ui/TextInput.svelte';
  import Checkbox from '$lib/ui/Checkbox.svelte';
  import Icon from '$lib/ui/Icon.svelte';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import Unplug from '@lucide/svelte/icons/unplug';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';

  const suite = $derived(page.url.searchParams.get('suite') ?? `${base}/drive`);
  let utilisateur = $state('admin');
  let mdp = $state('');
  let admin = $state(page.url.searchParams.get('admin') === '1');
  let erreur = $state<{ code: string; message: string } | null>(null);
  let enCours = $state(false);

  $effect(() => { reprendre().then((ok) => { if (ok) goto(suite, { replaceState: true }); }); });

  async function valider(e: SubmitEvent) {
    e.preventDefault();
    erreur = null;
    enCours = true;
    try {
      await connecter(utilisateur, mdp, admin);
      goto(admin && !page.url.searchParams.get('suite') ? `${base}/admin` : suite, { replaceState: true });
    } catch (err) {
      erreur = err instanceof EchecConnexion ? { code: err.code, message: err.message } : { code: 'inconnu', message: String(err) };
    } finally {
      enCours = false;
    }
  }
</script>

<svelte:head><title>Connexion — SpinalCore</title></svelte:head>

<div class="page">
  <section class="art" aria-hidden="true">
    <div class="marque"><span class="logo"></span>SpinalCore</div>
    <div class="txt">
      <h2>Le Drive et le Studio du jumeau numérique.</h2>
      <p>Déposez vos maquettes, préparez le jumeau, structurez les espaces et raccordez le bâtiment.</p>
    </div>
    <svg class="iso" viewBox="0 0 400 300"><g fill="none" stroke="#3d566d" stroke-width="1.2">
      <path d="M200 20 340 90 340 230 200 290 60 230 60 90Z" fill="#17242f" /><path d="M60 90 200 160 340 90M200 160v130" />
      <path d="M60 137 200 207 340 137M60 183 200 253 340 183" stroke-opacity=".6" /></g>
      <path d="M200 160 340 90 340 137 200 207Z" fill="#ff7a00" fill-opacity=".4" />
      <path d="M200 207 340 137 340 183 200 253Z" fill="#ff7a00" fill-opacity=".14" /></svg>
    <div class="hote">Hub · {location.host}</div>
  </section>

  <section class="formulaire">
    <form onsubmit={valider} novalidate>
      <div><h1 class="sc-display">Connexion</h1><p class="sc-caption">Compte du hub SpinalCore</p></div>
      {#if erreur}
        <div class="err" role="alert">
          <Icon icon={erreur.code === 'hub-injoignable' ? Unplug : CircleAlert} />
          <span>{erreur.message}</span>
        </div>
      {/if}
      <Field id="u" label="Identifiant"><TextInput id="u" bind:value={utilisateur} size="lg" autocomplete="username" invalide={erreur?.code === 'identifiants'} /></Field>
      <Field id="p" label="Mot de passe"><TextInput id="p" type="password" bind:value={mdp} size="lg" autocomplete="current-password" invalide={erreur?.code === 'identifiants'} /></Field>
      <Checkbox bind:checked={admin} label="Administration du hub" />
      <Button type="submit" variant="primary" size="lg" loading={enCours || session.etat === 'connexion'}>Se connecter</Button>
      <p class="sc-caption note"><Icon icon={ShieldCheck} size={14} />Le mot de passe n'est conservé que pour cet onglet.</p>
    </form>
  </section>
</div>

<style>
  .page { display: grid; grid-template-columns: 1.1fr 1fr; min-height: 100vh; }
  .art { position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: 48px;
    background: radial-gradient(120% 100% at 20% 10%, #26384a 0, var(--sc-ink) 55%, #0c151e 100%); color: var(--sc-on-ink); }
  .marque { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 16px; position: relative; z-index: 1; }
  .logo { width: 22px; height: 22px; border-radius: 6px; background: var(--sc-accent); position: relative; }
  .logo::after { content: ''; position: absolute; inset: 6px; border-radius: 2px; background: var(--sc-ink); }
  .txt { position: relative; z-index: 1; max-width: 440px; display: flex; flex-direction: column; gap: 12px; }
  h2 { font: 600 34px/40px var(--sc-sans); letter-spacing: -.02em; }
  .txt p { color: var(--sc-on-ink-2); font-size: 15px; line-height: 23px; }
  .iso { position: absolute; right: -60px; bottom: -40px; width: 82%; }
  .hote { position: relative; z-index: 1; font: 400 12px var(--sc-mono); color: var(--sc-on-ink-2); }
  .formulaire { display: grid; place-items: center; padding: 48px; }
  form { width: min(380px, 100%); display: flex; flex-direction: column; gap: 18px; }
  .err { display: flex; gap: 10px; padding: 12px 14px; border-radius: 10px; background: var(--sc-danger-soft); color: var(--sc-danger); font-size: 13px; }
  .note { display: flex; gap: 6px; align-items: center; }
  @media (max-width: 860px) { .page { grid-template-columns: 1fr; } .art { display: none; } }
</style>
