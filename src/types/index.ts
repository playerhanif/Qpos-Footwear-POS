// Core type definitions for Qpos

export type UserRole = 'ADMIN' | 'CASHIER';

export interface User {
    id: string;
    username?: string;
    name: string;
    email?: string;
    pin: string;
    role: UserRole;
    isActive: boolean;
    avatarUrl?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    displayOrder: number;
    isActive: boolean;
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string;
    isActive: boolean;
}

export interface Product {
    id: number;
    sku: string;
    name: string;
    description?: string;
    categoryId: number;
    category?: Category;
    brandId: number;
    brand?: Brand;
    basePrice: number;
    costPrice?: number;
    taxRate: number;
    imageUrl?: string;
    additionalImages?: string[];
    variants?: ProductVariant[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductVariant {
    id: number;
    productId: number;
    sizeUk: number;
    sizeUs: number;
    sizeEu: number;
    color: string;
    colorHex?: string;
    barcode?: string;
    stockQuantity: number;
    reorderLevel: number;
    priceAdjustment: number;
    isActive: boolean;
}

export type StockStatus = 'high' | 'medium' | 'low' | 'out';

export interface CartItem {
    id: string; // Unique cart item ID
    variantId: number;
    productId: number;
    productName: string;
    imageUrl?: string;
    sizeUk: number;
    color: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    taxAmount: number;
    totalPrice: number;
}

export interface Discount {
    type: 'percentage' | 'fixed';
    value: number;
    amount: number;
}

export interface Order {
    id: number;
    orderNumber: string;
    customerId?: number;
    cashierId: number;
    orderDate: string;
    subtotal: number;
    discountAmount: number;
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
    taxAmount: number;
    totalAmount: number;
    paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
    notes?: string;
    items: OrderItem[];
    payments: Payment[];
}

export interface OrderItem {
    id: number;
    orderId: number;
    variantId: number;
    productName: string;
    sizeUk: number;
    color: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    taxAmount: number;
    totalPrice: number;
}

export interface Payment {
    id: number;
    orderId: number;
    paymentMethod: 'cash' | 'card' | 'upi' | 'other';
    amount: number;
    transactionId?: string;
    paymentDate: string;
    notes?: string;
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    loyaltyPoints: number;
    totalPurchases: number;
    totalSpent: number;
    createdAt: string;
}

export interface FilterOptions {
    categoryId?: number;
    brandIds?: number[];
    sizeUk?: number[];
    colors?: string[];
    priceRange?: [number, number];
    inStockOnly?: boolean;
    searchQuery?: string;
}

export interface StockLog {
    id: number;
    productId: number;
    variantId: number;
    changeAmount: number;
    reason: string;
    note?: string;
    timestamp: string;
}
