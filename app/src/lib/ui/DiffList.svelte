<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  import Checkbox from './Checkbox.svelte';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Plus from '@lucide/svelte/icons/plus';
  import Minus from '@lucide/svelte/icons/minus';
  import PencilLine from '@lucide/svelte/icons/pencil-line';
  import Equal from '@lucide/svelte/icons/equal';
  import Icon from './Icon.svelte';
  import type { Snippet } from 'svelte';

  export interface Diff { id: string; genre: 'ajout' | 'suppression' | 'modification' | 'inchange'; nom: string; avant?: string; apres?: string }
  /** Différences groupées avec compteurs, ancienne → nouvelle valeur, cases facultatives, action par ligne. */
  let { diffs, choisis = $bindable<string[]>([]), cochable = false, action }:
    { diffs: Diff[]; choisis?: string[]; cochable?: boolean; action?: Snippet<[Diff]> } = $props();
  const GROUPES = [
    { genre: 'ajout', titre: 'Ajouts', icone: Plus, ton: 'ok' },
    { genre: 'suppression', titre: 'Suppressions', icone: Minus, ton: 'danger' },
    { genre: 'modification', titre: 'Modifications', icone: PencilLine, ton: 'info' },
    { genre: 'inchange', titre: 'Inchangés', icone: Equal, ton: 'neutre' },
  ] as const;
</script>

<div class="sc-diff">
  {#each GROUPES as g}
    {@const items = diffs.filter((d) => d.genre === g.genre)}
    {#if items.length}
      <details open={g.genre !== 'inchange'}>
        <summary><ChevronRight size={14} /><span class="ic {g.ton}"><Icon icon={g.icone} size={12} /></span><b>{g.titre}</b><span class="sc-value sc-muted">{items.length}</span></summary>
        <ul>
          {#each items as d (d.id)}
            <li>
              {#if cochable && g.genre !== 'inchange'}<Checkbox label="Appliquer « {d.nom} »" masquerLabel checked={choisis.includes(d.id)}
                onchange={() => (choisis = choisis.includes(d.id) ? choisis.filter((x) => x !== d.id) : [...choisis, d.id])} />{/if}
              <span class="nom">{d.nom}</span>
              {#if d.genre === 'modification'}<span class="val"><s>{d.avant}</s> → <span>{d.apres}</span></span>{/if}
              {#if action}<span class="act">{@render action(d)}</span>{/if}
            </li>
          {/each}
        </ul>
      </details>
    {/if}
  {/each}
</div>

<style>
  .sc-diff { display: flex; flex-direction: column; gap: 6px; }
  summary { display: flex; align-items: center; gap: 8px; padding: 6px 4px; cursor: pointer; list-style: none; }
  details[open] > summary > :global(svg) { transform: rotate(90deg); }
  b { font-weight: 600; }
  .ic { width: 18px; height: 18px; border-radius: 5px; display: grid; place-items: center; background: var(--sc-ground-2); color: var(--sc-text-2); }
  .ok { background: var(--sc-ok-soft); color: var(--sc-ok); } .danger { background: var(--sc-danger-soft); color: var(--sc-danger); } .info { background: var(--sc-info-soft); color: var(--sc-info); }
  ul { list-style: none; margin: 0 0 0 22px; padding: 0; }
  li { display: flex; align-items: center; gap: 10px; min-height: 32px; padding: 0 8px; border-radius: 6px; }
  li:hover { background: var(--sc-sheet-hover); }
  .nom { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .val { font: 400 12.5px/18px var(--sc-mono); color: var(--sc-text-2); white-space: nowrap; }
  s { color: var(--sc-muted); }
  .act { opacity: 0; } li:hover .act, .act:focus-within { opacity: 1; }
</style>
