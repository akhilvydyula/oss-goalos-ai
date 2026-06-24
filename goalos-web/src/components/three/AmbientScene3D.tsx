"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";

function FloatingOrb({
  position,
  color,
  scale,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed?: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.12 * speed;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18 * speed;
  });

  return (
    <Float speed={1.2 * speed} rotationIntensity={0.35} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.28}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[8, 6, 6]} intensity={0.9} color="#2be7a8" />
      <pointLight position={[-6, -4, 4]} intensity={0.6} color="#68a7ff" />
      <FloatingOrb position={[-3.5, 1.5, -2]} color="#2be7a8" scale={0.75} />
      <FloatingOrb position={[3.8, -1, -3]} color="#68a7ff" scale={1} speed={0.85} />
      <FloatingOrb position={[0.5, 2.8, -4]} color="#2be7a8" scale={0.45} speed={1.2} />
      <FloatingOrb position={[-2, -2.5, -2.5]} color="#68a7ff" scale={0.55} speed={0.7} />
    </>
  );
}

export function AmbientScene3D({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
