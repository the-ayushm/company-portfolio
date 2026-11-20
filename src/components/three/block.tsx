"use client";
/* eslint-disable react-hooks/immutability, react-hooks/refs -- R3F: materials and text meshes are updated every frame inside useFrame by design */

import { RoundedBox, Text } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { clay, type ClayName } from "@/components/ui/iso-block";

export const TITLE_FONT = "/fonts/Poppins-Medium.ttf";
export const MONO_FONT = "/fonts/JetBrainsMono-Medium.ttf";
const PINE = "#0E2B24";

export type BlockDetail = "lines" | "card" | "bars" | "none";

export type BlockSpec = {
  id: string;
  title: string;
  label: string;
  color: ClayName;
  /** Centre of the footprint on the floor (x = right, z = toward camera). */
  x: number;
  z: number;
  /** Footprint (w along x, d along z) and extrusion height. */
  w: number;
  d?: number;
  h: number;
  detail?: BlockDetail;
  lines?: number;
  core?: boolean;
  /** Service slug a click on this block selects. */
  service?: string;
};

/** Mutable per-block state the scene writes every frame; the block applies it to its materials. */
export type BlockApi = {
  fade: number;
  dim: number;
  emissive: number;
  bars: number[];
};

export const newBlockApi = (bars = 0): BlockApi => ({ fade: 1, dim: 1, emissive: 0.08, bars: Array.from({ length: bars }, () => 0) });

/**
 * Soft clay / keycap material. A shader hook blends the top-face colour into a darker side colour
 * by the surface normal, so one rounded mesh reads as a lighter top on darker sides.
 */
export function createClayMaterial(top: string, side: string) {
  const m = new THREE.MeshPhysicalMaterial({ color: top, roughness: 0.42, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.4 });
  const uniforms = { uSide: { value: new THREE.Color(side) }, uDim: { value: 1 } };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vUpN;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvUpN = normal.y;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uSide;\nuniform float uDim;\nvarying float vUpN;")
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        "vec4 diffuseColor = vec4( mix( uSide, diffuse, smoothstep( 0.5, 0.95, vUpN ) ) * uDim, opacity );",
      );
  };
  m.userData.uniforms = uniforms;
  return m;
}

export const clayUniforms = (m: THREE.MeshPhysicalMaterial) =>
  m.userData.uniforms as { uSide: { value: THREE.Color }; uDim: { value: number } };

type TextMesh = THREE.Mesh & { fillOpacity: number };

