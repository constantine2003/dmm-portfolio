import { gsap } from 'gsap';

interface RevealOptions {
  y?: number;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
  const { y = 40, delay = 0, duration = 0.9, stagger = 0 } = options;

  const tween = gsap.fromTo(
    node,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger: node,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    }
  );

  return {
    destroy() {
      tween.scrollTrigger?.kill();
      tween.kill();
    }
  };
}