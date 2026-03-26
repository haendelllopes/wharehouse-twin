'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useWarehouseStore } from '@/store/warehouseStore';
import { runAiAnalysis } from '@/app/actions';

import { Header } from './Header';
import { AiDashboard } from './AiDashboard';
import { DetailsSidebar } from './DetailsSidebar';
import { WarehouseScene } from './WarehouseScene';
import { Leva } from 'leva';
import { FilterSidebar } from './FilterSidebar';

export default function WarehouseTwinApp() {
  const { positions, setAiData } = useWarehouseStore();
  const [loadingAi, setLoadingAi] = useState(true);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (positions.length > 0 && !hasRunRef.current) {
      hasRunRef.current = true;
      const analyze = async () => {
        setLoadingAi(true);
        try {
          const result = await runAiAnalysis(positions);
          if (result) {
            const { performanceScore, aiSuggestions } = result;
            setAiData(performanceScore, aiSuggestions);
          } else {
            throw new Error("AI analysis returned undefined");
          }
        } catch (error) {
          console.error("Failed to run AI analysis", error);
          setAiData(0, ["Erro ao analisar os dados por limite de cota da IA. Consulte o console."]);
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
      <FilterSidebar />
    </div>
  );
}
