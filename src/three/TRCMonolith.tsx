"use client";

import { ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { MARK_HEIGHT, MARK_PARTS, MARK_WIDTH, type MarkPart } from "@/lib/brand/geometry";
import { SceneCanvas } from "./SceneCanvas";

/**
 * TRC Monolith in 3D — the logo's parts extruded as precast elements.
 * Purpose: hero identity moment. GSAP drives `state` (intro assembly, scroll explode);
 * the scene only reads it. Budget: 4 meshes, 4 line sets, 1 contact shadow, no textures.
 */
export interface MonolithState {
  /** 0 → 1 assembly on load */
  intro: number;
  /** 0 → 1 exploded axonometric on scroll */
  explode: number;
  /** pointer position, -1 → 1 */
  px: number;
  py: number;
}

type PartId = MarkPart["id"];
const DEPTH = 16;

const ASSEMBLY: Record<PartId, { from: [number, number, number]; rot: [number, number, number]; window: [number, number] }> = {
  column: { from: [0, -80, 0], rot: [0, 0, 0], window: [0, 0.5] },
  brace: { from: [90, 0, -60], rot: [0, -0.7, 0], window: [0.12, 0.66] },
  channel: { from: [130, 0, 40], rot: [0, 0.8, 0], window: [0.24, 0.8] },
  beam: { from: [0, 90, 0], rot: [0, 0, 0.4], window: [0.48, 1] },
};

const EXPLODE: Record<PartId, [number, number, number]> = {
  beam: [-12, 17, 10],
  column: [-16, -3, 10],
  brace: [2, 0, 12],
  channel: [17, -3, -6],
};

const LABEL_OFFSET: Record<PartId, [number, number, number]> = {
  beam: [-14, 9, 0],
  column: [-13, -15, 0],
  brace: [2, 25, 0],
  channel: [8, -25, 0],
};

/** world-space box the camera keeps in frame (the mark plus room for the exploded view) */
const FIT_W = 195;
const FIT_H = 90;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface BuiltPart {
  part: MarkPart;
  geometry: THREE.ExtrudeGeometry;
  edges: THREE.EdgesGeometry;
  base: THREE.Vector3;
}

function buildPart(part: MarkPart): BuiltPart {
  const xs = part.outline.map((p) => p[0]);
  const ys = part.outline.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const toV = ([x, y]: readonly [number, number]) => new THREE.Vector2(x - cx, -(y - cy));
  const shape = new THREE.Shape(part.outline.map(toV));
  for (const hole of part.holes ?? []) shape.holes.push(new THREE.Path(hole.map(toV)));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.45,
    bevelSize: 0.4,
    bevelSegments: 2,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -DEPTH / 2);
  const edges = new THREE.EdgesGeometry(geometry, 25);
  const base = new THREE.Vector3(cx - MARK_WIDTH / 2, MARK_HEIGHT / 2 - cy, 0);
  return { part, geometry, edges, base };
}

