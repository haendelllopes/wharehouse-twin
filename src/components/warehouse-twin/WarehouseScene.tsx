'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stats } from '@react-three/drei';
import { useWarehouseStore } from '@/store/warehouseStore';

import { Floor } from './Floor';
import { Structure } from './Structure';
import { useControls } from 'leva';
import { useEffect } from 'react';

const FLOOR_SIZE = 50;

export function WarehouseScene() {
  const { positions, setCanvasRef } = useWarehouseStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (canvasRef) {
      setCanvasRef(canvasRef);
    }
  }, [canvasRef, setCanvasRef]);

  const { showGrid, showStats } = useControls('Scene', {
    showGrid: true,
    showStats: false,
  });

  return (
    <div className="h-full w-full">
      <Canvas 
        ref={canvasRef}
        shadows 
        camera={{ position: [0, 25, 25], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <directionalLight
            position={[10, 20, 5]}
            intensity={2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <OrbitControls makeDefault />
          {showGrid && (
            <Grid
              position={[0, -0.01, 0]}
              infiniteGrid
              fadeDistance={50}
              fadeStrength={5}
              cellSize={1}
              sectionSize={5}
              sectionColor={'#1E3A8A'}
              cellColor={'#60a5fa'}
              sectionThickness={1.5}
            />
          )}

          <Floor size={FLOOR_SIZE} />
          
          {positions.map(pos => (
            <Structure key={pos.id} positionData={pos} floorSize={FLOOR_SIZE} />
          ))}

        </Suspense>
        {showStats && <Stats />}
      </Canvas>
    </div>
  );
}
