<script lang="ts">
  import { reveal } from '$lib/actions/reveal';

  const stats = [
    { index: '01', value: '8',        label: 'Projects\nshipped'          },
    { index: '02', value: '3+',       label: 'Platforms\nbuilt for'        },
    { index: '03', value: '4+',     label: 'Earned\nCertifiates'    },
    { index: '04', value: 'May \'26', label: 'BS CompE\nCIT-U'             },
  ] satisfies { index: string; value: string; label: string }[];

  const tags = [
    'Full-Stack', 'IoT', 'Hardware',
    'PCB Assembly', 'Mobile', 'Desktop', 'AI Tools',
  ] satisfies string[];
</script>

<section
  id="about"
  class="w-full"
  style="background: #F3EFE9;"
  aria-labelledby="about-heading"
>

  <div class="about-gradient-block">

    <div class="grad-base"></div>
    <div class="grad-cloud grad-cloud-a"></div>
    <div class="grad-cloud grad-cloud-b"></div>
    <div class="grad-cloud grad-cloud-c"></div>
    <div class="grad-vignette"></div>

    <svg class="wave wave-top" viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#F3EFE9">
        <animate
          attributeName="d"
          dur="9s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          values="
            M0,0 L1440,0 L1440,45 Q1080,90 720,55 Q360,20 0,65 Z;
            M0,0 L1440,0 L1440,55 Q1080,15 720,50 Q360,85 0,40 Z;
            M0,0 L1440,0 L1440,45 Q1080,90 720,55 Q360,20 0,65 Z
          "
        />
      </path>
    </svg>

    <div class="grad-content">
      <h2
        use:reveal={{ y: 70, duration: 1.2 }}
        id="about-heading"
        class="serif-display italic leading-[0.88] tracking-tight"
        style="font-size: clamp(4rem, 10vw, 9rem); color: #EDE9E3;"
      >
        Engineer<br />
        <span class="outline-text-cream">from circuits</span><br />
        to cloud.
      </h2>
    </div>

    <svg class="wave wave-bottom" viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#F3EFE9">
        <animate
          attributeName="d"
          dur="11s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          values="
            M0,90 L1440,90 L1440,45 Q1100,0 720,35 Q340,70 0,25 Z;
            M0,90 L1440,90 L1440,35 Q1100,80 720,45 Q340,10 0,55 Z;
            M0,90 L1440,90 L1440,45 Q1100,0 720,35 Q340,70 0,25 Z
          "
        />
      </path>
    </svg>

  </div>

  <!-- ── MAIN CONTENT GRID ──────────────────────────────────────── -->
  <div class="grid grid-cols-1 border-b border-[#DDD8D0] md:grid-cols-[1fr_1fr]">

    <!-- LEFT — printf() framed body copy -->
    <div class="relative flex flex-col justify-between gap-16 border-b border-[#DDD8D0]
                px-5 py-12 sm:px-8 md:border-b-0 md:border-r md:px-10 md:py-16 overflow-hidden">

      <div use:reveal={{ y: 30, duration: 0.9, delay: 0.1 }} class="relative">

        <!-- printf( — large opening -->
        <span class="printf-tag">[INTRO]</span>
 
        <!-- the "quoted" body copy -->
        <div class="printf-body">
          <span class="quote-char">"</span>
          <span class="body-text">
            CIT-U Computer Engineering graduate, Cebu PH.
            I don't live on one layer of the stack — I've shipped a
            <em class="text-[#181512] not-italic font-medium">desktop app, a mobile app,</em>
            and multiple web platforms, and I've soldered components onto PCBs
            and validated
            <em class="text-[#181512] not-italic font-medium">AI-powered IoT devices</em>
            in a real production environment.
            <br /><br />
            My internship at Xeleqt exposed me to the physical layer of
            computing — assembling prototypes, diagnosing hardware faults,
            testing networked systems. That changed how I think about
            software permanently.
            <br /><br />
            <strong class="text-[#181512] font-medium">
              8 shipped projects. Web, mobile, desktop, hardware. All of it, one person.
            </strong>
          </span>
          <span class="quote-char">"</span>
        </div>
      </div>

      <div use:reveal={{ y: 20, duration: 0.7, delay: 0.2 }} class="relative">
        <div class="flex flex-wrap gap-1.5 mb-8">
          {#each tags as tag, i (tag)}
            <span
              class="tag tag-cascade"
              style="animation-delay: {0.3 + i * 0.06}s;"
            >{tag}</span>
          {/each}
        </div>
      </div>
    </div>

    <!-- stats -->
    <div class="grid grid-cols-2">
      {#each stats as { index, value, label }, i (index)}
        <div
          use:reveal={{ y: 24, duration: 0.7, delay: i * 0.07 }}
          class="stat-cell
            {i % 2 === 0 ? 'border-r' : ''}
            {i < 2 ? 'border-b' : ''}
            border-[#DDD8D0]"
        >
          <span class="stat-index">{index}</span>
          <span
            class="serif-display italic stat-value stat-pop"
            style="animation-delay: {0.25 + i * 0.09}s;"
          >{value}</span>
          <span class="stat-label">{label}</span>
        </div>
      {/each}
    </div>

  </div>

</section>

<style>
  .about-gradient-block {
    position: relative;
    overflow: hidden;
    min-height: clamp(320px, 50vw, 560px);
  }

  .grad-base {
    position: absolute;
    inset: 0;
    background: #0E0B1C;
  }

  /* ── horizontal cloudy blend layers ──
     Instead of scaling/translating a hard-edged radial ellipse (which
     exposed its boundary at the container edge and caused the rippling
     "wave" artifact), each layer is a soft linear-gradient, blurred and
     overscanned, that drifts purely via background-position. There is
     never a hard edge inside the visible area, so the motion reads as
     a slow-moving cloud instead of a pulsing blob. */
  .grad-cloud {
    position: absolute;
    inset: -15% -40%;
    pointer-events: none;
    z-index: 1;
    filter: blur(50px);
    background-repeat: no-repeat;
    will-change: background-position;
  }

  .grad-cloud-a {
    background-image: linear-gradient(
      100deg,
      transparent 0%,
      transparent 15%,
      #3B2E5A 38%,
      #4E3D7A 50%,
      #2E2350 62%,
      transparent 85%,
      transparent 100%
    );
    background-size: 160% 100%;
    animation: cloud-drift-a 22s ease-in-out infinite alternate;
  }

  .grad-cloud-b {
    background-image: linear-gradient(
      80deg,
      transparent 0%,
      transparent 20%,
      #6B4F8F 42%,
      #3B2E5A 58%,
      transparent 80%,
      transparent 100%
    );
    background-size: 150% 100%;
    mix-blend-mode: screen;
    opacity: 0.35;
    animation: cloud-drift-b 28s ease-in-out infinite alternate;
  }

  .grad-cloud-c {
    background-image: linear-gradient(
      110deg,
      transparent 20%,
      #241B42 45%,
      transparent 70%
    );
    background-size: 180% 100%;
    opacity: 0.7;
    animation: cloud-drift-c 34s ease-in-out infinite alternate;
  }

  @keyframes cloud-drift-a {
    0%   { background-position: 0% 50%;   }
    100% { background-position: 100% 50%; }
  }
  @keyframes cloud-drift-b {
    0%   { background-position: 100% 50%; }
    100% { background-position: 0% 50%;   }
  }
  @keyframes cloud-drift-c {
    0%   { background-position: 20% 50%;  }
    100% { background-position: 90% 50%;  }
  }

  /* soft vignette to keep edges dark and add depth on top of the clouds */
  .grad-vignette {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background: radial-gradient(
      ellipse 75% 80% at 42% 50%,
      transparent 30%,
      rgba(6, 4, 16, 0.85) 100%
    );
  }

  .wave {
    position: absolute;
    left: 0;
    width: 100%;
    height: 90px;
    pointer-events: none;
    z-index: 3;
  }
  .wave-top    { top: 0;    }
  .wave-bottom { bottom: 0; }

  .grad-content {
    position: relative;
    z-index: 4;
    padding: clamp(5rem, 10vw, 8rem) 1.25rem clamp(5rem, 10vw, 8rem);
  }
  @media (min-width: 640px) { .grad-content { padding-left: 2rem;   padding-right: 2rem;   } }
  @media (min-width: 768px) { .grad-content { padding-left: 2.5rem; padding-right: 2.5rem; } }

  .outline-text-cream {
    color: transparent;
    -webkit-text-stroke: 2px rgba(237, 233, 227, 0.5);
  }

  .serif-display {
    font-family: 'DM Serif Display', Georgia, serif;
  }

  /* ── printf() framing ── */
  .printf-tag {
    display: block;
    font-family: 'Courier New', 'SF Mono', Consolas, monospace;
    font-weight: 600;
    font-size: clamp(1.5rem, 2.4vw, 2.1rem);
    color: #181512;
    letter-spacing: -0.01em;
  }

  .printf-close {
    margin-top: 0.5rem;
  }

  .printf-body {
    position: relative;
    margin: 0.75rem 0 0.5rem;
    padding-left: 1.25rem;
    border-left: 2px solid #DDD8D0;
  }

  .quote-char {
    font-family: 'Courier New', 'SF Mono', Consolas, monospace;
    font-size: 1.4rem;
    font-weight: 700;
    color: #C9A876;
    vertical-align: top;
    line-height: 1;
  }

  .body-text {
    font-family: 'Courier New', 'SF Mono', Consolas, monospace;
    font-size: clamp(1rem, 1.6vw, 1.32rem);
    line-height: 1.85;
    color: #6B6159;
    letter-spacing: -0.005em;
  }

  /* ── tags ── */
  .tag {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8A7F74;
    border: 1px solid #DDD8D0;
    padding: 0.3rem 0.65rem;
    transition: border-color 0.2s, color 0.2s, transform 0.2s;
  }
  .tag:hover {
    border-color: #181512;
    color: #181512;
    transform: translateY(-2px);
  }

  .tag-cascade {
    opacity: 0;
    animation: tag-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes tag-in {
    from { opacity: 0; transform: translateY(10px) scale(0.92); }
    to   { opacity: 1; transform: translateY(0)     scale(1);   }
  }

  /* ── stat cells ── */
  .stat-cell {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 0.4rem;
    padding: 1.75rem 1.5rem;
    min-height: 11rem;
    transition: background-color 0.3s ease;
  }
  .stat-cell:hover {
    background-color: rgba(24, 21, 18, 0.025);
  }
  .stat-cell:hover .stat-value {
    transform: translateX(4px);
  }

  .stat-index {
    position: absolute;
    top: 1rem; right: 1rem;
    font-size: 0.45rem;
    letter-spacing: 0.08em;
    color: #C8C3BB;
    transition: color 0.3s ease;
  }
  .stat-cell:hover .stat-index {
    color: #8A7F74;
  }

  .stat-value {
    font-size: clamp(2.5rem, 4.5vw, 3.75rem);
    line-height: 1;
    letter-spacing: -0.03em;
    color: #181512;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: inline-block;
  }

  .stat-pop {
    opacity: 0;
    transform-origin: left bottom;
    animation: stat-pop-in 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes stat-pop-in {
    0%   { opacity: 0; transform: scale(0.7) translateY(16px); }
    60%  { opacity: 1; transform: scale(1.04) translateY(0);   }
    100% { opacity: 1; transform: scale(1)    translateY(0);   }
  }

  .stat-label {
    font-size: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8A7F74;
    line-height: 1.6;
    white-space: pre-line;
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; opacity: 1 !important; transform: none !important; }
    .wave path animate { display: none; }
    .tag-cascade, .stat-pop { opacity: 1 !important; }
    .grad-cloud-a { background-position: 40% 50%; }
    .grad-cloud-b { background-position: 60% 50%; }
    .grad-cloud-c { background-position: 55% 50%; }
  }
</style>