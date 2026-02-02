import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Customer } from '../types';

export const useCustomers = () => {
    const customers = useLiveQuery(() => db.customers.toArray()) || [];

    const addCustomer = async (data: Omit<Customer, 'id' | 'totalPurchases' | 'loyaltyPoints' | 'totalSpent' | 'createdAt'>) => {
        // Dexie auto-increments ID.
        const newCustomer = {
            ...data,
            totalPurchases: 0,
            loyaltyPoints: 0,
            totalSpent: 0,
            createdAt: new Date().toISOString(),
        };
        await db.customers.add(newCustomer as any);
    };

    const updateCustomer = async (id: number, data: Partial<Customer>) => {
        await db.customers.update(id, data);
    };

    const deleteCustomer = async (id: number) => {
        await db.customers.delete(id);
    };

    const recordVisit = async (id: number, amount: number) => {
        const customer = await db.customers.get(id);
        if (customer) {
            await db.customers.update(id, {
                totalPurchases: (customer.totalPurchases || 0) + 1,
                totalSpent: (customer.totalSpent || 0) + amount,
                loyaltyPoints: (customer.loyaltyPoints || 0) + Math.floor(amount / 10)
            });
        }
    };

    const getCustomer = (id: number) => {
        return customers.find(c => c.id === id);
    };

    return {
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        recordVisit,
        getCustomer
    };
};
