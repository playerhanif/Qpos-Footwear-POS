import { forwardRef } from 'react';
import type { CartItem } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

import { useSettingsStore } from '../store/settingsStore';

interface ReceiptProps {
    orderId: string;
    items: CartItem[];
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    paymentMethod: string;
    amountTendered?: number;
    changeAmount?: number;
    date: string;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({
    orderId,
    items,
    subtotal,
    taxAmount,
    totalAmount,
    paymentMethod,
    amountTendered,
    changeAmount,
    date,
}, ref) => {
    const { storeName, storeAddress, storePhone } = useSettingsStore();

    return (
        <div ref={ref} className="bg-white p-4 text-black font-mono text-sm leading-tight max-w-[300px] mx-auto print:max-w-none print:w-full">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold mb-1 uppercase">{storeName}</h1>
                <p className="text-xs">{storeAddress}</p>
                <p className="text-xs">Tel: {storePhone}</p>
            </div>

            <div className="border-b border-black border-dashed my-2" />

            {/* order Info */}
            <div className="flex justify-between text-xs mb-1">
                <span>Order #: {orderId}</span>
                <span>{formatDate(date)}</span>
            </div>

            <div className="border-b border-black border-dashed my-2" />

            {/* Items */}
            <div className="space-y-2 mb-2">
                {items.map((item) => (
                    <div key={item.id} className="flex flex-col">
                        <span className="font-bold">{item.productName}</span>
                        <div className="flex justify-between pl-2 text-xs">
                            <span>{item.quantity} x {item.sizeUk} ({item.color})</span>
                            <span>{formatCurrency(item.totalPrice)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-b border-black border-dashed my-2" />

            {/* Totals */}
            <div className="space-y-1 text-right">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                    <span>TOTAL</span>
                    <span>{formatCurrency(totalAmount)}</span>
                </div>
            </div>

            <div className="border-b border-black border-dashed my-2" />

            {/* Payment Details */}
            <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                    <span>Payment Mode</span>
                    <span className="capitalize">{paymentMethod}</span>
                </div>
                {amountTendered !== undefined && (
                    <div className="flex justify-between">
                        <span>Tendered</span>
                        <span>{formatCurrency(amountTendered)}</span>
                    </div>
                )}
                {changeAmount !== undefined && (
                    <div className="flex justify-between">
                        <span>Change</span>
                        <span>{formatCurrency(changeAmount)}</span>
                    </div>
                )}
            </div>

            <div className="border-b border-black border-dashed my-2" />

            {/* Footer */}
            <div className="text-center text-xs mt-4">
                <p>Thank you for shopping with us!</p>
                <p>No returns without receipt.</p>
                <p>Visit us at www.qpos.store</p>
            </div>
        </div>
    );
});

Receipt.displayName = 'Receipt';
