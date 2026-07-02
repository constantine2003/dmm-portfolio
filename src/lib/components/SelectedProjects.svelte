<script lang="ts">
  import { onMount } from 'svelte';

  type Project = {
    title:    string;
    tags:     string[];
    image:    string;
    href:     string;
    cardId:   string;
    index:    string;
  };

  const projects: Project[] = [
    {
      cardId: 'healthsense',
      index:  '01',
      title:  'HealthSense',
      tags:   ['Undergraduate Thesis', 'IoT + Hardware'],
      image:  '/thumbnail_healthsense.png',
      href:   '#',
    },
    {
      cardId: 'svelteskill',
      index:  '02',
      title:  'SvelteSkill',
      tags:   ['Full-Stack Platform', 'Auth + DB'],
      image:  '/thumbnail_svelteskill.png',
      href:   '#',
    },
    {
      cardId: 'macroloop',
      index:  '03',
      title:  'MacroLoop',
      tags:   ['Desktop App', 'Electron.js'],
      image:  '/thumbnail_macroloop.png',
      href:   '#',
    },
    {
      cardId: 'archivestream',
      index:  '04',
      title:  'ArchiveStream',
      tags:   ['Serverless Platform', 'Privacy-First'],
      image:  '/thumbnail_archive.png',
      href:   '#',
    },
  ];

  let sectionEl = $state<HTMLElement | null>(null);
  let cardEls: HTMLElement[] = [];

  function fadeUp(el: HTMLElement, delay: number) {
    el.animate(
      [
        { opacity: '0', transform: 'translateY(28px)' },
        { opacity: '1', transform: 'translateY(0)'    },
      ],
      { duration: 700, delay, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' }
    );
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        cardEls.forEach((el, i) => fadeUp(el, i * 110));
        observer.disconnect();
      },
      { threshold: 0.1 }
    );
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section
  bind:this={sectionEl}
  id="work"
  class="w-full bg-[#F3EFE9] border-t border-[#DDD8D0]"
  aria-labelledby="work-heading"
>

  <!-- BIG HEADER -->
  <h2
    id="work-heading"
    class="serif-display italic leading-[0.85] tracking-tight text-[#181512]
           text-center px-3 pt-16 sm:px-5 sm:pt-20 md:px-6 md:pt-28"
    style:font-size="clamp(3.5rem, 14vw, 13rem)"
  >
    <span>Selected</span>
    <span class="name-outline">Works.</span>
  </h2>

  <!-- discipline tag row -->
  <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 pb-10 pt-6
              sm:px-8 md:px-10 md:pb-16">
    {#each ['Full-Stack', 'IoT & Hardware', 'Desktop Apps', 'Web Platforms'] as discipline (discipline)}
      <span class="text-[0.6875rem] uppercase tracking-widest text-[#8A7F74]">{discipline}</span>
    {/each}
  </div>

  <!-- PROJECT GRID -->
  <div class="grid grid-cols-1 gap-x-6 gap-y-14 px-5 pb-16 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-20 sm:px-8 md:px-10 md:pb-24">
    {#each projects as project, i (project.cardId)}
      <a
        href={project.href}
        bind:this={cardEls[i]}
        class="group block"
        style="opacity: 0;"
        data-cursor="View"
        aria-label={`View ${project.title} project`}
      >
        <!-- image card -->
        <div class="relative aspect-4/3 w-full overflow-hidden rounded-md bg-[#181512]/5">
          <img
            src={project.image}
            alt={project.title}
            class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          <!-- tag pills -->
          <div class="absolute bottom-4 left-4 flex flex-wrap gap-1.5 z-10">
            {#each project.tags as tag (tag)}
              <span
                class="text-[0.625rem] uppercase tracking-[0.06em] text-white
                       bg-black/45 backdrop-blur-sm px-3 py-1.5 rounded-sm"
              >{tag}</span>
            {/each}
          </div>

          <!-- darken overlay on hover -->
          <div
            class="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15"
          ></div>
        </div>

        <!-- title row: index + serif italic title -->
        <div class="mt-5 flex items-baseline gap-3">
          <span class="project-index">{project.index}</span>
          <h3 class="project-title">
            {project.title}
          </h3>
        </div>

        <!-- animated underline -->
        <div class="project-underline">
          <div class="project-underline-fill"></div>
        </div>
      </a>
    {/each}
  </div>

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

  .project-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-style: italic;
    color: #181512;
    line-height: 1;
    letter-spacing: -0.01em;
    font-size: clamp(1.625rem, 3.2vw, 2.5rem);
    transition: opacity 0.25s ease;
  }
  .group:hover .project-title {
    opacity: 0.7;
  }

  .project-index {
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    color: #C8C3BB;
    font-variant-numeric: tabular-nums;
    transform: translateY(-2px);
  }

  .project-underline {
    margin-top: 0.625rem;
    height: 1px;
    width: 100%;
    background: #DDD8D0;
    overflow: hidden;
  }
  .project-underline-fill {
    height: 100%;
    width: 0%;
    background: #181512;
    transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .group:hover .project-underline-fill {
    width: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; }
  }
</style>