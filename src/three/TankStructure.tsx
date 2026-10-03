"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";

/**
 * Sump → staging → rising main → overhead tank, assembled by scroll.
 * Purpose: explain the sump/OHT work (current capability) as a technical model.
 * GSAP drives `state.progress` (0 → 5, one unit per step) and `state.orbit`.
 * Budget: ~30 boxes sharing 3 materials, 1 tube, line overlays; no shadows, no textures.
 */
export interface TankState {
  /** 0 excavate · 1 sump · 2 staging · 3 rising main · 4 tank · 5 complete */
  progress: number;
  /** small camera orbit, -1 → 1 */
  orbit: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

const C = { concrete: "#d9d5cc", edge: "#1f2a33", amber: "#e8a317", water: "#9fb8c4", grid: "#ffffff" };

function Box({
  size,
  position,
  material,
  edges = true,
  rotation,
}: {
  size: [number, number, number];
  position: [number, number, number];
  material: THREE.Material;
  edges?: boolean;
  rotation?: [number, number, number];
}) {
  const [w, h, d] = size;
  const geo = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);
  const edgeGeo = useMemo(() => (edges ? new THREE.EdgesGeometry(geo) : null), [geo, edges]);
  useEffect(
    () => () => {
      geo.dispose();
      edgeGeo?.dispose();
    },
    [geo, edgeGeo],
  );
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} material={material} />
      {edgeGeo && (
        <lineSegments geometry={edgeGeo}>
          <lineBasicMaterial color={C.edge} transparent opacity={0.55} />
        </lineSegments>
      )}
    </group>
  );
}

/** A group that grows upward from its base as `t` goes 0 → 1. */
function Rise({ t, children, base = 0 }: { t: () => number; children: ReactNode; base?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const v = Math.max(0.0001, ease(t()));
    ref.current.scale.y = v;
    ref.current.visible = v > 0.002;
  });
  return (
    <group position={[0, base, 0]}>
      <group ref={ref}>{children}</group>
    </group>
  );
}

