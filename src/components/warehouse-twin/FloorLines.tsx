'use client';

import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';

interface FloorLinesProps {
  size: number;
}

export function FloorLines({ size }: FloorLinesProps) {
  const lines = [];

  // --- Demarcações dos blocados com faixas amarelas ---
  const blockWidth = 1.2;
  const blockLength = 12; // 10 paletes * 1.2m
  const blockAisle = 6;
  const rackWidth = 1.2;
  const aisleWidth = 5.0;

  // Posição inicial, consistente com data.ts
  const startX = -25;
  const startZ = -15;
  const lastRackX = startX + (6/2-1)*(rackWidth*2 + aisleWidth) + rackWidth;
  const blockStartX = lastRackX + rackWidth + 4; // 4 metros de espaço

  // 2 ruas com 2 quadras cada
  for (let row = 1; row <= 2; row++) {
    for (let quad = 1; quad <= 2; quad++) {
      const quadX = blockStartX + (row - 1) * (blockWidth + blockAisle);
      const quadZ = startZ + (quad - 1) * (blockLength + 4); // 10 paletes de 1.2 + 4m de espaço

      const startLineX = quadX - blockWidth / 2;
      const endLineX = quadX + blockWidth / 2;
      const startLineZ = quadZ - blockWidth / 2;
      const endLineZ = quadZ + blockLength - blockWidth / 2;

      const blockLines = [
        // Retângulo amarelo
        [[startLineX, 0.01, startLineZ], [endLineX, 0.01, startLineZ]],
        [[startLineX, 0.01, endLineZ], [endLineX, 0.01, endLineZ]],
        [[startLineX, 0.01, startLineZ], [startLineX, 0.01, endLineZ]],
        [[endLineX, 0.01, startLineZ], [endLineX, 0.01, endLineZ]],
      ];
      lines.push(...blockLines);
    }
  }

  // --- Labels dos corredores ---
  const aisleLabels = [];
  const labelZ = startZ - 4; // Posição Z para os labels
  
  // Rua 1
  aisleLabels.push({ text: 'RUA 01', position: new THREE.Vector3(startX, 0.1, labelZ) });
  // Rua 2 e 3
  const aisle2X = startX + rackWidth + aisleWidth / 2;
  aisleLabels.push({ text: 'RUA 02', position: new THREE.Vector3(aisle2X, 0.1, labelZ) });
  
  const aisle3X = aisle2X + rackWidth;
  aisleLabels.push({ text: 'RUA 03', position: new THREE.Vector3(aisle3X, 0.1, labelZ) });

  // Rua 4 e 5
  const aisle4X = aisle3X + rackWidth + aisleWidth / 2;
  aisleLabels.push({ text: 'RUA 04', position: new THREE.Vector3(aisle4X, 0.1, labelZ) });
  const aisle5X = aisle4X + rackWidth;
  aisleLabels.push({ text: 'RUA 05', position: new THREE.Vector3(aisle5X, 0.1, labelZ) });

  // Rua 6
  const aisle6X = aisle5X + rackWidth + aisleWidth / 2;
  aisleLabels.push({ text: 'RUA 06', position: new THREE.Vector3(aisle6X, 0.1, labelZ) });


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
          fontSize={1.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {label.text}
        </Text>
      ))}
    </group>
  );
}
