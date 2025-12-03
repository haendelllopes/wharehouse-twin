import type { WarehousePosition } from './types';

function generateWarehouseData(): WarehousePosition[] {
  const positions: WarehousePosition[] = [];
  const aisleWidth = 5.5;
  const rackDepth = 1.2;
  const rackWidth = 1.2;
  const rackHeight = 1.2;
  const numAisles = 6;
  const numCols = 10;
  const numLevels = 5;

  const startX = -25;
  const startZ = -15;

  // Generate Racks (Porta Paletes)
  for (let aisle = 1; aisle <= numAisles; aisle++) {
    let aisleStartX = startX + (aisle - 1) * (rackWidth + aisleWidth);
    if (aisle > 2) aisleStartX -= aisleWidth - rackDepth * 2;
    if (aisle > 4) aisleStartX -= aisleWidth - rackDepth * 2;

    for (let col = 1; col <= numCols; col++) {
      for (let level = 1; level <= numLevels; level++) {
        // Rack on the left side of the aisle
        if (aisle % 2 !== 0 || aisle === 1) {
          const id = `R${String(aisle).padStart(2, '0')}-${String(col).padStart(2, '0')}-${level}`;
          const occupancy = Math.random() * 100;
          positions.push({
            id: `rack-left-${id}`,
            code: `P-${id}`,
            type: 'RACK',
            position: [
              aisleStartX - rackDepth / 2,
              (level - 1) * rackHeight + rackHeight / 2,
              startZ + (col - 1) * rackWidth + rackWidth/2,
            ],
            rotation: [0, 0, 0],
            dimensions: [rackDepth, rackHeight, rackWidth],
            occupancyPercentage: occupancy,
            status: occupancy > 95 ? 'ALERT' : occupancy < 5 ? 'EMPTY' : 'NORMAL',
            items: occupancy < 5 ? [] : [{ sku: `SKU-${id}-L`, description: 'Item em palete', quantity: 1, lpn: `LPN-${id}-L` }],
            lastUpdated: new Date().toISOString(),
          });
        }

        // Rack on the right side of the aisle
        if (aisle % 2 === 0 || aisle === numAisles) {
          let rightAisleX = aisleStartX + aisleWidth + rackDepth;
           if (aisle === 2 || aisle === 4) rightAisleX = aisleStartX + rackDepth;

          const id = `R${String(aisle + 1).padStart(2, '0')}-${String(col).padStart(2, '0')}-${level}`;
           positions.push({
            id: `rack-right-${id}`,
            code: `P-${id}`,
            type: 'RACK',
            position: [
              rightAisleX - rackDepth / 2,
              (level - 1) * rackHeight + rackHeight / 2,
              startZ + (col-1) * rackWidth + rackWidth/2,
            ],
            rotation: [0, 0, 0],
            dimensions: [rackDepth, rackHeight, rackWidth],
            occupancyPercentage: 70,
            status: 'NORMAL',
            items: [{ sku: `SKU-${id}-R`, description: 'Item em palete', quantity: 1, lpn: `LPN-${id}-R` }],
            lastUpdated: new Date().toISOString(),
          });
        }
      }
    }
  }

  // Generate Floor Blocks (Blocados)
  const blockWidth = 1.2;
  const blockLength = 12; // 10 pallets * 1.2m
  const blockAisle = 6;
  const blockStartZ = startZ + numCols * rackWidth + 10;

  for (let row = 1; row <= 2; row++) {
      for (let quad = 1; quad <= 2; quad++) {
          const id = `B${row}-Q${quad}`;
          const occupancy = Math.random() * 100;
          positions.push({
            id: `floor-${id}`,
            code: id,
            type: 'FLOOR_BLOCK',
            position: [
                -15 + (row-1) * (blockLength + blockAisle) + blockLength / 2,
                0.1,
                blockStartZ + (quad-1) * (blockWidth + 2)
            ],
            rotation: [0, Math.PI / 2, 0],
            dimensions: [blockLength, 0.2, blockWidth],
            occupancyPercentage: occupancy,
            status: occupancy > 98 ? 'BLOCKED' : 'NORMAL',
            items: Array.from({length: Math.floor(occupancy / 10)}).map((_, i) => ({
                sku: `SKU-B-${id}-${i}`,
                description: 'Palete blocado',
                quantity: 1,
                lpn: `LPN-B-${id}-${i}`
            })),
            lastUpdated: new Date().toISOString(),
          });
      }
  }

  return positions;
}


export const initialWarehouseData: WarehousePosition[] = generateWarehouseData();
