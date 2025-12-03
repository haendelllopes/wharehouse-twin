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

  const startX = -25;
  const startZ = -25;

  // Gerar Porta-Paletes (Racks)
  for (let aisleIndex = 0; aisleIndex < numAisles; aisleIndex++) {
    let currentX;
    const isDoubleAisle = aisleIndex === 1 || aisleIndex === 3; // Corredores 2/3 e 4/5 são duplos

    if (aisleIndex === 0) { // Rua 1
      currentX = startX;
    } else if (aisleIndex === 1) { // Rua 2
      currentX = startX + rackWidth + aisleWidth;
    } else if (aisleIndex === 2) { // Rua 3 (encostado na Rua 2)
      currentX = startX + rackWidth + aisleWidth + rackWidth;
    } else if (aisleIndex === 3) { // Rua 4
      currentX = startX + rackWidth + aisleWidth + rackWidth + rackWidth + aisleWidth;
    } else if (aisleIndex === 4) { // Rua 5 (encostado na Rua 4)
      currentX = startX + rackWidth + aisleWidth + rackWidth + rackWidth + aisleWidth + rackWidth;
    } else { // Rua 6
      currentX = startX + rackWidth + aisleWidth + rackWidth + rackWidth + aisleWidth + rackWidth + rackWidth + aisleWidth;
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
  }

  // --- Configurações dos Blocados ---
  const blockWidth = 1.2;
  const blockLength = 12; // 10 paletes * 1.2m
  const blockAisle = 6;
  const blockStartZ = 15;
  const blockHeight = 1.2;

  // Gerar Blocados
  for (let row = 1; row <= 2; row++) {
      for (let quad = 1; quad <= 2; quad++) {
          const id = `B${row}-Q${quad}`;
          // Um blocado é uma coleção de posições de paletes
          for (let i = 0; i < 10; i++) {
            const palletId = `${id}-P${i+1}`;
            const isOccupied = Math.random() < 0.7;
            
            positions.push({
              id: palletId,
              code: palletId,
              type: 'FLOOR_BLOCK',
              position: [
                  -15 + (row-1) * (blockLength + blockAisle) + i * blockWidth + blockWidth / 2,
                  blockHeight / 2,
                  blockStartZ + (quad-1) * (blockWidth + 2.8)
              ],
              rotation: [0, 0, 0],
              dimensions: [blockWidth, blockHeight, blockWidth],
              occupancyPercentage: isOccupied ? 100 : 0,
              status: isOccupied ? 'NORMAL' : 'EMPTY',
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
