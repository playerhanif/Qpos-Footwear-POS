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
    payments?: { method: string; amount: number }[];
    amountTendered?: number;
    changeAmount?: number;
    discountAmount?: number;
    date: string;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({
    orderId,
    items,
    subtotal,
    taxAmount,
    totalAmount,
    paymentMethod,
    payments,
    amountTendered,
    changeAmount,
    discountAmount,
    date,
}, ref) => {
    const { storeName, storeAddress, storePhone } = useSettingsStore();

    return (
        <div ref={ref} className="bg-white text-black font-mono text-[12px] leading-tight w-[58mm] mx-auto print:w-full print:m-0">
            {/* CRITICAL: This style tag ensures the browser doesn't add 
                default margins (0.5 inch) which ruins 58mm printing. 
            */}
            <style type="text/css" media="print">
                {`
                    @page { size: 58mm auto; margin: 0; }
                    body { margin: 0; padding: 0; }
                `}
            </style>

            {/* Container with minimal padding to maximize print area */}
            <div className="p-1">

                {/* Header */}
                <div className="text-center mb-2">
                    <h1 className="text-base font-bold uppercase leading-none mb-1">{storeName}</h1>
                    <p className="text-[10px] break-words">{storeAddress}</p>
                    <p className="text-[10px]">Tel: {storePhone}</p>
                </div>

                {/* Divider (Using CSS border is cleaner than ASCII for thermal if driver supports it, else use strings) */}
                <div className="border-b border-black border-dashed my-1" />

                {/* Order Info */}
                <div className="flex justify-between text-[10px]">
                    <span>#{orderId}</span>
                    <span>{formatDate(date)}</span>
                </div>

                <div className="border-b border-black border-dashed my-1" />

                {/* Items */}
                <div className="flex flex-col gap-1 mb-1">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col">
                            {/* Product Name - allowed to wrap */}
                            <span className="font-bold text-[11px] leading-3 mb-0.5 break-words">
                                {item.productName}
                            </span>

                            {/* Details Row */}
                            <div className="flex justify-between pl-1 text-[10px]">
                                <span>
                                    {item.quantity}x {item.sizeUk} <span className="opacity-75">({item.color})</span>
                                </span>
                                <span>{formatCurrency(item.totalPrice)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-b border-black border-dashed my-1" />

                {/* Totals */}
                <div className="space-y-0.5 text-right text-[11px]">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmount && discountAmount > 0 && (
                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-[10px]">
                        <span>Tax (18%)</span>
                        <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm mt-1">
                        <span>TOTAL</span>
                        <span>{formatCurrency(totalAmount)}</span>
                    </div>
                </div>

                <div className="border-b border-black border-dashed my-1" />

                {/* Payment Details */}
                <div className="space-y-0.5 text-[10px]">
                    {payments && payments.length > 0 ? (
                        <>
                            <div className="font-semibold mb-1">Payment Methods:</div>
                            {payments.map((p, i) => (
                                <div key={i} className="flex justify-between">
                                    <span className="capitalize">{p.method}</span>
                                    <span>{formatCurrency(p.amount)}</span>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="flex justify-between">
                            <span>Pay Mode</span>
                            <span className="capitalize font-semibold">{paymentMethod}</span>
                        </div>
                    )}

                    {amountTendered !== undefined && (
                        <div className="flex justify-between">
                            <span>Tendered</span>
                            <span>{formatCurrency(amountTendered)}</span>
                        </div>
                    )}
                    {changeAmount !== undefined && (
                        <div className="flex justify-between font-bold">
                            <span>Change</span>
                            <span>{formatCurrency(changeAmount)}</span>
                        </div>
                    )}
                </div>

                <div className="border-b border-black border-dashed my-1" />

                {/* Footer */}
                <div className="text-center text-[10px] mt-2 mb-4 leading-3">
                    <p>Thank you for shopping!</p>
                    <p>www.qpos.store</p>
                </div>
            </div>

            {/* Bottom padding to ensure the cutter doesn't cut the text */}
            <div className="h-4 print:h-2" />
        </div>
    );
});

Receipt.displayName = 'Receipt';