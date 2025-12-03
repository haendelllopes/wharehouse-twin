'use client';

import { useWarehouseStore } from '@/store/warehouseStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';

export function FilterSidebar() {
  const { isFilterSidebarOpen, toggleFilterSidebar, filters, setFilters } = useWarehouseStore();

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters({ [filterName]: value });
  };
  
  const clearFilters = () => {
    setFilters({ sku: '', code: '', lpn: '' });
  };

  return (
    <Sheet open={isFilterSidebarOpen} onOpenChange={toggleFilterSidebar}>
      <SheetContent className="w-full sm:max-w-xs p-0">
          <SheetHeader className="p-6">
            <SheetTitle>Filtrar Visualização</SheetTitle>
            <SheetDescription>
              Encontre posições específicas no armazém. Os resultados aparecerão destacados na cena 3D.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 p-6">
            <div className="grid gap-2">
              <Label htmlFor="filter-sku">Produto (SKU)</Label>
              <Input 
                id="filter-sku" 
                placeholder="Digite o SKU do produto"
                value={filters.sku}
                onChange={(e) => handleFilterChange('sku', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-code">Endereço</Label>
              <Input 
                id="filter-code" 
                placeholder="Ex: R01-C01-L1"
                value={filters.code}
                onChange={(e) => handleFilterChange('code', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-lpn">LPN (Palete)</Label>
              <Input 
                id="filter-lpn" 
                placeholder="Digite o LPN"
                value={filters.lpn}
                onChange={(e) => handleFilterChange('lpn', e.target.value)}
              />
            </div>
          </div>
          <SheetFooter className="p-6 pt-0">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Limpar Filtros
            </Button>
          </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
