import type { WarehousePosition } from './types';

function generateWarehouseData(): WarehousePosition[] {
  const positions: WarehousePosition[] = [];
  
  // --- Configurações dos Porta-Paletes ---
  const rackDepth = 1.2;
  const rackWidth = 1.2;
  const rackHeight = 1.2;
  const numAisles = 6;
  const numCols = 10;
  const numLevels = 5;
  const aisleWidth = 5.0; // Espaço entre as estruturas

  const startX = -30;
  const startZ = -25;
  let lastX = startX;

  // Gerar Porta-Paletes (Racks)
  for (let aisleIndex = 0; aisleIndex < numAisles; aisleIndex++) {
    let currentX;
    
    // Rua 1 (simples)
    if (aisleIndex === 0) {
      currentX = startX;
      lastX = currentX;
    } 
    // Rua 2 e 3 (duplas)
    else if (aisleIndex === 1) {
      currentX = lastX + rackWidth + aisleWidth;
    } else if (aisleIndex === 2) {
      currentX = lastX + rackWidth + aisleWidth + rackWidth;
      lastX = currentX;
    }
    // Rua 4 e 5 (duplas)
    else if (aisleIndex === 3) {
      currentX = lastX + rackWidth + aisleWidth;
    } else if (aisleIndex === 4) {
      currentX = lastX + rackWidth + aisleWidth + rackWidth;
      lastX = currentX;
    }
    // Rua 6 (simples)
    else {
      currentX = lastX + rackWidth + aisleWidth;
    }
    
    for (let col = 0; col < numCols; col++) {
      for (let level = 0; level < numLevels; level++) {
        const isOccupied = Math.random() < 0.7; // 70% de ocupação
        const streetNum = aisleIndex + 1;
        const colNum = col + 1;
        const levelNum = level + 1;
        const id = `R${String(streetNum).padStart(2, '0')}-C${String(colNum).padStart(2, '0')}-L${levelNum}`;
        
        positions.push({
          id,
          code: id,
          type: 'RACK',
          position: [
            currentX,
            level * rackHeight + rackHeight / 2,
            startZ + col * rackDepth + rackDepth / 2,
          ],
          rotation: [0, 0, 0],
          dimensions: [rackWidth, rackHeight, rackDepth],
          occupancyPercentage: isOccupied ? 100 : 0,
          status: isOccupied ? (Math.random() < 0.05 ? 'ALERT' : 'NORMAL') : 'EMPTY',
          items: isOccupied ? [{ sku: `SKU-${id}`, description: 'Item em palete', quantity: 1, lpn: `LPN-${id}` }] : [],
          lastUpdated: new Date().toISOString(),
        });
      }
    }
     if (aisleIndex === 0 || aisleIndex === 2 || aisleIndex === 4) {
        lastX = currentX;
    }
  }

  // --- Configurações dos Blocados ---
  const blockPalletWidth = 1.2;
  const blockPalletHeight = 1.2;
  const blockStartX = lastX + rackWidth + aisleWidth; // Começa depois da última rua de racks
  const blockStartZ = startZ;
  const blockAisle = 2.8;

  // Gerar Blocados
  for (let row = 1; row <= 2; row++) {
      for (let quad = 1; quad <= 2; quad++) {
          const id = `B${row}-Q${quad}`;
          const quadStartX = blockStartX + (row - 1) * (blockPalletWidth * 5 + aisleWidth);
          const quadStartZ = blockStartZ + (quad-1) * (blockPalletWidth * 1.2 + blockAisle);

          // Um blocado é uma coleção de posições de paletes
          for (let i = 0; i < 10; i++) {
            const palletId = `${id}-P${i+1}`;
            const isOccupied = Math.random() < 0.7;
            
            positions.push({
              id: palletId,
              code: palletId,
              type: 'FLOOR_BLOCK',
              position: [
                  quadStartX + i * blockPalletWidth,
                  blockPalletHeight / 2,
                  quadStartZ
              ],
              rotation: [0, 0, 0],
              dimensions: [blockPalletWidth, blockPalletHeight, blockPalletWidth],
              occupancyPercentage: isOccupied ? 100 : 0,
              status: isOccupied ? (Math.random() < 0.02 ? 'ALERT' : 'NORMAL') : 'EMPTY',
              items: isOccupied ? [{
                  sku: `SKU-${palletId}`,
                  description: 'Palete blocado',
                  quantity: 1,
                  lpn: `LPN-${palletId}`
              }] : [],
              lastUpdated: new Date().toISOString(),
            });
          }
      }
  }

  return positions;
}

export const initialWarehouseData: WarehousePosition[] = generateWarehouseData();
