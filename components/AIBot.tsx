"use client";

import { useEffect, useRef } from "react";
import type { MeshStandardMaterial, MeshBasicMaterial, Mesh, PointLight } from "three";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  animate,
  MotionValue,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   Props
   ═══════════════════════════════════════════════════════════ */

interface AIBotProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  entranceDelay?: number;
}

interface BuildPhase {
  wire: MotionValue<number>;
  fill: MotionValue<number>;
  light: MotionValue<number>;
  alive: MotionValue<number>;
}

/* ═══════════════════════════════════════════════════════════
   Continuously scrolling code
   ═══════════════════════════════════════════════════════════ */

const CODE_LINES = [
  { text: "import { AI } from '@gsd/core';", cls: "text-cyan-300/70" },
  { text: "const agent = new AI({", cls: "text-cyan-300/70" },
  { text: "  model: 'gpt-4o',", cls: "text-foreground/50" },
  { text: "  tools: ['web', 'code'],", cls: "text-foreground/50" },
  { text: "});", cls: "text-cyan-300/70" },
  { text: "", cls: "" },
  { text: "> compiling routes...", cls: "text-green-400/80" },
  { text: "> bundling assets", cls: "text-yellow-400/70" },
  { text: "const api = express();", cls: "text-cyan-300/70" },
  { text: "api.use(cors());", cls: "text-foreground/50" },
  { text: "api.get('/health', ok);", cls: "text-foreground/50" },
  { text: "", cls: "" },
  { text: "> tests: 42 passed \u2713", cls: "text-green-400/80" },
  { text: "> deploying to prod...", cls: "text-yellow-400/70" },
  { text: "export default app;", cls: "text-cyan-300/70" },
  { text: "> deployed \u2713", cls: "text-green-400/80" },
];

/* ═══════════════════════════════════════════════════════════
   BotCanvas — Three.js GLB model renderer
   ═══════════════════════════════════════════════════════════ */

