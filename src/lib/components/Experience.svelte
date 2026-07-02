<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

  let canvasEl: HTMLCanvasElement | undefined = $state(undefined);
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let controls: OrbitControls;
  let animationId: number;
  let initFailed = $state(false);
  let debugInfo = $state('Loading...');
  const clock = new THREE.Timer();

  onMount(() => {
    try {
      if (!canvasEl) { initFailed = true; return; }

      const cvs = canvasEl;
      const W = cvs.offsetWidth || 800;
      const H = cvs.offsetHeight || 700;

      renderer = new THREE.WebGLRenderer({ canvas: cvs, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H, false);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      camera.position.set(0, 1.6, 4.5);

      // ── Orbit Controls ──
      controls = new OrbitControls(camera, cvs);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.minDistance = 1.5;
      controls.maxDistance = 8;
      controls.maxPolarAngle = Math.PI / 2 + 0.1; // don't go below ground
      controls.target.set(0, 1, 0);
      controls.update();

      // ── Lights ──
      scene.add(new THREE.AmbientLight(0xffffff, 1.5));

      const key = new THREE.DirectionalLight(0xfff5e0, 3.5);
      key.position.set(2, 5, 3);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 30;
      key.shadow.camera.left   = -3;
      key.shadow.camera.right  =  3;
      key.shadow.camera.top    =  4;
      key.shadow.camera.bottom = -1;
      scene.add(key);

      const fill = new THREE.DirectionalLight(0xd4af37, 0.8);
      fill.position.set(-3, 2, -2);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0xffffff, 1.2);
      rim.position.set(0, 4, -5);
      scene.add(rim);

      // ── Ground ──
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.ShadowMaterial({ opacity: 0.2 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // ── Load GLB ──
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);

      loader.load(
        '/3dmodelofme.glb',
        (gltf: GLTF) => {
          const model = gltf.scene;

          // Auto-center and scale to fill view nicely
          const box    = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size   = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale  = 2.2 / maxDim;

          model.scale.setScalar(scale);
          model.position.copy(center.multiplyScalar(-scale));
          model.position.y = 0;

          // Recalculate after scaling so we know real height
          const scaledBox = new THREE.Box3().setFromObject(model);
          const scaledSize = scaledBox.getSize(new THREE.Vector3());
          const modelHeight = scaledSize.y;

          // Point camera and orbit target at mid-body
          const midY = modelHeight * 0.5;
          controls.target.set(0, midY, 0);
          camera.position.set(0, midY, modelHeight * 1.8);
          controls.update();

          // ── Hide base disc ──
          model.traverse((node: THREE.Object3D) => {
            const mesh = node as THREE.Mesh;
            if (mesh.isMesh) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat?.color) {
                const { r, g, b } = mat.color;
                const isBlack = r < 0.15 && g < 0.15 && b < 0.15;
                const flatBox = new THREE.Box3().setFromObject(mesh);
                const flatSize = flatBox.getSize(new THREE.Vector3());
                const isFlat = flatSize.y < 0.15;
                if (isBlack && isFlat) {
                  mesh.visible = false;
                  console.log('🚫 Hidden base mesh:', mesh.name);
                }
              }
            }
          });

          model.traverse((node: THREE.Object3D) => {
            if ((node as THREE.Mesh).isMesh) {
              (node as THREE.Mesh).castShadow = false;
              (node as THREE.Mesh).receiveShadow = true;
            }
          });

          scene.add(model);
          debugInfo = 'Drag to rotate · Scroll to zoom · Right-click to pan';
        },
        (progress) => {
          const pct = Math.round((progress.loaded / (progress.total || 1)) * 100);
          debugInfo = `Loading... ${pct}%`;
        },
        (err: unknown) => {
          initFailed = true;
          debugInfo = '❌ Failed to load GLB';
          console.error('GLB load error:', err);
        }
      );

      // ── Resize ──
      const onResize = () => {
        const w = cvs.offsetWidth;
        const h = cvs.offsetHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener('resize', onResize);

      // ── Render loop ──
      const tick = () => {
        animationId = requestAnimationFrame(tick);
        clock.getDelta(); // keep timer ticking
        controls.update();
        renderer.render(scene, camera);
      };
      tick();

      return () => window.removeEventListener('resize', onResize);

    } catch (err) {
      initFailed = true;
      console.error('WebGL init failed:', err);
    }
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    controls?.dispose();
    renderer?.dispose();
  });
</script>

{#if initFailed}
  <div class="fallback">Unable to render 3D on this device.</div>
{:else}
  <div class="wrapper">
    <canvas bind:this={canvasEl} class="cvs"></canvas>
    <div class="hint">{debugInfo}</div>
  </div>
{/if}

<style>
  .wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 500px;
    max-height: 900px;
    background: transparent;
  }

  .cvs {
    display: block;
    width: 100%;
    height: 100%;
  }

  .hint {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 11px;
    color: rgba(212, 175, 55, 0.6);
    font-family: monospace;
    pointer-events: none;
    letter-spacing: 0.05em;
  }

  .fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500px;
    color: rgba(239, 246, 241, 0.4);
    font-family: monospace;
  }
</style>