'use client';

import { Line } from '@react-three/drei';

interface FloorLinesProps {
  size: number;
}

export function FloorLines({ size }: FloorLinesProps) {
  const halfSize = size / 2;
  const lines = [];

  // Main aisles
  lines.push([[-halfSize + 5, 0.01, -halfSize], [-halfSize + 5, 0.01, halfSize]]);
  lines.push([[halfSize - 5, 0.01, -halfSize], [halfSize - 5, 0.01, halfSize]]);
  
  // Center aisle
  lines.push([[-halfSize, 0.01, 0], [halfSize, 0.01, 0]]);

  // Cross lines
  for (let i = -halfSize + 10; i < halfSize - 5; i += 10) {
    lines.push([[-halfSize, 0.01, i], [halfSize, 0.01, i]]);
  }

  // Floor markings
  const floorMarkings = [
    [[-3, 0.01, 15], [3, 0.01, 15]],
    [[-3, 0.01, 18], [3, 0.01, 18]],
    [[-3, 0.01, 15], [-3, 0.01, 18]],
    [[3, 0.01, 15], [3, 0.01, 18]],
  ]
  lines.push(...floorMarkings);

  return (
    <group>
      {lines.map((points, i) => (
        <Line
          key={i}
          // @ts-ignore
          points={points}
          color="white"
          lineWidth={3}
          dashed={false}
        />
      ))}
    </group>
  );
}
