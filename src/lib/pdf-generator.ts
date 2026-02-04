import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '@/types/banking';

export const generateReceipt = (transaction: any) => {
    const doc = new jsPDF();
    const currency = 'currency' in transaction ? transaction.currency : 'XAF';
    const amount = Number(transaction.amount);

    // --- Branding Colors ---
    const BRAND_BLUE = '#10218B';
    const BRAND_RED = '#FF350F';

    // --- Header ---
    // Logo Placement (Placeholder Rectangle if image not available, or simple text logo)
    doc.setFillColor(BRAND_BLUE);
    doc.rect(0, 0, 210, 40, 'F'); // Blue Header Background

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SGBGE", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Comprobante de Operación", 20, 30);

    // Red Line
    doc.setDrawColor(BRAND_RED);
    doc.setLineWidth(1.5);
    doc.line(0, 41, 210, 41);

    // --- Content Details ---
    const startY = 60;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Detalles de la Transacción", 20, startY - 10);

    const tableData = [
        ["Referencia", transaction.id],
        ["Fecha", new Date(transaction.date).toLocaleString('es-GQ')],
        ["Descripción", transaction.description],
        ...(transaction.destination ? [["Beneficiario", transaction.destination]] : []),
        ["Monto", new Intl.NumberFormat('es-GQ', { style: 'currency', currency: currency || 'XAF' }).format(amount)],
        ...(transaction.fees ? [["Comisiones", new Intl.NumberFormat('es-GQ', { style: 'currency', currency: currency || 'XAF' }).format(transaction.fees)]] : []),
        ["Estado", "EXITOSO"]
    ];

    autoTable(doc, {
        startY: startY,
        head: [['Concepto', 'Detalle']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: BRAND_BLUE, textColor: 255 },
        styles: { fontSize: 11, cellPadding: 5 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 },
        }
    });

    // --- Footer ---
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Este documento es un comprobante electrónico emitido por SGBGE conforme a la normativa vigente.", 105, pageHeight - 20, { align: "center" });
    doc.text("Société Générale de Banques en Guinée Equatoriale", 105, pageHeight - 15, { align: "center" });

    // --- Save ---
    doc.save(`SGBGE_Recibo_${transaction.id}.pdf`);
};

export const generateStatement = (card: any, transactions: any[], period?: string) => {
    const doc = new jsPDF();
    const BRAND_BLUE = '#10218B';

    // Header
    doc.setFillColor(BRAND_BLUE);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SGBGE", 20, 20);
    doc.setFontSize(14);
    doc.text("Extracto de Tarjeta", 20, 32);

    // Card Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Tarjeta: **** **** **** ${card.last4}`, 20, 60);
    doc.text(`Titular: ${card.holder}`, 20, 68);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-GQ')}`, 140, 60);

    // Transactions Table
    const tableData = transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        new Intl.NumberFormat('es-GQ', { style: 'currency', currency: 'XAF' }).format(t.amount)
    ]);

    autoTable(doc, {
        startY: 80,
        head: [['Fecha', 'Descripción', 'Monto']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: BRAND_BLUE },
    });

    doc.save(`Extracto_SGBGE_${card.last4}.pdf`);
};
