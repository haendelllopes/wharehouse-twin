'use client';

interface FloorProps {
  size: number;
}

export function Floor({ size }: FloorProps) {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[size, size]} />
      <shadowMaterial opacity={0.3} />
    </mesh>
  );
}
