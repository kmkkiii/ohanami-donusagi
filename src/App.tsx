import { Suspense, useState, memo, useTransition } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  Environment,
  GizmoHelper,
  GizmoViewport,
  PerspectiveCamera,
} from '@react-three/drei';
import { CherryBlossoms } from './components/CherryBlossoms';
import { CherryTrees } from './components/CherryTrees';
import { ChatInput } from './components/ChatInput';
import { SpeechBubble } from './components/SpeechBubble';
import './App.css';

// モデルとSpeechBubbleを分離してmemoで最適化
const DonusagiModelMemo = memo(function DonusagiModel() {
  const { scene } = useGLTF('/models/tripo_donusagi.glb');
  return <primitive object={scene} scale={1} />;
});

// SpeechBubbleをメモ化して再レンダリングを最適化
const MessageBubbleMemo = memo(function MessageBubble({
  message,
}: {
  message: string;
}) {
  return <SpeechBubble message={message} />;
});

function App() {
  // メッセージとタイムスタンプを組み合わせて状態を管理
  const [messageState, setMessageState] = useState<{
    text: string;
    timestamp: number;
  }>({
    text: '',
    timestamp: 0,
  });

  // useTransitionを使って状態更新を優先度の低い更新として扱う
  const [, startTransition] = useTransition();

  // どんうさぎの返答バリエーション
  const responses = [
    'この桜 マジで綺麗だな！',
    '今日も天気いいぜ！花見日和だな',
    'お花見ってのは最高だよな、まったく！',
    '春が来たな！待ちくたびれたぜ',
    '桜の季節は短いから楽しまないと損だぞ！',
    'お団子食いてぇな。腹減ったぜ！',
    '花びらが風に舞ってる。これぞ春って奴だな！',
    'おうよ！花見酒でも飲むか？',
    'まかせな！俺が最高の花見スポット教えてやるよ',
  ];

  const handleSendMessage = (_text: string) => {
    console.log('送信されたメッセージ:', _text);

    // ランダムな返答を選択
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    // 状態更新を優先度の低い更新として扱うことで、
    // メイン処理の中断を避ける
    startTransition(() => {
      setMessageState({
        text: randomResponse,
        timestamp: Date.now(),
      });
    });
  };

  return (
    <div className="app">
      <div className="info">
        <h1>どんうさぎとお花見</h1>
        <p>マウスでドラッグして回転 | スクロールでズーム</p>
      </div>
      <Canvas>
        {/* カメラを追加して前から少し上から見下ろすアングルに設定 */}
        <PerspectiveCamera makeDefault position={[6, 8, -35]} fov={30} />

        {/* 3Dモデルと吹き出しを別々のSuspenseでラップして再レンダリングの影響を分離 */}
        <group>
          <Suspense fallback={null}>
            <DonusagiModelMemo />
          </Suspense>

          <Suspense fallback={null}>
            <MessageBubbleMemo
              message={messageState.text}
              key={messageState.timestamp}
            />
          </Suspense>
        </group>

        <Suspense fallback={null}>
          <Environment
            preset="park"
            ground={{
              height: 10,
              radius: 60,
              scale: 500,
            }}
          />
          <CherryBlossoms />
          <CherryTrees />
        </Suspense>

        <OrbitControls target={[-1, 5, 0]} />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>
      </Canvas>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;
