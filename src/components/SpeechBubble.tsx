import { Text, Billboard, RoundedBox } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { DoubleSide } from 'three';

interface SpeechBubbleProps {
  message: string;
}

export function SpeechBubble({ message }: SpeechBubbleProps) {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setVisible(true);
      // タイマーを長くして確認しやすくする
      const timer = setTimeout(() => {
        setVisible(false);
      }, 10000); // 10秒後に非表示に変更
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 表示条件
  if (!visible || !displayMessage) return null;

  return (
    <group position={[0, 8, 0]}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        {/* 角丸の吹き出し */}
        <RoundedBox args={[8.0, 1.1, 0.1]} radius={0.2} smoothness={4}>
          <meshBasicMaterial
            color="white"
            opacity={0.9}
            transparent
            side={DoubleSide}
          />
        </RoundedBox>

        {/* 吹き出しの尖った部分（三角形） */}
        <mesh position={[0, -0.75, 0]} rotation={[0, 0, Math.PI]}>
          <cylinderGeometry args={[0, 0.2, 0.4, 3, 1]} />
          <meshBasicMaterial color="white" opacity={0.9} transparent />
        </mesh>

        {/* テキスト */}
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.32}
          color="black"
          anchorX="center"
          anchorY="middle"
          maxWidth={4.6}
          textAlign="center"
        >
          {displayMessage}
        </Text>
      </Billboard>
    </group>
  );
}
