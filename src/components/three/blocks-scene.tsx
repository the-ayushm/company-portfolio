"use client";
/* eslint-disable react-hooks/immutability -- R3F: three.js objects and animation state are mutated every frame inside useFrame by design */

import { Html, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { Block, newBlockApi, type BlockApi, type BlockSpec } from "@/components/three/block";
import { BlockCanvas } from "@/components/three/block-canvas";

type Line2Like = THREE.Object3D & { material: { dashOffset: number; opacity: number } };

export type BlocksSceneProps = {
  blocks: BlockSpec[];
  /** Ids in the order they fly in; the core always lands last. */
  introOrder?: string[];
  /** Render loop on/off (off-screen panels stop rendering). */
  active: boolean;
  /** Start the intro assembly (after the page loader). */
  start: boolean;
  reduced: boolean;
  mobile: boolean;
  /** Panel element used for pointer tilt and scroll progress. */
  panel: RefObject<HTMLElement | null>;
  pulses?: boolean;
  interactive?: boolean;
  /** service slug → tooltip label */
  tooltips?: Record<string, string>;
  onPulse?: (blockId: string) => void;
  onSelect?: (block: BlockSpec) => void;
  onReady?: () => void;
};

export default function BlocksScene(props: BlocksSceneProps) {
  return (
    <BlockCanvas active={props.active} lowPower={props.mobile} onReady={props.onReady}>
      <Cluster {...props} />
    </BlockCanvas>
  );
}

type Anim = {
  spec: BlockSpec;
  api: BlockApi;
  off: { x: number; y: number; z: number };
  rot: { x: number; y: number; z: number };
  scale: number;
  squash: number;
  press: number;
  lift: number;
  liftV: number;
  bump: number;
  phase: number;
  group: THREE.Group | null;
};

const CORE_BARS = [0.24, 0.36, 0.5, 0.68];
const DEG = Math.PI / 180;

/** Deterministic pseudo-random so the scattered start positions are stable between renders. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Cluster({
  blocks,
  introOrder,
  start,
  reduced,
  mobile,
  panel,
  pulses = true,
  interactive = true,
  tooltips = {},
  onPulse,
  onSelect,
}: BlocksSceneProps) {
  const { camera, size } = useThree();

  // Centre the cluster on the origin.
  const layout = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const b of blocks) {
      const d = b.d ?? b.w;
      minX = Math.min(minX, b.x - b.w / 2);
      maxX = Math.max(maxX, b.x + b.w / 2);
      minZ = Math.min(minZ, b.z - d / 2);
      maxZ = Math.max(maxZ, b.z + d / 2);
    }
    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;
    return blocks.map((b) => ({ ...b, x: b.x - cx, z: b.z - cz }));
  }, [blocks]);

  const core = useMemo(() => layout.find((b) => b.core), [layout]);
  const modules = useMemo(() => layout.filter((b) => !b.core), [layout]);

  const anims = useMemo<Anim[]>(() => {
    const rand = seeded(11);
    return layout.map((spec, i) => ({
      spec,
      api: newBlockApi(spec.core ? CORE_BARS.length : 0),
      off: { x: (rand() - 0.5) * 6, y: 2 + rand() * 2, z: (rand() - 0.5) * 6 },
      rot: { x: (rand() - 0.5) * 80 * DEG, y: (rand() - 0.5) * 80 * DEG, z: (rand() - 0.5) * 80 * DEG },
      scale: 0.85,
      squash: 1,
      press: 1,
      lift: 0,
      liftV: 0,
      bump: 0,
      phase: i * 1.37,
      group: null,
    }));
  }, [layout]);

  // Camera framing: fit the cluster's projected extents to the panel.
  const fit = useMemo(() => {
    const dir = new THREE.Vector3(9, 11, 9).normalize();
    const view = dir.clone().negate();
    const right = new THREE.Vector3().crossVectors(view, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(right, view).normalize();
    let halfW = 0;
    let halfH = 0;
    const p = new THREE.Vector3();
    for (const b of layout) {
      const d = b.d ?? b.w;
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (const y of [0, b.h + (b.core ? 0.7 : 0)]) {
        p.set(b.x + (sx * b.w) / 2, y, b.z + (sz * d) / 2);
        halfW = Math.max(halfW, Math.abs(p.dot(right)));
        halfH = Math.max(halfH, Math.abs(p.dot(up)));
      }
    }
    const t = Math.tan(((camera as THREE.PerspectiveCamera).fov * DEG) / 2);
    const aspect = size.width / Math.max(1, size.height);
    const margin = mobile ? 0.86 : 0.78;
    const dist = Math.max(halfH / (t * margin), halfW / (t * aspect * margin)) + 2;
    return { dir, dist };
  }, [layout, camera, size.width, size.height, mobile]);

  // Wires from each module into the core: along z first, then x, lying on the floor.
  const wires = useMemo(() => {
    if (!core) return [];
    return modules.map((m) => {
      const pts = [new THREE.Vector3(m.x, 0.015, m.z), new THREE.Vector3(m.x, 0.015, core.z), new THREE.Vector3(core.x, 0.015, core.z)];
      const segs = [pts[0]!.distanceTo(pts[1]!), pts[1]!.distanceTo(pts[2]!)];
      return { id: m.id, pts, segs, length: segs[0]! + segs[1]! };
    });
  }, [modules, core]);

  // Long faint traces running out to the panel edges.
  const traces = useMemo(() => {
    if (!core) return [];
    return [
      [new THREE.Vector3(core.x - 0.6, 0.01, core.z), new THREE.Vector3(core.x - 0.6, 0.01, core.z - 16)],
      [new THREE.Vector3(core.x + 0.5, 0.01, core.z + 0.4), new THREE.Vector3(core.x + 16, 0.01, core.z + 0.4)],
      [new THREE.Vector3(-1, 0.01, 2.6), new THREE.Vector3(14, 0.01, 2.6)],
      [new THREE.Vector3(-1.2, 0.01, 3), new THREE.Vector3(-1.2, 0.01, 16)],
    ];
  }, [core]);

  const wireRefs = useRef<(Line2Like | null)[]>([]);
  const glowRefs = useRef<(Line2Like | null)[]>([]);
  const wireDraw = useMemo(() => wires.map((w) => ({ offset: w.length })), [wires]);
  const flash = useRef<THREE.PointLight>(null);
  const flashState = useMemo(() => ({ v: 0 }), []);
  const rig = useRef<THREE.Group>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const scrollP = useRef(0);
  const introDone = useRef(false);
  const [hovered, setHovered] = useState<string | null>(null);

  // Pulses
  const pulseMeshes = useRef<(THREE.Group | null)[]>([]);
  const pulseState = useMemo(() => [0, 1].map(() => ({ wire: -1, t: 0 })), []);
  const nextPulse = useRef(0);

  // Intro assembly
  useEffect(() => {
    const coreAnim = anims.find((a) => a.spec.core);
    const settle = () => {
      for (const a of anims) {
        a.off.x = a.off.y = a.off.z = 0;
        a.rot.x = a.rot.y = a.rot.z = 0;
        a.scale = 1;
        a.api.fade = 1;
      }
      if (coreAnim) coreAnim.api.bars = [...CORE_BARS];
      wireDraw.forEach((w) => (w.offset = 0));
      flashState.v = 0.6;
      introDone.current = true;
    };

    if (reduced) {
      settle();
      return;
    }
    // Hidden until the page loader has finished.
    for (const a of anims) a.api.fade = 0;
    if (!start) return;

    const order = [
      ...(introOrder ?? []).map((id) => anims.find((a) => a.spec.id === id)).filter((a): a is Anim => Boolean(a && !a.spec.core)),
      ...anims.filter((a) => !a.spec.core && !(introOrder ?? []).includes(a.spec.id)),
    ];
    const tl = gsap.timeline({ onComplete: () => void (introDone.current = true) });
    order.forEach((a, i) => {
      const t = i * 0.09;
      tl.to(a.off, { x: 0, y: 0, z: 0, duration: 0.9, ease: "back.out(1.6)" }, t);
      tl.to(a.rot, { x: 0, y: 0, z: 0, duration: 0.9, ease: "back.out(1.6)" }, t);
      tl.to(a, { scale: 1, duration: 0.9, ease: "back.out(1.6)" }, t);
      tl.to(a.api, { fade: 1, duration: 0.35, ease: "power1.out" }, t);
      tl.fromTo(a, { squash: 1 }, { squash: 0.94, duration: 0.08, ease: "power1.in", immediateRender: false }, t + 0.5);
      tl.to(a, { squash: 1, duration: 0.35, ease: "back.out(3)" }, t + 0.58);
    });
    const tc = order.length * 0.09 + 0.2;
    if (coreAnim) {
      coreAnim.off.x = 0;
      coreAnim.off.z = 0;
      coreAnim.off.y = 6;
      coreAnim.rot.x = coreAnim.rot.z = 0;
      coreAnim.rot.y = 20 * DEG;
      tl.to(coreAnim.off, { y: 0, duration: 0.9, ease: "back.out(2.4)" }, tc);
      tl.to(coreAnim.rot, { y: 0, duration: 0.9, ease: "back.out(2)" }, tc);
      tl.to(coreAnim, { scale: 1, duration: 0.9, ease: "back.out(2)" }, tc);
      tl.to(coreAnim.api, { fade: 1, duration: 0.3 }, tc);
      tl.fromTo(coreAnim, { squash: 1 }, { squash: 0.9, duration: 0.08, immediateRender: false }, tc + 0.42);
      tl.to(coreAnim, { squash: 1, duration: 0.45, ease: "back.out(3.4)" }, tc + 0.5);
      tl.to(flashState, { v: 3, duration: 0.15, ease: "power2.out" }, tc + 0.42);
      tl.to(flashState, { v: 0.6, duration: 0.45, ease: "power2.in" }, tc + 0.57);
      wireDraw.forEach((w, i) => tl.to(w, { offset: 0, duration: 0.6, ease: "power2.inOut" }, tc + 0.55 + i * 0.08));
      CORE_BARS.forEach((hgt, i) => tl.to(coreAnim.api.bars, { [i]: hgt, duration: 0.5, ease: "back.out(2)" }, tc + 0.9 + i * 0.1));
    }
    return () => void tl.kill();
  }, [anims, start, reduced, introOrder, wireDraw, flashState]);

  // Pointer (relative to the panel) and scroll progress of the panel.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      scrollP.current = THREE.MathUtils.clamp(-r.top / (r.height * 0.9), 0, 1);
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [panel]);

  useEffect(() => () => void (document.body.style.cursor = ""), []);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const motionOn = !reduced;
    const explode = motionOn ? scrollP.current : 0;

    // Camera
    const dist = fit.dist * (1 + explode * 0.15);
    camera.position.copy(fit.dir).multiplyScalar(dist);
    camera.lookAt(0, 0.3, 0);

    // Tilt toward the pointer
    if (rig.current) {
      const allow = motionOn && !mobile;
      const tx = allow ? pointer.current.y * 3 * DEG : 0;
      const ty = allow ? pointer.current.x * 5 * DEG : 0;
      tilt.current.x += (tx - tilt.current.x) * 0.06;
      tilt.current.y += (ty - tilt.current.y) * 0.06;
      rig.current.rotation.set(tilt.current.x, tilt.current.y, 0);
    }

    const n = anims.length;
    anims.forEach((a, i) => {
      const g = a.group;
      if (!g) return;
      // Hover lift spring
      const target = hovered === a.spec.id ? 0.25 : 0;
      if (reduced) {
        a.lift = target;
      } else {
        a.liftV += (target - a.lift) * 220 * dt;
        a.liftV *= Math.exp(-18 * dt);
        a.lift += a.liftV * dt;
      }
      a.api.dim = hovered && hovered !== a.spec.id && !mobile ? 0.85 : 1;
      a.bump *= Math.exp(-7 * dt);

      const float = motionOn ? Math.sin(t * 0.8 + a.phase) * 0.04 : 0;
      const wob = motionOn && introDone.current ? 0.6 * DEG : 0;
      const ex = explode * (0.4 + (0.8 * i) / Math.max(1, n - 1));
      g.position.set(a.spec.x + a.off.x, a.off.y + float + a.lift + a.bump * 0.06 + ex, a.spec.z + a.off.z);
      g.rotation.set(a.rot.x + Math.sin(t * 0.6 + a.phase) * wob, a.rot.y, a.rot.z + Math.cos(t * 0.5 + a.phase) * wob);
      // `fade` grows the block in from nothing (no material transparency during the intro).
      const s = a.scale * a.api.fade;
      g.visible = a.api.fade > 0.001;
      g.scale.set(s, s * a.squash * a.press, s);

      if (a.spec.core) {
        a.api.emissive = 0.08 + a.bump * 0.17;
        if (introDone.current) a.api.bars.forEach((b, j) => (a.api.bars[j] = b + (CORE_BARS[j]! - b) * Math.min(1, dt * 0.25)));
      }
    });

    // Wires drawing in
    wireDraw.forEach((w, i) => {
      const line = wireRefs.current[i];
      const glow = glowRefs.current[i];
      if (line) line.material.dashOffset = w.offset;
      if (glow) glow.material.dashOffset = w.offset;
    });

    if (flash.current) flash.current.intensity = flashState.v + (anims.find((a) => a.spec.core)?.bump ?? 0) * 1.2;

    // Data pulses travelling module → core
    if (pulses && motionOn && introDone.current && wires.length) {
      if (nextPulse.current === 0) nextPulse.current = t + 0.8;
      if (t >= nextPulse.current) {
        const slot = pulseState.find((p) => p.wire < 0);
        if (slot) {
          slot.wire = Math.floor(Math.random() * wires.length);
          slot.t = 0;
        }
        nextPulse.current = t + 1.6 + Math.random() * 1.4;
      }
    }
    pulseState.forEach((p, i) => {
      const mesh = pulseMeshes.current[i];
      if (!mesh) return;
      if (p.wire < 0) {
        mesh.visible = false;
        return;
      }
      const w = wires[p.wire]!;
      p.t += dt / 0.7;
      if (p.t >= 1) {
        const coreAnim = anims.find((a) => a.spec.core);
        if (coreAnim) {
          coreAnim.bump = 1;
          const j = Math.floor(Math.random() * CORE_BARS.length);
          coreAnim.api.bars[j] = Math.min(CORE_BARS[j]! * 1.4, (coreAnim.api.bars[j] ?? 0) + 0.07);
        }
        onPulse?.(w.id);
        p.wire = -1;
        mesh.visible = false;
        return;
      }
      const d = easeInOut(p.t) * w.length;
      const [a, b, c] = w.pts as [THREE.Vector3, THREE.Vector3, THREE.Vector3];
      if (d <= w.segs[0]!) mesh.position.lerpVectors(a, b, d / Math.max(0.0001, w.segs[0]!));
      else mesh.position.lerpVectors(b, c, (d - w.segs[0]!) / Math.max(0.0001, w.segs[1]!));
      mesh.position.y = 0.09;
      mesh.visible = true;
    });
  });

  const press = (a: Anim) => {
    gsap.killTweensOf(a, "press");
    gsap.to(a, {
      press: 0.92,
      duration: reduced ? 0 : 0.12,
      ease: "power2.out",
      onComplete: () => void gsap.to(a, { press: 1, duration: reduced ? 0 : 0.5, ease: "back.out(3)" }),
    });
    window.setTimeout(() => onSelect?.(a.spec), reduced ? 0 : 180);
  };

  return (
    <group ref={rig}>
      {core && <pointLight ref={flash} position={[core.x, core.h + 1.2, core.z]} color="#C6F432" intensity={0} distance={7} decay={1.6} />}

      {traces.map((pts, i) => (
        <Line key={`t${i}`} points={pts} color="#C6F432" lineWidth={1.2} transparent opacity={0.22} />
      ))}

      {wires.map((w, i) => (
        <group key={w.id}>
          <Line
            ref={(l) => void (glowRefs.current[i] = l as unknown as Line2Like)}
            points={w.pts}
            color="#C6F432"
            lineWidth={8}
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            dashed
            dashSize={w.length}
            gapSize={w.length}
          />
          <Line
            ref={(l) => void (wireRefs.current[i] = l as unknown as Line2Like)}
            points={w.pts}
            color="#C6F432"
            lineWidth={2.6}
            dashed
            dashSize={w.length}
            gapSize={w.length}
          />
        </group>
      ))}

      {pulseState.map((_, i) => (
        <group key={i} ref={(g) => void (pulseMeshes.current[i] = g)} visible={false}>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#E4FF7A" toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshBasicMaterial color="#C6F432" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {anims.map((a) => (
        <group key={a.spec.id} ref={(g) => void (a.group = g)}>
          <Block
            spec={a.spec}
            api={a.api}
            onPointerOver={
              interactive
                ? (e) => {
                    e.stopPropagation();
                    setHovered(a.spec.id);
                    document.body.style.cursor = "pointer";
                  }
                : undefined
            }
            onPointerOut={
              interactive
                ? () => {
                    setHovered((h) => (h === a.spec.id ? null : h));
                    document.body.style.cursor = "";
                  }
                : undefined
            }
            onClick={
              interactive
                ? (e) => {
                    e.stopPropagation();
                    press(a);
                  }
                : undefined
            }
          >
            {interactive && hovered === a.spec.id && a.spec.service && tooltips[a.spec.service] && (
              <Html position={[0, a.spec.h + 0.55, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
                <span className="block whitespace-nowrap rounded-full bg-porcelain px-3.5 py-2 text-[13px] font-medium text-pine shadow-[var(--shadow-float)]">
                  {tooltips[a.spec.service]} →
                </span>
              </Html>
            )}
          </Block>
        </group>
      ))}
    </group>
  );
}
