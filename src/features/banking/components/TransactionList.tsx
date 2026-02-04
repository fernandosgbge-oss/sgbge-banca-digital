'use client';

import { Transaction } from "@/types/banking";
import { useState } from "react";
import { generateReceipt } from "@/lib/pdf-generator";
import { useI18n } from '@/features/i18n/I18nProvider';

interface TransactionListProps {
    transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const { t, locale } = useI18n();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">{t('transactions.recent')}</h2>
                <button className="text-sm text-sg-blue font-medium hover:underline">{t('transactions.viewAll')}</button>
            </div>

            <div className="divide-y divide-gray-50">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'DEBIT' ? 'bg-red-50 text-red-500' : 'bg-green-100 text-green-500'}`}>
                                {tx.type === 'DEBIT' ? '↓' : '↑'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm group-hover:text-sg-blue transition-colors">{tx.description}</p>
                                <p className="text-gray-500 text-xs">{new Date(tx.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'es-GQ')} • {new Date(tx.date).toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'es-GQ')}</p>
                            </div>
                        </div>
                        <span className={`font-mono font-bold ${tx.type === 'DEBIT' ? 'text-red-600' : 'text-green-600'}`}>
                            {tx.type === 'DEBIT' ? '-' : '+'}{tx.amount.toLocaleString()} XAF
                        </span>
                    </div>
                ))}

                {transactions.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        {t('transactions.noRecent')}
                    </div>
                )}
            </div>

            {/* Transaction Detail Modal */}
            {selectedTx && (
                <div
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setSelectedTx(null)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-gray-50 p-6 border-b flex flex-col items-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${selectedTx.type === 'DEBIT' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                <span className="text-2xl">{selectedTx.type === 'DEBIT' ? '📤' : '📥'}</span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg text-center">{selectedTx.description}</h3>
                            <span className={`mt-2 font-mono text-2xl font-bold ${selectedTx.type === 'DEBIT' ? 'text-red-600' : 'text-green-600'}`}>
                                {selectedTx.type === 'DEBIT' ? '-' : '+'}{selectedTx.amount.toLocaleString()} XAF
                            </span>
                        </div>

                        <div className="p-6 space-y-4 text-sm">
                            <div className="flex justify-between border-b pb-3">
                                <span className="text-gray-500">{t('transactions.refId')}</span>
                                <span className="font-mono text-gray-900">{selectedTx.id}</span>
                            </div>
                            <div className="flex justify-between border-b pb-3">
                                <span className="text-gray-500">{t('transactions.date')}</span>
                                <span className="text-gray-900">{new Date(selectedTx.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'es-GQ')}</span>
                            </div>
                            <div className="flex justify-between border-b pb-3">
                                <span className="text-gray-500">{t('transactions.time')}</span>
                                <span className="text-gray-900">{new Date(selectedTx.date).toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'es-GQ')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t('transactions.status')}</span>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{t('transactions.completed')}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setSelectedTx(null)}
                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                {t('transactions.close')}
                            </button>
                            <button
                                onClick={() => generateReceipt(selectedTx)}
                                className="flex-1 py-3 bg-sg-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <span>📄</span> PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
