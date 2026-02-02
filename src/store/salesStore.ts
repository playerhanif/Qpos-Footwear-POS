import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

export interface Order {
    id: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    amountTendered?: number;
    changeAmount?: number;
    date: string;
}

interface SalesState {
    orders: Order[];
    addOrder: (order: Order) => void;
    clearHistory: () => void;

    // Analytics Helpers
    getDailyRevenue: (date?: string) => number;
    getTotalRevenue: () => number;
    getTotalOrders: () => number;
}

export const useSalesStore = create<SalesState>()(
    persist(
        (set, get) => ({
            orders: [],

            addOrder: (order) => {
                set((state) => ({
                    orders: [order, ...state.orders]
                }));
            },

            clearHistory: () => set({ orders: [] }),

            getDailyRevenue: (dateString = new Date().toISOString().split('T')[0]) => {
                const state = get();
                return state.orders
                    .filter(order => order.date.startsWith(dateString))
                    .reduce((sum, order) => sum + order.total, 0);
            },

            getTotalRevenue: () => {
                return get().orders.reduce((sum, order) => sum + order.total, 0);
            },

            getTotalOrders: () => {
                return get().orders.length;
            }
        }),
        {
            name: 'qpos-sales-storage',
        }
    )
);