function MonolithModel({
  state,
  labelEls,
  onReady,
}: {
  state: RefObject<MonolithState>;
  labelEls: RefObject<(HTMLDivElement | null)[]>;
  onReady?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Group | null)[]>([]);
  const { camera, size } = useThree();
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const edgeMaterials = useRef<THREE.LineBasicMaterial[]>([]);
  const built = useMemo(() => MARK_PARTS.map(buildPart), []);

  const materials = useMemo(
    () => ({
      concrete: new THREE.MeshStandardMaterial({ color: "#d2cdc3", roughness: 0.9, metalness: 0 }),
      amber: new THREE.MeshStandardMaterial({ color: "#e8a317", roughness: 0.5, metalness: 0.05 }),
    }),
    [],
  );

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(
    () => () => {
      built.forEach((b) => {
        b.geometry.dispose();
        b.edges.dispose();
      });
      materials.concrete.dispose();
      materials.amber.dispose();
      edgeMaterials.current.forEach((m) => m.dispose());
    },
    [built, materials],
  );

  useFrame(({ camera: cam }, delta) => {
    const s = state.current;
    if (!s || !group.current) return;
    // keep the whole mark in frame whatever the canvas proportions (portrait tablets, ultrawide)
    const persp = cam as THREE.PerspectiveCamera;
    const t = Math.tan(THREE.MathUtils.degToRad(persp.fov) / 2);
    const aspect = size.width / Math.max(1, size.height);
    const dist = Math.max(FIT_H / 2 / t, FIT_W / 2 / (t * aspect));
    persp.position.z = THREE.MathUtils.damp(persp.position.z, dist, 6, Math.min(delta, 1 / 20));
    const e = easeInOut(clamp01(s.explode));
    const g = group.current;
    const dt = Math.min(delta, 1 / 20);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.42 + s.px * 0.14 - e * 0.16, 3.5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.16 + s.py * 0.06 + e * 0.3, 3.5, dt);

    built.forEach((b, i) => {
      const node = meshes.current[i];
      if (!node) return;
      const a = ASSEMBLY[b.part.id];
      const t = easeOutCubic(clamp01((s.intro - a.window[0]) / (a.window[1] - a.window[0])));
      const x = EXPLODE[b.part.id];
      node.position.set(
        b.base.x + a.from[0] * (1 - t) + x[0] * e,
        b.base.y + a.from[1] * (1 - t) + x[1] * e,
        b.base.z + a.from[2] * (1 - t) + x[2] * e,
      );
      node.rotation.set(a.rot[0] * (1 - t), a.rot[1] * (1 - t), a.rot[2] * (1 - t));
      node.visible = s.intro > a.window[0] - 0.001;
      const label = labelEls.current?.[i];
      if (label) {
        const o = clamp01((e - 0.45) / 0.4);
        label.style.opacity = String(o);
        if (o > 0) {
          node.updateWorldMatrix(true, false);
          anchor.set(...LABEL_OFFSET[b.part.id]);
          node.localToWorld(anchor).project(camera);
          const x = (anchor.x * 0.5 + 0.5) * size.width;
          const y = (-anchor.y * 0.5 + 0.5) * size.height;
          label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
        }
      }
    });
    edgeMaterials.current.forEach((m) => (m.opacity = 0.32 + e * 0.55));
  });

  return (
    <group ref={group}>
      {built.map((b, i) => (
        <group key={b.part.id} ref={(el) => void (meshes.current[i] = el)}>
          <mesh geometry={b.geometry} material={b.part.tone === "accent" ? materials.amber : materials.concrete} castShadow />
          <lineSegments geometry={b.edges}>
            <lineBasicMaterial
              ref={(m) => void (m && (edgeMaterials.current[i] = m))}
              color="#1f2a33"
              transparent
              opacity={0.32}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

export default function TRCMonolithScene({
  state,
  fallback,
  className,
  labels = true,
  onReady,
}: {
  state: RefObject<MonolithState>;
  fallback: ReactNode;
  className?: string;
  labels?: boolean;
  onReady?: () => void;
}) {
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const overlay = labels
    ? MARK_PARTS.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => void (labelEls.current[i] = el)}
          className="lettering absolute left-0 top-0 whitespace-nowrap border-l-2 border-amber bg-slate-deep/85 px-2 py-1 text-white"
          style={{ opacity: 0 }}
        >
          {p.role}
        </div>
      ))
    : null;
  return (
    <SceneCanvas
      fallback={fallback}
      className={className}
      overlay={overlay}
      camera={{ fov: 26, position: [0, 6, 290], near: 10, far: 900 }}
    >
      <hemisphereLight args={["#ffffff", "#2a3742", 0.55]} />
      <directionalLight position={[-90, 120, 160]} intensity={2.8} />
      <directionalLight position={[140, 30, 90]} intensity={0.7} color="#f3efe7" />
      <directionalLight position={[60, -40, -120]} intensity={0.35} color="#e8a317" />
      <MonolithModel state={state} labelEls={labelEls} onReady={onReady} />
      <ContactShadows position={[0, -MARK_HEIGHT / 2 - 16, 0]} scale={[220, 140]} opacity={0.55} blur={2.6} far={70} resolution={256} color="#000000" />
    </SceneCanvas>
  );
}
