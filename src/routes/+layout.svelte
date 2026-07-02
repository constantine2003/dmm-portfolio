<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { initNavStatus } from '$lib/states/navReady.svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Lenis from 'lenis';

  gsap.registerPlugin(ScrollTrigger);

  const navStatus = initNavStatus();
  let { children } = $props();

  onMount(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      orientation: 'vertical',
      smoothWheel: true,
    });

    // hook lenis into GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  });
</script>

<Cursor />
<Navbar ready={navStatus.ready} />

{@render children()}