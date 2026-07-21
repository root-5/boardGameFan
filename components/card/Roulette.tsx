"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, useCallback, useEffect } from "react";
import { Group } from "three";

function KickFrame({ active }: { active: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => {
    invalidate();
    if (!active) return;
    let id = 0;
    const loop = () => {
      invalidate();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [active, invalidate]);
  return null;
}

type user = {
  name: string;
  color: string;
};

const initialAngularVelocity = (Math.PI * 2 * 50) / 100;

function RouletteModel(props: { users: Array<user> }) {
  const { users } = props;

  return (
    <group>
      {users.map((user, i) => {
        const rad =
          (Math.PI * 2 * i) / users.length + Math.PI * (1 + 2 / users.length);
        return (
          <mesh key={i} position={[0, 0, 0]}>
            <cylinderGeometry
              args={[
                10,
                10,
                2,
                24, // 頂点数を削減してモバイル負荷を下げる
                1,
                false,
                -rad,
                (Math.PI * 2) / users.length,
              ]}
            />
            <meshStandardMaterial
              color={user.color}
              roughness={0.1}
              metalness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function GroupComponent(props: {
  users: Array<user>;
  rouletteNum: number;
  setRouletteNum: (num: number) => void;
}) {
  const { users, rouletteNum, setRouletteNum } = props;
  const groupRef = useRef<Group>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const isSpinningRef = useRef(false);
  const isSpinningLastRef = useRef(true);
  const angularVelocityRef = useRef(initialAngularVelocity);
  const rotationYRef = useRef(1 * Math.PI);
  const { invalidate } = useThree();

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    if (isSpinningRef.current && !isSpinningLastRef.current) {
      if (angularVelocityRef.current !== 0) {
        const prev = angularVelocityRef.current;
        if (prev > 0) {
          angularVelocityRef.current =
            prev - prev * 0.015 - (Math.PI * 2 * 0.001) / 100;
        } else {
          angularVelocityRef.current = 0;
        }
        rotationYRef.current += angularVelocityRef.current;
        group.rotation.y = rotationYRef.current;
        invalidate();
      } else {
        setIsSpinning(false);
        isSpinningRef.current = false;
        isSpinningLastRef.current = true;
      }
    } else if (!isSpinningRef.current && isSpinningLastRef.current) {
      angularVelocityRef.current = initialAngularVelocity;
      setRouletteNum(
        Math.round(
          (((rotationYRef.current + Math.PI) % (Math.PI * 2)) / (Math.PI * 2)) *
            (users.length - 1)
        )
      );
      isSpinningLastRef.current = false;
    }
  });

  const handleClick = useCallback(() => {
    if (!isSpinningRef.current && !isSpinningLastRef.current) {
      rotationYRef.current = Math.random() * Math.PI * 2;
      if (groupRef.current) {
        groupRef.current.rotation.y = rotationYRef.current;
      }
      setIsSpinning(true);
      isSpinningRef.current = true;
      isSpinningLastRef.current = false;
      invalidate();
    }
  }, [invalidate]);

  return (
    <>
      <KickFrame active={isSpinning} />
      <group ref={groupRef} rotation={[0, rotationYRef.current, 0]} onClick={handleClick}>
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[5, 5, 0.5, 24]} />
          <meshStandardMaterial
            color={isSpinning ? 0xffffff : users[rouletteNum].color}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        <mesh position={[0, 3.25, 0]}>
          <cylinderGeometry args={[2.5, 4.5, 3.5, 8]} />
          <meshStandardMaterial color={0xffffff} roughness={0.4} metalness={0.1} />
        </mesh>

        <RouletteModel users={users} />
      </group>
    </>
  );
}

export default function Roulette(props: {
  zoomRatio: number;
  players: Array<user>;
  isActive?: boolean;
}) {
  const { zoomRatio, players, isActive = true } = props;
  const [rouletteNum, setRouletteNum] = useState(0);

  return (
    <>
      <div className="absolute z-10 block top-3 right-1/2 translate-x-1/2 px-2 w-2/3 text-center text-2xl bg-opacity-80">
        {players[rouletteNum].name}
      </div>
      {isActive ? (
        <Canvas
          className="h-full w-full"
          camera={{ fov: 80, position: [10, 3, 0] }}
          style={{ background: "transparent", zoom: 1 / zoomRatio }}
          frameloop="demand"
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "low-power" }}
        >
          <GroupComponent
            users={players}
            rouletteNum={rouletteNum}
            setRouletteNum={setRouletteNum}
          />
          <OrbitControls
            minDistance={16}
            maxDistance={25}
            minPolarAngle={0}
            maxPolarAngle={(0.6 * Math.PI) / 2}
            minAzimuthAngle={0}
            maxAzimuthAngle={0}
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
