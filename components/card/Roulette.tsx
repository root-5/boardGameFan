"use client";

/**
 * 3D ルーレットカード
 *
 * プレイヤー設定の色・名前で扇形を分割し、タップで回転します。
 * 停止後に中央ハブの色と上部ラベルで当選プレイヤーを表示します。
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, useCallback } from "react";
import { Group } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { Player } from "@/utils/types";

/** スピン開始時の角速度 */
const INITIAL_ANGULAR_VELOCITY = (Math.PI * 2 * 50) / 100;

function RouletteModel({ players }: { players: Player[] }) {
  return (
    <group>
      {players.map((player, i) => {
        const rad =
          (Math.PI * 2 * i) / players.length +
          Math.PI * (1 + 2 / players.length);
        return (
          <mesh key={`${player.name}-${i}`} position={[0, 0, 0]}>
            <cylinderGeometry
              args={[
                10,
                10,
                2,
                24,
                1,
                false,
                -rad,
                (Math.PI * 2) / players.length,
              ]}
            />
            <meshStandardMaterial
              color={player.color}
              roughness={0.1}
              metalness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function RouletteGroup({
  players,
  rouletteNum,
  setRouletteNum,
}: {
  players: Player[];
  rouletteNum: number;
  setRouletteNum: (num: number) => void;
}) {
  const groupRef = useRef<Group>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const isSpinningRef = useRef(false);
  const isSpinningLastRef = useRef(true);
  const angularVelocityRef = useRef(INITIAL_ANGULAR_VELOCITY);
  const rotationYRef = useRef(Math.PI);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    if (isSpinningRef.current && !isSpinningLastRef.current) {
      if (angularVelocityRef.current !== 0) {
        const prev = angularVelocityRef.current;
        if (prev > 0) {
          // 徐々に減速して自然に止まる
          angularVelocityRef.current =
            prev - prev * 0.015 - (Math.PI * 2 * 0.001) / 100;
        } else {
          angularVelocityRef.current = 0;
        }
        rotationYRef.current += angularVelocityRef.current;
        group.rotation.y = rotationYRef.current;
      } else {
        setIsSpinning(false);
        isSpinningRef.current = false;
        isSpinningLastRef.current = true;
      }
    } else if (!isSpinningRef.current && isSpinningLastRef.current) {
      angularVelocityRef.current = INITIAL_ANGULAR_VELOCITY;
      setRouletteNum(
        Math.round(
          (((rotationYRef.current + Math.PI) % (Math.PI * 2)) / (Math.PI * 2)) *
            (players.length - 1)
        )
      );
      isSpinningLastRef.current = false;
    }
  });

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!isSpinningRef.current && !isSpinningLastRef.current) {
      rotationYRef.current = Math.random() * Math.PI * 2;
      if (groupRef.current) {
        groupRef.current.rotation.y = rotationYRef.current;
      }
      setIsSpinning(true);
      isSpinningRef.current = true;
      isSpinningLastRef.current = false;
    }
  }, []);

  const hubColor = isSpinning ? 0xffffff : players[rouletteNum]?.color;

  return (
    <group
      ref={groupRef}
      rotation={[0, rotationYRef.current, 0]}
      onPointerDown={handlePointerDown}
    >
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[5, 5, 0.5, 24]} />
        <meshStandardMaterial
          color={hubColor}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, 3.25, 0]}>
        <cylinderGeometry args={[2.5, 4.5, 3.5, 8]} />
        <meshStandardMaterial color={0xffffff} roughness={0.4} metalness={0.1} />
      </mesh>

      <RouletteModel players={players} />
    </group>
  );
}

export default function Roulette({
  zoomRatio = 1,
  players = [],
  isActive = true,
}: {
  zoomRatio?: number;
  players?: Player[];
  isActive?: boolean;
}) {
  const [rouletteNum, setRouletteNum] = useState(0);
  const safeIndex = Math.min(rouletteNum, Math.max(players.length - 1, 0));

  return (
    <>
      <div className="absolute z-10 block top-3 right-1/2 translate-x-1/2 px-2 w-2/3 text-center text-2xl bg-opacity-80">
        {players[safeIndex]?.name ?? ""}
      </div>
      {isActive && players.length > 0 ? (
        <Canvas
          className="h-full w-full"
          camera={{ fov: 80, position: [10, 3, 0] }}
          style={{ background: "transparent", zoom: 1 / zoomRatio }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "low-power" }}
        >
          <RouletteGroup
            players={players}
            rouletteNum={safeIndex}
            setRouletteNum={setRouletteNum}
          />
          <OrbitControls
            minDistance={16}
            maxDistance={25}
            minPolarAngle={0}
            maxPolarAngle={(0.6 * Math.PI) / 2}
            minAzimuthAngle={0}
            maxAzimuthAngle={0}
            enableRotate={false}
            enableZoom={false}
            enablePan={false}
          />
          <ambientLight intensity={0.8} />
          <directionalLight intensity={2.5} position={[20, 50, -25]} />
          <directionalLight intensity={1.5} position={[20, 20, 55]} />
        </Canvas>
      ) : (
        <div className="h-full w-full" aria-hidden />
      )}
    </>
  );
}
