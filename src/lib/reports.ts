import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { WarehousePosition } from './types';

export const exportToPdf = (
    performanceScore: number,
    aiSuggestions: string[],
    positions: WarehousePosition[],
    canvas: HTMLCanvasElement | null
) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Relatório de Desempenho do Armazém', 14, 22);

    if (canvas) {
        try {
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 14, 30, 180, 100);
        } catch (e) {
            console.error("Could not add canvas image to PDF", e);
        }
    }

    const contentStartY = canvas ? 140 : 30;

    doc.setFontSize(16);
    doc.text(`Pontuação de Desempenho: ${performanceScore.toFixed(1)} / 100`, 14, contentStartY);

    doc.setFontSize(14);
    doc.text('Sugestões da IA:', 14, contentStartY + 10);
    
    autoTable(doc, {
        startY: contentStartY + 15,
        head: [['Sugestões']],
        body: aiSuggestions.map(s => [s]),
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138] }, // #1E3A8A
    });

    doc.addPage();
    doc.text('Dados de Layout do Armazém', 14, 22);

    autoTable(doc, {
        startY: 30,
        head: [['ID', 'Código', 'Tipo', 'Ocupação (%)', 'Status']],
        body: positions.map(p => [p.id, p.code, p.type, p.occupancyPercentage.toFixed(1), p.status]),
        theme: 'grid',
    });

    doc.save('relatorio_armazem.pdf');
};

export const exportToXlsx = (positions: WarehousePosition[]) => {
    const flattenedData = positions.flatMap(p => 
        p.items.length > 0 
        ? p.items.map(item => ({
            'ID Posição': p.id,
            'Código Posição': p.code,
            'Tipo Posição': p.type,
            'Ocupação (%)': p.occupancyPercentage,
            'Status': p.status,
            'SKU': item.sku,
            'Descrição': item.description,
            'Quantidade': item.quantity,
            'LPN': item.lpn || 'N/A',
        }))
        : [{
            'ID Posição': p.id,
            'Código Posição': p.code,
            'Tipo Posição': p.type,
            'Ocupação (%)': p.occupancyPercentage,
            'Status': p.status,
            'SKU': 'N/A',
            'Descrição': 'VAZIO',
            'Quantidade': 0,
            'LPN': 'N/A',
        }]
    );

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados do Armazém');
    XLSX.writeFile(workbook, 'dados_armazem.xlsx');
};
