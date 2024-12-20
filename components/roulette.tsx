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
} from "three";

const initialAngularVelocity = (Math.PI * 2 * 50) / 100;

// ルーレットモデル
function RouletteModel(props: { colors: Array<number> }) {
  const { colors } = props;
  const [rouletteGroup, setRouletteGroup] = useState(new Group());

  useEffect(() => {
    const newRouletteGroup = new Group();

    for (let i = 0; i < colors.length; i++) {
      const rad =
        (Math.PI * 2 * i) / colors.length + Math.PI * (1 + 2 / colors.length);
      const pieceGeometry = new CylinderGeometry(
        10, // 1ピースの上底の半径
        10, // 1ピースの半径
        2, // 1ピースの高さ
        32, // 1ピースの頂点数
        1,
        false,
        -rad,
        (Math.PI * 2) / colors.length
      );
      const pieceMaterial = new MeshStandardMaterial({
        color: colors[i],
        roughness: 0.1, // ざらつき
        metalness: 0.2, // 金属感
      });
      newRouletteGroup.add(new Mesh(pieceGeometry, pieceMaterial));
    }

    setRouletteGroup(newRouletteGroup);
  }, []);

  return <primitive object={rouletteGroup} />;
}

// グループ（複数のモデルの集合）
function GroupComponent(props: { colors: Array<number> }) {
  const { colors } = props;
  const [rotation, setRotation] = useState(new Euler(0, 0, 0));
  const [isSpinning, setIsSpinning] = useState(false); // 回転状態の判定
  const [isSpinningLast, setIsSpinningLast] = useState(true); // isSpinning だけでも表現はできるが、isSpinningLast を加えることで停止中の useFrame 内の計算をなしにできる
  const [rouletteNum, setRouletteNum] = useState(0); // ルーレットの出目
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
          ((rotation.y % (Math.PI * 2)) / (Math.PI * 2)) * (colors.length - 1)
        )
      );
      setIsSpinningLast(false);
    }
  });

  return (
    <group
      rotation={rotation}
      onClick={() => {
        // 静止状態のみトリガー
        if (!isSpinning && !isSpinningLast) {
          setIsSpinning(true);
          setIsSpinningLast(false);
          setRotation(new Euler(0, Math.random() * Math.PI * 2, 0));
        }
      }}
    >
      <RouletteModel colors={colors} />
    </group>
  );
}

export default function Roulette() {
  const colors = [
    0xff0000, // 赤
    0xff00ff, // ピンク
    0xbbbb00, // 黄
    0x00ff00, // 緑
    0x00bbbb, // シアン
    0x0000ff, // 青
  ];
  const [rouletteColors, setRouletteColors] = useState(colors);

  return (
    <div className="h-56 w-56 bg-gray-300">
      <Canvas
        className="h-full w-full"
        camera={{ fov: 80, position: [0, 10, 0] }}
      >
        <GroupComponent colors={rouletteColors} />
        <OrbitControls
          minDistance={16}
          maxDistance={25}
          minPolarAngle={0}
          maxPolarAngle={(0.6 * Math.PI) / 2}
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
        />
        <directionalLight intensity={4} position={[20, 50, 15]} castShadow />
      </Canvas>
    </div>
  );
}