function BotCanvas({
  rotateY,
  rotateX,
  buildProgress,
}: {
  rotateY: MotionValue<number>;
  rotateX: MotionValue<number>;
  buildProgress: MotionValue<number>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mvRef = useRef({ rotateY, rotateX, buildProgress });
  mvRef.current = { rotateY, rotateX, buildProgress };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );
      if (disposed) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      // Scene (no background — transparent)
      const scene = new THREE.Scene();

      // Camera — wider FOV + pulled back to fit full model
      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
      camera.position.set(0, 0, 5);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
      renderer.domElement.style.display = "block";
      container.appendChild(renderer.domElement);

      // Lighting
      scene.add(new THREE.AmbientLight(0x4060a0, 0.8));

      const main = new THREE.DirectionalLight(0x6090cc, 2.0);
      main.position.set(5, 8, 5);
      scene.add(main);

      const fill = new THREE.DirectionalLight(0x7ee8fa, 0.6);
      fill.position.set(-5, 3, -5);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0x0066ff, 0.5);
      rim.position.set(0, -2, 5);
      scene.add(rim);

      const top = new THREE.PointLight(0x4a8aba, 0.5, 10);
      top.position.set(0, 3, 2);
      scene.add(top);

      // Environment for PBR reflections
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x1a2a4a);
      scene.environment = pmrem.fromScene(envScene).texture;

      /* ── Server room / data center background ─────────────── */
      const serverGroup = new THREE.Group();
      scene.add(serverGroup);

      const ledMeshes: { mesh: Mesh; speed: number; offset: number }[] = [];
      const dataStreamMats: MeshBasicMaterial[] = [];
      let scanLineMesh: Mesh | null = null;
      const serverMaterials: (MeshStandardMaterial | MeshBasicMaterial)[] = [];

      // ── Server rack towers — larger, closer, more visible ──
      const rackPositions = [
        // left cluster (3 rows deep)
        { x: -2.4, z: -0.4 },
        { x: -2.0, z: -0.9 },
        { x: -1.6, z: -0.3 },
        { x: -2.8, z: -0.7 },
        { x: -1.2, z: -0.8 },
        { x: -2.2, z: -1.4 },
        // right cluster
        { x: 2.4, z: -0.4 },
        { x: 2.0, z: -0.9 },
        { x: 1.6, z: -0.3 },
        { x: 2.8, z: -0.7 },
        { x: 1.2, z: -0.8 },
        { x: 2.2, z: -1.4 },
      ];

      const ledColors = [0x00ff88, 0x0088ff, 0xffaa00, 0x00ffcc];

      rackPositions.forEach((pos, rackIdx) => {
        // Main rack body — taller, wider, more opaque
        const rackGeo = new THREE.BoxGeometry(0.4, 2.0, 0.25);
        const rackMat = new THREE.MeshStandardMaterial({
          color: 0x0c1a30,
          transparent: true,
          opacity: 0.55,
          emissive: 0x0a3060,
          emissiveIntensity: 0.5,
          roughness: 0.4,
          metalness: 0.6,
        });
        serverMaterials.push(rackMat);
        const rack = new THREE.Mesh(rackGeo, rackMat);
        rack.position.set(pos.x, 0, pos.z);
        serverGroup.add(rack);

        // Rack shelf lines (horizontal detail) — 5 per rack
        for (let si = 0; si < 5; si++) {
          const shelfGeo = new THREE.BoxGeometry(0.42, 0.008, 0.26);
          const shelfMat = new THREE.MeshBasicMaterial({
            color: 0x1a4a80,
            transparent: true,
            opacity: 0.6,
          });
          serverMaterials.push(shelfMat);
          const shelf = new THREE.Mesh(shelfGeo, shelfMat);
          shelf.position.set(pos.x, -0.7 + si * 0.35, pos.z);
          serverGroup.add(shelf);
        }

        // Edge glow outline on front face
        const edgeGeo = new THREE.BoxGeometry(0.42, 2.02, 0.01);
        const edgeMat = new THREE.MeshBasicMaterial({
          color: 0x0066ff,
          transparent: true,
          opacity: 0.15,
        });
        serverMaterials.push(edgeMat);
        const edge = new THREE.Mesh(edgeGeo, edgeMat);
        edge.position.set(pos.x, 0, pos.z + 0.13);
        serverGroup.add(edge);

        // LEDs — 4 per rack, bigger, brighter
        const ledCount = 4;
        for (let li = 0; li < ledCount; li++) {
          const ledGeo = new THREE.SphereGeometry(0.025, 8, 8);
          const ledMat = new THREE.MeshBasicMaterial({
            color: ledColors[(rackIdx + li) % ledColors.length],
            transparent: true,
            opacity: 1.0,
          });
          const led = new THREE.Mesh(ledGeo, ledMat);
          const yOff = -0.55 + li * 0.35;
          // Alternate left/right placement on rack face
          const xOff = li % 2 === 0 ? -0.12 : 0.12;
          led.position.set(pos.x + xOff, yOff, pos.z + 0.14);
          serverGroup.add(led);
          ledMeshes.push({
            mesh: led,
            speed: 1.2 + rackIdx * 0.3 + li * 0.5,
            offset: rackIdx * 0.9 + li * 1.8,
          });
        }
      });

      // ── Data stream lines — thicker, brighter, more of them ──
      const streamPositions = [
        { x: -1.8, z: -0.6 },
        { x: -1.4, z: -1.1 },
        { x: -0.9, z: -0.5 },
        { x: 0.9, z: -0.5 },
        { x: 1.4, z: -1.1 },
        { x: 1.8, z: -0.6 },
      ];
      streamPositions.forEach((pos) => {
        const streamGeo = new THREE.CylinderGeometry(0.008, 0.008, 2.2, 6);
        const streamMat = new THREE.MeshBasicMaterial({
          color: 0x00ccff,
          transparent: true,
          opacity: 0.35,
        });
        dataStreamMats.push(streamMat);
        const stream = new THREE.Mesh(streamGeo, streamMat);
        stream.position.set(pos.x, 0, pos.z);
        serverGroup.add(stream);
      });

      // ── Horizontal scan line — wider, more visible ──
      const scanGeo = new THREE.PlaneGeometry(7, 0.025);
      const scanMat = new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });
      scanLineMesh = new THREE.Mesh(scanGeo, scanMat);
      scanLineMesh.position.set(0, 0, -0.5);
      serverGroup.add(scanLineMesh);

      // ── Floor grid — larger, brighter, with glow plane ──
      const floorGeo = new THREE.PlaneGeometry(8, 6, 16, 12);
      const floorMat = new THREE.MeshBasicMaterial({
        color: 0x0066ff,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.position.set(0, -1.1, -0.5);
      floor.rotateX(-Math.PI / 2);
      serverGroup.add(floor);

      // Floor glow (solid subtle plane under the grid)
      const floorGlowGeo = new THREE.PlaneGeometry(6, 4);
      const floorGlowMat = new THREE.MeshBasicMaterial({
        color: 0x0044aa,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
      });
      serverMaterials.push(floorGlowMat);
      const floorGlow = new THREE.Mesh(floorGlowGeo, floorGlowMat);
      floorGlow.position.set(0, -1.09, -0.5);
      floorGlow.rotateX(-Math.PI / 2);
      serverGroup.add(floorGlow);

      // ── Back wall ambient glow ──
      const backGlowGeo = new THREE.PlaneGeometry(8, 3);
      const backGlowMat = new THREE.MeshBasicMaterial({
        color: 0x0055cc,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      });
      serverMaterials.push(backGlowMat);
      const backGlow = new THREE.Mesh(backGlowGeo, backGlowMat);
      backGlow.position.set(0, 0, -2.0);
      serverGroup.add(backGlow);

      serverGroup.visible = false;

      // Model group
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      const materials: MeshStandardMaterial[] = [];
      const wireMeshes: Mesh[] = [];
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x008cff,
        wireframe: true,
        transparent: true,
        opacity: 0,
      });

      // Clipping plane for bottom-to-top reveal (normal points DOWN, clips above constant)
      // With normal (0,-1,0): clips where y > constant (hides everything above constant)
      // Start at -100 so everything is clipped (hidden) initially
      const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -100);
      renderer.localClippingEnabled = true;

      // Emissive glow lights for eyes and heart
      let eyeLeftLight: PointLight | null = null;
      let eyeRightLight: PointLight | null = null;
      let heartLight: PointLight | null = null;

      // Model Y bounds (set after load)
      let modelYMin = 0;
      let modelYMax = 1;

      // Load GLB
      const loader = new GLTFLoader();
      loader.load("/models/model.glb", (gltf) => {
        if (disposed) return;
        const model = gltf.scene;

        // Center and scale to fit canvas with padding
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;

        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        // Auto-frame: adjust camera distance so the full model fits
        const fov = camera.fov * (Math.PI / 180);
        const fitHeight = size.y * scale;
        const fitWidth = size.x * scale;
        const distH = fitHeight / 2 / Math.tan(fov / 2);
        const distW = fitWidth / 2 / Math.tan((fov * camera.aspect) / 2);
        const dist = Math.max(distH, distW) * 1.1;
        camera.position.set(0, 0, dist);
        camera.updateProjectionMatrix();

        // Get model Y bounds after centering
        const modelBox = new THREE.Box3().setFromObject(model);
        modelYMin = modelBox.min.y;
        modelYMax = modelBox.max.y;

        model.traverse((child) => {
          const mesh = child as Mesh;
          if (mesh.isMesh) {
            const mat = mesh.material as MeshStandardMaterial;
            // Enable clipping on the material
            mat.clippingPlanes = [clipPlane];
            mat.clipShadows = true;
            materials.push(mat);
          }
        });

        modelGroup.add(model);

        // Eye glow lights — positioned at approximate eye locations
        // Model Y range: 0 to ~1.9 (before scaling). Eyes are roughly at 75-80% height
        const eyeY = modelYMin + (modelYMax - modelYMin) * 0.78;
        const eyeSpacing = (modelYMax - modelYMin) * 0.12;

        eyeLeftLight = new THREE.PointLight(0x00ccff, 0, 2.0);
        eyeLeftLight.position.set(-eyeSpacing, eyeY, 0.6);
        modelGroup.add(eyeLeftLight);

        eyeRightLight = new THREE.PointLight(0x00ccff, 0, 2.0);
        eyeRightLight.position.set(eyeSpacing, eyeY, 0.6);
        modelGroup.add(eyeRightLight);

        // Heart/chest glow — at roughly 45-50% height
        const heartY = modelYMin + (modelYMax - modelYMin) * 0.48;
        heartLight = new THREE.PointLight(0x4488ff, 0, 2.0);
        heartLight.position.set(0, heartY, 0.5);
        modelGroup.add(heartLight);

        // Wireframe overlay — create one for EVERY mesh
        model.traverse((child) => {
          const mesh = child as Mesh;
          if (mesh.isMesh && mesh.geometry) {
            const wire = new THREE.Mesh(mesh.geometry, wireMat);
            mesh.updateWorldMatrix(true, false);
            wire.applyMatrix4(mesh.matrixWorld);
            wire.scale.multiplyScalar(1.02);
            modelGroup.add(wire);
            wireMeshes.push(wire);
          }
        });
      });

      // Animation loop
      const clock = new THREE.Clock();
      let animId: number;

      function tick() {
        if (disposed) return;
        animId = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        const { rotateY, rotateX, buildProgress } = mvRef.current;
        const ry = rotateY.get();
        const rx = rotateX.get();
        const bp = buildProgress.get();

        // Rotation from scroll + mouse
        modelGroup.rotation.y = (ry * Math.PI) / 180;
        modelGroup.rotation.x = (rx * Math.PI) / 180;

        // Build animation — wireframe (long hold during blueprint phase)
        if (wireMeshes.length > 0) {
          let wo = 0;
          if (bp < 0.05) wo = bp / 0.05;          // fade in 0→0.05
          else if (bp < 0.55) wo = 1;              // hold full 0.05→0.55
          else if (bp < 0.72) wo = 1 - (bp - 0.55) / 0.17; // fade out 0.55→0.72
          wireMat.opacity = wo * 0.5;
          const wireVisible = bp > 0 && bp < 0.72;
          wireMeshes.forEach((wm) => { wm.visible = wireVisible; });
        }

        // Build animation — bottom-to-top fill via clipping plane
        // fillProgress: 0 at bp=0.50, 1 at bp=0.82
        const fillProgress = Math.max(0, Math.min(1, (bp - 0.50) / 0.32));

        // Clipping plane with normal (0,-1,0): clips (hides) where y > constant
        // Sweep constant from below model (hide all) to above model (show all)
        if (fillProgress <= 0) {
          // Before fill: clip constant far below model — hides entire solid
          clipPlane.constant = modelYMin - 0.5;
        } else if (fillProgress < 1) {
          // During fill: sweep from bottom to top
          clipPlane.constant = modelYMin + (modelYMax - modelYMin) * fillProgress;
        } else {
          // Fill done: clip constant far above model — nothing clipped
          clipPlane.constant = modelYMax + 1;
        }

        // Eye + heart glow lights — disabled
        if (eyeLeftLight) eyeLeftLight.intensity = 0;
        if (eyeRightLight) eyeRightLight.intensity = 0;
        if (heartLight) heartLight.intensity = 0;

        // Subtle breathing when alive
        if (bp >= 0.95) {
          modelGroup.scale.y = 1 + Math.sin(t * 1.5) * 0.005;
        }

        // ── Server room animations ──
        serverGroup.visible = bp > 0.40;
        const serverFade = Math.max(0, Math.min(1, (bp - 0.40) / 0.35));

        // Parallax rotation (subtle depth feel)
        serverGroup.rotation.y = ((ry * Math.PI) / 180) * 0.3;

        // Fade all server materials proportionally to their base opacity
        serverMaterials.forEach((sm) => {
          const base = (sm as MeshStandardMaterial).emissiveIntensity !== undefined
            ? (sm.userData.baseOpacity ?? sm.opacity)
            : sm.opacity;
          // Store base opacity on first frame
          if (sm.userData.baseOpacity === undefined) {
            sm.userData.baseOpacity = sm.opacity;
          }
          sm.opacity = (sm.userData.baseOpacity as number) * serverFade;
        });

        // Blink LEDs — strong, noticeable
        ledMeshes.forEach(({ mesh, speed, offset }) => {
          const ledMat = mesh.material as MeshBasicMaterial;
          ledMat.opacity =
            (0.4 + 0.6 * Math.max(0, Math.sin(t * speed + offset))) *
            serverFade;
        });

        // Animate data stream opacity — pulsing glow
        dataStreamMats.forEach((dsm, i) => {
          dsm.opacity =
            (0.12 + 0.25 * Math.max(0, Math.sin(t * 1.5 + i * 1.4))) *
            serverFade;
        });

        // Scan line oscillation — sweeps up and down
        if (scanLineMesh) {
          scanLineMesh.position.y = Math.sin(t * 0.4) * 1.0;
          (scanLineMesh.material as MeshBasicMaterial).opacity =
            0.2 * serverFade;
        }

        renderer.render(scene, camera);
      }
      tick();

      // Resize
      const obs = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: rw, height: rh } = entry.contentRect;
          if (rw > 0 && rh > 0) {
            camera.aspect = rw / rh;
            camera.updateProjectionMatrix();
            renderer.setSize(rw, rh);
          }
        }
      });
      obs.observe(container);

      // Store cleanup
      (container as HTMLDivElement & { __cleanup?: () => void }).__cleanup =
        () => {
          disposed = true;
          cancelAnimationFrame(animId);
          obs.disconnect();
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        };
    })();

    return () => {
      disposed = true;
      const fn = (container as HTMLDivElement & { __cleanup?: () => void })
        ?.__cleanup;
      if (fn) fn();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}

