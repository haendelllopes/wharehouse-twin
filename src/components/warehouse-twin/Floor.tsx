'use client';

import * as THREE from 'three';

interface FloorProps {
  size: number;
}

export function Floor({ size }: FloorProps) {
  return (
    <>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.1} roughness={0.7} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  );
}
