"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useState, useMemo } from "react";
import { Euler } from "three";

// ==============================
// 設定
const modelPath = "Coin.glb"; // コインモデルのパス

// コインモデル単体
function CoinModel() {
  const { scene } = useGLTF(modelPath);

  // モデルのクローン（コインカードを複数作成するため）
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clonedScene}
      // 今回はコインの中心が原点になるように調整
      position={[0, 0, 0]} // モデルの位置
      scale={[10, 10, 10]} // モデルの大きさ
    />
  );
}

// グループ（複数のモデルの集合）
function Group() {
  const [rotation, setRotation] = useState(
    new Euler((2 * Math.PI) / 2, (2 * Math.PI) / 2, (2 * Math.PI) / 2)
  );
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFlippingLast, setIsFlippingLast] = useState(false);

  useFrame(() => {
    if (isFlipping === isFlippingLast) {
      // モデルの回転
      if (isFlipping) {
        setRotation(
          (prevRotation) =>
            new Euler(
              prevRotation.x + (Math.PI * 15) / 100,
              prevRotation.y,
              prevRotation.z
            )
        );
      }
    } else {
      // コインフリップの切り替え時にランダムな回転角にする
      setRotation(
        (prevRotation) =>
          new Euler(
            ((Math.floor(Math.random() * 2) + 1) * Math.PI),
            prevRotation.y,
            prevRotation.z,
          )
      );
      setIsFlippingLast(isFlipping);
    }
  });

  return (
    <group
      rotation={rotation} // モデルの回転
      onClick={() => {
        // クリック時の処理
        setIsFlipping(!isFlipping);
      }}
    >
      {/* モデル */}
      <CoinModel />
    </group>
  );
}

export default function Coin(props: { zoomRatio: number }) {
  const { zoomRatio } = props;
  return (
    <>
      <Canvas
        className="h-full w-full"
        camera={{
          fov: 70, // 視野角
          position: [0, 0, 50], // カメラの位置
        }}
        style={{
          zoom: 1 / zoomRatio, // キャンバスの拡大
        }}
      >
        {/* グループ */}
        <Group />

        {/* カメラ操作 https://threejs.org/docs/#examples/en/controls/OrbitControls */}
        <OrbitControls
          minDistance={120} // ズームの最小距離
          maxDistance={153} // ズームの最大距離
          minPolarAngle={(Math.PI * -0) / 100} // カメラの上下回転角度の最小値
          maxPolarAngle={(Math.PI * 0) / 100} // カメラの上下回転角度の最大値
          minAzimuthAngle={(Math.PI * -0) / 100} // カメラの左右回転角度の最小値
          maxAzimuthAngle={(Math.PI * 0) / 100} // カメラの左右回転角度の最大値
        />

        {/* ライト */}
        <directionalLight intensity={5} position={[10, 25, 80]} />
        <ambientLight intensity={0.2} />

        {/* パフォーマンスモニター */}
        {/* <Stats /> */}
      </Canvas>
    </>
  );
}