/* ═══════════════════════════════════════════════════════════
   Mini keyboard
   ═══════════════════════════════════════════════════════════ */

function MiniKeyboard() {
  const rows = [
    { keys: ["Q","W","E","R","T","Y","U","I","O","P","[","]"], offset: 0 },
    { keys: ["A","S","D","F","G","H","J","K","L",";","'"], offset: 3 },
    { keys: ["Z","X","C","V","B","N","M",",","."], offset: 7 },
  ];

  return (
    <div
      className="relative rounded-xl mt-3 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0e0e22, #0a0a1a)",
        border: "1px solid rgba(40,80,160,0.12)",
        padding: "clamp(6px, 1vw, 12px)",
        boxShadow:
          "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(80,140,255,0.05)",
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{ opacity: [0.02, 0.08, 0.02] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        style={{ background: "rgba(0,100,255,0.06)" }}
      />
      {rows.map((row, ri) => (
        <div
          key={ri}
          className="flex gap-[2px] mb-[2px] last:mb-0"
          style={{ paddingLeft: row.offset }}
        >
          {row.keys.map((label, ki) => (
            <div
              key={ki}
              className="flex-1 rounded-[3px] flex items-center justify-center"
              style={{
                height: "clamp(10px, 1.4vw, 18px)",
                background: "linear-gradient(180deg, #16162e, #0c0c20)",
                boxShadow:
                  "inset 0 1px 0 rgba(80,120,200,0.06), 0 1px 1px rgba(0,0,0,0.2)",
              }}
            >
              <span
                className="font-mono select-none"
                style={{
                  fontSize: "clamp(4px, 0.7vw, 9px)",
                  lineHeight: 1,
                  color: "rgba(120,160,220,0.35)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      ))}
      <div className="flex justify-center mt-[2px]">
        <div
          className="rounded-[3px]"
          style={{
            width: "40%",
            height: "clamp(10px, 1.4vw, 18px)",
            background: "linear-gradient(180deg, #16162e, #0c0c20)",
            boxShadow:
              "inset 0 1px 0 rgba(80,120,200,0.06), 0 1px 1px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Dimension Annotations — igloo.inc-style measurement overlays
   Visible during wireframe/blueprint phase, fade on materialize
   ═══════════════════════════════════════════════════════════ */

const DIMENSION_ANNOTATIONS = [
  // Pairs: each has a number, position (%), and optional line to another point
  { id: "d1", num: 47, x: 28, y: 22, lx: 42, ly: 30, delay: 0 },
  { id: "d2", num: 32, x: 68, y: 18, lx: 58, ly: 28, delay: 0.08 },
  { id: "d3", num: 23, x: 15, y: 45, lx: 30, ly: 42, delay: 0.15 },
  { id: "d4", num: 56, x: 78, y: 40, lx: 65, ly: 38, delay: 0.05 },
  { id: "d5", num: 41, x: 35, y: 65, lx: 45, ly: 55, delay: 0.12 },
  { id: "d6", num: 29, x: 72, y: 62, lx: 60, ly: 52, delay: 0.18 },
  { id: "d7", num: 11, x: 10, y: 70, lx: 25, ly: 60, delay: 0.22 },
  { id: "d8", num: 38, x: 85, y: 25, lx: 72, ly: 32, delay: 0.1 },
  { id: "d9", num: 64, x: 50, y: 15, lx: 50, ly: 25, delay: 0.03 },
  { id: "d10", num: 19, x: 22, y: 82, lx: 35, ly: 72, delay: 0.25 },
  { id: "d11", num: 87, x: 82, y: 75, lx: 68, ly: 65, delay: 0.2 },
  { id: "d12", num: 33, x: 45, y: 80, lx: 48, ly: 68, delay: 0.16 },
];

function DimensionAnnotations({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-[4]"
      style={{ opacity }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {DIMENSION_ANNOTATIONS.map((d) => (
          <g key={d.id}>
            {/* Connecting line from annotation to model area */}
            <line
              x1={d.x}
              y1={d.y}
              x2={d.lx}
              y2={d.ly}
              stroke="rgba(180,210,255,0.2)"
              strokeWidth="0.15"
              strokeDasharray="0.6 0.4"
            />
            {/* Endpoint dot on model */}
            <circle
              cx={d.lx}
              cy={d.ly}
              r="0.3"
              fill="rgba(180,210,255,0.35)"
            />
          </g>
        ))}
      </svg>

      {/* Annotation labels with crosshair + number */}
      {DIMENSION_ANNOTATIONS.map((d) => (
        <motion.div
          key={d.id}
          className="absolute font-mono select-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: d.delay + 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Crosshair */}
          <div className="relative flex items-center gap-[2px]">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className="opacity-40"
            >
              <line x1="0" y1="5" x2="10" y2="5" stroke="rgba(180,210,255,0.6)" strokeWidth="0.5" />
              <line x1="5" y1="0" x2="5" y2="10" stroke="rgba(180,210,255,0.6)" strokeWidth="0.5" />
            </svg>
            <span
              style={{
                fontSize: "clamp(7px, 1vw, 12px)",
                color: "rgba(180,210,255,0.4)",
                letterSpacing: "0.05em",
              }}
            >
              {d.num}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Blueprint grid — visible during wireframe phase, fades out
   ═══════════════════════════════════════════════════════════ */

function BlueprintGrid({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-[0]"
      style={{ opacity }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,120,255,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, black, transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "10%",
          bottom: "40%",
          width: 1,
          background:
            "linear-gradient(to bottom, transparent, rgba(0,120,255,0.08), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "20%",
          right: "20%",
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(0,120,255,0.06), transparent)",
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main AIBot Component

   On load: wireframe → fill → lit → alive (timed ~2.8s)
   On scroll: turn + monitor + keyboard (scroll-driven)
   ═══════════════════════════════════════════════════════════ */

export default function AIBot({
  mouseX,
  mouseY,
  entranceDelay = 3.45,
}: AIBotProps) {
  const { scrollY } = useScroll();

  /* ═══════════════════════════════════════════════════════════
     Build sequence — timed animation on page load
     ═══════════════════════════════════════════════════════════ */

  const buildProgress = useMotionValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      animate(buildProgress, 1, {
        duration: 6,
        ease: "linear",
      });
    }, entranceDelay * 1000);
    return () => clearTimeout(timer);
  }, [entranceDelay, buildProgress]);

  /* Derive build phases from single progress value
     With 6s duration:
     0.00–0.05 (0.0–0.3s)  → wireframe fades in
     0.05–0.55 (0.3–3.3s)  → wireframe fully visible (long hold for blueprint feel)
     0.55–0.70 (3.3–4.2s)  → wireframe fades, solid fills in (materialization)
     0.60–0.80 (3.6–4.8s)  → lighting kicks in
     0.75–0.95 (4.5–5.7s)  → alive / interactive
  */
  const build: BuildPhase = {
    wire: useTransform(buildProgress, [0, 0.05, 0.55, 0.72], [0, 1, 1, 0]),
    fill: useTransform(buildProgress, [0.50, 0.72], [0, 1]),
    light: useTransform(buildProgress, [0.60, 0.82], [0, 1]),
    alive: useTransform(buildProgress, [0.75, 0.95], [0, 1]),
  };

  /* Grid fades with wireframe — long hold during blueprint phase */
  const gridOpacity = useTransform(
    buildProgress,
    [0, 0.05, 0.50, 0.72],
    [0, 0.8, 0.8, 0]
  );

  /* Dimension annotations — appear early, hold through wireframe, fade on materialize */
  const annotationOpacity = useTransform(
    buildProgress,
    [0, 0.08, 0.50, 0.68],
    [0, 0.9, 0.9, 0]
  );

  /* Materialization flash — bright pulse at the wireframe→solid transition */
  const materializeFlash = useTransform(
    buildProgress,
    [0.52, 0.62, 0.75],
    [0, 1, 0]
  );

  /* Overall bot visibility — fades in at start of build */
  const botOpacity = useTransform(buildProgress, [0, 0.08], [0, 1]);

  /* ═══════════════════════════════════════════════════════════
     Scroll-driven animations (active after build completes)
     ═══════════════════════════════════════════════════════════ */

  /* Bot shifts 20% left when monitor slides in (percentage-based for responsiveness) */
  const rawBotShiftPct = useTransform(scrollY, [30, 280], [0, -20]);
  const botShiftPct = useSpring(rawBotShiftPct, { stiffness: 100, damping: 20 });
  const botTranslateX = useMotionTemplate`${botShiftPct}%`;

  /* Bot shrinks 10% as monitor slides in */
  const rawBotScale = useTransform(scrollY, [30, 280], [1, 0.9]);
  const botScale = useSpring(rawBotScale, { stiffness: 100, damping: 20 });

  const rawTurnY = useTransform(scrollY, [30, 270], [0, 90]);
  const turnY = useSpring(rawTurnY, { stiffness: 120, damping: 20 });

  const rawMonitorX = useTransform(scrollY, [80, 300], [200, 0]);
  const monitorX = useSpring(rawMonitorX, { stiffness: 100, damping: 20 });
  const monitorOpacity = useTransform(scrollY, [80, 250], [0, 1]);

  const kbOpacity = useTransform(scrollY, [180, 320], [0, 1]);
  const screenGlow = useTransform(scrollY, [200, 380], [0, 1]);

  /* ═══════════════════════════════════════════════════════════
     Mouse tilt — fades out during scroll turn
     ═══════════════════════════════════════════════════════════ */

  const tiltIntensity = useTransform(scrollY, [0, 60, 140], [1, 1, 0]);

  const rawTiltY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const rawTiltX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);

  const blendedTiltY = useTransform(
    [rawTiltY, tiltIntensity] as MotionValue<number>[],
    (latest: number[]) => latest[0] * latest[1]
  );
  const blendedTiltX = useTransform(
    [rawTiltX, tiltIntensity] as MotionValue<number>[],
    (latest: number[]) => latest[0] * latest[1]
  );

  const combinedRotateY = useTransform(
    [turnY, blendedTiltY] as MotionValue<number>[],
    (latest: number[]) => latest[0] + latest[1]
  );
  const finalRotateX = useSpring(blendedTiltX, {
    stiffness: 150,
    damping: 25,
  });

  const shadowX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [10, -10]),
    { stiffness: 100, damping: 30 }
  );

  /* Monitor perspective spring (must be at top level, not in JSX) */
  const monitorRotateY = useSpring(
    useTransform(monitorOpacity, [0, 1], [-8, 0]),
    { stiffness: 80, damping: 20 }
  );

  return (
    <div className="relative w-full h-full">
      {/* Blueprint grid — behind everything */}
      <BlueprintGrid opacity={gridOpacity} />

      {/* Dimension annotations — measurement lines during wireframe phase */}
      <DimensionAnnotations opacity={annotationOpacity} />

      {/* Materialization flash — bright center pulse during wireframe→solid transition */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{ opacity: materializeFlash }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,150,255,0.25) 0%, rgba(0,120,255,0.08) 40%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      </motion.div>

      <motion.div style={{ opacity: botOpacity }} className="h-full">
        {/* Idle float — only starts after build completes (6s) */}
        <motion.div
          className="h-full"
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: entranceDelay + 6 }}
        >
          <div className="relative h-full">
            {/* 3D Bot — Three.js canvas */}
            <motion.div
              className="relative z-[2] flex justify-center h-full"
              style={{ x: botTranslateX, scale: botScale }}
            >
              <div className="w-full h-full">
                <BotCanvas
                  rotateY={combinedRotateY}
                  rotateX={finalRotateX}
                  buildProgress={buildProgress}
                />
              </div>

              {/* Ground shadow — fades in with lighting */}
              <motion.div
                className="absolute -bottom-6 left-1/2 pointer-events-none"
                style={{
                  width: "50%",
                  maxWidth: 500,
                  height: 50,
                  x: shadowX,
                  translateX: "-50%",
                  opacity: build.light,
                  background:
                    "radial-gradient(ellipse, rgba(0,80,200,0.2) 0%, rgba(0,60,160,0.06) 50%, transparent 70%)",
                  filter: "blur(12px)",
                  borderRadius: "50%",
                }}
              />
            </motion.div>

            {/* Screen glow */}
            <motion.div
              className="absolute top-[10%] left-[30%] w-[40%] h-[60%] pointer-events-none z-[1]"
              style={{
                opacity: screenGlow,
                background:
                  "radial-gradient(ellipse, rgba(0,100,255,0.1) 0%, transparent 70%)",
                filter: "blur(24px)",
              }}
            />

            {/* Monitor + Keyboard */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 z-[3] hidden sm:block"
              style={{
                left: "52%",
                width: "clamp(240px, 35%, 480px)",
                x: monitorX,
                opacity: monitorOpacity,
              }}
            >
              <div style={{ perspective: 800 }}>
                <motion.div
                  style={{
                    rotateY: monitorRotateY,
                    transformOrigin: "left center",
                  }}
                >
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "linear-gradient(180deg, #0e0e24, #06061a)",
                      boxShadow:
                        "0 0 60px rgba(0,80,200,0.1), 0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(100,160,255,0.08)",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 px-4 py-2.5"
                      style={{
                        borderBottom: "1px solid rgba(40,80,160,0.12)",
                        background:
                          "linear-gradient(180deg, rgba(20,20,50,0.4), transparent)",
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: "#ff5f57",
                          boxShadow: "0 0 4px rgba(255,95,87,0.3)",
                        }}
                      />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: "#febc2e",
                          boxShadow: "0 0 4px rgba(254,188,46,0.3)",
                        }}
                      />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: "#28c840",
                          boxShadow: "0 0 4px rgba(40,200,64,0.3)",
                        }}
                      />
                      <span
                        className="ml-3 text-foreground/30 font-mono"
                        style={{ fontSize: "clamp(9px, 1.1vw, 13px)" }}
                      >
                        project.ts
                      </span>
                    </div>

                    <div
                      className="relative overflow-hidden"
                      style={{ height: "clamp(140px, 26vw, 320px)" }}
                    >
                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: "-50%" }}
                        transition={{
                          duration: 14,
                          repeat: Infinity,
                          ease: "linear",
                          repeatType: "loop",
                        }}
                        className="px-4 py-2"
                      >
                        {[...CODE_LINES, ...CODE_LINES].map((line, i) => (
                          <div
                            key={i}
                            className={`font-mono truncate ${line.cls}`}
                            style={{
                              fontSize: "clamp(10px, 1.4vw, 15px)",
                              lineHeight: 1.8,
                            }}
                          >
                            {line.text || "\u00A0"}
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>

                  <motion.div style={{ opacity: kbOpacity }}>
                    <MiniKeyboard />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Ambient glow — fades in with lighting */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-16 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,80,200,0.1) 0%, rgba(0,140,255,0.03) 40%, transparent 70%)",
          filter: "blur(16px)",
          opacity: build.light,
          x: shadowX,
        }}
      />
    </div>
  );
}
