export type StructureType = 'RACK' | 'FLOOR_BLOCK';
export type StatusType = 'NORMAL' | 'ALERT' | 'EMPTY' | 'BLOCKED';

export interface InventoryItem {
  sku: string;
  description: string;
  quantity: number;
  lpn?: string; // License Plate Number
}

export interface WarehousePosition {
  id: string;
  code: string; // Ex: "Rua-A-01-1"
  type: StructureType;
  
  // Coordenadas 3D no mundo
  position: [number, number, number]; 
  rotation: [number, number, number];
  dimensions: [number, number, number]; // [width, height, depth]
  
  // Dados de Negócio
  occupancyPercentage: number; // 0 a 100+
  status: StatusType;
  items: InventoryItem[];
  
  // Metadados
  lastUpdated: string;
}

export interface WarehouseState {
  positions: WarehousePosition[];
  isEditMode: boolean;
  selectedPositionId: string | null;
  performanceScore: number;
  aiSuggestions: string[];
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  
  // Actions
  setInitialData: (positions: WarehousePosition[]) => void;
  toggleEditMode: () => void;
  selectPosition: (id: string | null) => void;
  updatePositionCoordinates: (id: string, newPos: [number, number, number]) => void;
  setAiData: (score: number, suggestions: string[]) => void;
  setCanvasRef: (ref: React.RefObject<HTMLCanvasElement>) => void;
}
