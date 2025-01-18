"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Euler } from "three";
import { useSelector, useDispatch } from "react-redux";
import { setDiceState } from "../../store/diceSlice";

// ==============================
// 設定
const modelPath = "Dice.glb";

// ダイスモデル単体
function DiceModel() {
  const { scene } = useGLTF(modelPath);

  // モデルのクローン（ダイスカードを複数作成するため）
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clonedScene}
      // 今回はサイコロの中心が原点になるように調整、元は中心が底面になっている
      position={[0, -5, 0]} // モデルの位置
      scale={[100, 100, 100]} // モデルの大きさ
    />
  );
}

// グループ（複数のモデルの集合）
function Group() {
  const rotation = useSelector((state: { dice: { rotation: Euler } }) => state.dice.rotation);
  const isRolling = useSelector((state: { dice: { isRolling: boolean } }) => state.dice.isRolling);
  const dispatch = useDispatch();

  useFrame(() => {
    if (isRolling) {
      dispatch(setDiceState({
        rotation: new Euler(
          rotation.x + (Math.PI * 15) / 100,
          rotation.y + (Math.PI * 15) / 100,
          rotation.z + (Math.PI * 15) / 100
        ),
        isRolling: true
      }));
    } else {
      dispatch(setDiceState({
        rotation: new Euler(
          ((Math.floor(Math.random() * 6) + 1) * Math.PI) / 2,
          ((Math.floor(Math.random() * 6) + 1) * Math.PI) / 2,
          ((Math.floor(Math.random() * 6) + 1) * Math.PI) / 2
        ),
        isRolling: false
      }));
    }
  });

  return (
    <group
      rotation={rotation} // モデルの回転
      onClick={() => {
        // クリック時の処理
        dispatch(setDiceState({ rotation, isRolling: !isRolling }));
      }}
    >
      {/* モデル */}
      <DiceModel />
    </group>
  );
}

export default function Dice(props: { zoomRatio: number }) {
  const { zoomRatio } = props;
  return (
    <>
      <Canvas
        className="h-full w-full"
        camera={{
          fov: 80, // 視野角
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
          minDistance={15} // ズームの最小距離
          maxDistance={15} // ズームの最大距離
          minPolarAngle={(Math.PI * 43) / 100} // カメラの上下回転角度の最小値
          maxPolarAngle={(Math.PI * 58.5) / 100} // カメラの上下回転角度の最大値
          minAzimuthAngle={(Math.PI * -7) / 100} // カメラの左右回転角度の最小値
          maxAzimuthAngle={(Math.PI * 7) / 100} // カメラの左右回転角度の最大値
          // autoRotate // 自動回転
        />

        {/* ライト */}
        <directionalLight intensity={5} position={[10, 20, 50]} castShadow />

        {/* パフォーマンスモニター */}
        {/* <Stats /> */}
      </Canvas>
    </>
  );
}
