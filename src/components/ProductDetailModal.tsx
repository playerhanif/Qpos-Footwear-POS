import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, ProductVariant } from '../types';
import { formatCurrency } from '../utils/format';
import { Button } from './ui/Button';
import { useCartStore } from '../store/cartStore';

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    product,
    isOpen,
    onClose,
}) => {
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const addToCart = useCartStore((state) => state.addToCart);

    // Reset state when product changes
    useEffect(() => {
        if (product) {
            setSelectedSize(null);
            setSelectedColor(null);
            setQuantity(1);

            // Auto-select first available variant if exists
            if (product.variants && product.variants.length > 0) {
                const firstVariant = product.variants[0];
                setSelectedSize(firstVariant.sizeUk);
                setSelectedColor(firstVariant.color);
            }
        }
    }, [product]);

    if (!product) return null;

    // Get unique sizes and colors from variants (or generate dummy ones if no variants)
    const variants = product.variants || [];

    // If no variants, mock some for demo purposes
    const displayVariants = variants.length > 0 ? variants : [
        { id: 999, productId: product.id, sizeUk: 7, sizeUs: 8, sizeEu: 41, color: 'Default', stockQuantity: 10, isActive: true, reorderLevel: 0, priceAdjustment: 0 },
        { id: 998, productId: product.id, sizeUk: 8, sizeUs: 9, sizeEu: 42, color: 'Default', stockQuantity: 5, isActive: true, reorderLevel: 0, priceAdjustment: 0 },
        { id: 997, productId: product.id, sizeUk: 9, sizeUs: 10, sizeEu: 43, color: 'Default', stockQuantity: 0, isActive: true, reorderLevel: 0, priceAdjustment: 0 },
    ] as ProductVariant[];

    const availableSizes = Array.from(new Set(displayVariants.map(v => v.sizeUk))).sort((a, b) => a - b);
    const availableColors = Array.from(new Set(displayVariants.map(v => v.color)));

    // Find selected variant
    const selectedVariant = displayVariants.find(
        v => v.sizeUk === selectedSize && (availableColors.length === 1 || v.color === selectedColor)
    );


    const canAddToCart = selectedVariant && selectedVariant.stockQuantity > 0;

    const handleAddToCart = () => {
        if (canAddToCart && selectedVariant) {
            addToCart(product, selectedVariant, quantity);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 bg-gray-100 relative h-64 md:h-auto">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* content Section */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar">
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                                    <span>{product.brand?.name || 'Brand'}</span>
                                    <span>•</span>
                                    <span>{product.sku}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                                <div className="text-3xl font-bold text-primary-600">
                                    {formatCurrency(product.basePrice)}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-gray-900">Select Size (UK)</span>
                                    <button className="text-sm text-primary-600 hover:text-primary-700">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {availableSizes.map((size) => {
                                        const variant = displayVariants.find(v => v.sizeUk === size);
                                        const isAvailable = variant && variant.stockQuantity > 0;

                                        return (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                disabled={!isAvailable}
                                                className={`
                          py-3 rounded-xl border-2 font-medium transition-all
                          ${selectedSize === size
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : isAvailable
                                                            ? 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                            : 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed decoration-slice'
                                                    }
                        `}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Colors */}
                            {availableColors.length > 0 && availableColors[0] !== 'Default' && (
                                <div className="mb-6">
                                    <span className="block font-semibold text-gray-900 mb-3">Select Color</span>
                                    <div className="flex space-x-3">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`
                          px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                          ${selectedColor === color
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                    }
                        `}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="mb-6 flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                {selectedVariant && selectedVariant.stockQuantity > 0 ? (
                                    <>
                                        <Check size={20} className="text-success-500" />
                                        <span className="text-success-700 font-medium">In Stock ({selectedVariant.stockQuantity} pairs)</span>
                                    </>
                                ) : selectedVariant ? (
                                    <>
                                        <X size={20} className="text-error-500" />
                                        <span className="text-error-700 font-medium">Out of Stock</span>
                                    </>
                                ) : (
                                    <>
                                        <Info size={20} className="text-gray-400" />
                                        <span className="text-gray-500">Select size to see availability</span>
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <div className="flex space-x-4">
                                    <div className="w-32">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            >
                                                -
                                            </button>
                                            <div className="flex-1 text-center font-semibold">{quantity}</div>
                                            <button
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                                onClick={() => setQuantity(Math.min(selectedVariant?.stockQuantity || 5, quantity + 1))}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <Button
                                        fullWidth
                                        size="lg"
                                        disabled={!canAddToCart}
                                        onClick={handleAddToCart}
                                        icon={ShoppingCart}
                                    >
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
