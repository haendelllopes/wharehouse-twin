'use client';

import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';

interface FloorLinesProps {
  size: number;
}

export function FloorLines({ size }: FloorLinesProps) {
  const linePoints: [number, number, number][][] = [];

  // --- CONFIGURAÇÕES DE LAYOUT (DEVEM SER IDÊNTICAS A data.ts) ---
  const rackWidth = 1.2;
  const aisleWidth = 5.0;
  const startX = -20;
  const startZ = -15;

  const blockPalletWidth = 1.2;
  const blockPalletDepth = 1.2;
  const blockAisle = 6.0;
  const palletsPerQuad = 10;
  const spaceBetweenQuads = 4.0; // Espaço entre os blocos de 10 paletes

  // --- CÁLCULO DA POSIÇÃO INICIAL DOS BLOCOS (IDÊNTICO A data.ts) ---
  const lastRackX = startX + 3 * rackWidth + 2 * aisleWidth + rackWidth; // Posição X final do último rack
  const blockStartX = lastRackX + aisleWidth;

  // --- DEMARCAÇÕES DOS BLOCOS ---
  for (let row = 1; row <= 2; row++) {
    for (let quad = 1; quad <= 2; quad++) {
      // Posição X do início da rua de blocados
      const quadStartXPos = blockStartX + (row - 1) * (blockPalletWidth + blockAisle);

      // Comprimento total da área de uma quadra (10 paletes)
      const blockLength = palletsPerQuad * blockPalletDepth;

      // Posição Z inicial da quadra
      const quadStartZ = startZ + (quad - 1) * (blockLength + spaceBetweenQuads);
      
      // Calcula os cantos da área
      const startLineX = quadStartXPos - blockPalletWidth / 2;
      const endLineX = quadStartXPos + blockPalletWidth / 2;
      const startLineZ = quadStartZ - blockPalletDepth / 2;
      const endLineZ = quadStartZ + blockLength - blockPalletDepth / 2;
      
      const blockLines = [
        [[startLineX, 0.01, startLineZ], [endLineX, 0.01, startLineZ]], // Topo
        [[startLineX, 0.01, endLineZ], [endLineX, 0.01, endLineZ]],     // Fundo
        [[startLineX, 0.01, startLineZ], [startLineX, 0.01, endLineZ]], // Esquerda
        [[endLineX, 0.01, startLineZ], [endLineX, 0.01, endLineZ]],     // Direita
      ];
      linePoints.push(...blockLines);
    }
  }

  // --- LABELS DOS CORREDORES ---
  const aisleLabels = [];
  const labelZ = startZ - 2; // Posição Z para os labels
  
  // Posição central de cada rua de racks para os labels
  const aisle1X = startX + rackWidth + aisleWidth / 2;
  aisleLabels.push({ text: 'RUA 01/02', position: new THREE.Vector3(aisle1X, 0.1, labelZ) });

  const aisle2X = aisle1X + rackWidth + aisleWidth;
  aisleLabels.push({ text: 'RUA 03/04', position: new THREE.Vector3(aisle2X, 0.1, labelZ) });
  
  const aisle3X = aisle2X + rackWidth + aisleWidth;
  aisleLabels.push({ text: 'RUA 05/06', position: new THREE.Vector3(aisle3X, 0.1, labelZ) });


  return (
    <group>
      {linePoints.map((points, i) => (
        <Line
          key={`line-${i}`}
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
