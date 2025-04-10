import { Suspense, useState, memo } from 'react';
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

// モデルとSpeechBubbleを分離してmemoで最適化
const DonusagiModelMemo = memo(function DonusagiModel() {
  const { scene } = useGLTF('/models/tripo_donusagi.glb');
  return <primitive object={scene} scale={1} position={[0, -1, 0]} />;
});

// SpeechBubbleを独立したコンポーネントとして定義
function MessageBubble({ message }: { message: string }) {
  return <SpeechBubble message={message} />;
}

function App() {
  // メッセージとタイムスタンプを組み合わせて状態を管理
  const [messageState, setMessageState] = useState<{
    text: string;
    timestamp: number;
  }>({
    text: '',
    timestamp: 0,
  });

  // どんうさぎの返答バリエーション
  const responses = [
    'この桜、マジで綺麗だな！',
    '今日も天気いいぜ！花見日和だな',
    'お花見ってのは最高だよな、まったく！',
    '春が来たな！待ちくたびれたぜ',
    '桜の季節は短いから楽しまないと損だぞ！',
    'おい、一緒にお花見できて悪くないな',
    'お団子食いてぇな。腹減ったぜ！',
    '花びらが風に舞ってる、これぞ春って奴だな！',
    'おうよ！花見酒でも飲むか？',
    'まかせな！俺が最高の花見スポット教えてやるよ',
  ];

  const handleSendMessage = (_text: string) => {
    console.log('送信されたメッセージ:', _text);

    // ランダムな返答を選択
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    // タイムスタンプを更新してコンポーネントを確実に再レンダリング
    setMessageState({
      text: randomResponse,
      timestamp: Date.now(),
    });
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
          <group>
            <DonusagiModelMemo />
            <MessageBubble
              message={messageState.text}
              key={messageState.timestamp}
            />
          </group>
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
