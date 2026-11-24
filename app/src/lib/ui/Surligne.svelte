<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  /** Surligne le terme recherché dans un texte (insensible à la casse). */
  let { texte, terme = '' }: { texte: string; terme?: string } = $props();
  const parts = $derived.by(() => {
    if (!terme) return [{ t: texte, m: false }];
    const out: { t: string; m: boolean }[] = []; const bas = texte.toLowerCase(); let i = 0;
    for (let j = bas.indexOf(terme); j >= 0; j = bas.indexOf(terme, i)) { if (j > i) out.push({ t: texte.slice(i, j), m: false }); out.push({ t: texte.slice(j, j + terme.length), m: true }); i = j + terme.length; }
    if (i < texte.length) out.push({ t: texte.slice(i), m: false });
    return out;
  });
</script>

{#each parts as p}{#if p.m}<mark>{p.t}</mark>{:else}{p.t}{/if}{/each}

<style>
  mark { background: var(--sc-selection-text); color: inherit; border-radius: 2px; padding: 0 1px; }
</style>
