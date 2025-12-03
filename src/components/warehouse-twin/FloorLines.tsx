'use client';

import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';

interface FloorLinesProps {
  size: number;
}

export function FloorLines({ size }: FloorLinesProps) {
  const halfSize = size / 2;
  const lines = [];

  // Demarcações dos blocados com faixas amarelas
  const blockWidth = 1.2;
  const blockLength = 12; // 10 paletes * 1.2m
  const blockAisle = 6;
  const blockStartZ = 15;

  for (let row = 1; row <= 2; row++) {
    for (let quad = 1; quad <= 2; quad++) {
      const startX = -15 + (row - 1) * (blockLength + blockAisle);
      const startZ = blockStartZ + (quad - 1) * (blockWidth + 2.8);
      const endX = startX + blockLength;
      const endZ = startZ + blockWidth;

      const blockLines = [
        // Retângulo amarelo
        [[startX, 0.01, startZ], [endX, 0.01, startZ]],
        [[startX, 0.01, endZ], [endX, 0.01, endZ]],
        [[startX, 0.01, startZ], [startX, 0.01, endZ]],
        [[endX, 0.01, startZ], [endX, 0.01, endZ]],
      ];
      lines.push(...blockLines);
    }
  }

  // Labels dos corredores
  const aisleLabels = [];
  const aisleWidth = 1.2 + 5; // rack + aisle space
  const startX = -25;
  const startZ = -25;
  
  // Aisle 1
  aisleLabels.push({ text: 'RUA 01', position: new THREE.Vector3(startX - 1.5, 0.1, startZ - 2) });
  // Aisle 2 & 3
  const aisle2_3_X = startX + aisleWidth + 1.2;
  aisleLabels.push({ text: 'RUA 02', position: new THREE.Vector3(aisle2_3_X - 3, 0.1, startZ - 2) });
  aisleLabels.push({ text: 'RUA 03', position: new THREE.Vector3(aisle2_3_X + 3, 0.1, startZ - 2) });
  // Aisle 4 & 5
  const aisle4_5_X = aisle2_3_X + 1.2 + aisleWidth;
  aisleLabels.push({ text: 'RUA 04', position: new THREE.Vector3(aisle4_5_X - 3, 0.1, startZ - 2) });
  aisleLabels.push({ text: 'RUA 05', position: new THREE.Vector3(aisle4_5_X + 3, 0.1, startZ - 2) });
  // Aisle 6
  const aisle6_X = aisle4_5_X + 1.2 + aisleWidth;
  aisleLabels.push({ text: 'RUA 06', position: new THREE.Vector3(aisle6_X, 0.1, startZ - 2) });

  return (
    <group>
      {lines.map((points, i) => (
        <Line
          key={`line-${i}`}
          // @ts-ignore
          points={points}
          color="yellow"
          lineWidth={3}
          dashed={false}
        />
      ))}
      {aisleLabels.map((label, i) => (
         <Text
          key={`label-${i}`}
          position={label.position}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={1.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label.text}
        </Text>
      ))}
    </group>
  );
}
