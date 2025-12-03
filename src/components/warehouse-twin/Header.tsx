'use client';

import { useWarehouseStore } from '@/store/warehouseStore';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bot, Filter } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ViewMode } from '@/lib/types';

export function Header() {
  const { isEditMode, toggleEditMode, toggleFilterSidebar, viewMode, setViewMode } = useWarehouseStore();

  return (
    <header className="flex h-16 items-center border-b px-4 md:px-6 z-20 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Warehouse Twin</h1>
      </div>
      <div className="ml-auto flex items-center gap-6">
        <RadioGroup
          defaultValue="normal"
          onValueChange={(value: ViewMode) => setViewMode(value)}
          className="flex items-center gap-4"
          value={viewMode}
        >
          <Label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <RadioGroupItem value="normal" id="view-normal" />
            Padrão
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <RadioGroupItem value="heatmap" id="view-heatmap" />
            Mapa de Calor
          </Label>
        </RadioGroup>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={toggleFilterSidebar}>
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrar</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-mode"
              checked={isEditMode}
              onCheckedChange={toggleEditMode}
            />
            <Label htmlFor="edit-mode" className="font-medium">
              Edit Mode
            </Label>
          </div>
        </div>
      </div>
    </header>
  );
}
