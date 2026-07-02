<script lang="ts">
  import { onMount } from 'svelte';

  let canvas = $state<HTMLCanvasElement | null>(null);

  onMount(() => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;

    const COLS  = 28;
    const ROWS  = 16;
    const SPEED = 0.38;
    const AMP   = 36;
    const COLOR = '#181512';
    const ALPHA = 0.065;

    function resize() {
      const dpr = devicePixelRatio ?? 1;
      canvas!.width  = canvas!.offsetWidth  * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function getY(c: number, r: number, w: number, h: number): number {
      const cx = c / COLS;
      const ry = r / ROWS;
      return (
        r * (h / ROWS) +
        Math.sin(cx * Math.PI * 2.8 + ry * Math.PI * 1.2 + t * 0.012) * AMP * 0.65 +
        Math.sin(cx * Math.PI * 1.4 + ry * Math.PI * 2.6 + t * 0.019) * AMP * 0.35
      );
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = COLOR;
      ctx.lineWidth   = 0.8;
      ctx.globalAlpha = ALPHA;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';

      // ── horizontal wave lines ──────────────────────────────────
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c <= COLS; c++) {
          const x = (c / COLS) * w;
          const y = getY(c, r, w, h);
          if (c === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // ── vertical connectors (every 4th column) ─────────────────
      for (let c = 0; c <= COLS; c += 4) {
        ctx.beginPath();
        for (let r = 0; r <= ROWS; r++) {
          const x = (c / COLS) * w;
          const y = getY(c, r, w, h);
          if (r === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      t += SPEED;
      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas!);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="absolute inset-0 h-full w-full"
  aria-hidden="true"
></canvas>