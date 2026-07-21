"use client";

/**
 * 3D コインカード
 *
 * タップでフリップ開始・停止。停止時に表裏どちらかへスナップします。
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useMemo, useRef, useCallback } from "react";
import { Group } from "three";
import type { ThreeEvent } from "@react-three/fiber";

const MODEL_PATH = "Coin.glb";

function CoinModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clonedScene}
      position={[0, 0, 0]}
      scale={[10, 10, 10]}
    />
  );
}

function CoinGroup() {
  const groupRef = useRef<Group>(null);
  const isFlippingRef = useRef(false);
  const isFlippingLastRef = useRef(false);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    if (isFlippingRef.current === isFlippingLastRef.current) {
      if (isFlippingRef.current) {
        group.rotation.x += (Math.PI * 15) / 100;
      }
    } else {
      // 表裏のどちらか（π の奇数倍 / 偶数倍）へスナップ
      group.rotation.x = (Math.floor(Math.random() * 2) + 1) * Math.PI;
      isFlippingLastRef.current = isFlippingRef.current;
    }
  });

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isFlippingRef.current = !isFlippingRef.current;
  }, []);

  return (
    <group
      ref={groupRef}
      rotation={[Math.PI, Math.PI, Math.PI]}
      onPointerDown={handlePointerDown}
    >
      <CoinModel />
    </group>
  );
}

export default function Coin({
  zoomRatio = 1,
  isActive = true,
}: {
  zoomRatio?: number;
  isActive?: boolean;
}) {
  return (
    <>
      {isActive ? (
        <Canvas
          className="h-full w-full"
          camera={{ fov: 70, position: [0, 0, 50] }}
          style={{ zoom: 1 / zoomRatio }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "low-power" }}
        >
          <CoinGroup />
          <OrbitControls
            minDistance={120}
            maxDistance={153}
            minPolarAngle={0}
            maxPolarAngle={0}
            minAzimuthAngle={0}
            maxAzimuthAngle={0}
            enableRotate={false}
            enableZoom={false}
            enablePan={false}
          />
          <directionalLight intensity={5} position={[10, 25, 80]} />
          <ambientLight intensity={0.2} />
        </Canvas>
      ) : (
        <div className="h-full w-full" aria-hidden />
      )}
    </>
  );
}
