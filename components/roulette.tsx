// "use client";

// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { useState } from "react";
// import { Euler, MeshLambertMaterial } from "three";
// import { Color } from "three";

// // ルーレットモデル
// function RouletteModel() {
//   const color = () => {
//     const colors = [
//       0xff0000, // 赤
//       0x00ff00, // 緑
//       0x0000ff, // 青
//       0xffff00, // 黄
//       0xff00ff, // ピンク
//       0x00ffff, // シアン
//     ];
//     return colors[Math.floor(Math.random() * colors.length)];
//   }

//   var materials = [
//     new MeshLambertMaterial({color: 0x00ff00}),
//     new MeshLambertMaterial({color: 0x00ff00}),
//     new MeshLambertMaterial({color: 0x0000ff}),
//     new MeshLambertMaterial({color: 0x0000ff}),
//     new MeshLambertMaterial({color: 0xff0000}),
//     new MeshLambertMaterial({color: 0xff0000})
// ];

//   return (
//     <mesh position={[0, 0, 0]} rotation={[0.65 * Math.PI / 2, 0, 0]}>
//       <cylinderGeometry
//         args={
//           [10, 10, 2, 8] // 半径上, 半径下, 高さ, 側面数
//         }
//       />
//       <meshStandardMaterial
//         color={0x00ffff}
//       />
//       {/* <meshStandardMaterial
//         color={0x00ffff}
//         roughness={0.5}
//         metalness={0.5}
//       /> */}
//     </mesh>
//   );
// }

// // グループ（複数のモデルの集合）
// function Group() {
//   const [rotation, setRotation] = useState(
//     new Euler(0, 0, 0)
//   );
//   const [isSpinning, setIsSpinning] = useState(false);
//   const [isSpinningLast, setIsSpinningLast] = useState(false);

//   useFrame(() => {
//     if (isSpinning === isSpinningLast) {
//       // モデルの回転
//       if (isSpinning) {
//         setRotation(
//           (prevRotation) =>
//             new Euler(
//               prevRotation.x,
//               prevRotation.y,
//               prevRotation.z + (Math.PI * 2) / 100
//             )
//         );
//       }
//     } else {
//       // ルーレットの切り替え時にランダムな回転角にする
//       setRotation(
//         new Euler(
//           0,
//           0,
//           (Math.random() * Math.PI * 2)
//         )
//       );
//       setIsSpinningLast(isSpinning);
//     }
//   });

//   return (
//     <group
//       rotation={rotation} // モデルの回転
//       onClick={() => {
//         // クリック時の処理
//         setIsSpinning(!isSpinning);
//       }}
//     >
//       {/* モデル */}
//       <RouletteModel />
//     </group>
//   );
// }

// export default function Roulette() {
//   return (
//     <div className="h-56 w-56 bg-gray-500">
//       <Canvas
//         className="h-full w-full"
//         camera={{
//           fov: 80, // 視野角
//           position: [0, 0, 20], // カメラの位置
//         }}
//       >
//         {/* グループ */}
//         <Group />

//         {/* カメラ操作 https://threejs.org/docs/#examples/en/controls/OrbitControls */}
//         <OrbitControls
//           minDistance={10} // ズームの最小距離
//           maxDistance={30} // ズームの最大距離
//           minPolarAngle={0} // カメラの上下回転角度の最小値
//           maxPolarAngle={Math.PI} // カメラの上下回転角度の最大値
//           minAzimuthAngle={-Infinity} // カメラの左右回転角度の最小値
//           maxAzimuthAngle={Infinity} // カメラの左右回転角度の最大値
//           // autoRotate // 自動回転
//         />

//         {/* ライト */}
//         <directionalLight intensity={1} position={[10, 10, 10]} castShadow />
//       </Canvas>
//     </div>
//   );
// }

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useEffect } from "react";
import {
  Euler,
  MeshStandardMaterial,
  Group,
  CylinderGeometry,
  Mesh,
  Vector3,
  DoubleSide,
} from "three";

