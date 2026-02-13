import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Order } from '../types';

export const useSales = () => {
    // Live query to get all orders, sorted by date descending (newest first)
    // Note: Dexie sorts text/numbers ascending. For descending, we reverse.
    const orders = useLiveQuery(
        () => db.orders.reverse().toArray(),
        []
    ) || [];

    const addOrder = async (order: Order) => {
        // We cast to any for Dexie because 'id' is mandatory in our Order type 
        // but Dexie auto-generates it if omitted or 0.
        await db.orders.add(order as any);
    };

    const clearHistory = async () => {
        await db.orders.clear();
    };

    const clearTodayOrders = async () => {
        const today = new Date().toISOString().split('T')[0];
        // Find keys of orders from today
        const ordersToDelete = await db.orders
            .filter(order => order.orderDate.startsWith(today))
            .primaryKeys();

        await db.orders.bulkDelete(ordersToDelete);
    };

    const getDailyRevenue = (dateString = new Date().toISOString().split('T')[0]) => {
        return orders
            .filter(order => order.orderDate.startsWith(dateString))
            .reduce((sum, order) => sum + order.totalAmount, 0);
    };

    const getTotalRevenue = () => {
        return orders.reduce((sum, order) => sum + order.totalAmount, 0);
    };

    const getTotalOrders = () => {
        return orders.length;
    };

    return {
        orders,
        addOrder,
        getDailyRevenue,
        getTotalRevenue,
        getTotalOrders,
        clearHistory,
        clearTodayOrders
    };
};
