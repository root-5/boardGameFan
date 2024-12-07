'use client'

import { Canvas } from '@react-three/fiber'
import { Stats, OrbitControls, Environment, useGLTF } from '@react-three/drei'

// 背景設定
const isLocal = true;
const bgImg = isLocal ? 'bg_.jpg' : 'bg.jpg';

function Model() {
  const { scene } = useGLTF('Dice.glb')
  return <primitive object={scene} />
}

export default function App() {
  return (
    <>
      <Canvas
        className='h-full'
        camera={{ fov: 80, position: [0.2, 0.1, 0.5] }}
      >

        {/* モデル */}
        <group>
          <Model />
        </group>

        {/* カメラ操作 */}
        <OrbitControls
          // autoRotate // 自動回転
        />

        {/* ライト */}
        <directionalLight position={[5, 5, 5]} castShadow />
        
        {/* パフォーマンスモニター */}
        {/* <Stats /> */}

        {/* 背景 */}
        <Environment
          files={[bgImg]} // 背景のファイル名
          blur={0} // 背景のぼかしの強さ
          background
        />
      </Canvas>
    </>
  )
}
