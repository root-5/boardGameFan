"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Euler, Group } from "three";

// ==============================
// 型定義
// ==============================
type DiceDimensions = "d6" | "d20";

type DiceConfig = {
  modelPath: string;
  scale: number[];
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  position: number[];
  maxValue: number;
  eulers: Euler[];
};

interface DiceTypes {
  d6: DiceConfig;
  d20: DiceConfig;
}

// ==============================
// 設定
// ==============================
const diceTypes: DiceTypes = {
  d6: {
    modelPath: "Dice_6.glb",
    scale: [100, 100, 100],
    minDistance: 15,
    maxDistance: 15,
    minPolarAngle: (Math.PI * 47) / 100,
    maxPolarAngle: (Math.PI * 53) / 100,
    minAzimuthAngle: (Math.PI * -3) / 100,
    maxAzimuthAngle: (Math.PI * 3) / 100,
    position: [0, 0, 0],
    maxValue: 6,
    eulers: [
      new Euler(0, 0, 0),
      new Euler(Math.PI / 2, 0, 0),
      new Euler(-Math.PI / 2, 0, 0),
      new Euler(0, 0, Math.PI / 2),
      new Euler(0, 0, -Math.PI / 2),
      new Euler(Math.PI, 0, 0),
    ],
  },
  d20: {
    modelPath: "Dice_20.glb",
    scale: [100, 100, 100],
    minDistance: 15,
    maxDistance: 15,
    minPolarAngle: (Math.PI * 44) / 100,
    maxPolarAngle: (Math.PI * 46) / 100,
    minAzimuthAngle: (Math.PI * -1) / 100,
    maxAzimuthAngle: (Math.PI * 1) / 100,
    position: [0, 0, 0],
    maxValue: 20,
    eulers: [
      new Euler(2.281594635649414, 2.7364837123268737, 0.46752905169531833),
      new Euler(2.1329691446641348, 6.134649083647228, 3.305001660001041),
      new Euler(2.3193434262335735, 3.2847295930698245, 5.446634381780314),
      new Euler(6.278464803475794, 3.6758206415915864, 5.732631696386318),
      new Euler(1.9110104546349074, 1.3849923221166003, 1.409861144114713),
      new Euler(1.129774579899926, 3.096048908848052, 5.668938888734065),
      new Euler(6.078385611352912, 5.853985208610443, 0.6719989399062191),
      new Euler(5.735207411848094, 4.532278199506348, 2.4597113845158978),
      new Euler(1.381144516894394, 3.863382759749827, 6.251253607998515),
      new Euler(1.0066123767655852, 0.4834038972723187, 3.9782125074423965),
      new Euler(1.702892540125957, 5.725014387652284, 0.8611688443707862),
      new Euler(2.8623545613968244, 1.6426512776530358, 1.745647249052657),
      new Euler(1.585823099427606, 2.6217073675809703, 1.1126693899847808),
      new Euler(2.411671741221388, 6.244476079017044, 5.396571586383581),
      new Euler(0.9580497323326584, 0.478848416061389, 2.6996472829175273),
      new Euler(1.6810075306228713, 2.2890730247237423, 4.890603643619729),
      new Euler(5.543978808669293, 0.056539120429048524, 0.8341191002506894),
      new Euler(0.5183588895568026, 2.8676940228557144, 2.3590613468466524),
      new Euler(5.417709666430658, 0.43647968081176275, 2.754869759867071),
      new Euler(5.5853625767868635, 2.5303617386887964, 0.23988265126975464),
    ],
  },
};

