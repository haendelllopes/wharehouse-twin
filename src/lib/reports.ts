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
    doc.text('Warehouse Performance Report', 14, 22);

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
    doc.text(`Performance Score: ${performanceScore.toFixed(1)} / 100`, 14, contentStartY);

    doc.setFontSize(14);
    doc.text('AI-Generated Insights:', 14, contentStartY + 10);
    
    autoTable(doc, {
        startY: contentStartY + 15,
        head: [['Suggestions']],
        body: aiSuggestions.map(s => [s]),
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138] }, // #1E3A8A
    });

    doc.addPage();
    doc.text('Current Warehouse Layout Data', 14, 22);

    autoTable(doc, {
        startY: 30,
        head: [['ID', 'Code', 'Type', 'Occupancy (%)', 'Status']],
        body: positions.map(p => [p.id, p.code, p.type, p.occupancyPercentage, p.status]),
        theme: 'grid',
    });

    doc.save('warehouse_report.pdf');
};

export const exportToXlsx = (positions: WarehousePosition[]) => {
    const flattenedData = positions.flatMap(p => 
        p.items.length > 0 
        ? p.items.map(item => ({
            positionId: p.id,
            positionCode: p.code,
            positionType: p.type,
            occupancy: p.occupancyPercentage,
            status: p.status,
            sku: item.sku,
            description: item.description,
            quantity: item.quantity,
            lpn: item.lpn || 'N/A',
        }))
        : [{
            positionId: p.id,
            positionCode: p.code,
            positionType: p.type,
            occupancy: p.occupancyPercentage,
            status: p.status,
            sku: 'N/A',
            description: 'EMPTY',
            quantity: 0,
            lpn: 'N/A',
        }]
    );

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Warehouse Data');
    XLSX.writeFile(workbook, 'warehouse_data.xlsx');
};
