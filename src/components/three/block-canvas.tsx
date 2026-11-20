"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Suspense, useRef, useState, type ReactNode } from "react";

/** Calls `onReady` once real frames are being drawn (used to crossfade from the static poster). */
function FirstFrame({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) onReady?.();
  });
  return null;
}

/** Standard lights for the clay blocks: soft ambient, a shadow-casting key and a cool pine rim. */
export function BlockLights() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[-6, 12, 6]}
        intensity={3.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={5}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={40}
      />
      <directionalLight position={[7, 4, -9]} intensity={1.1} color="#9FE3C8" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={1.6} color="#ffffff" position={[-4, 6, 4]} scale={[8, 4, 1]} />
        <Lightformer intensity={0.8} color="#9FE3C8" position={[6, 3, -6]} scale={[10, 2, 1]} />
        <Lightformer intensity={0.6} color="#C6F432" position={[0, -4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 12, 1]} />
      </Environment>
    </>
  );
}

/** Invisible floor that only shows the blocks' shadows on the pine panel behind the canvas. */
export function ShadowCatcher({ opacity = 0.35 }: { opacity?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <shadowMaterial transparent opacity={opacity} />
    </mesh>
  );
}

/**
 * Lightweight transparent canvas for block scenes: near-isometric low-FOV camera, standard lights,
 * shadow catcher, adaptive resolution. Stops rendering entirely while `active` is false.
 */
export function BlockCanvas({
  active,
  lowPower = false,
  onReady,
  className,
  children,
}: {
  active: boolean;
  lowPower?: boolean;
  onReady?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const max = lowPower ? 1.5 : 2;
  const [dpr, setDpr] = useState(max);
  return (
    <Canvas
      className={className}
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      shadows="percentage"
      flat
      camera={{ position: [9, 11, 9], fov: 25, near: 0.5, far: 120 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(max)} flipflops={3} onFallback={() => setDpr(1)} />
      <AdaptiveDpr pixelated={false} />
      <BlockLights />
      <ShadowCatcher />
      <Suspense fallback={null}>
        {children}
        <FirstFrame onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
