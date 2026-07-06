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
    const heroEls = [heroEyebrowEl, heroHeadlineEl, heroSubEl, ...heroPhotoEls].filter(
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
    { id: 'ai',        tag: '[AI]',  label: 'AI Automations',           src: '/thumbnail_sabong.png',       fallback: '#DCCFBE' },
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
</script>

<div class="relative bg-[#F3EFE9]">

  <!-- blob-scene background — cream base, copper corner blobs, masked so
       it fades in from the top instead of cutting in sharply -->
  <svg
    class="blob-bg pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 900 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <rect x="0" y="0" width="900" height="600" fill="#F3EFE9"></rect>
    <g transform="translate(900, 0)">
      <path d="M0 486.7C-54.3 488.6 -108.6 490.5 -150.4 462.9C-192.2 435.3 -221.6 378.2 -238.6 328.5C-255.7 278.8 -260.3 236.5 -284 206.3C-307.6 176.2 -350.1 158.1 -387.1 125.8C-424 93.4 -455.4 46.7 -486.7 0L0 0Z" fill="#EEE7DB"></path>
      <path d="M0 365.1C-40.7 366.5 -81.4 367.9 -112.8 347.2C-144.2 326.5 -166.2 283.6 -179 246.3C-191.8 209.1 -195.3 177.4 -213 154.7C-230.7 132.1 -262.6 118.6 -290.3 94.3C-318 70.1 -341.5 35 -365.1 0L0 0Z" fill="#E0CFBE"></path>
      <path d="M0 243.4C-27.1 244.3 -54.3 245.3 -75.2 231.5C-96.1 217.7 -110.8 189.1 -119.3 164.2C-127.8 139.4 -130.2 118.2 -142 103.2C-153.8 88.1 -175.1 79.1 -193.5 62.9C-212 46.7 -227.7 23.4 -243.4 0L0 0Z" fill="#CBA47E"></path>
      <path d="M0 121.7C-13.6 122.2 -27.1 122.6 -37.6 115.7C-48.1 108.8 -55.4 94.5 -59.7 82.1C-63.9 69.7 -65.1 59.1 -71 51.6C-76.9 44 -87.5 39.5 -96.8 31.4C-106 23.4 -113.8 11.7 -121.7 0L0 0Z" fill="#B8763F"></path>
    </g>
    <g transform="translate(0, 600)">
      <path d="M0 -486.7C55.5 -476.6 110.9 -466.5 137.5 -423.2C164.1 -380 161.8 -303.6 205.7 -283.2C249.7 -262.7 339.8 -298.1 390.8 -283.9C441.7 -269.7 453.5 -206 462.9 -150.4C472.4 -94.8 479.6 -47.4 486.7 0L0 0Z" fill="#EEE7DB"></path>
      <path d="M0 -365.1C41.6 -357.5 83.2 -349.8 103.1 -317.4C123.1 -285 121.3 -227.7 154.3 -212.4C187.2 -197 254.9 -223.6 293.1 -212.9C331.3 -202.3 340.1 -154.5 347.2 -112.8C354.3 -71.1 359.7 -35.6 365.1 0L0 0Z" fill="#E0CFBE"></path>
      <path d="M0 -243.4C27.7 -238.3 55.5 -233.2 68.8 -211.6C82 -190 80.9 -151.8 102.9 -141.6C124.8 -131.3 169.9 -149 195.4 -142C220.9 -134.9 226.7 -103 231.5 -75.2C236.2 -47.4 239.8 -23.7 243.4 0L0 0Z" fill="#CBA47E"></path>
      <path d="M0 -121.7C13.9 -119.2 27.7 -116.6 34.4 -105.8C41 -95 40.4 -75.9 51.4 -70.8C62.4 -65.7 85 -74.5 97.7 -71C110.4 -67.4 113.4 -51.5 115.7 -37.6C118.1 -23.7 119.9 -11.9 121.7 0L0 0Z" fill="#B8763F"></path>
    </g>
  </svg>

  <div class="pointer-events-none absolute inset-0 bg-[#F3EFE9]/72" aria-hidden="true"></div>

  <!-- soft gloss — two faint highlights so the cream field reads as a
       material surface rather than a flat fill -->
  <div
    class="pointer-events-none absolute inset-0"
    style="background:
      radial-gradient(60% 40% at 88% 4%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%),
      radial-gradient(50% 35% at 4% 100%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%);"
    aria-hidden="true"
  ></div>

  <!-- ═══════════════════════════ PHILOSOPHY ═══════════════════════════ -->
  <section
    bind:this={heroSectionEl}
    class="relative z-10 w-full pt-[clamp(3.5rem,7vw,6rem)] pb-[clamp(6rem,14vw,10rem)]"
    aria-label="philosophy"
  >
    <div class="relative w-full px-6 sm:px-10 lg:px-16">
      <div class="grid w-full grid-cols-1 overflow-hidden sm:grid-cols-2">
        {#each heroPhotos as photo, i (photo.id)}
          <div
            bind:this={heroPhotoEls[i]}
            class="relative aspect-square w-full overflow-hidden"
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

      <!-- headline lockup — centered over the seam, frosted so it reads
           against either photo, edges feathered rather than boxed -->
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <div class="philosophy-overlay pointer-events-auto max-w-xl px-8 py-10 text-center sm:max-w-2xl sm:px-16 sm:py-14">
          <p
            bind:this={heroEyebrowEl}
            class="font-mono m-0 mb-4 text-[0.72rem] uppercase tracking-[0.16em] text-[#7A4E28]"
            style="opacity: 0;"
          >
          </p>

          <h1
            bind:this={heroHeadlineEl}
            class="font-display m-0 text-[clamp(2.15rem,5.4vw,3.55rem)] font-semibold leading-[1.14] tracking-[-0.01em] text-[#1A1A18]"
            style="opacity: 0;"
          >
            I design the software, then<br />
            solder the <em class="hero-accent">hardware</em> underneath.
          </h1>

          <p
            bind:this={heroSubEl}
            class="font-ui mx-auto mt-[1.35rem] max-w-md text-[clamp(1.08rem,1.5vw,1.2rem)] leading-[1.65] text-[#3A3A37]"
            style="opacity: 0;"
          >
            A systems engineer who ships firmware and frontend from the same bench —
            the boundary between the two is mostly imaginary.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════ WHAT I CAN DO ═══════════════════════ -->
  <section
    class="relative z-10 w-full pt-[clamp(2rem,6vw,3rem)] pb-[clamp(5.5rem,13vw,9.5rem)]"
    aria-labelledby="capabilities-heading"
  >
    <div class="flex w-full items-start gap-6 sm:gap-10">

      <p
        id="capabilities-heading"
        class="font-mono sticky top-8 m-0 shrink-0 whitespace-nowrap pl-6 text-[0.78rem]
               tracking-widest text-[#8C8A82] sm:pl-10"
      >
        [ what i can do ]
      </p>

      <div
        class="relative w-full pb-8 sm:pb-12"
        role="group"
        aria-label="Capability list with preview"
        bind:this={capListWrap}
        onmouseleave={() => setActiveCap(null)}
        onfocusout={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setActiveCap(null);
        }}
      >

        <div class="flex flex-col pl-[6vw] pr-6 sm:pr-108 sm:pl-[18vw]">
          {#each capabilities as cap, i (cap.id)}
            <button
              bind:this={capRowEls[i]}
              type="button"
              class="group relative flex w-full items-center gap-4 overflow-hidden py-8 text-left
                     {i === 0 ? 'pt-2' : ''}
                     outline-none focus-visible:rounded focus-visible:shadow-[inset_0_0_0_2px_#CBA47E]"
              onmouseenter={() => setActiveCap(i)}
              onfocus={() => setActiveCap(i)}
            >
              <span
                class="font-mono w-14 shrink-0 text-[0.78rem] tracking-wider text-[#B8763F]"
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
                class="relative block h-[1.08em] min-w-0 flex-1 overflow-hidden text-[clamp(2.3rem,6.6vw,3.9rem)] font-bold leading-[1.08] tracking-tight text-[#1A1A18]"
                style="contain: paint;"
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
            {#each capabilities as cap, i (cap.id)}
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

  .blob-bg {
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%);
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