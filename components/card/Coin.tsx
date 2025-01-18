"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Euler } from "three";
import { useSelector, useDispatch } from "react-redux";
import { setCoinState } from "../../store/coinSlice";

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
      position={[0, -5, 0]} // モデルの位置
      scale={[10, 10, 10]} // モデルの大きさ
    />
  );
}

// グループ（複数のモデルの集合）
function Group() {
  const rotation = useSelector((state: { coin: { rotation: Euler } }) => state.coin.rotation);
  const isFlipping = useSelector((state: { coin: { isFlipping: boolean } }) => state.coin.isFlipping);
  const dispatch = useDispatch();

  useFrame(() => {
    if (isFlipping) {
      dispatch(setCoinState({
        rotation: new Euler(
          rotation.x + (Math.PI * 15) / 100,
          rotation.y,
          rotation.z
        ),
        isFlipping: true
      }));
    } else {
      dispatch(setCoinState({
        rotation: new Euler(
          ((Math.floor(Math.random() * 2) + 1) * Math.PI),
          rotation.y,
          rotation.z,
        ),
        isFlipping: false
      }));
    }
  });

  return (
    <group
      rotation={rotation} // モデルの回転
      onClick={() => {
        // クリック時の処理
        dispatch(setCoinState({ rotation, isFlipping: !isFlipping }));
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
