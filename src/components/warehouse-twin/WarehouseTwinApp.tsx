'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useWarehouseStore } from '@/store/warehouseStore';
import { runAiAnalysis } from '@/app/actions';
import { initialWarehouseData } from '@/lib/data';

import { Header } from './Header';
import { AiDashboard } from './AiDashboard';
import { DetailsSidebar } from './DetailsSidebar';
import { WarehouseScene } from './WarehouseScene';
import { Leva } from 'leva';
import { FilterSidebar } from './FilterSidebar';

export default function WarehouseTwinApp() {
  const { positions, setAiData, setInitialData } = useWarehouseStore();
  const [loadingAi, setLoadingAi] = useState(true);
  const isInitialDataLoaded = useRef(false);

  useEffect(() => {
    if (!isInitialDataLoaded.current) {
      setInitialData(initialWarehouseData);
      isInitialDataLoaded.current = true;
    }
  }, [setInitialData]);

  const memoizedPositions = useMemo(() => positions, [positions]);

  useEffect(() => {
    if (memoizedPositions.length > 0) {
      const analyze = async () => {
        setLoadingAi(true);
        try {
          const { performanceScore, aiSuggestions } = await runAiAnalysis(memoizedPositions);
          setAiData(performanceScore, aiSuggestions);
        } catch (error) {
            console.error("Failed to run AI analysis", error);
            setAiData(0, ["Erro ao analisar os dados."]);
        } finally {
            setLoadingAi(false);
        }
      };
      analyze();
    }
  }, [memoizedPositions, setAiData]);


  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Leva hidden />
      <Header />
      <main className="relative flex-1">
        <WarehouseScene />
        <AiDashboard loading={loadingAi} />
      </main>
      <DetailsSidebar />
      <FilterSidebar />
    </div>
  );
}
