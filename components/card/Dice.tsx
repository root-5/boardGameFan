"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useState, useMemo, useEffect } from "react";
import { Euler } from "three";

// 設定できるダイスタイプ
type DiceDimensions = "d6" | "d20";

// ダイスの設定を表す型
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
};

// 文字列インデックスを持つダイスタイプの型
interface DiceTypes {
  [key: string]: DiceConfig;
  d6: DiceConfig;
  d20: DiceConfig;
}

// ==============================
// 設定
const diceTypes: DiceTypes = {
  d6: {
    modelPath: "Dice_6.glb",
    scale: [100, 100, 100],
    minDistance: 15,
    maxDistance: 15,
    minPolarAngle: (Math.PI * 43) / 100,
    maxPolarAngle: (Math.PI * 58.5) / 100,
    minAzimuthAngle: (Math.PI * -7) / 100,
    maxAzimuthAngle: (Math.PI * 7) / 100,
    position: [0, 0, 0]
  },
  d20: {
    modelPath: "Dice_20.glb", // 20面ダイスのモデルパス（適宜調整してください）
    scale: [100, 100, 100],
    minDistance: 15,
    maxDistance: 15,
    minPolarAngle: (Math.PI * 43) / 100,
    maxPolarAngle: (Math.PI * 58.5) / 100,
    minAzimuthAngle: (Math.PI * -7) / 100,
    maxAzimuthAngle: (Math.PI * 7) / 100,
    position: [0, 0, 0]
  }
};

// ダイスモデル単体
function DiceModel(props: { diceType: DiceDimensions }) {
  const { diceType } = props;
  const { scene } = useGLTF(diceTypes[diceType].modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const config = diceTypes[diceType];

  return (
    <primitive
      object={clonedScene}
      position={config.position}
      scale={config.scale}
    />
  );
}

// グループ（複数のモデルの集合）
function Group(props: { diceType: DiceDimensions }) {
  const { diceType } = props;
  const [rotation, setRotation] = useState(
    new Euler((1 * Math.PI) / 2, (2 * Math.PI) / 2, (2 * Math.PI) / 2)
  );
  const [isRolling, setIsRolling] = useState(false);
  const [isRollingLast, setIsRollingLast] = useState(false);
  const [diceValue, setDiceValue] = useState(1); // ダイス目の値

  // ダイスの種類に応じた最大値
  const maxDiceValue = diceType === 'd20' ? 20 : 6;

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

  return (
    <group
      rotation={rotation} // モデルの回転
      onClick={() => {
        // クリック時の処理
        setIsRolling(!isRolling);
      }}
    >
      <DiceModel diceType={diceType} />
    </group>
  );
}

export default function Dice(props: { zoomRatio: number }) {
  const { zoomRatio } = props;
  const [selectedDiceDimention, setSelectedDiceDimention] = useState<DiceDimensions>('d6');
  const config = diceTypes[selectedDiceDimention];

  // モデルの事前読み込み
  useEffect(() => {
    Object.values(diceTypes).forEach(type => {
      useGLTF.preload(type.modelPath);
    });
  }, []);

  return (
    <>
      <div className="h-full w-full relative">
        {/* ダイス選択UI */}
        <button
          className={"absolute z-10 block bottom-2 left-1/2 -translate-x-1/2 w-16 text-xl text-center duration-200 hover:opacity-80"}
          onClick={() => {
            if (selectedDiceDimention === 'd6') {
              setSelectedDiceDimention('d20');
            } else {
              setSelectedDiceDimention('d6');
            }
          }}
        >
          {selectedDiceDimention}
        </button>

        <Canvas
          className="h-full w-full"
          camera={{
            fov: 80,
            position: [0, 0, 50],
          }}
          style={{
            zoom: 1 / zoomRatio,
          }}
        >
          {/* グループ */}
          <Group diceType={selectedDiceDimention} />

          {/* カメラ操作 */}
          <OrbitControls
            minDistance={config.minDistance}
            maxDistance={config.maxDistance}
            minPolarAngle={config.minPolarAngle}
            maxPolarAngle={config.maxPolarAngle}
            minAzimuthAngle={config.minAzimuthAngle}
            maxAzimuthAngle={config.maxAzimuthAngle}
          />

          {/* ライト */}
          <directionalLight intensity={5} position={[10, 20, 50]} castShadow />
          <ambientLight intensity={0.5} />
        </Canvas>
      </div>
    </>
  );
}