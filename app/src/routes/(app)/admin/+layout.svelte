<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<!-- L'administration n'est visible que pour une session administrateur du hub. -->
<script lang="ts">
  import { session } from '$lib/hub/session.svelte';
  import EmptyState from '$lib/ui/EmptyState.svelte';
  import Button from '$lib/ui/Button.svelte';
  import { base } from '$app/paths';
  import ShieldAlert from '@lucide/svelte/icons/shield-alert';
  let { children } = $props();
</script>

{#if session.identite?.admin}
  {@render children()}
{:else}
  <div class="refus">
    <EmptyState icone={ShieldAlert} titre="Réservé aux administrateurs du hub" texte="Le compte « {session.identite?.utilisateur} » n'a pas les droits d'administration du hub.">
      {#snippet actions()}<Button href="{base}/drive">Retour au Drive</Button>{/snippet}
    </EmptyState>
  </div>
{/if}

<style>.refus { flex: 1; display: grid; place-items: center; }</style>
