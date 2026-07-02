<script lang="ts">
  import { onMount } from 'svelte';

  // ── principles ──────────────────────────────────────────────────
  const principles: string[] = [
    'solder before you ship',
    'simplicity survives the rewrite',
    'test on real hardware, not assumptions',
    'privacy is a default, not a feature',
    'consistency across every platform',
  ];

  let listEl: HTMLElement | null = $state(null);
  let rowEls: HTMLElement[] = [];

  function fadeUp(el: HTMLElement, delay: number) {
    el.animate(
      [
        { opacity: '0', transform: 'translateY(10px)' },
        { opacity: '1', transform: 'translateY(0)' },
      ],
      { duration: 600, delay, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' }
    );
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        rowEls.forEach((el, i) => fadeUp(el, i * 90));
        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    if (listEl) observer.observe(listEl);
    return () => observer.disconnect();
  });

  // ── thought ─────────────────────────────────────────────────────
  type Segment = { text: string; hl: 'a' | 'b' | null };
  type Item = { id: string; title: string; segments: Segment[] };

  function parseSegments(text: string): Segment[] {
    const segments: Segment[] = [];
    const regex = /<hl-(a|b)>(.*?)<\/hl-\1>/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ text: text.slice(lastIndex, match.index), hl: null });
      }
      segments.push({ text: match[2], hl: match[1] as 'a' | 'b' });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex), hl: null });
    }
    return segments;
  }

  const rawItems: { id: string; title: string; description: string }[] = [
    {
      id: 'aesthetics',
      title: 'aesthetics',
      description:
        'a clean <hl-a>interface</hl-a> hides a thousand small decisions. simplicity is not the <hl-b>absence</hl-b> of complexity — it is complexity <hl-a>resolved</hl-a>.',
    },
    {
      id: 'entropy',
      title: 'entropy',
      description:
        'hardware taught me this first: nothing stays <hl-b>calibrated</hl-b> on its own. solder joints fatigue, systems drift — <hl-a>entropy</hl-a> always wins unless you show up.',
    },
    {
      id: 'rationality',
      title: 'rationality',
      description:
        'every board, every framework, every stack is a <hl-a>tradeoff</hl-a>. choosing one means saying <hl-b>no</hl-b> to the others — that is how you actually ship.',
    },
  ];

  const items: Item[] = rawItems.map((it) => ({
    id: it.id,
    title: it.title,
    segments: parseSegments(it.description),
  }));

  let openIndex: number = $state(0);

  function toggleOpen(i: number) {
    openIndex = openIndex === i ? -1 : i;
  }
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

  <!-- ═══════════════════════ PRINCIPLES ═══════════════════════ -->
  <section
    class="relative z-10 flex min-h-[60vh] w-full items-center justify-center
           px-6 py-[clamp(3rem,8vw,6rem)] pt-[calc(clamp(3rem,8vw,6rem)+20px)]"
    aria-labelledby="principles-heading"
  >
    <div
      class="grid w-fit grid-cols-1 gap-y-5 sm:grid-cols-[150px_1fr] sm:gap-x-9 sm:gap-y-0"
    >
      <p
        id="principles-heading"
        class="font-ui m-0 whitespace-nowrap text-[0.8125rem] tracking-[0.01em] text-[#A8A8A3]"
      >
        [principles]
      </p>

      <div bind:this={listEl} class="flex flex-col gap-[1.1rem]">
        {#each principles as line, i (line)}
          <p
            bind:this={rowEls[i]}
            class="font-ui m-0 whitespace-normal text-[clamp(0.9375rem,1.3vw,1.0625rem)]
                   font-normal leading-[1.4] text-[#2B2B29] sm:whitespace-nowrap"
            style="opacity: 0;"
          >{line}</p>
        {/each}
      </div>
    </div>
  </section>

  <!-- ═══════════════════════ THOUGHT ═══════════════════════════ -->
  <section
    class="relative z-10 flex w-full justify-center px-6 py-[clamp(2.5rem,7vw,5rem)]
           pt-[calc(clamp(2.5rem,7vw,5rem)+50px)]"
    aria-labelledby="thought-heading"
  >
    <div class="w-full max-w-155">

      <p id="thought-heading" class="font-ui mb-6 text-[0.8125rem] text-[#A8A8A3]">
        [thought]
      </p>

      <p class="font-ui mb-8 max-w-lg text-[clamp(0.9375rem,1.3vw,1.0625rem)] leading-[1.55] text-[#3A3A37]">
        an interface is born not from pixels, but from decisions. i let go of the
        needless and leave only meaning behind.
      </p>

      <ul class="border-t border-black/10">
        {#each items as item, i (item.id)}
          <li>
            <button
              type="button"
              class="group -mx-3 w-full rounded-md border-b border-black/10 px-3 py-[0.85rem]
                     text-left ring-1 ring-transparent outline-none
                     transition-[transform,box-shadow] duration-150
                     {openIndex === i
                       ? 'ring-[#B8763F]/70'
                       : 'hover:translate-x-1 focus-visible:translate-x-1 focus-visible:ring-[#B8763F]/70'}"
              aria-expanded={openIndex === i}
              onclick={() => toggleOpen(i)}
            >
              <span class="flex items-baseline gap-[0.9rem]">
                <span
                  class="font-ui min-w-[1.1rem] text-[0.6875rem] text-[#B0AFA9]"
                >{String(i + 1).padStart(2, '0')}</span>

                <span class="relative inline-block">
                  <span
                    class="font-ui text-[clamp(0.9375rem,1.3vw,1.0625rem)] font-medium
                           transition-colors duration-150
                           {openIndex === i
                             ? 'text-[#1A1A18]'
                             : 'text-[#C6C4BD] group-hover:text-[#8E8C85] group-focus-visible:text-[#8E8C85]'}"
                  >{item.title}</span>
                  <span
                    class="absolute -bottom-1 left-0 h-px bg-[#B8763F] transition-all duration-300
                           {openIndex === i ? 'w-full' : 'w-0 group-hover:w-full'}"
                  ></span>
                </span>
              </span>

              <!-- always rendered, height animated via grid-template-rows so
                   opening/closing eases the layout shift instead of snapping
                   the rest of the page into a new position instantly -->
              <span
                class="grid transition-[grid-template-rows] duration-300 ease-out"
                style="grid-template-rows: {openIndex === i ? '1fr' : '0fr'};"
              >
                <span class="overflow-hidden">
                  <span class="font-ui mb-[0.15rem] ml-8 mt-[0.55rem] block max-w-120 text-[0.8125rem] leading-[1.55] text-[#4A4A46]">
                    {#each item.segments as seg, si (si)}
                      {#if seg.hl === 'a'}
                        <span class="text-[#B8763F]">{seg.text}</span>
                      {:else if seg.hl === 'b'}
                        <span class="text-[#5A72A0]">{seg.text}</span>
                      {:else}
                        {seg.text}
                      {/if}
                    {/each}
                  </span>
                </span>
              </span>
            </button>
          </li>
        {/each}
      </ul>

      <div class="mt-7 flex justify-end">
        <a
          href="/thoughts"
          class="font-ui inline-flex items-center gap-2 rounded-lg bg-[#EDEDEA]
                 px-[0.9rem] py-2 text-[0.8125rem] text-[#1A1A18] no-underline
                 transition-colors duration-150 hover:bg-[#E2E2DE]"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-[#B8763F]"></span>
          read how i think
        </a>
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
</style>