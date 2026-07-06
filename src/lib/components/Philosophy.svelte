<script lang="ts">
  import { onMount } from 'svelte';

  // ── philosophy ───────────────────────────────────────────────────
  // Photo slots. Each still resolves to a real photo via `src`; the
  // `fallback` color + schematic texture behind it is what shows while
  // the photo loads or if it 404s, so there's never a dead gray box.
  const heroPhotos: { id: string; src: string; fallback: string }[] = [
    { id: 'code',   src: '/coding.png',    fallback: '#EEE7DB' },
    { id: 'solder', src: '/soldering.png', fallback: '#E0CFBE' },
  ];

  let heroSectionEl: HTMLElement | null = $state(null);
  let heroHeadlineEl: HTMLElement | null = $state(null);
  let heroSubEl: HTMLElement | null = $state(null);
  let heroEyebrowEl: HTMLElement | null = $state(null);
  let heroParaEl: HTMLElement | null = $state(null);
  let heroQuoteEl: HTMLElement | null = $state(null);
  let heroPhotoEls: HTMLElement[] = [];

  function fadeUp(el: HTMLElement, delay: number) {
    el.animate(
      [
        { opacity: '0', transform: 'translateY(10px)' },
        { opacity: '1', transform: 'translateY(0)' },
      ],
      { duration: 700, delay, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' }
    );
  }

  onMount(() => {
    const heroEls = [heroEyebrowEl, heroHeadlineEl, heroSubEl, heroParaEl, heroQuoteEl, ...heroPhotoEls].filter(
      (el): el is HTMLElement => el !== null
    );
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        heroEls.forEach((el, i) => fadeUp(el, i * 90));
        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    if (heroSectionEl) observer.observe(heroSectionEl);
    return () => observer.disconnect();
  });

  // ── what i can do ───────────────────────────────────────────────
  // `tag` is a short bracketed designator (echoing the "[ what i can do ]"
  // eyebrow above the list) rather than a sequence number — this list
  // isn't an ordered process, so numbering it would imply an order that
  // isn't there.
  const capabilities: {
    id: string;
    tag: string;
    label: string;
    src: string;
    fallback: string;
  }[] = [
    { id: 'hardware',  tag: '[HW]',  label: 'Hardware Prototyping',     src: '/thumbnail_healthsense.png', fallback: '#EEE7DB' },
    { id: 'fullstack', tag: '[FS]',  label: 'Full Stack Development',   src: '/thumbnail_svelteskill.png', fallback: '#E0CFBE' },
    { id: 'mobile',    tag: '[MB]',  label: 'Mobile Development',       src: '/thumbnail_macroloop.png',   fallback: '#CBA47E' },
    { id: 'web',       tag: '[WEB]', label: 'Web Applications',         src: '/thumbnail_archive.png',      fallback: '#D8C9B4' },
    { id: 'ai',        tag: '[AI]',  label: 'AI Automations',           src: '/aiautomations.png',       fallback: '#DCCFBE' },
  ];

  let activeCap: number | null = $state(null);

  let capListWrap: HTMLElement | null = $state(null);
  let capRowEls: HTMLElement[] = [];
  let imageY: number = $state(0);
  const CAP_IMAGE_HEIGHT = 420;

  function setActiveCap(i: number | null) {
    activeCap = i;
    if (i !== null) positionCapImage();
  }

  function positionCapImage() {
    if (activeCap === null) return;
    const row = capRowEls[activeCap];
    const wrap = capListWrap;
    if (!row || !wrap) return;
    const rowRect = row.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const raw = rowRect.top - wrapRect.top + rowRect.height / 2 - CAP_IMAGE_HEIGHT / 2;
    // dampen the travel distance so the window doesn't swing all the way
    // to the top/bottom rows — it eases toward each row without fully
    // committing to its exact vertical position.
    const MOVEMENT_DAMPING = 0.8;
    const centerRest = wrapRect.height / 2 - CAP_IMAGE_HEIGHT / 2;
    imageY = centerRest + (raw - centerRest) * MOVEMENT_DAMPING;
  }

  onMount(() => {
    const handleResize = () => positionCapImage();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // ── vanta rings background (capabilities section) ────────────────
  // Loaded dynamically since these are external <script> tags, not
  // importable modules. VANTA.RINGS is mounted onto capSectionEl and
  // destroyed on unmount to avoid leaking WebGL contexts.
  let capSectionEl: HTMLElement | null = $state(null);
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
        await loadScriptOnce('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.rings.min.js');

        if (cancelled || !capSectionEl) return;

        const VANTA = (window as unknown as { VANTA?: { RINGS: (opts: Record<string, unknown>) => { destroy: () => void } } }).VANTA;
        if (!VANTA) return;

        vantaEffect = VANTA.RINGS({
          el: capSectionEl,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0xf3efe9,
          color: 0xb8763f,
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

<div class="relative bg-[#F3EFE9]">

  <!-- ═══════════════════════════ PHILOSOPHY ═══════════════════════════ -->
  <section
    bind:this={heroSectionEl}
    class="relative z-10 w-full py-[clamp(4.8rem,9.6vw,8.4rem)]"
    aria-label="philosophy"
  >
    <div class="mx-auto w-full max-w-[1680px] px-7 sm:px-12 lg:px-20">
      <div class="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-24">

        <!-- text column -->
        <div class="order-2 lg:order-1">
          <div class="mb-6 flex items-center gap-3.5">
            <span class="h-px w-10 bg-[#B8763F]"></span>
            <p
              bind:this={heroEyebrowEl}
              class="font-mono m-0 text-[0.86rem] uppercase tracking-[0.2em] text-[#7A4E28]"
              style="opacity: 0;"
            >
              philosophy
            </p>
          </div>

          <h1
            bind:this={heroHeadlineEl}
            class="font-display m-0 text-[clamp(2.4rem,4.3vw,3.7rem)] font-semibold leading-[1.18] tracking-[-0.01em] text-[#1A1A18]"
            style="opacity: 0;"
          >
            I design the software, then solder the
            <em class="hero-accent">hardware</em> underneath.
          </h1>

          <p
            bind:this={heroSubEl}
            class="font-ui mt-7 max-w-[33rem] text-[clamp(1.22rem,1.56vw,1.34rem)] leading-[1.7] text-[#3A3A37]"
            style="opacity: 0;"
          >
            A systems engineer who ships firmware and frontend from the same bench —
            the boundary between the two is mostly imaginary.
          </p>

          <p
            bind:this={heroParaEl}
            class="font-ui mt-5 max-w-[33rem] text-[clamp(1.05rem,1.3vw,1.14rem)] leading-[1.75] text-[#5A5952]"
            style="opacity: 0;"
          >
            Most of what looks like magic in a finished product is just decisions made
            early, then revisited under real constraints — a battery that drains faster
            than the spec sheet promised, a signal that only misbehaves at 3am. Software
            teaches you to abstract. Hardware forces you to reckon.
          </p>

          <p
            bind:this={heroQuoteEl}
            class="font-display mt-8 max-w-[30rem] border-l-2 border-[#B8763F]/40 pl-5 text-[1.08rem] italic leading-[1.6] text-[#3A3A37]"
            style="opacity: 0;"
          >
            the boundary you draw between "frontend" and "firmware" is usually just
            where you stopped looking.
          </p>
        </div>

        <!-- photo composition: layered, asymmetric, rounded — not a mirrored grid -->
        <div class="relative order-1 aspect-[4/5] w-full sm:aspect-[6/5] lg:order-2 lg:aspect-[4/5]">
          {#each heroPhotos as photo, i (photo.id)}
            <div
              bind:this={heroPhotoEls[i]}
              class={i === 0
                ? "absolute inset-0 right-[16%] top-0 overflow-hidden rounded-[1.8rem] shadow-[0_48px_96px_-36px_rgba(58,38,18,0.35)]"
                : "absolute bottom-0 left-0 h-[52%] w-[46%] overflow-hidden rounded-[1.32rem] shadow-[0_34px_67px_-26px_rgba(58,38,18,0.42)] ring-[5px] ring-[#F3EFE9]"}
              style="opacity: 0; background-color: {photo.fallback};"
            >
              <img
                src={photo.src}
                alt=""
                loading="lazy"
                class="h-full w-full object-cover"
                onerror={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
              />
            </div>
          {/each}
        </div>

      </div>
    </div>
  </section>

  <!-- ═══════════════════════ WHAT I CAN DO ═══════════════════════ -->
  <!-- blob-scene background now lives here, scoped to this section only,
       instead of on the outer wrapper covering the whole page -->
  <section
    bind:this={capSectionEl}
    class="relative z-10 flex w-full min-h-[90vh] flex-col justify-center overflow-hidden py-[clamp(3rem,8vw,6rem)]"
    aria-labelledby="capabilities-heading"
  >
    <div class="relative z-10 flex w-full flex-col items-start gap-4 sm:flex-row sm:gap-10">

      <p
        id="capabilities-heading"
        class="font-mono relative top-0 m-0 shrink-0 whitespace-nowrap pl-6 text-[0.72rem]
               tracking-widest text-[#8C8A82] sm:sticky sm:top-8 sm:pl-10 sm:text-[0.78rem]"
      >
        [ what i can do ]
      </p>

      <div
        class="relative w-full pb-4 sm:pb-12"
        role="group"
        aria-label="Capability list with preview"
        bind:this={capListWrap}
        onmouseleave={() => setActiveCap(null)}
        onfocusout={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setActiveCap(null);
        }}
      >

        <div class="flex flex-col pl-6 pr-6 sm:pr-[26rem] sm:pl-24">
          {#each capabilities as cap, i (cap.id)}
            <button
              bind:this={capRowEls[i]}
              type="button"
              class="group relative flex w-full items-center gap-3 overflow-hidden py-5 text-left
                     sm:gap-4 sm:py-8
                     {i === 0 ? 'pt-2' : ''}
                     outline-none focus-visible:rounded focus-visible:shadow-[inset_0_0_0_2px_#CBA47E]"
              onmouseenter={() => setActiveCap(i)}
              onfocus={() => setActiveCap(i)}
            >
              <span
                class="font-mono w-10 shrink-0 text-[0.68rem] tracking-wider text-[#B8763F] sm:w-14 sm:text-[0.78rem]"
              >
                {cap.tag}
              </span>

              <!-- text roll: two copies of the same label, each absolutely
                   pinned to fill this exact window (inset:0), so a 100%
                   transform on either copy always means "exactly one line" —
                   no ambiguity from a taller stacked wrapper. At rest, copy A
                   sits in place and copy B waits one line below, both
                   clipped by the window's own overflow-hidden. On hover, A
                   slides up and out while B slides up into place. -->
              <span
                class="relative block h-[1.08em] min-w-0 flex-1 overflow-hidden text-[clamp(1.8rem,5vw,3.1rem)] font-bold leading-[1.08] tracking-tight transition-colors duration-500"
                style="contain: paint; color: {activeCap === null || activeCap === i ? '#1A1A18' : '#ACA89D'};"
              >
                <span
                  class="font-ui absolute inset-0 block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style="transform: translateY({activeCap === i ? '-105%' : '0%'});"
                >{cap.label}</span>
                <span
                  class="font-ui absolute inset-0 block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style="transform: translateY({activeCap === i ? '0%' : '105%'});"
                >{cap.label}</span>
              </span>
            </button>
          {/each}
        </div>

        <!-- floating preview — a "viewfinder" that tracks the vertical
             position of the hovered row, framed like an instrument
             screen (bezel + reticle corners) to echo the hero photos.
             Hidden until something is hovered; fades/scales in rather
             than just appearing. Contents are a single fixed-order
             filmstrip that slides internally — a clean scroll between
             frames, no per-frame dim/blur pass. -->
        <div
          class="pointer-events-none absolute right-6 hidden w-[24rem] overflow-hidden
                 shadow-[0_30px_60px_-24px_rgba(24,18,10,0.38),inset_0_0_0_1px_rgba(184,118,63,0.28)]
                 transition-[transform,opacity] duration-500 ease-out sm:block
                 {activeCap === null ? 'opacity-0 scale-[0.97]' : 'opacity-100 scale-100'}"
          style="height: {CAP_IMAGE_HEIGHT}px; top: 0; transform: translateY({imageY}px);"
        >
          <div
            class="transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style="transform: translateY(-{(activeCap ?? 0) * CAP_IMAGE_HEIGHT}px);"
          >
            {#each capabilities as cap (cap.id)}
              <div
                class="relative w-full overflow-hidden"
                style="height: {CAP_IMAGE_HEIGHT}px; background-color: {cap.fallback};"
              >
                <div class="schematic-bg pointer-events-none absolute inset-0"></div>
                <img
                  src={cap.src}
                  alt=""
                  loading="lazy"
                  class="relative h-full w-full object-cover"
                  onerror={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                />
              </div>
            {/each}
          </div>

          <span class="corner corner-tl"></span>
          <span class="corner corner-tr"></span>
          <span class="corner corner-bl"></span>
          <span class="corner corner-br"></span>

          {#if activeCap !== null}
            <span class="font-mono absolute bottom-3.5 left-3.5 z-10 flex items-center gap-2 rounded-sm bg-[#1A1A18]/55 px-2.5 py-1.5 text-[0.7rem] tracking-[0.08em] text-[#FFFDF8] backdrop-blur-sm">
              <span class="h-1.5 w-1.5 rounded-full bg-[#B8763F]"></span>
              {capabilities[activeCap].label}
            </span>
          {/if}
        </div>

      </div>
    </div>
  </section>

</div>

<style>
  /* Load these three once, globally, if they aren't already —
     e.g. in app.html or a root +layout.svelte:
     Fraunces (display serif), Inter (UI), JetBrains Mono (labels/tags). */
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,380;0,9..144,560;1,9..144,480&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .font-ui {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .font-display {
    font-family: 'Fraunces', Georgia, serif;
    font-optical-sizing: auto;
  }
  .font-mono {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
  }

  .hero-accent {
    font-style: italic;
    font-weight: 480;
    color: #B8763F;
  }

  /* schematic placeholder texture — a faint circuit-trace grid that
     stands in for missing photography, on-theme for a hardware/software
     engineer rather than a generic gray fill */
  .schematic-bg {
    opacity: 0.5;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M0 32H64M32 0V64' stroke='rgb(122,78,40)' stroke-width='1' opacity='0.35'/%3E%3Ccircle cx='32' cy='32' r='3' fill='rgb(122,78,40)' opacity='0.5'/%3E%3Ccircle cx='0' cy='32' r='2' fill='rgb(122,78,40)' opacity='0.35'/%3E%3Ccircle cx='64' cy='32' r='2' fill='rgb(122,78,40)' opacity='0.35'/%3E%3Ccircle cx='32' cy='0' r='2' fill='rgb(122,78,40)' opacity='0.35'/%3E%3Ccircle cx='32' cy='64' r='2' fill='rgb(122,78,40)' opacity='0.35'/%3E%3C/svg%3E");
  }

  /* reticle corners — the page's one signature framing motif, shared by
     the hero photos and the capability viewfinder */
  .corner {
    position: absolute;
    width: 15px;
    height: 15px;
    opacity: 0.45;
    transition: opacity 0.4s ease, transform 0.4s ease;
    pointer-events: none;
  }
  .corner-tl { top: 12px; left: 12px; border-top: 1.5px solid #B8763F; border-left: 1.5px solid #B8763F; }
  .corner-tr { top: 12px; right: 12px; border-top: 1.5px solid #B8763F; border-right: 1.5px solid #B8763F; }
  .corner-bl { bottom: 12px; left: 12px; border-bottom: 1.5px solid #B8763F; border-left: 1.5px solid #B8763F; }
  .corner-br { bottom: 12px; right: 12px; border-bottom: 1.5px solid #B8763F; border-right: 1.5px solid #B8763F; }
  /* philosophy — frosted glass panel over the photo split. */
  .philosophy-overlay {
    position: relative;
    border-radius: clamp(20px, 3vw, 30px);
    background: linear-gradient(
      155deg,
      rgba(255, 253, 248, 0.9) 0%,
      rgba(243, 239, 233, 0.74) 45%,
      rgba(224, 207, 190, 0.56) 100%
    );
    backdrop-filter: blur(28px) saturate(150%);
    -webkit-backdrop-filter: blur(28px) saturate(150%);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
      inset 0 0 0 1px rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 0 rgba(120, 96, 66, 0.14),
      0 34px 80px -28px rgba(24, 18, 10, 0.4),
      0 12px 28px -14px rgba(24, 18, 10, 0.22);
  }

  .philosophy-overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0.045;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  @media (prefers-reduced-motion: reduce) {
    .relative[style*='transform'] {
      transition: none;
    }
  }
</style>