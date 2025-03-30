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
      new Euler(Math.PI, 0, 0)
    ]
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
      new Euler(2.281594635649414, 2.7364837123268737, 0.46752905169531833), // 1
      new Euler(2.1329691446641348, 6.134649083647228, 3.305001660001041), // 2
      new Euler(2.3193434262335735, 3.2847295930698245, 5.446634381780314), // 3
      new Euler(6.278464803475794, 3.6758206415915864, 5.732631696386318), // 4
      new Euler(1.9110104546349074, 1.3849923221166003, 1.409861144114713), // 5
      new Euler(1.129774579899926, 3.096048908848052, 5.668938888734065), // 6
      new Euler(6.078385611352912, 5.853985208610443, 0.6719989399062191), // 7
      new Euler(5.735207411848094, 4.532278199506348, 2.4597113845158978), // 8
      new Euler(1.381144516894394, 3.863382759749827, 6.251253607998515), // 9
      new Euler(1.0066123767655852, 0.4834038972723187, 3.9782125074423965), // 10
      new Euler(1.702892540125957, 5.725014387652284, 0.8611688443707862), // 11
      new Euler(2.8623545613968244, 1.6426512776530358, 1.745647249052657), // 12
      new Euler(1.585823099427606, 2.6217073675809703, 1.1126693899847808), // 13
      new Euler(2.411671741221388, 6.244476079017044, 5.396571586383581), // 14
      new Euler(0.9580497323326584, 0.478848416061389, 2.6996472829175273), // 15
      new Euler(1.6810075306228713, 2.2890730247237423, 4.890603643619729), // 16
      new Euler(5.543978808669293, 0.056539120429048524, 0.8341191002506894), // 17
      new Euler(0.5183588895568026, 2.8676940228557144, 2.3590613468466524), // 18
      new Euler(5.417709666430658, 0.43647968081176275, 2.754869759867071), // 19
      new Euler(5.5853625767868635, 2.5303617386887964, 0.23988265126975464), // 20
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
      // eulers の値を総当たりで取得する際に使ったコード
      // const randomNums = {
      //   x: Math.random() * Math.PI,
      //   y: Math.random() * Math.PI,
      //   z: Math.random() * Math.PI
      // }
      // console.log("new Euler(" + randomNums.x + "," + randomNums.y + "," + randomNums.z + "),");
      // setRotation(
      //   new Euler(randomNums.x, randomNums.y, randomNums.z)
      // );
      const randomIndex = Math.floor(Math.random() * diceTypes[diceType].maxValue);
      setRotation(
        diceTypes[diceType].eulers[randomIndex]
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

      {/* ダイス選択UI */}
      <button
        className={"absolute z-10 block bottom-2 left-1/2 -translate-x-1/2 w-16 text-xl text-center duration-200 hover:opacity-80"}
        onClick={toggleDiceType}
      >
        {selectedDiceType}
      </button>
    </div>
  );
}