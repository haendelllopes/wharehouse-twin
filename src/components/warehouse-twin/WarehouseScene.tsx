'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { useWarehouseStore } from '@/store/warehouseStore';

import { Floor } from './Floor';
import { InstancedStructure } from './InstancedStructure';
import { useControls } from 'leva';
import { useEffect } from 'react';
import { FloorLines } from './FloorLines';

const FLOOR_SIZE = 60;
const WALL_HEIGHT = 10;

export function WarehouseScene() {
  const { positions, setCanvasRef } = useWarehouseStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (canvasRef) {
      setCanvasRef(canvasRef);
    }
  }, [canvasRef, setCanvasRef]);

  const { showStats } = useControls('Scene', {
    showStats: false,
  });

  return (
    <div className="h-full w-full">
      <Canvas 
        ref={canvasRef}
        shadows 
        camera={{ position: [35, 35, 35], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={['#a0a0a0', 50, 150]} />
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[10, 20, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={80}
            shadow-camera-left={-FLOOR_SIZE/2}
            shadow-camera-right={FLOOR_SIZE/2}
            shadow-camera-top={FLOOR_SIZE/2}
            shadow-camera-bottom={-FLOOR_SIZE/2}
          />
          <OrbitControls makeDefault minDistance={10} maxDistance={100} maxPolarAngle={Math.PI / 2.1}/>

          <Floor size={FLOOR_SIZE} />
          <FloorLines size={FLOOR_SIZE} />
          
          <InstancedStructure positions={positions} />

        </Suspense>
        {showStats && <Stats />}
      </Canvas>
    </div>
  );
}
