import { memo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// 桜の木のポジション配列 - 木の数を10本に増やし、中央寄りに配置
const TREE_POSITIONS = [
  // より中央寄りに配置し、Y座標を15に設定して地面に接地するように
  [40, 13, 25], // どんうさぎの右側
  [-30, 13, 30], // どんうさぎの左側
  [25, 13, -35], // どんうさぎの後ろ右
  [-25, 13, -30], // どんうさぎの後ろ左
  [0, 13, -40], // どんうさぎの真後ろ

  [45, 13, -10], // 右側
  [-40, 13, -15], // 左側
  [20, 13, 40], // 手前右
  [-20, 13, 35], // 手前左
  [0, 13, 45], // 真正面
];

// 各木のスケールとY軸回転をランダム化するための関数
// スケールをさらに2倍に増加（約24〜30倍）
const getRandomScale = () => 24 + Math.random() * 6; // 基本値24〜30の範囲
const getRandomRotation = () => Math.random() * Math.PI * 2;

// メモ化された桜の木コンポーネント
export const CherryTrees = memo(function CherryTrees() {
  // モデルをロード
  const { scene } = useGLTF('/models/tripo_cherry_blossom.glb');

  useEffect(() => {
    // モデルマテリアルの設定があれば行う
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // 影を有効化
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group>
      {TREE_POSITIONS.map((position, index) => (
        <primitive
          key={index}
          object={scene.clone()}
          position={position}
          rotation={[0, getRandomRotation(), 0]}
          scale={getRandomScale()}
        />
      ))}
    </group>
  );
});

// モデルをプリロード
useGLTF.preload('/models/tripo_cherry_blossom.glb');
