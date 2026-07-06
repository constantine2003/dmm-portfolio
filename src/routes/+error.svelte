<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';

  let codeEl = $state<HTMLElement | null>(null);
  let msgEl  = $state<HTMLElement | null>(null);
  let ctaEl  = $state<HTMLElement | null>(null);
  let name1El = $state<HTMLElement | null>(null);
  let name2El = $state<HTMLElement | null>(null);

  function fadeUp(el: HTMLElement, delay: number, dur = 700, y = 18) {
    el.animate(
      [
        { opacity: '0', transform: `translateY(${y}px)` },
        { opacity: '1', transform: 'translateY(0)' },
      ],
      { duration: dur, delay, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' }
    );
  }

  function curtainUp(el: HTMLElement, delay: number) {
    el.animate(
      [
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)'   },
      ],
      { duration: 800, delay, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' }
    );
  }

  onMount(() => {
    if (codeEl) fadeUp(codeEl, 0,   650, 16);
    if (msgEl)  fadeUp(msgEl,  120, 600, 12);
    if (ctaEl)  fadeUp(ctaEl,  240, 600, 10);
    if (name1El) curtainUp(name1El, 380);
    if (name2El) curtainUp(name2El, 520);
  });

  // ── vanta fog background ──────────────────────────────────────────
  // This is the piece that was missing before — the scripts were pasted
  // in but never actually wired to an element. Loaded the same way the
  // capabilities section does it: dynamic <script> tags (these aren't
  // importable modules), mounted onto bgSectionEl, destroyed on unmount
  // so it doesn't leak a WebGL context. Colors pulled from the site's
  // own cream/amber/near-black palette instead of the demo's stock
  // green/coral so it actually blends in rather than looking bolted on.
  let bgSectionEl: HTMLElement | null = $state(null);
  let vantaEffect: { destroy: () => void } | null = null;

  function loadScriptOnce(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  onMount(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        await loadScriptOnce('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js');

        if (cancelled || !bgSectionEl) return;

        const VANTA = (window as unknown as { VANTA?: { FOG: (opts: Record<string, unknown>) => { destroy: () => void } } }).VANTA;
        if (!VANTA) return;

        vantaEffect = VANTA.FOG({
          el: bgSectionEl,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0xffe4c2,
          midtoneColor: 0xd9a46c,
          lowlightColor: 0x7a4e28,
          baseColor: 0xf3efe9,
          blurFactor: 0.6,
          speed: 1.3,
          zoom: 1,
        });
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
      vantaEffect?.destroy();
      vantaEffect = null;
    };
  });
</script>

<svelte:head>
  <title>{$page.status} — Daniel M. Montesclaros</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<Navbar />

<section
  bind:this={bgSectionEl}
  class="relative flex min-h-svh w-full flex-col justify-between overflow-hidden bg-[#F3EFE9] px-5 py-16 sm:px-8 md:px-10"
  aria-label="Page not found"
>

  <!-- top: status code + message + CTA. Pushed down from dead-center
       toward the lower half of this block (justify-end + bottom
       padding) so it doesn't crowd the navbar above it. -->
  <div class="relative z-10 flex flex-1 flex-col items-center justify-end gap-6 pb-[10vh] text-center sm:pb-[12vh]">

    <span
      bind:this={codeEl}
      class="serif-display italic leading-none tracking-tight text-[#181512]"
      style="opacity: 0; font-size: clamp(4rem, 14vw, 9rem);"
    >{$page.status}</span>

    <p
      bind:this={msgEl}
      class="max-w-sm text-[0.9375rem] leading-[1.75] text-[#8A7F74]"
      style="opacity: 0;"
    >
      {$page.status === 404
        ? "This page doesn't exist — looks like a broken connection somewhere."
        : ($page.error?.message ?? 'Something went wrong.')}
    </p>

    <a
      bind:this={ctaEl}
      href="/"
      style="opacity: 0;"
      class="mt-2 inline-flex items-center gap-2 rounded-sm bg-[#181512] px-6 py-3
             text-[0.6875rem] font-medium uppercase tracking-[0.09em] text-[#F3EFE9]
             no-underline transition-opacity duration-150 hover:opacity-75"
    >
      Back to home
    </a>
  </div>

  <!-- bottom: giant name, left-aligned at the bottom -->
  <h2
    class="serif-display relative z-10 m-0 select-none text-left italic leading-[0.85] tracking-tight"
    style:font-size="clamp(2.5rem, 11vw, 9rem)"
    aria-hidden="true"
  >
    <span class="block overflow-hidden">
      <span
        bind:this={name1El}
        class="block text-[#181512]"
        style="clip-path: inset(0 0 100% 0);"
      >DANIEL</span>
    </span>
    <span class="block overflow-hidden">
      <span
        bind:this={name2El}
        class="name-outline block"
        style="clip-path: inset(0 0 100% 0);"
      >MONTESCLAROS.</span>
    </span>
  </h2>

</section>

<style>
  .serif-display {
    font-family: 'DM Serif Display', Georgia, serif;
  }

  .name-outline {
    color: transparent;
    -webkit-text-stroke: 1.5px #181512;
  }

  @media (max-width: 640px) {
    .name-outline {
      -webkit-text-stroke: 1px #181512;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
    [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; }
    [style*="clip-path"] { clip-path: none !important; }
  }
</style>