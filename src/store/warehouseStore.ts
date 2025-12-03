import { create } from 'zustand';
import type { WarehouseState, WarehousePosition, Filters, ViewMode } from '@/lib/types';
import { initialWarehouseData } from '@/lib/data';

const filterPositions = (positions: WarehousePosition[], filters: Filters): WarehousePosition[] => {
  const { sku, code, lpn } = filters;
  if (!sku && !code && !lpn) {
    return positions;
  }

  return positions.filter(position => {
    const codeMatch = code ? position.code.toLowerCase().includes(code.toLowerCase()) : true;
    
    if (position.items.length === 0) {
      return codeMatch && !sku && !lpn;
    }

    const skuMatch = sku ? position.items.some(item => item.sku.toLowerCase().includes(sku.toLowerCase())) : true;
    const lpnMatch = lpn ? position.items.some(item => item.lpn?.toLowerCase().includes(lpn.toLowerCase())) : true;
    
    return codeMatch && skuMatch && lpnMatch;
  });
};

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
  positions: [],
  filteredPositions: [],
  isEditMode: false,
  selectedPositionId: null,
  performanceScore: 0,
  aiSuggestions: [],
  canvasRef: null,
  filters: { sku: '', code: '', lpn: '' },
  isFilterSidebarOpen: false,
  viewMode: 'normal',

  setInitialData: (positions) => set({ 
    positions, 
    filteredPositions: positions 
  }),
  
  toggleEditMode: () => set(state => {
    if (state.isEditMode) {
      return { isEditMode: false, selectedPositionId: null };
    }
    return { isEditMode: !state.isEditMode };
  }),
  
  selectPosition: (id) => set({ selectedPositionId: id }),

  updatePositionCoordinates: (id, newPos) => {
    set(state => {
      const updatedPositions = state.positions.map(p => 
        p.id === id ? { ...p, position: newPos, lastUpdated: new Date().toISOString() } : p
      );
      return {
        positions: updatedPositions,
        filteredPositions: filterPositions(updatedPositions, get().filters),
      };
    });
  },
  
  setAiData: (score, suggestions) => set({
    performanceScore: score,
    aiSuggestions: suggestions
  }),

  setCanvasRef: (ref) => set({ canvasRef: ref }),
  
  setFilters: (newFilters: Partial<Filters>) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredPositions = filterPositions(state.positions, updatedFilters);
      return { filters: updatedFilters, filteredPositions };
    });
  },

  toggleFilterSidebar: () => set(state => ({ isFilterSidebarOpen: !state.isFilterSidebarOpen })),
  
  setViewMode: (mode) => set({ viewMode: mode }),
}));

useWarehouseStore.getState().setInitialData(initialWarehouseData);
