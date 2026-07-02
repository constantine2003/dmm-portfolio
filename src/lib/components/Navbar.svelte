<script lang="ts">
  import { onMount } from 'svelte';

  let { ready = false }: { ready: boolean } = $props();

  let scrolled = $state(false);
  let menuOpen = $state(false);
  let navEl = $state<HTMLElement | null>(null);

  const links = [
    { label: 'WORK',     href: '#work'     },
    { label: 'ABOUT',    href: '#about'    },
    { label: 'PROJECTS', href: '/projects' },
    { label: 'CONTACT',  href: '#contact'  },
  ] satisfies { label: string; href: string }[];

  onMount(() => {
    const onScroll = () => { scrolled = window.scrollY > 80; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  // runs after ready flips true and navEl is bound
  $effect(() => {
    if (!ready || !navEl) return;

    const items = navEl.querySelectorAll<HTMLElement>('[data-nav-item]');
    items.forEach((el, i) => {
      el.animate(
        [
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)',   opacity: 1 },
        ],
        {
          duration: 600,
          delay: i * 80,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'both',
        }
      );
    });
  });
</script>

{#if ready}
  <header
    bind:this={navEl}
    class="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-10 py-5 transition-all duration-500
      {scrolled
        ? 'bg-[#F3EFE9]/90 backdrop-blur-md border-b border-[#DDD8D0]'
        : 'bg-transparent border-b border-transparent'}"
  >
    <!-- logo -->
    <a
      href="/"
      data-nav-item
      class="text-[0.8125rem] font-medium uppercase tracking-[0.06em] text-[#181512] no-underline"
      style="clip-path: inset(0 100% 0 0); opacity: 0;"
    >
      DM.
    </a>

    <!-- desktop links -->
    <nav aria-label="Primary navigation" class="hidden md:block">
      <ul class="flex items-center gap-8">
        {#each links as { label, href } (label)}
          <li data-nav-item style="clip-path: inset(0 100% 0 0); opacity: 0;">
            <a {href} class="nav-link">{label}</a>
          </li>
        {/each}
      </ul>
    </nav>

    <!-- right side -->
    <div class="flex items-center gap-6">
      <!-- <a
        href="#contact"
        data-nav-item
        class="open-to-work hidden md:inline-flex"
        style="clip-path: inset(0 100% 0 0); opacity: 0;"
      >
        ↗ Open to work
      </a> -->

      <!-- hamburger (mobile only) -->
      <button
        class="md:hidden flex flex-col justify-center items-center w-8 h-8 text-[#181512]"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onclick={() => menuOpen = !menuOpen}
      >
        {menuOpen ? '✕' : '☰'}
      </button>
    </div>

    <!-- mobile menu -->
    {#if menuOpen}
      <nav
        aria-label="Mobile navigation"
        class="absolute left-0 top-full w-full border-t border-[#DDD8D0] bg-[#F3EFE9]/95 backdrop-blur-md py-6 md:hidden"
      >
        <ul class="flex flex-col gap-6 px-10">
          {#each links as { label, href } (label)}
            <li>
              <a
                {href}
                class="nav-link"
                onclick={() => menuOpen = false}
              >
                {label}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
  </header>
{/if}

<style>
  ul { list-style: none; margin: 0; padding: 0; }
  li::marker { display: none; content: ''; }

  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: .25rem 0;
    font-size: .6875rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    text-decoration: none;
    color: #8A7F74;
    transition: color .25s;
  }

  .nav-link:hover {
    color: #181512;
  }

  .nav-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 1px;
    background: #181512;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .35s cubic-bezier(.16, 1, .3, 1);
  }

  .nav-link:hover::after {
    transform: scaleX(1);
  }

  /* .open-to-work {
    font-size: .6875rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    text-decoration: none;
    font-style: italic;
    color: #8A7F74;
    transition: color .25s;
  }

  .open-to-work:hover {
    color: #181512;
  } */

  @media (prefers-reduced-motion: reduce) {
    [data-nav-item] { clip-path: none !important; opacity: 1 !important; }
  }
</style>