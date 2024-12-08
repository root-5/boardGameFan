'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react';
import * as THREE from 'three';

// ==============================
// 設定
const isLocal = true;
const modelPath = 'Dice.glb';
const backgroundImagePath = isLocal ? 'bg_.jpg' : 'bg.jpg';

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
  const [rotation, setRotation] = useState([0, 0, 0]);

  useFrame(() => {
    // モデルの回転
    setRotation([
      rotation[0] + Math.PI * 1 / 100,
      rotation[1] + Math.PI * 1 / 100,
      rotation[2] + Math.PI * 1 / 100
    ])
  })

  return <group
    // position={[0, -5, 0]} // モデルの位置
    rotation={rotation} // モデルの回転
    onClick={() => { // クリック時の処理
        console.log('click');
        setRotation([
          rotation[0] + Math.PI * 1 / 100,
          rotation[1] + Math.PI * 0 / 100,
          rotation[2] + Math.PI * 0 / 100
        ])
      }}
    >
    {/* モデル */}
    <DiceModel />
  </group>
}

export default function App() {

  return (
    <>
      <Canvas
        className='h-full'
        camera={{ 
          fov: 80, // 視野角
          position: [20, 10, 50] // カメラの位置
        }}
      >

        {/* グループ */}
        <Group />

        {/* カメラ操作 https://threejs.org/docs/#examples/en/controls/OrbitControls */}
        <OrbitControls
          minDistance={20} // ズームの最小距離
          maxDistance={100} // ズームの最大距離
          minPolarAngle={Math.PI * 43.5 / 100} // カメラの上下回転角度の最小値
          maxPolarAngle={Math.PI * 59 / 100} // カメラの上下回転角度の最大値
          // autoRotate // 自動回転
        />

        {/* ライト */}
        {/* <directionalLight position={[5, 5, 5]} castShadow /> */}
        
        {/* パフォーマンスモニター */}
        {/* <Stats /> */}

        {/* 背景 */}
        <Environment
          files={[backgroundImagePath]} // 背景のファイル名
          blur={0} // 背景のぼかしの強さ
          background
        />

      </Canvas>
    </>
  )
}
