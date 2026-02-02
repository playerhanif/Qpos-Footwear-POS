import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    totalSpent: number;
    visitCount: number;
    notes?: string;
    createdAt: string;
}

interface CustomerState {
    customers: Customer[];
    addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalSpent' | 'visitCount'>) => void;
    updateCustomer: (id: string, data: Partial<Customer>) => void;
    deleteCustomer: (id: string) => void;
    recordVisit: (id: string, amount: number) => void;
    getCustomer: (id: string) => Customer | undefined;
}

export const useCustomerStore = create<CustomerState>()(
    persist(
        (set, get) => ({
            customers: [],

            addCustomer: (data) => {
                const newCustomer: Customer = {
                    id: Math.random().toString(36).substr(2, 9),
                    ...data,
                    totalSpent: 0,
                    visitCount: 0,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    customers: [...state.customers, newCustomer],
                }));
            },

            updateCustomer: (id, data) => {
                set((state) => ({
                    customers: state.customers.map((c) =>
                        c.id === id ? { ...c, ...data } : c
                    ),
                }));
            },

            deleteCustomer: (id) => {
                set((state) => ({
                    customers: state.customers.filter((c) => c.id !== id),
                }));
            },

            recordVisit: (id, amount) => {
                set((state) => ({
                    customers: state.customers.map((c) =>
                        c.id === id
                            ? {
                                ...c,
                                totalSpent: c.totalSpent + amount,
                                visitCount: c.visitCount + 1,
                            }
                            : c
                    ),
                }));
            },

            getCustomer: (id) => get().customers.find((c) => c.id === id),
        }),
        {
            name: 'qpos-customers',
        }
    )
);
