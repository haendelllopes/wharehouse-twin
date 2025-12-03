'use client';

import { useEffect, useState, useRef } from 'react';
import { useWarehouseStore } from '@/store/warehouseStore';
import { runAiAnalysis } from '@/app/actions';

import { Header } from './Header';
import { AiDashboard } from './AiDashboard';
import { DetailsSidebar } from './DetailsSidebar';
import { WarehouseScene } from './WarehouseScene';
import { Leva } from 'leva';

export default function WarehouseTwinApp() {
  const { positions, setAiData, setInitialData } = useWarehouseStore();
  const [loadingAi, setLoadingAi] = useState(true);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (positions.length > 0 && isInitialLoad.current) {
      isInitialLoad.current = false;
      const analyze = async () => {
        setLoadingAi(true);
        const { performanceScore, aiSuggestions } = await runAiAnalysis(positions);
        setAiData(performanceScore, aiSuggestions);
        setLoadingAi(false);
      };
      analyze();
    }
  }, [positions, setAiData]);

  // This effect will run on subsequent position changes (e.g., drag and drop)
  useEffect(() => {
    if (isInitialLoad.current) return; // Don't run on initial load

    const handler = setTimeout(() => {
      const analyze = async () => {
        setLoadingAi(true);
        const { performanceScore, aiSuggestions } = await runAiAnalysis(positions);
        setAiData(performanceScore, aiSuggestions);
        setLoadingAi(false);
      };
      analyze();
    }, 1000); // Debounce for 1 second

    return () => {
      clearTimeout(handler);
    };
  }, [positions, setAiData]);

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Leva hidden />
      <Header />
      <main className="relative flex-1">
        <WarehouseScene />
        <AiDashboard loading={loadingAi} />
      </main>
      <DetailsSidebar />
    </div>
  );
}
