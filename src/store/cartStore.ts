import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '../types';

interface CartState {
    items: CartItem[];
    addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    setCustomer: (customerId: number | undefined) => void;
    customerId?: number;

    // Discount state
    discount: { type: 'percentage' | 'fixed'; value: number } | null;
    setDiscount: (type: 'percentage' | 'fixed', value: number) => void;
    clearDiscount: () => void;

    // Computed values helpers
    getSubtotal: () => number;
    getDiscountAmount: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            customerId: undefined,
            discount: null,

            setCustomer: (id) => set({ customerId: id }),

            setDiscount: (type, value) => set({ discount: { type, value } }),

            clearDiscount: () => set({ discount: null }),

            addToCart: (product, variant, quantity) => {
                set((state) => {
                    // Check if item already exists with same variant
                    const existingItemIndex = state.items.findIndex(
                        (item) => item.variantId === variant.id
                    );

                    if (existingItemIndex > -1) {
                        // Update quantity if exists
                        const newItems = [...state.items];
                        newItems[existingItemIndex].quantity += quantity;
                        newItems[existingItemIndex].totalPrice =
                            newItems[existingItemIndex].quantity * newItems[existingItemIndex].unitPrice;
                        return { items: newItems };
                    }

                    // Add new item
                    const newItem: CartItem = {
                        id: `${variant.id}-${Date.now()}`, // Simple unique ID
                        variantId: variant.id,
                        productId: product.id,
                        productName: product.name,
                        imageUrl: product.imageUrl,
                        sizeUk: variant.sizeUk,
                        color: variant.color,
                        quantity,
                        unitPrice: product.basePrice + (variant.priceAdjustment || 0),
                        discountAmount: 0,
                        taxAmount: 0, // Calculate later
                        totalPrice: (product.basePrice + (variant.priceAdjustment || 0)) * quantity,
                    };

                    return { items: [...state.items, newItem] };
                });
            },

            removeFromCart: (itemId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                }));
            },

            updateQuantity: (itemId, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter((item) => item.id !== itemId),
                        };
                    }

                    const newItems = state.items.map((item) => {
                        if (item.id === itemId) {
                            return {
                                ...item,
                                quantity,
                                totalPrice: item.unitPrice * quantity,
                            };
                        }
                        return item;
                    });

                    return { items: newItems };
                });
            },

            clearCart: () => set({ items: [], discount: null, customerId: undefined }),

            getSubtotal: () => {
                return get().items.reduce((total, item) => total + item.totalPrice, 0);
            },

            getDiscountAmount: () => {
                const state = get();
                const subtotal = state.items.reduce((total, item) => total + item.totalPrice, 0);

                if (!state.discount) return 0;

                if (state.discount.type === 'percentage') {
                    return subtotal * (state.discount.value / 100);
                } else {
                    return Math.min(state.discount.value, subtotal); // Cannot exceed subtotal
                }
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'qpos-cart-storage',
        }
    )
);
