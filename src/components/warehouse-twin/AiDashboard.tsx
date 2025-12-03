'use client';

import { useWarehouseStore } from '@/store/warehouseStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Loader2 } from 'lucide-react';
import { exportToPdf, exportToXlsx } from '@/lib/reports';
import { useToast } from '@/hooks/use-toast';

interface AiDashboardProps {
  loading: boolean;
}

export function AiDashboard({ loading }: AiDashboardProps) {
  const { performanceScore, aiSuggestions, positions, canvasRef } = useWarehouseStore();
  const { toast } = useToast();

  const handleExportPdf = () => {
    if (!canvasRef?.current) {
      toast({
        variant: 'destructive',
        title: 'Export Error',
        description: '3D scene not ready for capture. Please wait a moment and try again.',
      });
      return;
    }
    exportToPdf(performanceScore, aiSuggestions, positions, canvasRef.current);
    toast({
      title: 'Export Successful',
      description: 'PDF report has been downloaded.',
    });
  };

  const handleExportXlsx = () => {
    exportToXlsx(positions);
    toast({
      title: 'Export Successful',
      description: 'Excel data has been downloaded.',
    });
  };

  return (
    <Card className="absolute top-4 left-4 z-10 w-full max-w-sm bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          AI Performance Insights
          {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        </CardTitle>
        <CardDescription>
          Score: <span className="font-bold text-accent">{performanceScore.toFixed(1)}</span> / 100
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm font-medium text-foreground">Suggestions</p>
        <ScrollArea className="h-40 rounded-md border p-2">
          {aiSuggestions.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {aiSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  {suggestion}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No suggestions available.</p>
          )}
        </ScrollArea>
        <Separator className="my-4" />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleExportXlsx}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="default" size="sm" onClick={handleExportPdf}>
            <FileText className="mr-2 h-4 w-4" />
            PDF Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
