import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Loader } from '@react-three/drei';
import GameScene from './game/GameScene';
import UIOverlay from './components/UIOverlay';
import GameStateProvider, { useGame } from './game/GameStateProvider';

function App() {
    return (
        <GameStateProvider>
            <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
                <Canvas shadows camera={{ position: [0, 8, 5], fov: 50 }}>
                    <color attach="background" args={['#252525']} />
                    <Suspense fallback={null}>
                        <Experience />
                    </Suspense>
                </Canvas>
                <Loader />
                <UIOverlay />
            </div>
        </GameStateProvider>
    );
}

function Experience() {
    const { isBoardRotated } = useGame();

    return (
        <>
            <Environment preset="studio" blur={1} />
            <ambientLight intensity={1.2} />
            <pointLight position={[0, 15, 0]} intensity={0.3} castShadow />
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
            <group rotation={[0, isBoardRotated ? Math.PI : 0, 0]}>
                <GameScene />
            </group>
        </>
    );
}

export default App;