// ==============================
// カスタムフック - ダイスロジック（ref 更新で React 再レンダーを回避）
// ==============================
function useDiceLogic(diceType: DiceDimensions, groupRef: React.RefObject<Group | null>) {
  const [isRolling, setIsRolling] = useState(false);
  const isRollingRef = useRef(false);
  const isRollingLastRef = useRef(false);
  const { invalidate } = useThree();

  const rollDice = useCallback(() => {
    setIsRolling((prev) => {
      const next = !prev;
      isRollingRef.current = next;
      return next;
    });
  }, []);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    if (isRollingRef.current === isRollingLastRef.current) {
      if (isRollingRef.current) {
        group.rotation.x += (Math.PI * 15) / 100;
        group.rotation.y += (Math.PI * 15) / 100;
        group.rotation.z += (Math.PI * 15) / 100;
        invalidate();
      }
    } else {
      const randomIndex = Math.floor(Math.random() * diceTypes[diceType].maxValue);
      const euler = diceTypes[diceType].eulers[randomIndex];
      group.rotation.copy(euler);
      isRollingLastRef.current = isRollingRef.current;
      invalidate();
    }
  });

  return { isRolling, rollDice };
}

// ==============================
// ダイスモデルコンポーネント
// ==============================
function DiceModel({ diceType }: { diceType: DiceDimensions }) {
  const { scene } = useGLTF(diceTypes[diceType].modelPath);
  const clonedScene = useMemo(() => scene?.clone(), [scene]);
  const config = diceTypes[diceType];
  return (
    <primitive
      object={clonedScene}
      position={config.position}
      scale={config.scale}
    />
  );
}

// ==============================
// グループコンポーネント
// ==============================
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

function DiceGroup({ diceType }: { diceType: DiceDimensions }) {
  const groupRef = useRef<Group>(null);
  const { isRolling, rollDice } = useDiceLogic(diceType, groupRef);
  const initialEuler = diceTypes[diceType].eulers[2];

  return (
    <>
      <KickFrame active={isRolling} />
      <group
        ref={groupRef}
        rotation={[initialEuler.x, initialEuler.y, initialEuler.z]}
        onClick={rollDice}
      >
        <DiceModel diceType={diceType} />
      </group>
    </>
  );
}

// ==============================
// メインコンポーネント
// ==============================
export default function Dice(props: { zoomRatio: number; isActive?: boolean }) {
  const { zoomRatio, isActive = true } = props;
  const [selectedDiceType, setSelectedDiceType] = useState<DiceDimensions>("d6");
  const config = diceTypes[selectedDiceType];

  // アクティブ時のみ現在のモデルをプリロード（両方一括ロードしない）
  useEffect(() => {
    if (!isActive) return;
    try {
      useGLTF.preload(diceTypes[selectedDiceType].modelPath);
    } catch (error) {
      console.error("モデルのプリロードに失敗しました:", error);
    }
  }, [isActive, selectedDiceType]);

  const toggleDiceType = useCallback(() => {
    setSelectedDiceType((prev) => (prev === "d6" ? "d20" : "d6"));
  }, []);

  return (
    <div className="h-full w-full relative">
      {isActive ? (
        <Canvas
          className="h-full w-full"
          style={{ zoom: 1 / zoomRatio }}
          frameloop="demand"
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "low-power" }}
        >
          <DiceGroup diceType={selectedDiceType} />
          <OrbitControls
            minDistance={config.minDistance}
            maxDistance={config.maxDistance}
            minPolarAngle={config.minPolarAngle}
            maxPolarAngle={config.maxPolarAngle}
            minAzimuthAngle={config.minAzimuthAngle}
            maxAzimuthAngle={config.maxAzimuthAngle}
            enablePan={false}
          />
          <directionalLight intensity={5} position={[10, 20, 50]} />
          <ambientLight intensity={0.5} />
        </Canvas>
      ) : (
        <div className="h-full w-full" aria-hidden />
      )}

      <button
        className={
          "absolute z-10 block bottom-2 left-1/2 -translate-x-1/2 w-16 text-xl text-center duration-200 hover:opacity-80"
        }
        onClick={toggleDiceType}
      >
        {selectedDiceType}
      </button>
    </div>
  );
}
