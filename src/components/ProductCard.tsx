import React from 'react';
import type { Product } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatCurrency } from '../utils/format';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    // Mock stock status for now (random logic for demo)
    const isOutOfStock = product.id === 10; // Salomon out of stock
    const isLowStock = product.id === 1; // Nike Air Max low stock

    return (
        <Card
            padding="none"
            hoverable={!isOutOfStock}
            className={`h-full flex flex-col overflow-hidden group ${isOutOfStock ? 'opacity-75 grayscale' : ''}`}
            onClick={() => !isOutOfStock && onClick(product)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {isOutOfStock ? (
                        <Badge variant="neutral" size="sm" className="bg-gray-900/80 text-white backdrop-blur-sm border-0">
                            Out of Stock
                        </Badge>
                    ) : isLowStock ? (
                        <Badge variant="warning" size="sm" className="bg-warning-500/90 text-white backdrop-blur-sm border-0">
                            Low Stock
                        </Badge>
                    ) : (
                        <Badge variant="success" size="sm" className="bg-success-500/90 text-white backdrop-blur-sm border-0">
                            In Stock
                        </Badge>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-1">
                    <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{product.sku}</p>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.basePrice)}
                    </span>

                    <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOutOfStock
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-50 text-primary-600 hover:bg-primary-500 hover:text-white'
                            }`}
                        disabled={isOutOfStock}
                        aria-label="Add to cart"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isOutOfStock) onClick(product);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                        </svg>
                    </button>
                </div>
            </div>
        </Card>
    );
};
