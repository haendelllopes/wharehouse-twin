'use client';

import { useState } from 'react';
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
import { Download, FileText, Loader2, Bot, X, Lightbulb } from 'lucide-react';
import { exportToPdf, exportToXlsx } from '@/lib/reports';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';

interface AiDashboardProps {
  loading: boolean;
}

export function AiDashboard({ loading }: AiDashboardProps) {
  const { performanceScore, aiSuggestions, positions, canvasRef } = useWarehouseStore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleExportPdf = () => {
    if (!canvasRef?.current) {
      toast({
        variant: 'destructive',
        title: 'Erro de Exportação',
        description: 'A cena 3D não está pronta para captura. Aguarde um momento e tente novamente.',
      });
      return;
    }
    exportToPdf(performanceScore, aiSuggestions, positions, canvasRef.current);
    toast({
      title: 'Exportação Concluída',
      description: 'O relatório em PDF foi baixado.',
    });
  };

  const handleExportXlsx = () => {
    exportToXlsx(positions);
    toast({
      title: 'Exportação Concluída',
      description: 'Os dados do Excel foram baixados.',
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 z-10 h-12 w-12 rounded-full shadow-lg"
        >
          <Bot className="h-6 w-6 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-md bg-card">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Insights de Performance da IA
            {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          </SheetTitle>
          <SheetDescription>
            Pontuação de Eficiência: <span className="font-bold text-accent">{performanceScore.toFixed(1)}</span> / 100
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Lightbulb className="mr-2 h-5 w-5 text-accent" />
                Sugestões de Otimização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72">
                {aiSuggestions.length > 0 && !loading ? (
                  <ul className="space-y-4 text-sm">
                    {aiSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 block h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="pt-4 text-center text-sm text-muted-foreground">
                    {loading ? 'Analisando dados do armazém...' : 'Nenhuma sugestão disponível no momento.'}
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <Separator className="my-4" />
        <SheetFooter className="sm:justify-end gap-2">
           <Button variant="outline" size="sm" onClick={handleExportXlsx}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          <Button variant="default" size="sm" onClick={handleExportPdf}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório PDF
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
