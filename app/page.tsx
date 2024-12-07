'use client';

import React, { useState, forwardRef } from 'react'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { suspend } from 'suspend-react'

// 背景設定
const isLocal = true;
const bgImg = isLocal ? 'bg_.jpg' : 'bg.jpg';

// ダイスモデル
const diceModel = 'Dice.glb';

export default function Home() {
  return (
    <Canvas
      className='h-full'
      camera={{ fov: 80, position: [20, 10, 50] }}
    >
      <OrbitControls />
      <Scene />
      {/* <pointLight position={[10, 10, 10]} /> */}
      <Environment
        files={[bgImg]} // 背景のファイル名
        blur={0} // 背景のぼかしの強さ
        // ground={{
        //   height: 100, // 環境マップを作成するために使用されたカメラの高さ (デフォルト: 15)
        //   radius: 60, // ワールドの半径 (デフォルト: 60)
        //   scale: 1000, // 環境テクスチャを保持する裏側の投影球のスケール (デフォルト: 1000)
        // }}
        background
      />
    </Canvas>
  );
}

const Scene = () => {
  const [color, setColor] = useState<string>('hotpink')
  return (
    <mesh
      onClick={() => {
        color === 'hotpink' ? setColor('orange') : setColor('hotpink')
      }}>
      <boxGeometry args={[10,10,10]}/>
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// const Dice = forwardRef((props, ref) => {
//   const { nodes } = useGLTF(suspend(diceModel).default)
//   return (
//     <>
//       <mesh ref={ref} castShadow receiveShadow geometry={nodes.mesh.geometry} {...props}>
//         <meshStandardMaterial color="#9d4b4b" />
//       </mesh>
//     </>
//   )
// })
