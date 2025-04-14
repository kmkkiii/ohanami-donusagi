import { memo, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// 桜の木のポジション配列 - 木の数を10本に増やし、中央寄りに配置
const TREE_POSITIONS = [
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

// スケールを固定値に設定
const TREE_SCALE = 27; // 固定値に変更

// メモ化された桜の木コンポーネント
export const CherryTrees = memo(function CherryTrees() {
  // モデルをロード
  const { scene } = useGLTF('/models/tripo_cherry_blossom.glb');

  // 各木の回転のみ初回レンダリング時に計算し、スケールは固定
  const treesData = useMemo(() => {
    return TREE_POSITIONS.map(() => ({
      rotation: Math.random() * Math.PI * 2, // Y軸回転をランダム化
    }));
  }, []); // 空の依存配列で初回レンダリング時にのみ計算

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
          rotation={[0, treesData[index].rotation, 0]}
          scale={TREE_SCALE}
        />
      ))}
    </group>
  );
});

// モデルをプリロード
useGLTF.preload('/models/tripo_cherry_blossom.glb');
