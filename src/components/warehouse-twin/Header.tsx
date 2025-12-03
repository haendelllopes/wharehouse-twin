'use client';

import { useWarehouseStore } from '@/store/warehouseStore';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bot } from 'lucide-react';

export function Header() {
  const { isEditMode, toggleEditMode } = useWarehouseStore();

  return (
    <header className="flex h-16 items-center border-b px-4 md:px-6 z-20 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Warehouse Twin</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
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
    </header>
  );
}
