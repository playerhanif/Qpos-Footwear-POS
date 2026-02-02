import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
    onProductClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    isLoading = false,
    onProductClick,
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl h-64 animate-pulse">
                        <div className="h-40 bg-gray-200 rounded-t-xl" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-8 bg-gray-200 rounded w-full mt-auto" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-96 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-1 max-w-sm">
                    Try adjusting your search or filter to find what you're looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
            {products.map((product) => (
                <div key={product.id} className="h-full animate-fade-in">
                    <ProductCard product={product} onClick={onProductClick} />
                </div>
            ))}
        </div>
    );
};
