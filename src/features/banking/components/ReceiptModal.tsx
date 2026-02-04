'use client';

import { generateReceipt } from '@/lib/pdf-generator';

interface ReceiptData {
    id: string;
    amount: number;
    fees: number;
    date: string;
    destination: string;
}

interface ReceiptModalProps {
    data: ReceiptData | null;
    onClose: () => void;
}

export const ReceiptModal = ({ data, onClose }: ReceiptModalProps) => {
    if (!data) return null;

    const handleDownload = () => {
        generateReceipt({
            id: data.id,
            date: data.date,
            description: `Transferencia a ${data.destination}`,
            amount: data.amount,
            fees: data.fees,
            destination: data.destination
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header OK */}
                <div className="bg-green-500 p-8 flex flex-col items-center justify-center text-white">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl text-green-500">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold">¡Operación Exitosa!</h2>
                    <p className="opacity-90 mt-1 text-sm">Transferencia Completada</p>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Referencia</span>
                        <span className="font-mono text-gray-900">{data.id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Monto Enviado</span>
                        <span className="font-bold text-gray-900">{data.amount.toLocaleString()} XAF</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Comisiones + IVA</span>
                        <span className="text-red-500 text-sm">{data.fees.toLocaleString()} XAF</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-gray-500">Destino</span>
                        <span className="font-medium text-gray-900">{data.destination}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 py-3 bg-sg-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        <span>📥</span> Descargar PDF
                    </button>
                </div>
            </div>
        </div>
    );
};
