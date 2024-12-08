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

// ダイスモデル
function DiceModel() {
  const { scene } = useGLTF(modelPath)
  // const [rotation, setRotation] = useState([0, 0, 0])

  //モデルの中心を再設定
  // useEffect(() => {
  //   scene.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0));
  //   // scene.makeTranslation
  // }, [scene]);

  // マイフレームの処理
  // useFrame(() => {
  //   setRotation([
  //     rotation[0] + Math.PI * 1 / 100,
  //     rotation[1] + Math.PI * 1 / 100,
  //     rotation[2] + Math.PI * 1 / 100
  //   ])
  // })

  return <primitive
    object={scene}
    position={[0, -5, 0]} // モデルの位置
    scale={[100,100,100]} // モデルの大きさ
    // rotation={rotation} // モデルの回転
    // translate={[0, 0, 0]} // モデルの中心を再設定
    // onClick={() => { // クリック時の処理
    //   setRotation([
    //     rotation[0] + Math.PI * 1 / 100,
    //     rotation[1] + Math.PI * 0 / 100,
    //     rotation[2] + Math.PI * 0 / 100
    //   ])
    // }}
  />
}

export default function App() {
  const [rotation, setRotation] = useState([0, 0, 0])

  return (
    <>
      <Canvas
        className='h-full'
        camera={{ 
          fov: 80, // 視野角
          position: [20, 10, 50] // カメラの位置
        }}
      >

        {/* モデル */}
        <group
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
          <DiceModel />
        </group>

        {/* カメラ操作 https://threejs.org/docs/#examples/en/controls/OrbitControls */}
        <OrbitControls
          minDistance={20} // ズームの最小距離
          maxDistance={100} // ズームの最大距離
          // minPolarAngle={Math.PI * 43.5 / 100} // カメラの上下回転角度の最小値
          // maxPolarAngle={Math.PI * 59 / 100} // カメラの上下回転角度の最大値
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
