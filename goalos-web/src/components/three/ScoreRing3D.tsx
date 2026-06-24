"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import { DoubleSide } from "three";

function ScoreRing({ score, size }: { score: number; size: "sm" | "lg" }) {
  const groupRef = useRef<Group>(null);
  const progress = Math.min(100, Math.max(0, score)) / 100;
  const theta = progress * Math.PI * 2;
  const scale = size === "lg" ? 1 : 0.72;

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.35;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.1, 24, 80]} />
        <meshStandardMaterial color="#1c2030" metalness={0.85} roughness={0.25} />
      </mesh>

      {progress > 0.01 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.88, 1.12, 64, 1, 0, theta]} />
          <meshStandardMaterial
            color="#2be7a8"
            emissive="#2be7a8"
            emissiveIntensity={0.55}
            metalness={0.4}
            roughness={0.2}
            side={DoubleSide}
          />
        </mesh>
      )}

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#68a7ff"
          emissive="#68a7ff"
          emissiveIntensity={0.2}
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      <Html center style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center select-none">
          <span
            className={`font-bold tabular-nums text-[#2be7a8] ${size === "lg" ? "text-4xl" : "text-2xl"}`}
          >
            {score}
          </span>
          {size === "lg" && <span className="text-xs text-zinc-500">/ 100</span>}
        </div>
      </Html>
    </group>
  );
}

export function ScoreRing3D({
  score,
  size = "lg",
  className = "",
}: {
  score: number;
  size?: "sm" | "lg";
  className?: string;
}) {
  const dim = size === "lg" ? 160 : 120;

  return (
    <div className={className} style={{ width: dim, height: dim }} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[3, 3, 4]} intensity={1} color="#2be7a8" />
        <pointLight position={[-3, -2, 3]} intensity={0.6} color="#68a7ff" />
        <ScoreRing score={score} size={size} />
      </Canvas>
    </div>
  );
}
