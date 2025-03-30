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
};

interface DiceTypes {
  [key: string]: DiceConfig;
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
    maxValue: 6
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
    maxValue: 20
  }
};

// ==============================
// カスタムフック - ダイスロジック
// ==============================
function useDiceLogic(diceType: DiceDimensions) {
  const [rotation, setRotation] = useState(
    new Euler((1 * Math.PI) / 2, (2 * Math.PI) / 2, (2 * Math.PI) / 2)
  );
  const [isRolling, setIsRolling] = useState(false);
  const [isRollingLast, setIsRollingLast] = useState(false);
  const [diceValue, setDiceValue] = useState(1);

  const maxDiceValue = diceTypes[diceType].maxValue;

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
      if (!isRolling && isRollingLast) {
        // ロールが終了したときに新しいダイス目を設定
        const newValue = Math.floor(Math.random() * maxDiceValue) + 1;
        setDiceValue(newValue);
      }

      // ダイスロールの切り替え時にランダムな回転角にする
      setRotation(
        new Euler(
          ((Math.floor(Math.random() * 6) + 1) * Math.PI) / 2,
          ((Math.floor(Math.random() * 6) + 1) * Math.PI) / 2,
          ((Math.floor(Math.random() * 6) + 1) * Math.PI) / 2
        )
      );
      setIsRollingLast(isRolling);
    }
  });

  return {
    rotation,
    isRolling,
    diceValue,
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
  const { rotation, rollDice, diceValue } = useDiceLogic(diceType);

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