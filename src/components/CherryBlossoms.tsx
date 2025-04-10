import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// 花びらの数を多めに設定
const PETAL_COUNT = 750;
// アニメーションエリアの範囲を広く
const AREA_SIZE = 150;

export function CherryBlossoms() {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const [positions, rotations, speeds] = useMemo(() => {
    const pos = new Array(PETAL_COUNT).fill(0).map(
      () =>
        new THREE.Vector3(
          Math.random() * AREA_SIZE - AREA_SIZE / 2,
          Math.random() * AREA_SIZE * 0.4, // 落下開始点を少し上げる
          Math.random() * AREA_SIZE - AREA_SIZE / 2
        )
    );
    const rot = new Array(PETAL_COUNT)
      .fill(0)
      .map(
        () =>
          new THREE.Euler(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          )
      );
    const spd = new Array(PETAL_COUNT).fill(0).map(() => ({
      fall: 0.1 + Math.random() * 0.2, // ゆっくりとした落下速度
      rotate: 0.01 + Math.random() * 0.02,
    }));
    return [pos, rot, spd];
  }, []);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load('/models/Cherry blossom petals.fbx', (fbx) => {
      const mesh = meshRef.current;
      if (!mesh) return;

      // FBXからメッシュを取得
      const petal = fbx.children[0] as THREE.Mesh;
      if (petal.geometry) {
        // スケールを小さく設定
        const scaledGeometry = petal.geometry.clone().scale(0.3, 0.3, 0.3);
        mesh.geometry = scaledGeometry;

        // 薄いピンク色のマテリアルを作成
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#ffcce6'), // 薄いピンク
          emissive: new THREE.Color('#ff99cc'), // 発光効果で明るく
          emissiveIntensity: 0.2,
          metalness: 0.1,
          roughness: 0.8,
          side: THREE.DoubleSide,
        });
        mesh.material = material;
      }
    });
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const matrix = new THREE.Matrix4();
    positions.forEach((pos, i) => {
      // 落下アニメーション
      pos.y -= speeds[i].fall * delta * 2;

      // 風による揺れの効果
      pos.x += Math.sin(Date.now() * 0.001 + i) * 0.01;
      pos.z += Math.cos(Date.now() * 0.001 + i) * 0.01;

      // 画面外に出たら上部にリセット
      if (pos.y < -AREA_SIZE / 2) {
        pos.y = AREA_SIZE + AREA_SIZE / 2;
        pos.x = Math.random() * AREA_SIZE - AREA_SIZE / 2;
        pos.z = Math.random() * AREA_SIZE - AREA_SIZE / 2;
      }

      // 回転アニメーション
      rotations[i].x += speeds[i].rotate;
      rotations[i].y += speeds[i].rotate;

      // 行列を更新
      matrix.makeRotationFromEuler(rotations[i]);
      matrix.setPosition(pos);
      mesh.setMatrixAt(i, matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PETAL_COUNT]} />
  );
}
