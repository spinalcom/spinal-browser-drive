<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
<script lang="ts">
  /** Nuancier de la palette de données + hexadécimal + sélecteur natif. */
  let { value = $bindable('#4a79c6'), label }: { value?: string; label: string } = $props();
  const PALETTE = Array.from({ length: 12 }, (_, i) => `var(--sc-data-${i + 1})`);
  let resolues = $state<string[]>([]);
  let racine = $state<HTMLElement>();
  $effect(() => {
    if (!racine) return;
    const cs = getComputedStyle(racine);
    resolues = PALETTE.map((_, i) => cs.getPropertyValue(`--sc-data-${i + 1}`).trim());
  });
  const valide = $derived(/^#[0-9a-f]{6}$/i.test(value));
  let brut = $state(value);
  $effect(() => { brut = value; });
</script>

<div class="sc-color" bind:this={racine} role="group" aria-label={label}>
  <div class="nuancier">
    {#each resolues as c, i}
      <button type="button" class="pot" class:on={c.toLowerCase() === value.toLowerCase()} style:background={c}
        aria-label="Teinte {i + 1}" aria-pressed={c.toLowerCase() === value.toLowerCase()} onclick={() => (value = c)}></button>
    {/each}
  </div>
  <div class="ligne">
    <label class="natif" style:background={valide ? value : 'transparent'}>
      <input type="color" value={valide ? value : '#000000'} oninput={(e) => (value = e.currentTarget.value)} aria-label="Choisir une couleur" />
    </label>
    <div class="sc-control sm hex" class:invalide={!/^#[0-9a-f]{6}$/i.test(brut)}>
      <input value={brut} maxlength={7} aria-label="Couleur hexadécimale"
        oninput={(e) => { brut = e.currentTarget.value; if (/^#[0-9a-f]{6}$/i.test(brut)) value = brut.toLowerCase(); }} />
    </div>
  </div>
</div>

<style>
  .sc-color { display: flex; flex-direction: column; gap: 8px; width: 232px; }
  .nuancier { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .pot { aspect-ratio: 1; border-radius: 8px; border: 0; padding: 0; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); }
  .pot.on { outline: 2px solid var(--sc-focus); outline-offset: 2px; }
  .ligne { display: flex; gap: 8px; align-items: center; }
  .natif { width: 28px; height: 28px; border-radius: 8px; flex: none; box-shadow: inset 0 0 0 1px var(--sc-line-field); cursor: pointer; position: relative; overflow: hidden; }
  .natif input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .hex { flex: 1; }
  .hex input { font-family: var(--sc-mono); font-size: 12.5px; text-transform: lowercase; }
</style>
