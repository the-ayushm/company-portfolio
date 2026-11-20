"use client";
/* eslint-disable react-hooks/immutability -- R3F: three.js objects are mutated every frame inside useFrame by design */

import { RoundedBox, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { BlockCanvas } from "@/components/three/block-canvas";
import { clayUniforms, createClayMaterial, MONO_FONT, TITLE_FONT } from "@/components/three/block";
import { clay, type ClayName } from "@/components/ui/iso-block";

export type ServiceBlockLook = { color: ClayName; title: string; label: string; index: number };

type TextMesh = THREE.Mesh & { fillOpacity: number };

const W = 2.7;
const H = 0.9;
const PINE = "#0E2B24";

/** One large block that hops, turns a quarter and re-colours itself when the selected service changes. */
function MorphBlock({ look, reduced }: { look: ServiceBlockLook; reduced: boolean }) {
  const { camera } = useThree();
  const mat = useMemo(() => createClayMaterial(clay[look.color].top, clay[look.color].side), []); // eslint-disable-line react-hooks/exhaustive-deps -- colour is tweened below
  const lineMat = useMemo(() => new THREE.MeshStandardMaterial({ color: PINE, transparent: true, opacity: 0.18 }), []);
  const body = useRef<THREE.Group>(null);
  const face = useRef<THREE.Group>(null);
  const titleRef = useRef<TextMesh>(null);
  const labelRef = useRef<TextMesh>(null);
  const motion = useRef({ turn: 0, hop: 0, fade: 1 });
  const [label, setShown] = useState(look);
  const shown = reduced ? look : label;
  const first = useRef(true);
  const target = useMemo(() => ({ top: new THREE.Color(), side: new THREE.Color() }), []);

  useEffect(() => {
    target.top.set(clay[look.color].top);
    target.side.set(clay[look.color].side);
    if (first.current) {
      first.current = false;
      return;
    }
    const m = motion.current;
    if (reduced) return;
    const tl = gsap.timeline();
    tl.to(m, { fade: 0, duration: 0.18, ease: "power1.out", onComplete: () => setShown(look) });
    tl.to(m, { turn: m.turn + Math.PI / 2, duration: 0.8, ease: "back.out(1.5)" }, 0);
    tl.to(m, { hop: 0.45, duration: 0.25, ease: "power2.out" }, 0);
    tl.to(m, { hop: 0, duration: 0.55, ease: "back.out(2.2)" }, 0.25);
    tl.to(m, { fade: 1, duration: 0.35, ease: "power1.out" }, 0.45);
    return () => void tl.kill();
  }, [look, reduced, target]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.set(9, 11, 9).normalize().multiplyScalar(13);
    camera.lookAt(0, 0.35, 0);
    const k = reduced ? 1 : 0.09;
    mat.color.lerp(target.top, k);
    clayUniforms(mat).uSide.value.lerp(target.side, k);
    const m = motion.current;
    const float = reduced ? 0 : Math.sin(t * 0.8) * 0.05;
    if (body.current) {
      body.current.rotation.y = m.turn;
      body.current.position.y = m.hop + float;
    }
    if (face.current) face.current.position.y = H + 0.004 + m.hop + float;
    if (titleRef.current) titleRef.current.fillOpacity = m.fade;
    if (labelRef.current) labelRef.current.fillOpacity = m.fade * 0.7;
    lineMat.opacity = 0.18 * m.fade;
  });

  const fx0 = -W / 2 + 0.26;
  return (
    <group>
      <group ref={body}>
        <RoundedBox args={[W, H, W]} radius={0.2} smoothness={6} position={[0, H / 2, 0]} material={mat} castShadow receiveShadow />
      </group>
      <group ref={face} rotation={[0, Math.PI / 2, 0]}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Text ref={labelRef} font={MONO_FONT} fontSize={0.12} letterSpacing={0.08} color={PINE} anchorX="left" anchorY="top" position={[fx0, W / 2 - 0.26, 0.002]}>
            {shown.label}
          </Text>
          {[0, 1, 2].map((i) => {
            const len = (W - 0.6) * (0.8 - i * 0.2);
            return <RoundedBox key={i} args={[len, 0.08, 0.012]} radius={0.005} smoothness={2} position={[fx0 + len / 2, W / 2 - 0.75 - i * 0.18, 0.006]} material={lineMat} />;
          })}
          <Text ref={titleRef} font={TITLE_FONT} fontSize={0.42} letterSpacing={-0.03} color={PINE} anchorX="left" anchorY="bottom" position={[fx0, -W / 2 + 0.26, 0.002]}>
            {shown.title}
          </Text>
        </group>
      </group>
    </group>
  );
}

export default function ServiceBlockScene({ look, active, reduced }: { look: ServiceBlockLook; active: boolean; reduced: boolean }) {
  return (
    <BlockCanvas active={active}>
      <MorphBlock look={look} reduced={reduced} />
    </BlockCanvas>
  );
}