// ルーレットモデル
function RouletteModel() {
  const [rouletteGroup, setRouletteGroup] = useState(new Group());

  useEffect(() => {
    const lunch = ["1", "2", "3", "4", "5", "6"];
    const colors = [];
    let memo = Math.random() * 360;

    for (let j = 0; j < lunch.length; j++) {
      if (lunch.length > 2 && j === lunch.length - 1) {
        const avg = (colors[0] + colors[j - 1]) / 2;
        const h: number =
          Math.abs(colors[0] - colors[j - 1]) > 180 ? avg : avg + 180;
        colors.push(h);
      } else {
        const h = (memo + 90 + Math.random() * 180) % 360;
        colors.push(h);
        memo = h;
      }
    }

    const newRouletteGroup = new Group();

    for (let i = 0; i < lunch.length; i++) {
      const rad =
        (Math.PI * 2 * i) / lunch.length + Math.PI * (1 + 2 / lunch.length);
      const geometry = new CylinderGeometry(
        10,
        10,
        2,
        32,
        1,
        false,
        -rad,
        (Math.PI * 2) / lunch.length
      );
      const material = new MeshStandardMaterial({
        color: `hsl(${colors[i]}, 90%, 70%)`,
        roughness: 0.02,
        metalness: 0.7,
        side: DoubleSide,
      });
      const circle = new Mesh(geometry, material);
      circle.position.set(0, 1, 0);
      circle.receiveShadow = true;
      newRouletteGroup.add(circle);

      // const loader = new FontLoader();
      // loader.load('/path/to/helvetiker_bold.typeface.json', (font) => {
      //   const textGeometry = new TextGeometry(lunch[i], {
      //     font: font,
      //     size: 1,
      //     height: 0.5,
      //     curveSegments: 12
      //   });
      //   const textMaterials = [
      //     new MeshStandardMaterial({ color: 0xffffff }),
      //     new MeshStandardMaterial({ color: 0xaaaaaa })
      //   ];
      //   const textMesh = new Mesh(textGeometry, textMaterials);
      //   textMesh.geometry.computeBoundingBox();
      //   const box = textMesh.geometry.boundingBox.clone();
      //   const center = box.getCenter(new Vector3());
      //   textMesh.position.set(-center.x, 0, center.z * 2);
      //   textMesh.rotation.set(-Math.PI * 0.5, 0, 0);
      //   textMesh.castShadow = true;

      //   const textGroup = new Group();
      //   textGroup.add(textMesh);

      //   const txtrad = -(Math.PI * 2 * i / lunch.length + Math.PI * 1.5 + Math.PI * 1 / lunch.length);
      //   textGroup.position.set(10 * Math.cos(txtrad), 1.5, 10 * Math.sin(-txtrad));

      //   const txtrad2 = -(Math.PI * 2 * i / lunch.length + Math.PI * 1 / lunch.length);
      //   textGroup.rotation.set(0, txtrad2, 0);

      //   newRouletteGroup.add(textGroup);
      // });
    }

    setRouletteGroup(newRouletteGroup);
  }, []);

  return <primitive object={rouletteGroup} />;
}

// グループ（複数のモデルの集合）
function GroupComponent() {
  const [rotation, setRotation] = useState(new Euler(0, 0, 0));
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinningLast, setIsSpinningLast] = useState(false);

  useFrame(() => {
    if (isSpinning === isSpinningLast) {
      if (isSpinning) {
        setRotation(
          (prevRotation) =>
            new Euler(
              prevRotation.x,
              prevRotation.y + (Math.PI * 2) / 100,
              prevRotation.z
            )
        );
      }
    } else {
      setRotation(new Euler(0, Math.random() * Math.PI * 2, 0));
      setIsSpinningLast(isSpinning);
    }
  });

  return (
    <group rotation={rotation} onClick={() => setIsSpinning(!isSpinning)}>
      <RouletteModel />
    </group>
  );
}

export default function Roulette() {
  return (
    <div className="h-56 w-56 bg-gray-300">
      <Canvas
        className="h-full w-full"
        camera={{ fov: 80, position: [0, 10, 0] }}
      >
        <GroupComponent />
        <OrbitControls
          minDistance={16}
          maxDistance={25}
          minPolarAngle={0}
          maxPolarAngle={(0.6 * Math.PI) / 2}
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
        />
        <directionalLight intensity={5} position={[10, 30, 10]} castShadow />
      </Canvas>
    </div>
  );
}
