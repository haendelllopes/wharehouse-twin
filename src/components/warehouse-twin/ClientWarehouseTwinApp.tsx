'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const WarehouseTwinApp = dynamic(
  () => import('@/components/warehouse-twin/WarehouseTwinApp'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full flex-col">
        <header className="flex h-16 items-center border-b px-4 md:px-6">
          <Skeleton className="h-6 w-48" />
          <div className="ml-auto flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
          </div>
        </header>
        <main className="flex-1 bg-background">
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">Loading 3D Scene...</p>
          </div>
        </main>
      </div>
    ),
  }
);

export default function ClientWarehouseTwinApp() {
  return <WarehouseTwinApp />;
}
