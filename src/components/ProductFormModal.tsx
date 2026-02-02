import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { CATEGORIES } from '../utils/mockData';

export interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: any) => void;
    initialData?: any;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'variants'>('details');
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        categoryId: '',
        basePrice: '',
        description: '',
        imageUrl: '',
    });

    const [variants, setVariants] = useState([
        { id: 1, sizeUk: 7, color: 'Black', stock: 10, price: 0 }
    ]);

    const addVariant = () => {
        setVariants([...variants, { id: Date.now(), sizeUk: 8, color: 'Black', stock: 0, price: 0 }]);
    };

    const removeVariant = (id: number) => {
        setVariants(variants.filter(v => v.id !== id));
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                sku: initialData.sku,
                categoryId: initialData.categoryId.toString(),
                basePrice: initialData.basePrice.toString(),
                description: initialData.description || '',
                imageUrl: initialData.imageUrl || '',
            });
            if (initialData.variants) {
                setVariants(initialData.variants.map((v: any) => ({
                    id: v.id,
                    sizeUk: v.sizeUk,
                    color: v.color,
                    stock: v.stockQuantity,
                    price: v.priceAdjustment
                })));
            }
        } else {
            // Reset form
            setFormData({
                name: '',
                sku: '',
                categoryId: '',
                basePrice: '',
                description: '',
                imageUrl: '',
            });
            setVariants([{ id: 1, sizeUk: 7, color: 'Black', stock: 10, price: 0 }]);
        }
    }, [initialData, isOpen]);

    const handleSave = () => {
        const newProduct = {
            ...formData,
            basePrice: parseFloat(formData.basePrice) || 0,
            categoryId: parseInt(formData.categoryId) || 0,
            variants: variants.map(v => ({
                ...v,
                stockQuantity: v.stock,
                priceAdjustment: v.price
            })),
        };

        if (onSave) {
            onSave(newProduct);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-900">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Basic Details
                        </button>
                        <button
                            onClick={() => setActiveTab('variants')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'variants'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Variants & Stock
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                        {activeTab === 'details' ? (
                            <div className="space-y-6">
                                {/* Image Upload Placeholder */}
                                {/* Image Upload */}
                                <div
                                    onClick={() => document.getElementById('product-image-upload')?.click()}
                                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden relative"
                                >
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <>
                                            <Upload size={32} className="mb-2" />
                                            <span className="text-sm font-medium">Click to upload product image</span>
                                            <span className="text-xs">PNG, JPG up to 5MB</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        id="product-image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, imageUrl: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <Input
                                        label="Product Name"
                                        placeholder="e.g. Nike Air Max"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <Input
                                        label="SKU Code"
                                        placeholder="e.g. NIKE-AIR-001"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {CATEGORIES.filter(c => c.id !== 1).map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Input
                                        label="Base Price (₹)"
                                        placeholder="0.00"
                                        type="number"
                                        value={formData.basePrice}
                                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none min-h-[100px]"
                                        placeholder="Enter product description..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium text-gray-900">Manage Variants</h3>
                                    <Button size="sm" variant="secondary" icon={Plus} onClick={addVariant}>
                                        Add Variant
                                    </Button>
                                </div>

                                {variants.map((variant, index) => (
                                    <div key={variant.id} className="flex gap-4 items-end p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="w-20">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Size (UK)</label>
                                            <input
                                                type="number"
                                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                                value={variant.sizeUk}
                                                onChange={(e) => {
                                                    const newVariants = [...variants];
                                                    newVariants[index].sizeUk = parseInt(e.target.value);
                                                    setVariants(newVariants);
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                                value={variant.color}
                                                onChange={(e) => {
                                                    const newVariants = [...variants];
                                                    newVariants[index].color = e.target.value;
                                                    setVariants(newVariants);
                                                }}
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                                            <input
                                                type="number"
                                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                                value={variant.stock}
                                                onChange={(e) => {
                                                    const newVariants = [...variants];
                                                    newVariants[index].stock = parseInt(e.target.value);
                                                    setVariants(newVariants);
                                                }}
                                            />
                                        </div>
                                        <div className="w-28">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">+ Price (₹)</label>
                                            <input
                                                type="number"
                                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                                value={variant.price}
                                                onChange={(e) => {
                                                    const newVariants = [...variants];
                                                    newVariants[index].price = parseInt(e.target.value);
                                                    setVariants(newVariants);
                                                }}
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeVariant(variant.id)}
                                            className="p-2 text-gray-400 hover:text-error-500 hover:bg-error-50 rounded-md transition-colors"
                                            disabled={variants.length === 1}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleSave}>{initialData ? 'Update Product' : 'Save Product'}</Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
