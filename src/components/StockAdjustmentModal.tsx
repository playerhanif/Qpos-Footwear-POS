import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useProducts } from '../hooks/useProducts';
import type { StockChangeReason } from '../contexts/ProductContext';
import type { Product } from '../types';

interface StockAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    variantId?: number; // Optional if specific variant selected
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({ isOpen, onClose, product, variantId }) => {
    const { adjustStock } = useProducts();
    const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState<StockChangeReason>('RESTOCK');
    const [note, setNote] = useState('');
    const [selectedVariantId, setSelectedVariantId] = useState<number>(variantId || (product.variants && product.variants.length > 0 ? product.variants[0].id : 0));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const qty = parseInt(quantity);
        if (isNaN(qty) || qty <= 0) return;

        const changeAmount = adjustmentType === 'add' ? qty : -qty;

        adjustStock(product.id, selectedVariantId, changeAmount, reason, note);
        onClose();

        // Reset form
        setQuantity('');
        setNote('');
        setReason('RESTOCK');
    };

    if (!isOpen) return null;

    const currentVariant = product.variants?.find(v => v.id === selectedVariantId);

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
                    className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-900">Adjust Stock</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                            <h3 className="font-semibold text-blue-900">{product.name}</h3>
                            {currentVariant && <p className="text-sm text-blue-700">Variant: UK {currentVariant.sizeUk} / {currentVariant.color}</p>}
                            <p className="text-sm text-blue-700 mt-1">Current Stock: <span className="font-bold">{currentVariant?.stockQuantity || 0}</span></p>
                        </div>

                        {/* Variant Selector if multiple */}
                        {product.variants && product.variants.length > 1 && !variantId && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Variant</label>
                                <select
                                    value={selectedVariantId}
                                    onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    {product.variants.map(v => (
                                        <option key={v.id} value={v.id}>UK {v.sizeUk} - {v.color} (Stock: {v.stockQuantity})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Adjustment Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => { setAdjustmentType('add'); setReason('RESTOCK'); }}
                                className={`flex items-center justify-center space-x-2 py-3 rounded-xl border-2 transition-colors ${adjustmentType === 'add'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 hover:border-green-200 text-gray-600'
                                    }`}
                            >
                                <ArrowUpCircle size={20} />
                                <span className="font-bold">Add Stock</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAdjustmentType('remove'); setReason('DAMAGE'); }}
                                className={`flex items-center justify-center space-x-2 py-3 rounded-xl border-2 transition-colors ${adjustmentType === 'remove'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-gray-200 hover:border-red-200 text-gray-600'
                                    }`}
                            >
                                <ArrowDownCircle size={20} />
                                <span className="font-bold">Remove Stock</span>
                            </button>
                        </div>

                        <Input
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="0"
                            min="1"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value as StockChangeReason)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                {adjustmentType === 'add' ? (
                                    <>
                                        <option value="RESTOCK">Restock (New Shipment)</option>
                                        <option value="RETURN">Customer Return</option>
                                        <option value="CORRECTION">Inventory Correction (+)</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="DAMAGE">Damaged / Expired</option>
                                        <option value="THEFT">Theft / Lost</option>
                                        <option value="CORRECTION">Inventory Correction (-)</option>
                                        <option value="SALE">Manual Sale (Not Recommended)</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                placeholder="Details about this adjustment..."
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" icon={Save}>
                                Confirm Adjustment
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
