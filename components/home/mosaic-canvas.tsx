"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Homepage hero background: a photo mosaic (M1, "even/cool") rendered in
 * WebGL. Every tile is a UNIQUE real photo (never reused, never overlapping),
 * cool navy-tinted at rest and revealed to full color near the cursor. When
 * the cursor is idle it auto-drifts in a slow path so the hero stays alive.
 *
 * Canvas only — no text. Loaded via next/dynamic ssr:false and mounted only
 * on desktop/fine-pointer screens (see HomeHero), so mobile stays light.
 */
const PHOTOS = [
  "white-kitchen-marble-island", "kitchen-island-wood-cabinets-range", "dark-cabinet-kitchen-install",
  "warehouse-cabinet-display", "warehouse-assorted-windows", "discount-countertop-slabs",
  "bathroom-vanities-warehouse-display", "grey-cabinets-warehouse", "warehouse-lighting-inventory",
  "craftsman-door-warehouse", "white-base-cabinets-warehouse", "oak-double-vanity-warehouse",
  "paint-supplies-shelves", "red-sputnik-chandelier", "black-framed-windows-warehouse",
].map((n) => `/real-photos/business/${n}.jpg`);

const COLS = 5;
const ROWS = 3; // COLS*ROWS === PHOTOS.length → one unique photo per tile
const REST = new THREE.Color(0.42, 0.47, 0.6);
const HOT = new THREE.Color(1, 1, 1);

export default function MosaicCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);

    const loader = new THREE.TextureLoader();
    type Tile = { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; tex: THREE.Texture; cx: number; cy: number; col: number; row: number };
    const tiles: Tile[] = [];
    const group = new THREE.Group();
    scene.add(group);

    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tex = loader.load(PHOTOS[i]);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.center.set(0.5, 0.5);
        const mat = new THREE.MeshBasicMaterial({ map: tex, color: REST.clone() });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
        group.add(mesh);
        tiles.push({ mesh, mat, tex, cx: 0, cy: 0, col: c, row: r });
        i++;
      }
    }

    const layout = () => {
      const { clientWidth: w, clientHeight: h } = wrap;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.left = -aspect; camera.right = aspect; camera.top = 1; camera.bottom = -1;
      camera.updateProjectionMatrix();
      const gap = 0.012;
      const cellW = (2 * aspect) / COLS;
      const cellH = 2 / ROWS;
      const cellAspect = cellW / cellH;
      tiles.forEach((t) => {
        t.cx = -aspect + cellW * (t.col + 0.5);
        t.cy = 1 - cellH * (t.row + 0.5);
        t.mesh.position.set(t.cx, t.cy, 0);
        t.mesh.scale.set(cellW - gap, cellH - gap, 1);
        const img = t.tex.image as { width?: number; height?: number } | undefined;
        const ia = img?.width && img?.height ? img.width / img.height : 1.5;
        if (cellAspect > ia) t.tex.repeat.set(1, ia / cellAspect);
        else t.tex.repeat.set(cellAspect / ia, 1);
      });
    };
    layout();
    window.addEventListener("resize", layout);

    const mouse = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();
    let lastMove = -10;
    const onMove = (e: PointerEvent) => {
      const rct = renderer.domElement.getBoundingClientRect();
      if (e.clientY < rct.top || e.clientY > rct.bottom) return;
      const aspect = rct.width / rct.height;
      target.set(((e.clientX - rct.left) / rct.width * 2 - 1) * aspect, -((e.clientY - rct.top) / rct.height * 2 - 1));
      lastMove = clock.getElapsedTime();
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    const loop = () => {
      const t = clock.getElapsedTime();
      const { clientWidth: w, clientHeight: h } = wrap;
      const aspect = w && h ? w / h : 1.6;
      const idle = t - lastMove > 2.2;
      if (idle) target.set(Math.cos(t * 0.25) * aspect * 0.55, Math.sin(t * 0.32) * 0.55);
      mouse.lerp(target, idle ? 0.025 : 0.1);
      tiles.forEach((tl) => {
        const dist = Math.hypot(tl.cx - mouse.x, tl.cy - mouse.y);
        const infl = Math.max(0, 1 - dist / 0.95);
        const e = infl * infl;
        tl.mat.color.lerpColors(REST, HOT, e);
      });
      group.position.x = mouse.x * 0.03;
      group.position.y = mouse.y * 0.03;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    // fade the canvas in once it has painted a frame
    renderer.domElement.style.opacity = "0";
    renderer.domElement.style.transition = "opacity 700ms ease";
    const fade = window.setTimeout(() => { renderer.domElement.style.opacity = "1"; }, 60);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fade);
      window.removeEventListener("resize", layout);
      window.removeEventListener("pointermove", onMove);
      tiles.forEach((tl) => { tl.mesh.geometry.dispose(); tl.tex.dispose(); tl.mat.dispose(); });
      renderer.dispose();
      if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={wrapRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
