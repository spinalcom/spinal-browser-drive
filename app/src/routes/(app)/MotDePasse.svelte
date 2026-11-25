<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<!-- Changement de mot de passe (ADM-04). Le compte admin est géré par le déploiement : on bloque. -->
<script lang="ts">
  import Dialog from '$lib/ui/Dialog.svelte';
  import Button from '$lib/ui/Button.svelte';
  import Field from '$lib/ui/Field.svelte';
  import TextInput from '$lib/ui/TextInput.svelte';
  import { notifier } from '$lib/ui/toasts.svelte';
  import { session, changerMotDePasse } from '$lib/hub/session.svelte';
  import KeyRound from '@lucide/svelte/icons/key-round';

  let { open = $bindable(false) } = $props();
  let ancien = $state(''), nouveau = $state(''), confirmation = $state('');
  let erreur = $state(''), enCours = $state(false);
  const REGLE = /^[A-Za-z0-9._~-]{12,128}$/;
  const estAdmin = $derived(session.identite?.utilisateur === 'admin');
  const probleme = $derived(
    !nouveau ? '' : !REGLE.test(nouveau) ? '12 à 128 caractères parmi lettres, chiffres et . _ ~ -' : confirmation && confirmation !== nouveau ? 'Les deux saisies diffèrent.' : '');

  async function valider() {
    erreur = '';
    enCours = true;
    try {
      await changerMotDePasse(ancien, nouveau);
      notifier('Mot de passe changé');
      open = false;
      ancien = nouveau = confirmation = '';
    } catch (e) { erreur = String((e as Error).message); } finally { enCours = false; }
  }
</script>

<Dialog bind:open titre="Changer le mot de passe" icone={KeyRound} description="Compte {session.identite?.utilisateur}">
  {#if estAdmin}
    <p class="bloque">Le mot de passe du compte <b>admin</b> est fixé par la configuration de déploiement (<code>HUB_ADMIN_PASSWORD</code>).
      Le changer ici désynchroniserait l'API BOS, la forge et les autres services. Passez par la procédure de déploiement.</p>
  {:else}
    <div class="champs">
      <Field id="mdp-a" label="Mot de passe actuel"><TextInput id="mdp-a" type="password" bind:value={ancien} autocomplete="current-password" /></Field>
      <Field id="mdp-n" label="Nouveau mot de passe" description="12 à 128 caractères : lettres, chiffres et . _ ~ -" erreur={probleme || undefined}>
        <TextInput id="mdp-n" type="password" bind:value={nouveau} autocomplete="new-password" invalide={!!probleme} /></Field>
      <Field id="mdp-c" label="Confirmation"><TextInput id="mdp-c" type="password" bind:value={confirmation} autocomplete="new-password" /></Field>
      {#if erreur}<p class="err" role="alert">{erreur}</p>{/if}
    </div>
  {/if}
  {#snippet pied()}
    <Button variant="ghost" onclick={() => (open = false)}>{estAdmin ? 'Fermer' : 'Annuler'}</Button>
    {#if !estAdmin}
      <Button variant="primary" onclick={valider} loading={enCours} disabled={!ancien || !nouveau || !!probleme || confirmation !== nouveau} raison="Remplissez les trois champs">Changer le mot de passe</Button>
    {/if}
  {/snippet}
</Dialog>

<style>
  .champs { display: flex; flex-direction: column; gap: 14px; }
  .bloque { padding: 12px 14px; border-radius: 10px; background: var(--sc-warn-soft); color: var(--sc-text); line-height: 20px; }
  .err { color: var(--sc-danger); font-size: 13px; }
  code { font: 400 12px var(--sc-mono); }
</style>
