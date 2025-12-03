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
  const { positions, setAiData } = useWarehouseStore();
  const [loadingAi, setLoadingAi] = useState(true);

  useEffect(() => {
    if (positions.length > 0) {
      const analyze = async () => {
        setLoadingAi(true);
        try {
          const { performanceScore, aiSuggestions } = await runAiAnalysis(positions);
          setAiData(performanceScore, aiSuggestions);
        } catch (error) {
            console.error("Failed to run AI analysis", error);
            setAiData(0, ["Error analyzing data."]);
        } finally {
            setLoadingAi(false);
        }
      };
      analyze();
    }
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
