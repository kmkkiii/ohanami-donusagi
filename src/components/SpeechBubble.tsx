import { Text, Billboard } from '@react-three/drei';
import { useEffect, useState } from 'react';

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
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000); // 5秒後に非表示
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible || !displayMessage) return null;

  return (
    <group position={[0, 2, 0]}>
      {' '}
      {/* 高さ調整 */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        {' '}
        {/* カメラに向ける */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.4, 0.8]} />
          <meshBasicMaterial color="white" opacity={0.8} transparent />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {displayMessage}
        </Text>
      </Billboard>
    </group>
  );
}
