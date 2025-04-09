import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  Environment,
  GizmoHelper,
  GizmoViewport,
} from '@react-three/drei';
import { CherryBlossoms } from './components/CherryBlossoms';
import { ChatInput } from './components/ChatInput';
import { SpeechBubble } from './components/SpeechBubble';
import './App.css';

function DonusagiModel({ message }: { message: string }) {
  const { scene } = useGLTF('/models/tripo_donusagi.glb');
  return (
    <group>
      <primitive object={scene} scale={1} position={[0, -1, 0]} />
      <SpeechBubble message={message} />
    </group>
  );
}

function App() {
  const [message, setMessage] = useState('');

  const handleSendMessage = (_text: string) => {
    console.log('送信されたメッセージ:', _text);
    // 固定の返答を設定
    setMessage('桜が綺麗だな');
  };

  return (
    <div className="app">
      <div className="info">
        <h1>どんうさぎとお花見</h1>
        <p>マウスでドラッグして回転 | スクロールでズーム</p>
      </div>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <color attach="background" args={['#f0f0f0']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <Suspense fallback={null}>
          <DonusagiModel message={message} />
          <Environment preset="city" />
          <CherryBlossoms />
        </Suspense>

        <OrbitControls />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>
      </Canvas>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;