export function Block({
  spec,
  api,
  onPointerOver,
  onPointerOut,
  onClick,
  children,
}: {
  spec: BlockSpec;
  api: BlockApi;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  children?: ReactNode;
}) {
  const { w, h } = spec;
  const d = spec.d ?? w;
  const c = clay[spec.color];
  const body = useMemo(() => {
    const m = createClayMaterial(c.top, c.side);
    if (spec.core) m.emissive.set("#C6F432");
    return m;
  }, [c.top, c.side, spec.core]);
  const detailMats = useMemo(
    () => ({
      line: new THREE.MeshStandardMaterial({ color: PINE, transparent: true, opacity: 0.18, roughness: 0.8 }),
      card: new THREE.MeshStandardMaterial({ color: c.side, roughness: 0.6 }),
      bar: new THREE.MeshPhysicalMaterial({ color: PINE, roughness: 0.4, clearcoat: 0.4 }),
    }),
    [c.side],
  );
  const texts = useRef<{ mesh: TextMesh; base: number }[]>([]);
  const bars = useRef<(THREE.Group | null)[]>([]);
  const [titleWidth, setTitleWidth] = useState(0);

  useFrame(() => {
    const f = api.fade;
    const u = clayUniforms(body);
    u.uDim.value += (api.dim - u.uDim.value) * 0.15;
    if (spec.core) body.emissiveIntensity = api.emissive;
    detailMats.line.opacity = 0.18 * f;
    for (const t of texts.current) t.mesh.fillOpacity = t.base * f;
    bars.current.forEach((b, i) => {
      if (b) b.scale.z = Math.max(0.0001, api.bars[i] ?? 0);
    });
  });

  const registerText = (base: number) => (m: TextMesh | null) => {
    if (m && !texts.current.some((t) => t.mesh === m)) texts.current.push({ mesh: m, base });
  };

  // Face coordinates: x runs along the reading direction (world -z), y points "up" the text (world -x).
  const fx0 = -d / 2 + 0.2;
  const fy0 = w / 2 - 0.2;
  const lineCount = spec.detail === "lines" ? (spec.lines ?? 3) : 0;

  return (
    <group onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
      {/* Radius must stay under half the height or the slab balloons into a pillow. */}
      <RoundedBox args={[w, h, d]} radius={Math.min(0.18, h * 0.42)} smoothness={6} position={[0, h / 2, 0]} material={body} castShadow receiveShadow />
      <group position={[0, h + 0.004, 0]} rotation={[0, Math.PI / 2, 0]}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            ref={registerText(0.7)}
            font={MONO_FONT}
            fontSize={spec.core ? 0.12 : 0.1}
            letterSpacing={0.08}
            color={PINE}
            anchorX="left"
            anchorY="top"
            position={[fx0, fy0, 0.002]}
            fillOpacity={0.7}
          >
            {spec.label}
          </Text>
          <Text
            ref={registerText(1)}
            font={TITLE_FONT}
            fontSize={spec.core ? 0.3 : Math.min(0.28, d * 0.15)}
            letterSpacing={-0.03}
            color={PINE}
            anchorX="left"
            anchorY="bottom"
            position={[fx0, -w / 2 + 0.2, 0.002]}
            onSync={spec.core ? (t: { textRenderInfo?: { blockBounds: number[] } }) => {
              const b = t.textRenderInfo?.blockBounds;
              if (b) setTitleWidth(b[2]! - b[0]!);
            } : undefined}
          >
            {spec.title}
          </Text>

          {Array.from({ length: lineCount }, (_, i) => {
            const len = (d - 0.4) * (0.82 - i * 0.18);
            return (
              <RoundedBox key={i} args={[len, 0.075, 0.012]} radius={0.005} smoothness={2} position={[fx0 + len / 2, fy0 - 0.42 - i * 0.16, 0.006]} material={detailMats.line} />
            );
          })}

          {spec.detail === "card" && (
            <RoundedBox args={[d * 0.4, w * 0.18, 0.03]} radius={0.012} smoothness={3} position={[fx0 + d * 0.2 + 0.1, fy0 - 0.55, 0.015]} material={detailMats.card} castShadow />
          )}

          {spec.detail === "bars" &&
            api.bars.map((_, i) => (
              <group key={i} ref={(g) => void (bars.current[i] = g)} position={[fx0 + 0.14 + i * 0.27, fy0 - 0.72, 0]}>
                <mesh position={[0, 0, 0.5]} material={detailMats.bar} castShadow>
                  <boxGeometry args={[0.18, 0.18, 1]} />
                </mesh>
              </group>
            ))}

          {spec.core && titleWidth > 0 && (
            // Check mark after the title
            <group position={[fx0 + titleWidth + 0.2, -w / 2 + 0.33, 0.02]}>
              <mesh position={[-0.05, -0.01, 0]} rotation={[0, 0, -0.67]} material={detailMats.bar}>
                <boxGeometry args={[0.14, 0.045, 0.02]} />
              </mesh>
              <mesh position={[0.075, 0.04, 0]} rotation={[0, 0, 0.84]} material={detailMats.bar}>
                <boxGeometry args={[0.25, 0.045, 0.02]} />
              </mesh>
            </group>
          )}
        </group>
      </group>
      {children}
    </group>
  );
}
