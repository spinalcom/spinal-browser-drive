<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Dialog from './Dialog.svelte';
  import Kbd from './Kbd.svelte';
  import Keyboard from '@lucide/svelte/icons/keyboard';
  let { open = $bindable(false), groupes }: { open?: boolean; groupes: { titre: string; raccourcis: { touches: string; effet: string }[] }[] } = $props();
  $effect(() => {
    const f = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '?' && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) { e.preventDefault(); open = true; }
    };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  });
</script>

<Dialog bind:open titre="Raccourcis clavier" icone={Keyboard} largeur={620}>
  <div class="g">
    {#each groupes as g}
      <section><div class="sc-group">{g.titre}</div>
        <dl>{#each g.raccourcis as r}<div class="r"><dt><Kbd keys={r.touches} /></dt><dd>{r.effet}</dd></div>{/each}</dl></section>
    {/each}
  </div>
</Dialog>

<style>
  .g { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 28px; }
  dl { margin: 8px 0 0; }
  .r { display: grid; grid-template-columns: 110px 1fr; gap: 10px; align-items: center; min-height: 28px; }
  dd { margin: 0; color: var(--sc-text-2); }
</style>
