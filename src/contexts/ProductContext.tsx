import React, { createContext, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Product, StockLog } from '../types';
import { db, seedDatabase } from '../db/db';

export type StockChangeReason = 'SALE' | 'RESTOCK' | 'RETURN' | 'DAMAGE' | 'THEFT' | 'CORRECTION' | 'INITIAL';

interface ProductContextType {
    products: Product[];
    stockLogs: StockLog[];
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    getProduct: (id: number) => Product | undefined;
    adjustStock: (productId: number, variantId: number, changeAmount: number, reason: StockChangeReason, note?: string) => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    // Live Queries - Auto-update components when DB changes
    const products = useLiveQuery(() => db.products.toArray()) || [];
    const stockLogs = useLiveQuery(() => db.stockLogs.toArray()) || [];

    // Seed DB on mount
    useEffect(() => {
        seedDatabase();
    }, []);

    const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
        // Prepare the new product object
        // We let Dexie handle the ID (auto-increment), so we cast it to any or just omit it if keyPath is ++id
        const newProduct: any = {
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
        };

        const productId = await db.products.add(newProduct);

        // Initial Stock Log
        if (newProduct.variants) {
            for (const variant of newProduct.variants) {
                await addLog(Number(productId), variant.id, variant.stockQuantity, 'INITIAL', 'Initial Stock');
            }
        }
    };

    const updateProduct = async (id: number, updates: Partial<Product>) => {
        await db.products.update(id, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
    };

    const deleteProduct = async (id: number) => {
        await db.products.delete(id);
    };

    const getProduct = (id: number) => {
        return products.find(p => p.id === id);
    };

    const addLog = async (productId: number, variantId: number, changeAmount: number, reason: StockChangeReason, note?: string) => {
        const logEntry = {
            productId,
            variantId,
            changeAmount,
            reason,
            note,
            timestamp: new Date().toISOString()
        };
        // Cast to any to avoid strict StockLog ID requirement on insert
        await db.stockLogs.add(logEntry as any);
    };

    const adjustStock = async (productId: number, variantId: number, changeAmount: number, reason: StockChangeReason, note?: string) => {
        const product = products.find(p => p.id === productId);
        if (!product || !product.variants) return;

        const updatedVariants = product.variants.map(v => {
            if (v.id === variantId) {
                const newStock = Math.max(0, v.stockQuantity + changeAmount);
                return { ...v, stockQuantity: newStock };
            }
            return v;
        });

        await db.products.update(productId, { variants: updatedVariants });
        await addLog(productId, variantId, changeAmount, reason, note);
    };

    return (
        <ProductContext.Provider value={{
            products,
            stockLogs,
            addProduct,
            updateProduct,
            deleteProduct,
            getProduct,
            adjustStock
        }}>
            {children}
        </ProductContext.Provider>
    );
};
