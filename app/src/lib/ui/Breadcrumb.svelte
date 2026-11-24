<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Menu from './Menu.svelte';
  /** Fil d'Ariane : premier et deux derniers segments visibles, le milieu replié dans un menu. */
  let { segments, max = 4 }: { segments: { label: string; href?: string; onclick?: () => void }[]; max?: number } = $props();
  const replies = $derived(segments.length > max ? segments.slice(1, segments.length - (max - 2)) : []);
  const visibles = $derived(segments.length > max ? [segments[0], null, ...segments.slice(segments.length - (max - 2))] : segments);
</script>

<nav class="sc-crumbs" aria-label="Fil d’Ariane">
  <ol>
    {#each visibles as s, i}
      {#if i > 0}<li class="sep" aria-hidden="true"><ChevronRight size={14} /></li>{/if}
      <li class="seg">
        {#if s === null}
          <Menu elements={replies.map((r, k) => ({ id: String(k), label: r.label, executer: () => (r.onclick ? r.onclick() : r.href && (location.href = r.href)) }))}>
            {#snippet trigger(props)}<button {...props} class="lien" aria-label="Dossiers intermédiaires">…</button>{/snippet}
          </Menu>
        {:else if i === visibles.length - 1}
          <span class="courant" aria-current="page">{s.label}</span>
        {:else if s.href}<a class="lien" href={s.href}>{s.label}</a>
        {:else}<button class="lien" onclick={s.onclick}>{s.label}</button>{/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  ol { display: flex; align-items: center; gap: 2px; list-style: none; margin: 0; padding: 0; min-width: 0; }
  .seg { min-width: 0; display: flex; }
  .sep { color: var(--sc-muted); display: flex; }
  .lien { border: 0; background: none; padding: 4px 6px; border-radius: 6px; color: var(--sc-text-2); text-decoration: none; font: 500 14px/20px var(--sc-sans);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
  .lien:hover { background: var(--sc-ground-2); color: var(--sc-text); }
  .courant { padding: 4px 6px; font: 600 14px/20px var(--sc-sans); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
