'use client';

import { useWarehouseStore } from '@/store/warehouseStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusType } from '@/lib/types';
import { format } from 'date-fns';

export function DetailsSidebar() {
  const { positions, selectedPositionId, selectPosition } = useWarehouseStore();
  
  const selectedPosition = positions.find(p => p.id === selectedPositionId);

  const statusColors: Record<StatusType, string> = {
    NORMAL: 'bg-blue-500',
    ALERT: 'bg-red-500',
    EMPTY: 'bg-gray-500',
    BLOCKED: 'bg-yellow-500 text-black',
  };

  return (
    <Sheet open={!!selectedPositionId} onOpenChange={() => selectPosition(null)}>
      <SheetContent className="w-full sm:max-w-md p-0">
        {selectedPosition && (
          <ScrollArea className="h-full">
            <div className="p-6">
              <SheetHeader>
                <SheetTitle className="text-2xl">{selectedPosition.code}</SheetTitle>
                <SheetDescription>
                  Details for position ID: {selectedPosition.id}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge variant="default" className={statusColors[selectedPosition.status]}>
                    {selectedPosition.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                  <p className="text-foreground">{selectedPosition.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Occupancy</h3>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-accent">{selectedPosition.occupancyPercentage.toFixed(1)}%</p>
                    <div className="h-2 w-full rounded-full bg-muted">
                        <div 
                            className="h-2 rounded-full bg-accent" 
                            style={{ width: `${Math.min(selectedPosition.occupancyPercentage, 100)}%` }}
                        />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p className="text-foreground">
                    {format(new Date(selectedPosition.lastUpdated), 'PPP p')}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 text-lg font-semibold">Inventory Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>LPN</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPosition.items.length > 0 ? (
                        selectedPosition.items.map(item => (
                          <TableRow key={item.sku}>
                            <TableCell className="font-medium">{item.sku}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.lpn || 'N/A'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No items in this location.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
