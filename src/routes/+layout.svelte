<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { initNavStatus } from '$lib/states/navReady.svelte';

  const navStatus = initNavStatus();
  let { children } = $props();

  onMount(() => {
    let cleanup = () => {};

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.3,
      });

      const raf = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        lenis.destroy();
        gsap.ticker.remove(raf);
      };
    })();

    return () => cleanup();
  });
</script>

<Cursor />
<Navbar ready={navStatus.ready} />

{@render children()}