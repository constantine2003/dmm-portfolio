<script lang="ts">
  import { onMount } from 'svelte';

  type Tile = { src: string; label: string; fallback: string };

  const baseTiles: Tile[] = [
    { src: '/thumbnail_healthsense.png',  label: 'HealthSense',   fallback: '#C8C3BB' },
    { src: '/thumbnail_svelteskill.png',  label: 'SvelteSkill',   fallback: '#B8A99A' },
    { src: '/thumbnail_macroloop.png',    label: 'MacroLoop',     fallback: '#A89C8C' },
    { src: '/thumbnail_archive.png',      label: 'ArchiveStream', fallback: '#D4C4B0' },
    { src: '/thumbnail_sabong.png',       label: 'Sabong',        fallback: '#9C9388' },
    { src: '/thumbnail_morphai.png',      label: 'Morph.AI',      fallback: '#BFAE9C' },
  ];

  // grid is 5 columns x 3 rows = 15 tiles. Cycle the base set to fill it.
  const COLS = 5;
  const ROWS = 3;
  const TOTAL = COLS * ROWS;

  const tiles: Tile[] = shuffledTiles();

  // picks a tile per slot, avoiding a repeat of the tile directly to the left
  // or directly above it — stops the same thumbnail lining up 3-in-a-row
  function shuffledTiles(): Tile[] {
    const result: Tile[] = [];
    const maxAttempts = 50;

    for (let i = 0; i < TOTAL; i++) {
      const row = Math.floor(i / COLS);
      const col = i % COLS;
      const leftIdx = col > 0 ? i - 1 : -1;
      const topIdx = row > 0 ? i - COLS : -1;

      let choice: Tile;
      let attempts = 0;
      do {
        choice = baseTiles[Math.floor(Math.random() * baseTiles.length)];
        attempts++;
      } while (
        attempts < maxAttempts &&
        ((leftIdx >= 0 && result[leftIdx] === choice) ||
          (topIdx >= 0 && result[topIdx] === choice))
      );

      result.push(choice);
    }

    return result;
  }

  // how far (px) each column starts offset downward before settling.
  // center column = 0, outer columns = a much larger drop -> sharp, steep "V"
  function columnOffset(col: number): number {
    const center = (COLS - 1) / 2;
    const dist = Math.abs(col - center);
    return Math.pow(dist, 1.15) * 480; // px — big multiplier = sharp V
  }

  let gridEl = $state<HTMLElement | null>(null);
  let progress = $state(0); // smoothed, rendered value (0 = V, 1 = flat/aligned)

  onMount(() => {
    let rafId: number;
    let target = 0;

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

    // Nothing happens until the grid's last row is still this many viewport-heights
    // below the fold. Bigger number = you have to scroll a lot further before
    // anything reacts.
    const START_MULT = 1.7;

    // The animation finishes exactly when the TOP of the last row reaches this
    // fraction of the viewport height. 0.5 = vertical center, i.e. "bottom half
    // of the screen" starts here — tune down (e.g. 0.4) to finish a bit later.
    const END_FRACTION = 0.5;

    const computeTarget = () => {
      if (!gridEl) return;
      const rect = gridEl.getBoundingClientRect();
      const vh = window.innerHeight;

      // approximate top of the last (3rd) row: 2/3 of the way down the grid
      const lastRowTopY = rect.top + rect.height * (2 / 3);

      const startY = vh * START_MULT;
      const endY = vh * END_FRACTION;

      target = clamp((startY - lastRowTopY) / (startY - endY), 0, 1);
    };

    const loop = () => {
      // smooth chase toward the target instead of snapping 1:1 with scroll
      progress += (target - progress) * 0.16;
      if (Math.abs(target - progress) < 0.001) progress = target;
      rafId = requestAnimationFrame(loop);
    };

    const onScroll = () => computeTarget();

    computeTarget();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  });

  // ease-out cubic on top of the lerp, for a slightly snappier final settle
  function ease(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }
</script>

<section
  class="relative w-full overflow-hidden bg-[#F3EFE9] py-15"
  aria-hidden="true"
>
  <div class="flex w-full justify-center">
    <div
      bind:this={gridEl}
      class="grid shrink-0 gap-[clamp(14px,1.8vw,28px)]"
      style="grid-template-columns: repeat({COLS}, clamp(260px, 25vw, 450px));"
    >
      {#each tiles as tile, i (i)}
        {@const col = i % COLS}
        {@const eased = ease(progress)}
        {@const ty = columnOffset(col) * (1 - eased)}
        <div
          class="relative aspect-square w-full overflow-hidden shadow-[0_16px_40px_rgba(24,21,18,0.14)] will-change-transform"
          style="
            background: {tile.fallback};
            transform: translateY({ty}px);
          "
        >
          <img
            src={tile.src}
            alt=""
            class="h-full w-full object-cover"
            loading="lazy"
            onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  @media (prefers-reduced-motion: reduce) {
    [style*="will-change"] { transform: none !important; }
  }
</style>