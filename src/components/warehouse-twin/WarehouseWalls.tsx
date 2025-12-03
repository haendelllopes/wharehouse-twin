'use client';

import * as THREE from 'three';

interface WarehouseWallsProps {
  size: number;
  height: number;
}

const wallMaterial = new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.8, metalness: 0.2 });
const roofMaterial = new THREE.MeshStandardMaterial({ color: '#d1d5db', roughness: 0.8, metalness: 0.2, side: THREE.DoubleSide });

export function WarehouseWalls({ size, height }: WarehouseWallsProps) {
  const halfSize = size / 2;

  return (
    <group position={[0, height / 2, 0]}>
      {/* Back Wall */}
      <mesh position={[0, 0, -halfSize]} material={wallMaterial} castShadow receiveShadow>
        <boxGeometry args={[size, height, 0.2]} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[halfSize, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={wallMaterial} castShadow receiveShadow>
        <boxGeometry args={[size, height, 0.2]} />
      </mesh>

       {/* Left Wall */}
      <mesh position={[-halfSize, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial} castShadow receiveShadow>
        <boxGeometry args={[size, height, 0.2]} />
      </mesh>

      {/* Ceiling Beams */}
      <group position={[0, height / 2, 0]}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[0, 0, (i - 4.5) * (size / 10)]} rotation={[0, 0, 0]} material={roofMaterial} castShadow>
             <boxGeometry args={[size, 0.3, 0.3]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
