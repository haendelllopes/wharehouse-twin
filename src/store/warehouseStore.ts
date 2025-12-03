import { create } from 'zustand';
import type { WarehouseState, WarehousePosition } from '@/lib/types';
import { initialWarehouseData } from '@/lib/data';

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
  positions: [],
  isEditMode: false,
  selectedPositionId: null,
  performanceScore: 0,
  aiSuggestions: [],
  canvasRef: null,

  setInitialData: (positions) => set({ positions }),
  
  toggleEditMode: () => set(state => {
    if (state.isEditMode) {
      // when turning off edit mode, deselect any position
      return { isEditMode: false, selectedPositionId: null };
    }
    return { isEditMode: !state.isEditMode };
  }),
  
  selectPosition: (id) => set({ selectedPositionId: id }),

  updatePositionCoordinates: (id, newPos) => {
    set(state => ({
      positions: state.positions.map(p => 
        p.id === id ? { ...p, position: newPos, lastUpdated: new Date().toISOString() } : p
      ),
    }));
  },
  
  setAiData: (score, suggestions) => set({
    performanceScore: score,
    aiSuggestions: suggestions
  }),

  setCanvasRef: (ref) => set({ canvasRef: ref }),
}));

useWarehouseStore.getState().setInitialData(initialWarehouseData);
