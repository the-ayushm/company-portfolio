"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * "System core" — an original hero visual:
 *  • a faceted iridescent core (the product),
 *  • a lattice of connected nodes (infrastructure, data, integrations),
 *  • light pulses travelling along edges (automation / data flow),
 *  • three orbiting nodes on tilted rings (three engineers, one system).
 * Reacts to the pointer and to scroll. Rendering pauses when off-screen.
 */

const ACCENT = new THREE.Color("#6d7cff");
const VIOLET = new THREE.Color("#a77bff");
const SIGNAL = new THREE.Color("#7ee8fa");

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Network = { points: THREE.Vector3[]; edges: [number, number][]; adjacency: number[][] };

function buildNetwork(count: number, radius: number): Network {
  const rand = mulberry32(7);
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const jitter = radius * (0.82 + rand() * 0.36);
    points.push(new THREE.Vector3(Math.cos(theta) * r * jitter, y * jitter * 0.92, Math.sin(theta) * r * jitter));
  }
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  const adjacency: number[][] = points.map(() => []);
  points.forEach((p, i) => {
    const nearest = points
      .map((q, j) => ({ j, d: p.distanceToSquared(q) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
      adjacency[i]!.push(j);
      adjacency[j]!.push(i);
    }
  });
  return { points, edges, adjacency };
}

const pointer = { x: 0, y: 0 };

function NetworkLattice({ lowPower }: { lowPower: boolean }) {
  const network = useMemo(() => buildNetwork(lowPower ? 48 : 84, 2.35), [lowPower]);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const pulsesRef = useRef<THREE.InstancedMesh>(null);
  const pulseCount = lowPower ? 12 : 26;

  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(network.edges.length * 6);
    const colors = new Float32Array(network.edges.length * 6);
    const c = new THREE.Color();
    network.edges.forEach(([a, b], i) => {
      const pa = network.points[a]!;
      const pb = network.points[b]!;
      positions.set([pa.x, pa.y, pa.z, pb.x, pb.y, pb.z], i * 6);
      [pa, pb].forEach((p, k) => {
        c.copy(ACCENT).lerp(VIOLET, (p.y + 2.8) / 5.6);
        colors.set([c.r, c.g, c.b], i * 6 + k * 3);
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [network]);

  // Static node instances.
  useEffect(() => {
    const mesh = nodesRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    network.points.forEach((p, i) => {
      const s = 0.6 + ((i * 13) % 7) / 7;
      m.makeScale(s, s, s).setPosition(p);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [network]);

  // Pulses travel node → neighbour → neighbour…
  const pulses = useMemo(() => {
    const rand = mulberry32(42);
    return Array.from({ length: pulseCount }, () => {
      const from = Math.floor(rand() * network.points.length);
      const nbrs = network.adjacency[from]!;
      return { from, to: nbrs[Math.floor(rand() * nbrs.length)] ?? from, t: rand(), speed: 0.35 + rand() * 0.55 };
    });
  }, [network, pulseCount]);

  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), v: new THREE.Vector3() }), []);

  useFrame((_, delta) => {
    const mesh = pulsesRef.current;
    if (!mesh) return;
    const dt = Math.min(delta, 0.05);
    pulses.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        const nbrs = network.adjacency[p.to]!;
        const next = nbrs[Math.floor(Math.random() * nbrs.length)] ?? p.from;
        p.from = p.to;
        p.to = next;
        p.t = 0;
      }
      tmp.v.lerpVectors(network.points[p.from]!, network.points[p.to]!, p.t);
      const s = Math.sin(p.t * Math.PI) * 1.1 + 0.2;
      tmp.m.makeScale(s, s, s).setPosition(tmp.v);
      mesh.setMatrixAt(i, tmp.m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.2} depthWrite={false} />
      </lineSegments>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, network.points.length]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#e8eaff" toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={pulsesRef} args={[undefined, undefined, pulseCount]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={SIGNAL} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Core() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.25;
  });
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.02, 0]} />
        <meshPhysicalMaterial
          color="#2a2f4a"
          emissive="#1c2266"
          emissiveIntensity={0.55}
          metalness={0.55}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={1}
          iridescenceIOR={1.35}
          iridescenceThicknessRange={[180, 620]}
          envMapIntensity={1.6}
          flatShading
        />
      </mesh>
      <mesh scale={1.42}>
        <icosahedronGeometry args={[1.02, 1]} />
        <meshBasicMaterial wireframe color={ACCENT} transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius, tilt, speed, color, phase }: { radius: number; tilt: [number, number, number]; speed: number; color: THREE.Color | string; phase: number }) {
  const node = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!node.current) return;
    const a = state.clock.elapsedTime * speed + phase;
    node.current.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.0045, 6, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh ref={node}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();
  const wide = size.width >= 900;
  const baseX = wide ? viewport.width * 0.26 : 0;
  const baseY = wide ? 0.1 : 1.9;
  const baseScale = wide ? 0.82 : 0.5;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.pow(0.002, delta); // frame-rate independent damping
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.45 + state.clock.elapsedTime * 0.04, k);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.y * 0.3, k);

    const progress = Math.min(1.5, window.scrollY / window.innerHeight);
    g.position.x = THREE.MathUtils.lerp(g.position.x, baseX + pointer.x * 0.15, k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, baseY + progress * 1.6 + pointer.y * 0.1, k);
    const s = baseScale * (1 - progress * 0.18);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x || s, s, k));
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 10 + progress * 1.5, k);
  });

  return <group ref={group}>{children}</group>;
}

export default function HeroScene({ active, lowPower }: { active: boolean; lowPower: boolean }) {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 10], fov: 35 }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 3]} intensity={1.4} />
      <pointLight position={[-4, -2, 2]} intensity={18} color={VIOLET} />
      <pointLight position={[3, 2, -3]} intensity={14} color={ACCENT} />

      <Rig>
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
          <Core />
          <OrbitRing radius={1.75} tilt={[0.35, 0, 0.5]} speed={0.6} color="#f5f5f7" phase={0} />
          <OrbitRing radius={2.05} tilt={[-0.6, 0.4, -0.2]} speed={0.45} color={ACCENT} phase={2.1} />
          <OrbitRing radius={2.3} tilt={[1.1, -0.3, 0.3]} speed={0.35} color={VIOLET} phase={4.2} />
        </Float>
        <NetworkLattice lowPower={lowPower} />
      </Rig>

      <Sparkles count={lowPower ? 30 : 70} scale={[12, 8, 6]} size={1.6} speed={0.25} opacity={0.5} color={SIGNAL} />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} color="#6d7cff" position={[-5, 2, -2]} scale={[10, 2, 1]} />
        <Lightformer intensity={3} color="#ffffff" position={[3, 4, 3]} scale={[4, 4, 1]} form="ring" />
        <Lightformer intensity={1.6} color="#a77bff" position={[4, -3, -1]} scale={[8, 1.5, 1]} />
        <Lightformer intensity={1} color="#7ee8fa" position={[0, -5, 2]} scale={[6, 1, 1]} />
      </Environment>
    </Canvas>
  );
}
