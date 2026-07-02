<script lang="ts">
  import { onMount } from 'svelte';

  let dotEl = $state<HTMLElement | null>(null);
  let labelEl = $state<HTMLElement | null>(null);
  let label = $state('');

  onMount(() => {
    let rafId: number;
    let cx = -100, cy = -100;
    let tx = -100, ty = -100;
    let visible = false;
    let isDown = false;

    const LERP_IDLE = 0.35;
    const LERP_DRAG = 0.85;

    function tick() {
      const lerp = isDown ? LERP_DRAG : LERP_IDLE;
      cx += (tx - cx) * lerp;
      cy += (ty - cy) * lerp;

      const transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (dotEl) {
        dotEl.style.transform = `${transform} scale(${isDown ? 1.4 : 1})`;
        dotEl.style.opacity = visible && !label ? '1' : '0';
      }
      if (labelEl) {
        labelEl.style.transform = transform;
        labelEl.style.opacity = visible && label ? '1' : '0';
      }

      rafId = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      visible = true;

      const target = (e.target as HTMLElement)?.closest('[data-cursor]');
      label = target?.getAttribute('data-cursor') ?? '';
    }

    function onDown() { isDown = true; }
    function onUp()   { isDown = false; }
    function onLeave() { visible = false; }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mouseleave', onLeave);
    };
  });
</script>

<div bind:this={dotEl} class="cursor-dot" aria-hidden="true"></div>
<div bind:this={labelEl} class="cursor-label" aria-hidden="true">{label}</div>

<style>
  .cursor-dot {
    pointer-events: none;
    position: fixed;
    top: -6px;
    left: -6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    mix-blend-mode: difference;
    opacity: 0;
    z-index: 9999;
    will-change: transform, opacity;
    transition: opacity 0.15s ease, transform 0.1s ease;
  }

  .cursor-label {
    pointer-events: none;
    position: fixed;
    top: -22px;
    left: -34px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 68px;
    height: 44px;
    border-radius: 999px;
    background: #F3EFE9;
    color: #181512;
    font-size: 0.6875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0;
    z-index: 9999;
    will-change: transform, opacity;
    transition: opacity 0.2s ease;
  }

  @media (hover: none) {
    .cursor-dot, .cursor-label { display: none; }
  }

  :global(*) { cursor: none !important; }

  @media (hover: none) {
    :global(*) { cursor: auto !important; }
  }
</style>