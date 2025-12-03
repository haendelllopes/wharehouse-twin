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

const FLOOR_SIZE = 45;

export function WarehouseScene() {
  const { filteredPositions, setCanvasRef } = useWarehouseStore();
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
        camera={{ position: [0, 45, 45], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={['#a0a0a0', 70, 150]} />
          <ambientLight intensity={1.5} />
          <directionalLight
            position={[10, 30, 20]}
            intensity={2.5}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={100}
            shadow-camera-left={-FLOOR_SIZE/2}
            shadow-camera-right={FLOOR_SIZE/2}
            shadow-camera-top={FLOOR_SIZE/2}
            shadow-camera-bottom={-FLOOR_SIZE/2}
          />
          <OrbitControls makeDefault minDistance={10} maxDistance={100} maxPolarAngle={Math.PI / 2.1} enableDamping={false} />

          <Floor size={FLOOR_SIZE} />
          <FloorLines size={FLOOR_SIZE} />
          
          <InstancedStructure positions={filteredPositions} />

        </Suspense>
        {showStats && <Stats />}
      </Canvas>
    </div>
  );
}
