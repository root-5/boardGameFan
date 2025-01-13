"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { Euler } from "three";

type user = {
  name: string;
  color: string;
};

// 初期角速度
const initialAngularVelocity = (Math.PI * 2 * 50) / 100;

// ルーレット盤
function RouletteModel(props: { users: Array<user> }) {
  const { users } = props;

  return (
    <group>
      {users.map((user, i) => {
        const rad =
          (Math.PI * 2 * i) / users.length + Math.PI * (1 + 2 / users.length);
        return (
          <mesh key={i} position={[0, 0, 0]}>
            <cylinderGeometry
              args={[
                10, // 1ピースの上面の半径
                10, // 1ピースの下面の半径
                2, // 1ピースの高さ
                32, // 1ピースの頂点数
                1,
                false,
                -rad, // 1ピースの開始角度
                (Math.PI * 2) / users.length, // 1ピースの角度
              ]}
            />
            <meshStandardMaterial
              color={user.color}
              roughness={0.1} // ざらつき
              metalness={0.2} // 金属感
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ルーレット全体
function GroupComponent(props: {
  users: Array<user>;
  rouletteNum: number;
  setRouletteNum: (num: number) => void;
}) {
  const { users, rouletteNum, setRouletteNum } = props;
  const [rotation, setRotation] = useState(new Euler(0, 1 * Math.PI, 0));
  const [isSpinning, setIsSpinning] = useState(false); // 回転状態の判定
  const [isSpinningLast, setIsSpinningLast] = useState(true); // isSpinning だけでも表現はできるが、isSpinningLast を加えることで停止中の useFrame 内の計算をなしにできる
  const [angularVelocity, setAngularVelocity] = useState(
    // 角速度
    initialAngularVelocity
  );

  useFrame(() => {
    if (isSpinning && !isSpinningLast) {
      // ======================================
      // 回転中の処理
      // ======================================
      if (angularVelocity != 0) {
        // 次フレームの角速度の計算
        setAngularVelocity((prevAngularVelocity) => {
          if (prevAngularVelocity > 0) {
            return (
              prevAngularVelocity - // 現在の速度
              prevAngularVelocity * 0.015 -
              (Math.PI * 2 * 0.001) / 100
            );
          } else {
            return 0;
          }
        });
        // 計算した角速度をもとに次フレームの回転角を設定
        setRotation(
          (prevRotation) =>
            new Euler(
              prevRotation.x,
              prevRotation.y + angularVelocity,
              prevRotation.z
            )
        );
      } else {
        // 角速度が 0 に収束した際は静止への移行状態をステートへ反映
        setIsSpinning(false);
        setIsSpinningLast(true);
      }
    } else if (!isSpinning && isSpinningLast) {
      // ======================================
      // 静止への移行処理
      // ======================================
      setAngularVelocity(initialAngularVelocity);
      setRouletteNum(
        Math.round(
          // (((回転角 + π<判定場所を手前側にずらすため>) % 2π) / 2π) * (色数 - 1)
          (((rotation.y + Math.PI) % (Math.PI * 2)) / (Math.PI * 2)) *
            (users.length - 1)
        )
      );
      setIsSpinningLast(false);
    }
  });

  return (
    <>
      {/* ルーレット全体 */}
      <group
        rotation={rotation}
        onClick={() => {
          // 静止状態のみトリガー
          if (!isSpinning && !isSpinningLast) {
            setRotation(new Euler(0, Math.random() * Math.PI * 2, 0));
            setIsSpinning(true);
            setIsSpinningLast(false);
          }
        }}
      >
        {/* 色判定用センターパーツ */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[5, 5, 0.5, 32]} />
          <meshStandardMaterial
            color={isSpinning ? 0xffffff : users[rouletteNum].color}
            roughness={0.4} // ざらつき
            metalness={0.1} // 金属感
          />
        </mesh>

        {/* 持ち手パーツ */}
        <mesh position={[0, 3.25, 0]}>
          <cylinderGeometry args={[2.5, 4.5, 3.5, 8]} />
          <meshStandardMaterial
            color={0xffffff}
            roughness={0.4} // ざらつき
            metalness={0.1} // 金属感
            // wireframe={true}
          />
        </mesh>

        {/* ルーレット本体 */}
        <RouletteModel users={users} />
      </group>
    </>
  );
}

export default function Roulette(props: {
  zoomRatio: number;
  players: Array<user>;
}) {
  const { zoomRatio, players } = props;

  const [rouletteNum, setRouletteNum] = useState(0);

  return (
    <>
      {/* 名前表示 */}
      <div className="absolute z-10 block top-3 right-1/2 translate-x-1/2 px-2 w-fit text-center text-2xl font-bold bg-opacity-80">
        {players[rouletteNum].name}
      </div>
      {/* ルーレット3D描画 */}
      <Canvas
        className="h-full w-full"
        camera={{ fov: 80, position: [10, 3, 0] }}
        style={{ background: "transparent", zoom: 1 / zoomRatio }}
      >
        <GroupComponent
          users={players}
          rouletteNum={rouletteNum}
          setRouletteNum={setRouletteNum}
        />
        <OrbitControls
          minDistance={16}
          maxDistance={25}
          minPolarAngle={0}
          maxPolarAngle={(0.6 * Math.PI) / 2}
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
        />
        <ambientLight intensity={0.8} />
        <directionalLight intensity={2.5} position={[20, 50, -25]} castShadow />
        <directionalLight intensity={1.5} position={[20, 20, 55]} castShadow />
      </Canvas>
    </>
  );
}
