'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { useState } from 'react';
import { Euler } from 'three';

// ==============================
// 設定
const modelPath = 'Dice.glb';

// ダイスモデル単体
function DiceModel() {
  const { scene } = useGLTF(modelPath)

  return <primitive
    object={scene}
    // 今回はサイコロの中心が原点になるように調整、元は中心が底面になっている
    position={[0, -5, 0]} // モデルの位置
    scale={[100,100,100]} // モデルの大きさ
  />
}

// グループ（複数のモデルの集合）
function Group() {
  const [rotation, setRotation] = useState(new Euler(1 * Math.PI / 2, 2 * Math.PI / 2, 2 * Math.PI / 2));
  const [isRolling, setIsRolling] = useState(false);
  const [isRollingLast, setIsRollingLast] = useState(false);

  useFrame(() => {
    if (isRolling === isRollingLast) {
      // モデルの回転
      if (isRolling) {
        setRotation((prevRotation) => new Euler(
          prevRotation.x + Math.PI * 15 / 100,
          prevRotation.y + Math.PI * 15 / 100,
          prevRotation.z + Math.PI * 15 / 100
        ));
      }
    } else {
      // ダイスロールの切り替え時にランダムな回転角にする
      setRotation(new Euler(
        (Math.floor(Math.random() * 6) + 1) * Math.PI / 2, 
        (Math.floor(Math.random() * 6) + 1) * Math.PI / 2, 
        (Math.floor(Math.random() * 6) + 1) * Math.PI / 2
      ));
      setIsRollingLast(isRolling);
    }
  })

  return <group
    rotation={rotation} // モデルの回転
    onClick={() => { // クリック時の処理
        setIsRolling(!isRolling);
      }}
    >
    {/* モデル */}
    <DiceModel />
  </group>
}

export default function Dice() {
  return (
    <div className='h-44 w-44'>
      <Canvas
        className='h-44 w-44'
        camera={{ 
          fov: 80, // 視野角
          position: [0, 0, 50] // カメラの位置
        }}
      >

        {/* グループ */}
        <Group />

        {/* カメラ操作 https://threejs.org/docs/#examples/en/controls/OrbitControls */}
        <OrbitControls
          minDistance={15} // ズームの最小距離
          maxDistance={15} // ズームの最大距離
          minPolarAngle={Math.PI * 43 / 100} // カメラの上下回転角度の最小値
          maxPolarAngle={Math.PI * 58.5 / 100} // カメラの上下回転角度の最大値
          minAzimuthAngle={Math.PI * -7 / 100} // カメラの左右回転角度の最小値
          maxAzimuthAngle={Math.PI * 7 / 100} // カメラの左右回転角度の最大値
          // autoRotate // 自動回転
        />

        {/* ライト */}
        <directionalLight
          intensity={5}
          position={[10, 20, 50]}
          castShadow
        />
        
        {/* パフォーマンスモニター */}
        {/* <Stats /> */}

      </Canvas>
    </div>
  )
}
