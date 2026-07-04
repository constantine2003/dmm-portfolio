<script lang="ts">
  import { onMount } from 'svelte';
  import WaveCanvas from '$lib/components/WaveCanvas.svelte';
  import { setNavReady } from '$lib/states/navReady.svelte';

  type Phase = 'hello' | 'hero';
  let phase = $state<Phase>('hello');

  let portraitEl = $state<HTMLElement | null>(null);
  let eyebrowEl  = $state<HTMLElement | null>(null);
  let name1El    = $state<HTMLElement | null>(null);
  let name2El    = $state<HTMLElement | null>(null);
  let descEl     = $state<HTMLElement | null>(null);
  let ctasEl     = $state<HTMLElement | null>(null);
  let metaEl     = $state<HTMLElement | null>(null);
  let helloEl    = $state<HTMLElement | null>(null);

  // ── portrait src swap ─────────────────────────────────────────
  let isDesktop = $state(false);
  let portraitSrc = $derived(isDesktop ? '/danielpic.jpg' : '/danielpic2.png');

  // ── hello words ───────────────────────────────────────────────
  const greetings = [
    'Hello', 'Kamusta', 'Привет', 'こんにちは', '你好',
    'Hola', 'Bonjour', 'Hallo', 'Ciao', '안녕하세요',
    'Namaste', 'Olá', 'Merhaba', 'Hej', 'Sawubona',
  ];
  const GREETING_SEEN_KEY = 'dmm:greeting-seen:tab:v1';
  let greetingIndex = $state(0);

  // ── WAAPI helpers ─────────────────────────────────────────────
  function fadeUp(el: HTMLElement, delay: number, dur = 700, y = 20) {
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
        { clipPath: 'inset(0 0 0% 0)' },
      ],
      { duration: 800, delay, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' }
    );
  }

  $effect(() => {
    if (phase !== 'hero') return;
    if (portraitEl) fadeUp(portraitEl,   0,  800, 30);
    if (eyebrowEl)  fadeUp(eyebrowEl,   80,  500, 10);
    if (name1El)    curtainUp(name1El,  160);
    if (name2El)    curtainUp(name2El,  300);
    if (descEl)     fadeUp(descEl,      480, 600, 12);
    if (ctasEl)     fadeUp(ctasEl,      600, 600, 12);
    if (metaEl)     fadeUp(metaEl,      660, 500,  8);
  });

  onMount(() => {
    // ── media query listener ──────────────────────────────────────
    const mq = window.matchMedia('(min-width: 768px)');
    isDesktop = mq.matches;
    const onMqChange = (e: MediaQueryListEvent) => { isDesktop = e.matches; };
    mq.addEventListener('change', onMqChange);

    let hasSeenGreeting = false;
    try {
      hasSeenGreeting = sessionStorage.getItem(GREETING_SEEN_KEY) === '1';
    } catch {
      // Storage can be unavailable in some privacy modes.
    }

    if (hasSeenGreeting) {
      phase = 'hero';
      setNavReady();
      return () => {
        mq.removeEventListener('change', onMqChange);
      };
    }

    try {
      // Mark as seen immediately so a refresh won't replay the intro.
      sessionStorage.setItem(GREETING_SEEN_KEY, '1');
    } catch {
      // Ignore storage write failures.
    }

    if (!helloEl) {
      phase = 'hero';
      setNavReady();
      return () => {
        mq.removeEventListener('change', onMqChange);
      };
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    // ── "Hello" — quick opening beat ──────────────────────────────
    const HELLO_FADE_IN  = 300;
    const HELLO_HOLD     = 500;
    const HELLO_FADE_OUT = 200;
    const HELLO_END      = HELLO_FADE_IN + HELLO_HOLD + HELLO_FADE_OUT; // 1000

    timers.push(setTimeout(() => {
      greetingIndex = 0;
      helloEl!.animate(
        [
          { opacity: '0', transform: 'translateY(16px)' },
          { opacity: '1', transform: 'translateY(0)'    },
        ],
        { duration: HELLO_FADE_IN, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' }
      );
    }, 0));

    timers.push(setTimeout(() => {
      helloEl!.animate(
        [
          { opacity: '1', transform: 'translateY(0)'     },
          { opacity: '0', transform: 'translateY(-14px)' },
        ],
        { duration: HELLO_FADE_OUT, easing: 'ease-in', fill: 'both' }
      );
    }, HELLO_FADE_IN + HELLO_HOLD));

    // ── remaining greetings — gentle, gradual speed-up, no hard cap ─
    // each greeting's hold/fade shrinks slightly from the previous one,
    // but never drops below a comfortable minimum
    const REST = greetings.length - 1; // 19
    const HOLD_START = 340, HOLD_MIN = 140;
    const FADE_START = 200, FADE_MIN = 90;
    const DECAY = 0.94; // how much each step shrinks — closer to 1 = slower ramp

    let cursor = HELLO_END;
    let hold = HOLD_START;
    let fade = FADE_START;

    for (let i = 0; i < REST; i++) {
      const gIndex = i + 1; // skip "Hello"
      const start = cursor;
      const thisHold = hold;
      const thisFade = fade;

      timers.push(setTimeout(() => {
        greetingIndex = gIndex;
        helloEl!.animate(
          [
            { opacity: '0', transform: 'translateY(10px)' },
            { opacity: '1', transform: 'translateY(0)'    },
          ],
          { duration: thisFade, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' }
        );
      }, start));

      if (i < REST - 1) {
        timers.push(setTimeout(() => {
          helloEl!.animate(
            [
              { opacity: '1', transform: 'translateY(0)'     },
              { opacity: '0', transform: 'translateY(-10px)' },
            ],
            { duration: thisFade, easing: 'ease-in', fill: 'both' }
          );
        }, start + thisFade + thisHold));
      }

      cursor += thisFade + thisHold + thisFade;
      hold = Math.max(HOLD_MIN, hold * DECAY);
      fade = Math.max(FADE_MIN, fade * DECAY);
    }

    // ── surprise reveal — fires right after the last greeting ──────
    const REVEAL_AT = cursor + 150; // small breath before the pop

    timers.push(setTimeout(() => {
      helloEl!.animate(
        [
          { opacity: '1', transform: 'scale(1)'    },
          { opacity: '0', transform: 'scale(1.08)' },
        ],
        { duration: 220, easing: 'cubic-bezier(0.7,0,0.84,0)', fill: 'both' }
      );
    }, REVEAL_AT));

    timers.push(setTimeout(() => {
      phase = 'hero';
      setNavReady();
    }, REVEAL_AT + 220));

    return () => {
      timers.forEach(clearTimeout);
      mq.removeEventListener('change', onMqChange);
    };
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section
  class="relative flex min-h-svh w-full flex-col overflow-hidden bg-[#F3EFE9]"
  aria-label="Introduction"
>

  <!-- ── WAVE ───────────────────────────────────────────────────── -->
  {#if phase === 'hero'}
    <WaveCanvas />
  {/if}

  <!-- ── HELLO ──────────────────────────────────────────────────── -->
  <div
    bind:this={helloEl}
    class="absolute inset-0 z-40 flex items-center justify-center bg-[#F3EFE9]
           {phase === 'hero' ? 'pointer-events-none select-none' : ''}"
    aria-live="polite"
    style="opacity: 0;"
  >
    <span class="serif-display italic text-[#181512]" style="font-size: clamp(2.5rem,8vw,6rem);">
      {greetings[greetingIndex]}
    </span>
  </div>

  <!-- ── HERO ───────────────────────────────────────────────────── -->
  {#if phase === 'hero'}

    <div class="h-16 shrink-0 md:h-18" aria-hidden="true"></div>

    <div class="relative flex flex-1 flex-col px-5 sm:px-8 md:px-10">

      <!-- PORTRAIT -->
      <div
        bind:this={portraitEl}
        class="portrait-wrap relative w-full overflow-hidden
               md:absolute md:right-10 md:top-0 md:w-[clamp(180px,26vw,340px)]"
        style="opacity: 0;"
        aria-hidden="true"
      >
        <img
          src={portraitSrc}
          alt=""
          class="h-full w-full object-cover object-top block"
        />
        <div
          class="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style="background: linear-gradient(to bottom, transparent, #F3EFE9);"
        ></div>
      </div>

      <!-- NAME BLOCK -->
      <div
        class="mt-4 md:mt-auto"
        aria-label="Daniel Montesclaros — Computer Engineer"
      >
        <p
          bind:this={eyebrowEl}
          class="mb-1.5 text-[0.5rem] uppercase tracking-[0.13em] text-[#8A7F74] sm:text-[0.5625rem]"
          style="opacity: 0;"
        >
          Computer Engineer&nbsp;&nbsp;·&nbsp;&nbsp;Full-Stack&nbsp;&nbsp;·&nbsp;&nbsp;IoT
        </p>

        <h1
          class="serif-display m-0 italic leading-[0.88] tracking-tight"
          style:font-size="clamp(3rem, 11.5vw, 10rem)"
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
        </h1>
      </div>

      <!-- BOTTOM ROW -->
      <div class="flex flex-col gap-4 pb-6 pt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <p
          bind:this={descEl}
          class="m-0 max-w-xs text-[0.8125rem] leading-[1.75] tracking-[0.01em] text-[#8A7F74]"
          style="opacity: 0;"
        >
          I build across the full product —<br />
          circuits to cloud, firmware to frontend.
        </p>

        <div
          bind:this={ctasEl}
          class="flex items-center gap-2.5"
          style="opacity: 0;"
        >
          <a
            href="#work"
            class="rounded-sm bg-[#181512] px-4 py-2 text-[0.625rem] font-medium
                   uppercase tracking-[0.09em] text-[#F3EFE9] no-underline
                   transition-opacity duration-150 hover:opacity-75
                   sm:px-5 sm:py-2.5 sm:text-[0.6875rem]"
          >View work</a>
          <a
            href="https://github.com/constantine2003"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-sm border border-[#DDD8D0] px-4 py-2 text-[0.625rem]
                   uppercase tracking-[0.09em] text-[#8A7F74] no-underline
                   transition-colors duration-150 hover:border-[#181512] hover:text-[#181512]
                   sm:px-5 sm:py-2.5 sm:text-[0.6875rem]"
          >GitHub ↗</a>
        </div>
      </div>
    </div>

  {/if}
</section>

<style>
  .serif-display {
    font-family: 'DM Serif Display', Georgia, serif;
  }

  .name-outline {
    color: transparent;
    -webkit-text-stroke: 1.5px #181512;
  }

  .portrait-wrap {
    height: 55vw;
    max-height: 320px;
  }
  @media (min-width: 640px) {
    .portrait-wrap {
      height: 45vw;
      max-height: 400px;
    }
  }
  @media (min-width: 768px) {
    .portrait-wrap {
      height: auto;
      max-height: none;
      bottom: 6.5rem;
      position: absolute;
      right: 2.5rem;
      top: 0;
      width: clamp(180px, 26vw, 340px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    canvas { display: none; }
    * { animation: none !important; transition: none !important; }
  }
</style>