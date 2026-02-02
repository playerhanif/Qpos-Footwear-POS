import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';

interface StockHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export const StockHistoryModal: React.FC<StockHistoryModalProps> = ({ isOpen, onClose, product }) => {
    const { stockLogs } = useProducts();

    const logs = useMemo(() => {
        if (!stockLogs) return [];
        return stockLogs
            .filter(log => log.productId === product.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [stockLogs, product.id]);

    if (!isOpen) return null;

    const getReasonColor = (reason: string) => {
        switch (reason) {
            case 'SALE': return 'bg-blue-100 text-blue-800';
            case 'RESTOCK': return 'bg-green-100 text-green-800';
            case 'DAMAGE': return 'bg-red-100 text-red-800';
            case 'THEFT': return 'bg-red-100 text-red-800';
            case 'RETURN': return 'bg-yellow-100 text-yellow-800';
            case 'CORRECTION': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getVariantName = (variantId: number) => {
        const v = product.variants?.find(v => v.id === variantId);
        return v ? `UK ${v.sizeUk} - ${v.color}` : 'Unknown Variant';
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Stock History</h2>
                                <p className="text-sm text-gray-500">{product.name}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-0">
                        {logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <FileText size={48} className="mb-4 opacity-20" />
                                <p>No history found for this product.</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Date & Time</th>
                                        <th className="px-6 py-3 font-medium">Variant</th>
                                        <th className="px-6 py-3 font-medium">Change</th>
                                        <th className="px-6 py-3 font-medium">Reason</th>
                                        <th className="px-6 py-3 font-medium">Note</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {new Date(log.timestamp).toLocaleDateString()}
                                                <div className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {getVariantName(log.variantId)}
                                            </td>
                                            <td className={`px-6 py-4 font-bold ${log.changeAmount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                <div className="flex items-center">
                                                    {log.changeAmount > 0 ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                                                    {Math.abs(log.changeAmount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getReasonColor(log.reason)}`}>
                                                    {log.reason}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={log.note}>
                                                {log.note || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
