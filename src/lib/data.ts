import type { WarehousePosition, StatusType } from './types';

// Helper para criar uma data no passado
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

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

  const startX = -20;
  const startZ = -15;

  // Gerar Porta-Paletes (Racks)
  for (let aisleIndex = 0; aisleIndex < numAisles; aisleIndex++) {
    let currentX;
    
    if (aisleIndex === 0) { // Rua 1
      currentX = startX;
    } else if (aisleIndex % 2 !== 0) { // Início de um par (costas com a anterior)
      currentX = positions[positions.length - numCols * numLevels].position[0] + rackWidth;
    } else { // Início de um novo corredor
      currentX = positions[positions.length - numCols * numLevels].position[0] + aisleWidth;
    }
    
    for (let col = 0; col < numCols; col++) {
      for (let level = 0; level < numLevels; level++) {
        const streetNum = aisleIndex + 1;
        const colNum = col + 1;
        const levelNum = level + 1;
        const id = `R${String(streetNum).padStart(2, '0')}-C${String(colNum).padStart(2, '0')}-L${levelNum}`;
        
        let status: StatusType = 'EMPTY';
        let lastUpdated = daysAgo(1);
        let items = [];

        // Cenário 1: Item danificado (ALERT)
        if (id === 'R01-C01-L5' || id === 'R02-C05-L3') {
          status = 'ALERT';
        }
        // Cenário 2: Corredor parcialmente bloqueado (BLOCKED)
        else if (streetNum === 3 && colNum >= 3 && colNum <= 5) {
          status = 'BLOCKED';
          lastUpdated = daysAgo(0);
        }
        // Cenário 3: Itens de baixo giro (ALERT)
        else if (id === 'R06-C09-L1' || id === 'R06-C10-L1') {
          status = 'ALERT';
          lastUpdated = daysAgo(120); // Item parado há 4 meses
        }
        // Cenário 4: Ocupação normal
        else if (level < 3 && col < 8 && streetNum < 5) {
            status = 'NORMAL';
            lastUpdated = daysAgo(Math.floor(Math.random() * 30));
        }
        // Outros permanecem vazios

        const isOccupied = status !== 'EMPTY';
        
        positions.push({
          id,
          code: id,
          type: 'RACK',
          position: [
            currentX,
            level * rackHeight + rackHeight / 2,
            startZ + col * rackDepth,
          ],
          rotation: [0, 0, 0],
          dimensions: [rackWidth, rackHeight, rackDepth],
          occupancyPercentage: isOccupied ? 100 : 0,
          status: status,
          items: isOccupied ? [{ sku: `SKU-${id}`, description: 'Item em palete', quantity: 1, lpn: `LPN-${id}` }] : [],
          lastUpdated: lastUpdated,
        });
      }
    }
  }

  // --- Configurações dos Blocados ---
  const blockPalletWidth = 1.2;
  const blockPalletHeight = 1.2;
  const blockPalletDepth = 1.2;
  const blockAisle = 6.0;

  const lastRackX = positions[positions.length - 1].position[0];
  const blockStartX = lastRackX + aisleWidth;

  // Gerar Blocados - 2 ruas com 2 quadras cada
  for (let row = 1; row <= 2; row++) {
    for (let quad = 1; quad <= 2; quad++) {
      const quadStartX = blockStartX + (row - 1) * (blockPalletWidth + blockAisle);
      
      for (let i = 0; i < 10; i++) {
        const palletId = `B${row}Q${quad}-P${i + 1}`;
        
        let status: StatusType = 'NORMAL';
        let lastUpdated = daysAgo(Math.floor(Math.random() * 15));

        // Cenário 5: Palete blocado danificado
        if (palletId === 'B01Q01-P05') {
            status = 'ALERT';
            lastUpdated = daysAgo(2);
        } else if (palletId.startsWith('B02Q02')) { // Quadra de um produto específico
            status = 'NORMAL';
        } else if (i > 6) { // Deixar alguns blocados vazios
            status = 'EMPTY';
        }

        const isOccupied = status !== 'EMPTY';
        
        positions.push({
          id: palletId,
          code: palletId,
          type: 'FLOOR_BLOCK',
          position: [
            quadStartX,
            blockPalletHeight / 2,
            startZ + (quad-1)*(blockPalletDepth*10 + 4) + i * blockPalletDepth,
          ],
          rotation: [0, 0, 0],
          dimensions: [blockPalletWidth, blockPalletHeight, blockPalletDepth],
          occupancyPercentage: isOccupied ? 100 : 0,
          status: status,
          items: isOccupied ? [{
            sku: `SKU-${palletId}`,
            description: 'Palete blocado',
            quantity: 1,
            lpn: `LPN-${palletId}`
          }] : [],
          lastUpdated: lastUpdated,
        });
      }
    }
  }

  return positions;
}

export const initialWarehouseData: WarehousePosition[] = generateWarehouseData();
