<script lang="ts">
  import { onMount } from 'svelte';

  // ── philosophy ───────────────────────────────────────────────────
  // 2 placeholder photo slots — swap `src` for the soldering / coding
  // photos once they're added to the project's static assets.
  const heroPhotos: { id: string; src: string; fallback: string }[] = [
    { id: 'code',   src: '/coding.png',    fallback: '#A89C8C' },
    { id: 'solder', src: '/soldering.png', fallback: '#C8C3BB' },
  ];

  let heroSectionEl: HTMLElement | null = $state(null);
  let heroHeadlineEl: HTMLElement | null = $state(null);
  let heroSubEl: HTMLElement | null = $state(null);
  let heroPhotoEls: HTMLElement[] = [];

  function fadeUp(el: HTMLElement, delay: number) {
    el.animate(
      [
        { opacity: '0', transform: 'translateY(10px)' },
        { opacity: '1', transform: 'translateY(0)' },
      ],
      { duration: 600, delay, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' }
    );
  }

  // reuses the same fadeUp()/IntersectionObserver pattern used elsewhere,
  // aimed at the hero's own elements.
  onMount(() => {
    const heroEls = [heroHeadlineEl, heroSubEl, ...heroPhotoEls].filter(
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
  const capabilities: { id: string; label: string; src: string; fallback: string }[] = [
    { id: 'hardware',  label: 'Hardware Prototyping',   src: '/thumbnail_healthsense.png', fallback: '#C8C3BB' },
    { id: 'firmware',  label: 'Embedded Firmware',      src: '/thumbnail_svelteskill.png', fallback: '#B8A99A' },
    { id: 'frontend',  label: 'Frontend Engineering',   src: '/thumbnail_macroloop.png',   fallback: '#A89C8C' },
    { id: 'fullstack', label: 'Full-Stack Web Apps',    src: '/thumbnail_archive.png',     fallback: '#D4C4B0' },
    { id: 'systems',   label: 'Systems Architecture',   src: '/thumbnail_sabong.png',      fallback: '#9C9388' },
  ];

  let activeCap: number = $state(0);

  let capListWrap: HTMLElement | null = $state(null);
  let capRowEls: HTMLElement[] = [];
  let imageY: number = $state(0);
  const CAP_IMAGE_HEIGHT = 420;

  function setActiveCap(i: number) {
    activeCap = i;
    positionCapImage();
  }

  function positionCapImage() {
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
    positionCapImage();
    const handleResize = () => positionCapImage();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
</script>

<div class="relative bg-[#F3EFE9]">

  <!-- recolored blob-scene background — cream base, copper corner blobs,
       masked so it fades in from the top instead of cutting in sharply -->
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

  <!-- translucent cream veil — keeps the blobs from fighting with text contrast -->
  <div class="pointer-events-none absolute inset-0 bg-[#F3EFE9]/72" aria-hidden="true"></div>

  <!-- ═══════════════════════════ PHILOSOPHY ═══════════════════════════ -->
  <section
    bind:this={heroSectionEl}
    class="relative z-10 w-full pt-[clamp(3.5rem,7vw,6rem)] pb-[clamp(6rem,14vw,10rem)]"
    aria-label="philosophy"
  >
    <div class="relative w-full px-6 sm:px-10 lg:px-16">
      <!-- the two photos, equal-sized blocks stacked on mobile and side-by-side from sm up -->
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
        <div class="philosophy-overlay pointer-events-auto max-w-xl px-8 py-10 text-center sm:max-w-2xl sm:px-14 sm:py-14">
          <h1
            bind:this={heroHeadlineEl}
            class="font-ui m-0 text-[clamp(2.1rem,5.6vw,3.6rem)] font-semibold leading-[1.12] tracking-tight text-[#1A1A18]"
            style="opacity: 0;"
          >
            I design the software, then<br />
            solder the <em class="hero-accent">hardware</em> underneath.
          </h1>

          <p
            bind:this={heroSubEl}
            class="font-ui mx-auto mt-6 max-w-md text-[clamp(1.22rem,1.82vw,1.46rem)] leading-[1.6] text-[#3A3A37]"
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
    class="relative z-10 w-full pt-[clamp(6rem,14vw,10rem)] pb-[clamp(5.5rem,13vw,9.5rem)]"
    aria-labelledby="capabilities-heading"
  >
    <div class="flex w-full items-start gap-6 sm:gap-10">

      <!-- label — pinned to the far left edge, own column -->
      <p
        id="capabilities-heading"
        class="font-ui sticky top-8 m-0 shrink-0 whitespace-nowrap pl-6 text-[0.84rem]
               uppercase tracking-[0.08em] text-[#6E6D67] sm:pl-10"
      >
        [what i can do]
      </p>

      <!-- capability list + image — shifted left of center, image sits with a gap from the right edge -->
      <div class="relative w-full pb-8 sm:pb-12" bind:this={capListWrap}>

        <!-- capability list -->
        <div class="flex flex-col pl-[6vw] pr-6 sm:pr-120 sm:pl-[18vw]">
          {#each capabilities as cap, i (cap.id)}
            <button
              bind:this={capRowEls[i]}
              type="button"
              class="group relative w-full py-5 text-left
                     {i === 0 ? 'pt-0' : ''}
                     outline-none focus-visible:text-[#1A1A18]"
              onmouseenter={() => setActiveCap(i)}
              onfocus={() => setActiveCap(i)}
            >
              <span
                class="font-ui block text-[clamp(2.2rem,6.4vw,3.7rem)] font-bold leading-[1.08]
                       tracking-tight transition-colors duration-300
                       {activeCap === i ? 'text-[#1A1A18]' : 'text-[#8C8A82]'}"
              >
                {cap.label}
              </span>
            </button>
          {/each}
        </div>

        <!-- floating preview — the window itself tracks the vertical
             position of the hovered row (so it moves to where you hover),
             while everything inside it is a single fixed-order column of
             images that slides internally to the right frame — a real
             filmstrip scroll, never a cross-fade/blur between images. -->
        <div
             class="pointer-events-none absolute right-6 hidden w-105 overflow-hidden
                 transition-transform duration-500 ease-out sm:block"
          style="height: {CAP_IMAGE_HEIGHT}px; top: 0; transform: translateY({imageY}px);"
        >
          <div
            class="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style="transform: translateY(-{activeCap * CAP_IMAGE_HEIGHT}px);"
          >
            {#each capabilities as cap (cap.id)}
              <div
                class="w-full overflow-hidden"
                style="height: {CAP_IMAGE_HEIGHT}px; background-color: {cap.fallback};"
              >
                <img
                  src={cap.src}
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
    </div>
  </section>

</div>

<style>
  .font-ui {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  /* fades the blob background in from the top and out at the bottom, so it
     blends into whatever sits above/below instead of cutting with hard edges */
  .blob-bg {
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%);
  }

  /* hero — serif-italic emphasis word, matching the copper accent used
     throughout the rest of the page */
  .hero-accent {
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
    color: #B8763F;
  }

  /* philosophy — frosted glass panel over the photo split. The
     radial-gradient mask feathers the edges so it blends into the photos
     underneath instead of reading as a hard-edged box. */
  .philosophy-overlay {
    position: relative;
    background: rgba(243, 239, 233, 0.82);
    backdrop-filter: blur(20px) saturate(115%);
    -webkit-backdrop-filter: blur(20px) saturate(115%);
    -webkit-mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 55%, transparent 100%);
    mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 55%, transparent 100%);
  }

  @media (prefers-reduced-motion: reduce) {
    .relative[style*='transform'] {
      transition: none;
    }
  }
</style>