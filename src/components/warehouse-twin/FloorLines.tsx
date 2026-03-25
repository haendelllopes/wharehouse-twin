'use client';

import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * @fileOverview Desenha as linhas de demarcação no piso do armazém.
 * Utiliza as mesmas constantes matemáticas do arquivo src/lib/data.ts para garantir alinhamento perfeito.
 */

export function FloorLines({ size }: { size: number }) {
  const linePoints: [number, number, number][][] = [];

  // --- CONSTANTES IDÊNTICAS AO data.ts ---
  const startX = -20;
  const startZ = -15;
  const rackWidth = 1.2;
  const aisleWidth = 5.0;
  
  const blockPalletWidth = 1.2;
  const blockPalletDepth = 1.2;
  const blockAisle = 6.0;
  const palletsPerQuad = 10;
  const spaceBetweenQuads = 4.0;

  // Cálculo do X inicial do bloco baseado na Rua 6 de racks
  // Rua 1: -20, Rua 2: -18.8, Rua 3: -13.8, Rua 4: -12.6, Rua 5: -7.6, Rua 6: -6.4
  const lastRackX = -6.4; 
  const blockStartX = lastRackX + rackWidth + aisleWidth; // -0.2

  // --- GERAÇÃO DAS LINHAS DE DEMARCAÇÃO (BLOCOS) ---
  for (let row = 1; row <= 2; row++) {
    for (let quad = 1; quad <= 2; quad++) {
      // X central da quadra
      const quadStartXPos = blockStartX + (row - 1) * (blockPalletWidth + blockAisle);

      // Z central do primeiro e último palete da quadra (10 paletes)
      const firstPalletZ = startZ + (quad - 1) * (palletsPerQuad * blockPalletDepth + spaceBetweenQuads);
      const lastPalletZ = firstPalletZ + (palletsPerQuad - 1) * blockPalletDepth;
      
      // Limites reais da área (considerando metade da profundidade do palete para fora do centro)
      const minX = quadStartXPos - blockPalletWidth / 2;
      const maxX = quadStartXPos + blockPalletWidth / 2;
      const minZ = firstPalletZ - blockPalletDepth / 2;
      const maxZ = lastPalletZ + blockPalletDepth / 2;
      
      const y = 0.02; // Levemente acima do chão para evitar z-fighting

      // Desenha o retângulo da quadra
      linePoints.push(
        [[minX, y, minZ], [maxX, y, minZ]], // Topo
        [[minX, y, maxZ], [maxX, y, maxZ]], // Fundo
        [[minX, y, minZ], [minX, y, maxZ]], // Esquerda
        [[maxX, y, minZ], [maxX, y, maxZ]]  // Direita
      );
    }
  }

  // --- LABELS DAS RUAS ---
  const labels = [
    { text: 'RUA 01/02', x: startX + rackWidth + aisleWidth / 2 },
    { text: 'RUA 03/04', x: startX + 3 * rackWidth + 1.5 * aisleWidth }, // Ajustado visualmente
    { text: 'RUA 05/06', x: startX + 5 * rackWidth + 2.5 * aisleWidth },
  ];

  return (
    <group>
      {linePoints.map((points, i) => (
        <Line
          key={`block-line-${i}`}
          points={points as [number, number, number][]}
          color="#facc15" // Amarelo vibrante
          lineWidth={2.5}
          dashed={false}
        />
      ))}
      {labels.map((label, i) => (
         <Text
          key={`label-${i}`}
          position={[label.x, 0.1, startZ - 3]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={1.2}
          color="#374151"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ekwfodd8.woff"
          anchorX="center"
          anchorY="middle"
        >
          {label.text}
        </Text>
      ))}
    </group>
  );
}
