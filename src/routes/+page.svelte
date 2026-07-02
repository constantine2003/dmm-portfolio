<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import SectionBreak from '$lib/components/SectionBreak.svelte';
  import About from '$lib/components/About.svelte';
  import SelectedProjects from '$lib/components/SelectedProjects.svelte';
  import ImageGallery from '$lib/components/ImageGallery.svelte';
  import Philosophy from '$lib/components/Philosophy.svelte';
  import Projects from '$lib/components/Projects.svelte';
  import Education from '$lib/components/Education.svelte';
  import Skills from '$lib/components/Skills.svelte';
  import Contact from '$lib/components/Contact.svelte';
  
  import { initNavStatus } from '$lib/states/navReady.svelte';

  const navStatus = initNavStatus();
</script>

<svelte:head>
  <title>Daniel's Portfolio</title>
</svelte:head>

<Hero />

{#if navStatus.ready}
  <SectionBreak />
  <About />
  <SelectedProjects />
  <ImageGallery />
  <Philosophy />
  <Projects />
  <Education />
  <Skills />
  <Contact />
{/if}