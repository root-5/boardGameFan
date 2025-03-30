"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Euler } from "three";

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
    minPolarAngle: (Math.PI * 45) / 100,
    maxPolarAngle: (Math.PI * 45) / 100,
    minAzimuthAngle: (Math.PI * -0) / 100,
    maxAzimuthAngle: (Math.PI * 0) / 100,
    position: [0, 0, 0],
    maxValue: 6,
    eulers: [
      new Euler(0, 0, 0),
      new Euler(Math.PI / 2, 0, 0),
      new Euler(-Math.PI / 2, 0, 0),
      new Euler(0, 0, Math.PI / 2),
      new Euler(0, 0, -Math.PI / 2),
      new Euler(Math.PI, 0, 0)
    ]
  },
  d20: {
    modelPath: "Dice_20.glb",
    scale: [100, 100, 100],
    minDistance: 15,
    maxDistance: 15,
    minPolarAngle: (Math.PI * 45) / 100,
    maxPolarAngle: (Math.PI * 45) / 100,
    minAzimuthAngle: (Math.PI * -0) / 100,
    maxAzimuthAngle: (Math.PI * 0) / 100,
    position: [0, 0, 0],
    maxValue: 20,
    eulers: [
      new Euler(0, 0, 0),                                   // 1の面
      new Euler(0, Math.PI / 5, Math.PI / 3),               // 2の面
      new Euler(0, (2 * Math.PI) / 5, (2 * Math.PI) / 3),   // 3の面
      new Euler(0, (3 * Math.PI) / 5, Math.PI),             // 4の面
      new Euler(0, (4 * Math.PI) / 5, (4 * Math.PI) / 3),   // 5の面
      new Euler(Math.PI / 3, 0, 0),                         // 6の面
      new Euler(Math.PI / 3, (2 * Math.PI) / 5, 0),         // 7の面
      new Euler(Math.PI / 3, (4 * Math.PI) / 5, 0),         // 8の面
      new Euler(Math.PI / 3, Math.PI, 0),                   // 9の面
      new Euler(Math.PI / 3, (6 * Math.PI) / 5, 0),         // 10の面
      new Euler(Math.PI / 3, (8 * Math.PI) / 5, 0),         // 11の面
      new Euler((2 * Math.PI) / 3, 0, 0),                   // 12の面
      new Euler((2 * Math.PI) / 3, (2 * Math.PI) / 5, 0),   // 13の面
      new Euler((2 * Math.PI) / 3, (4 * Math.PI) / 5, 0),   // 14の面
      new Euler((2 * Math.PI) / 3, Math.PI, 0),             // 15の面
      new Euler((2 * Math.PI) / 3, (6 * Math.PI) / 5, 0),   // 16の面
      new Euler((2 * Math.PI) / 3, (8 * Math.PI) / 5, 0),   // 17の面
      new Euler(Math.PI, Math.PI / 5, Math.PI / 3),         // 18の面
      new Euler(Math.PI, (2 * Math.PI) / 5, (2 * Math.PI) / 3), // 19の面
      new Euler(Math.PI, 0, 0)                              // 20の面
    ]
  }
};

// ==============================
// カスタムフック - ダイスロジック
// ==============================
function useDiceLogic(diceType: DiceDimensions) {
  const [rotation, setRotation] = useState(
    diceTypes[diceType].eulers[2] // 6面ダイスの "6" の面
  );
  const [isRolling, setIsRolling] = useState(false);
  const [isRollingLast, setIsRollingLast] = useState(false);

  // ダイスを転がすハンドラー
  const rollDice = useCallback(() => {
    setIsRolling(!isRolling);
  }, [isRolling]);

  useFrame(() => {
    if (isRolling === isRollingLast) {
      // モデルの回転
      if (isRolling) {
        setRotation(
          (prevRotation) =>
            new Euler(
              prevRotation.x + (Math.PI * 15) / 100,
              prevRotation.y + (Math.PI * 15) / 100,
              prevRotation.z + (Math.PI * 15) / 100
            )
        );
      }
    } else {
      // ダイスロールの切り替え時にランダムな回転角にする
      setRotation(
        diceTypes[diceType].eulers[Math.floor(Math.random() * diceTypes[diceType].maxValue)]
      );
      setIsRollingLast(isRolling);
    }
  });

  return {
    rotation,
    isRolling,
    rollDice
  };
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
function DiceGroup({ diceType }: { diceType: DiceDimensions }) {
  const { rotation, rollDice } = useDiceLogic(diceType);
  return (
    <group
      rotation={rotation}
      onClick={rollDice}
    >
      <DiceModel diceType={diceType} />
    </group>
  );
}

// ==============================
// メインコンポーネント
// ==============================
export default function Dice(props: { zoomRatio: number }) {
  const { zoomRatio } = props;
  const [selectedDiceType, setSelectedDiceType] = useState<DiceDimensions>('d6');
  const config = diceTypes[selectedDiceType];

  // モデルの事前読み込み
  useEffect(() => {
    try {
      Object.values(diceTypes).forEach(type => {
        useGLTF.preload(type.modelPath);
      });
    } catch (error) {
      console.error("モデルのプリロードに失敗しました:", error);
    }
  }, []);

  // ダイスタイプ切り替えハンドラー
  const toggleDiceType = useCallback(() => {
    setSelectedDiceType(prev => prev === 'd6' ? 'd20' : 'd6');
  }, []);

  return (
    <div className="h-full w-full relative">
      {/* ダイス選択UI */}
      <button
        className={"absolute z-10 block bottom-2 left-1/2 -translate-x-1/2 w-16 text-xl text-center duration-200 hover:opacity-80"}
        onClick={toggleDiceType}
      >
        {selectedDiceType}
      </button>

      <Canvas
        className="h-full w-full"
        style={{ zoom: 1 / zoomRatio, }}
      >
        {/* グループ */}
        <DiceGroup diceType={selectedDiceType} />

        {/* カメラ操作 */}
        <OrbitControls
          minDistance={config.minDistance}
          maxDistance={config.maxDistance}
          minPolarAngle={config.minPolarAngle}
          maxPolarAngle={config.maxPolarAngle}
          minAzimuthAngle={config.minAzimuthAngle}
          maxAzimuthAngle={config.maxAzimuthAngle}
          enablePan={false}
        />

        {/* ライト */}
        <directionalLight intensity={5} position={[10, 20, 50]} castShadow />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}