function GroundGrid() {
  const geo = useMemo(() => {
    const pts: number[] = [];
    const W = 30;
    const D = 20;
    for (let x = -W; x <= W; x += 4) pts.push(x, 0, -D, x, 0, D);
    for (let z = -D; z <= D; z += 4) pts.push(-W, 0, z, W, 0, z);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={C.grid} transparent opacity={0.12} />
    </lineSegments>
  );
}

function Excavation({ t }: { t: () => number }) {
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => {
    const box = new THREE.BoxGeometry(18, 9.5, 18);
    box.translate(-17, -4.75, 0);
    const e = new THREE.EdgesGeometry(box);
    box.dispose();
    return e;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame(() => {
    const m = ref.current?.material as THREE.LineBasicMaterial | undefined;
    if (m) m.opacity = 0.6 * ease(t());
  });
  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color={C.amber} transparent opacity={0} />
    </lineSegments>
  );
}

function RisingMain({ t, material }: { t: () => number; material: THREE.Material }) {
  const geo = useMemo(() => {
    const path = new THREE.CurvePath<THREE.Vector3>();
    const p = [
      new THREE.Vector3(-12, -6, 4),
      new THREE.Vector3(-12, 0.6, 4),
      new THREE.Vector3(9, 0.6, 4),
      new THREE.Vector3(9, 27.5, 4),
      new THREE.Vector3(12, 27.5, 4),
    ];
    for (let i = 0; i < p.length - 1; i++) path.add(new THREE.LineCurve3(p[i], p[i + 1]));
    return new THREE.TubeGeometry(path, 160, 0.42, 8, false);
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame(() => {
    const total = geo.index ? geo.index.count : 0;
    geo.setDrawRange(0, Math.floor(total * ease(t())));
  });
  return <mesh geometry={geo} material={material} />;
}

function Model({ state }: { state: RefObject<TankState> }) {
  const mats = useMemo(
    () => ({
      concrete: new THREE.MeshStandardMaterial({ color: C.concrete, roughness: 0.9 }),
      amber: new THREE.MeshStandardMaterial({ color: C.amber, roughness: 0.45, emissive: C.amber, emissiveIntensity: 0.15 }),
      water: new THREE.MeshStandardMaterial({ color: C.water, roughness: 0.2, transparent: true, opacity: 0.55 }),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  const step = (i: number) => () => (state.current?.progress ?? 0) - i;

  // sump: open-top box below grade, walls 0.8 thick
  const sump = (
    <group position={[-17, 0, 0]}>
      <Box size={[16, 0.8, 16]} position={[0, 0.4, 0]} material={mats.concrete} />
      <Box size={[16, 8.4, 0.8]} position={[0, 4.6, -7.6]} material={mats.concrete} />
      <Box size={[0.8, 8.4, 14.4]} position={[-7.6, 4.6, 0]} material={mats.concrete} />
      <Box size={[0.8, 8.4, 14.4]} position={[7.6, 4.6, 0]} material={mats.concrete} />
      {/* front wall cut away to show the inside, drawn as a low curb */}
      <Box size={[16, 1.4, 0.8]} position={[0, 1.5, 7.6]} material={mats.concrete} />
    </group>
  );

  const cols: [number, number][] = [
    [3, -6],
    [17, -6],
    [3, 6],
    [17, 6],
  ];

  return (
    <group position={[2, -6, 0]}>
      <GroundGrid />
      <Excavation t={step(0)} />

      <Rise t={step(1)} base={-9}>
        {sump}
      </Rise>
      <Rise t={() => (state.current?.progress ?? 0) - 1.6} base={-8.2}>
        <Box size={[14.2, 4, 14.2]} position={[-17, 2, 0]} material={mats.water} edges={false} />
      </Rise>

      <Rise t={step(2)} base={0}>
        {cols.map(([x, z]) => (
          <Box key={`${x}${z}`} size={[1, 24, 1]} position={[x, 12, z]} material={mats.concrete} />
        ))}
        {[8, 16].map((y) => (
          <group key={y}>
            <Box size={[14, 0.7, 0.7]} position={[10, y, -6]} material={mats.concrete} />
            <Box size={[14, 0.7, 0.7]} position={[10, y, 6]} material={mats.concrete} />
            <Box size={[0.7, 0.7, 12]} position={[3, y, 0]} material={mats.concrete} />
            <Box size={[0.7, 0.7, 12]} position={[17, y, 0]} material={mats.concrete} />
          </group>
        ))}
      </Rise>

      <RisingMain t={step(3)} material={mats.amber} />

      <Rise t={step(4)} base={24}>
        <Box size={[17, 1, 15]} position={[10, 0.5, 0]} material={mats.concrete} />
        <Box size={[16, 7, 14]} position={[10, 4.5, 0]} material={mats.concrete} />
        <Box size={[17, 0.8, 15]} position={[10, 8.4, 0]} material={mats.concrete} />
      </Rise>
    </group>
  );
}

function Rig({ state }: { state: RefObject<TankState> }) {
  const look = useRef(new THREE.Vector3(-11, -7, 0));
  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    const o = state.current?.orbit ?? 0;
    // the camera starts close on the sump and pulls back as the tower rises
    const p = ease(clamp01((state.current?.progress ?? 0) / 4.6));
    const lerp = THREE.MathUtils.lerp;
    const l = look.current;
    l.set(THREE.MathUtils.damp(l.x, lerp(-11, -1, p), 3, dt), THREE.MathUtils.damp(l.y, lerp(-7, 4, p), 3, dt), 0);
    const angle = 0.72 + o * 0.35;
    const r = lerp(58, 86, p);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, l.x + Math.sin(angle) * r, 3, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, Math.cos(angle) * r, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, l.y + lerp(20, 28, p), 3, dt);
    camera.lookAt(l);
  });
  return null;
}

export default function TankStructureScene({
  state,
  fallback,
  className,
}: {
  state: RefObject<TankState>;
  fallback: ReactNode;
  className?: string;
}) {
  return (
    <SceneCanvas fallback={fallback} className={className} camera={{ fov: 30, position: [60, 34, 70], near: 1, far: 500 }}>
      <hemisphereLight args={["#ffffff", "#1f2a33", 0.7]} />
      <directionalLight position={[40, 80, 50]} intensity={2.2} />
      <directionalLight position={[-60, 20, -40]} intensity={0.5} color="#e8a317" />
      <Model state={state} />
      <Rig state={state} />
    </SceneCanvas>
  );
}
