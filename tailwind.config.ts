/**
 * ADD THIS to your tailwind.config.ts / tailwind.config.js
 * so that class="font-serif-display" resolves correctly.
 *
 * If you're on Tailwind v4 with CSS config, add the @font-face
 * entry inside your main CSS file instead (see bottom of this file).
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,js,ts,svelte}'],
  theme: {
    extend: {
      fontFamily: {
        // used as: class="font-serif-display"
        'serif-display': ['"DM Serif Display"', 'Georgia', 'serif'],
      },
    },
  },
};

export default config;

/*
 * ── Tailwind v4 CSS-first approach ──────────────────────────────
 * Inside your app.css / global.css, add:
 *
 *   @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');
 *
 *   @theme {
 *     --font-serif-display: "DM Serif Display", Georgia, serif;
 *   }
 *
 * Then class="font-serif-display" works natively in v4.
 */