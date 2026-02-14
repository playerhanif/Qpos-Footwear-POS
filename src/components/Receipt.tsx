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
        <div ref={ref}>
            <style type="text/css" media="print">
                {`
                    @page { 
                        size: 58mm auto; 
                        margin: 0mm; 
                    }
                    
                    @media print {
                        html, body { 
                            margin: 0 !important; 
                            padding: 0 !important;
                            width: 58mm !important;
                        }

                        .receipt-container {
                            width: 48mm !important; 
                            max-width: 48mm !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }

                        /* Professional Font Stack */
                        body {
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            filter: contrast(150%) brightness(90%); /* Darkens text */
                        }
                        
                        * {
                            color: black !important;
                            -webkit-print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                    }
                `}
            </style>

            {/* Main Container: Arial/Helvetica font, removed top padding (pt-0) */}
            <div className="bg-white text-black text-[12px] leading-snug receipt-container font-bold"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

                {/* Zero top padding to prevent waste */}
                <div className="px-0 pt-0 pb-2">

                    {/* Header */}
                    <div className="text-center mb-2 mt-1">
                        <h1 className="text-base font-black uppercase leading-tight mb-1">{storeName}</h1>
                        <p className="text-[10px] font-bold break-words leading-tight">{storeAddress}</p>
                        <p className="text-[10px] font-black mt-0.5">Tel: {storePhone}</p>
                    </div>

                    {/* Divider */}
                    <div className="border-b-2 border-black border-dashed my-1" />

                    {/* Order Info */}
                    <div className="flex justify-between text-[11px] font-black">
                        <span>Ord: #{orderId}</span>
                        <span>{formatDate(date).split(',')[0]}</span>
                    </div>

                    <div className="border-b-2 border-black border-dashed my-1" />

                    {/* Items */}
                    <div className="flex flex-col gap-1 mb-1">
                        {items.map((item) => (
                            <div key={item.id} className="flex flex-col">
                                {/* Product Name */}
                                <span className="font-black text-[12px] leading-tight mb-0.5">
                                    {item.productName}
                                </span>
                                <div className="flex justify-between pl-1 text-[11px] leading-tight text-black">
                                    <span className="font-bold">
                                        {item.quantity} x {item.sizeUk} ({item.color})
                                    </span>
                                    <span className="font-black">{formatCurrency(item.totalPrice)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-b-2 border-black border-dashed my-1" />

                    {/* Totals */}
                    <div className="space-y-1 text-right text-[11px] leading-tight font-bold">
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
                        <div className="flex justify-between">
                            <span>Tax (18%)</span>
                            <span>{formatCurrency(taxAmount)}</span>
                        </div>

                        {/* Final Total */}
                        <div className="flex justify-between font-black text-lg mt-1 border-t-2 border-black border-dashed pt-1">
                            <span>TOTAL</span>
                            <span>{formatCurrency(totalAmount)}</span>
                        </div>
                    </div>

                    <div className="border-b-2 border-black border-dashed my-1" />

                    {/* Payment Details */}
                    <div className="space-y-1 text-[11px] leading-tight font-bold">
                        {payments && payments.length > 0 ? (
                            <>
                                <div className="font-black border-b border-gray-400 pb-0.5 mb-0.5">Paid via:</div>
                                {payments.map((p, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span className="capitalize">{p.method}</span>
                                        <span>{formatCurrency(p.amount)}</span>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="flex justify-between">
                                <span>Mode</span>
                                <span className="capitalize font-black">{paymentMethod}</span>
                            </div>
                        )}

                        {amountTendered !== undefined && (
                            <div className="flex justify-between mt-1 pt-1 border-t-2 border-dotted border-black">
                                <span>Given</span>
                                <span>{formatCurrency(amountTendered)}</span>
                            </div>
                        )}
                        {changeAmount !== undefined && (
                            <div className="flex justify-between font-black text-[12px]">
                                <span>Change</span>
                                <span>{formatCurrency(changeAmount)}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-b-2 border-black border-dashed my-1" />

                    {/* Footer */}
                    <div className="text-center text-[10px] mt-2 mb-2 font-black">
                        <p>Thank you for shopping!</p>
                        <p className="mt-1">www.qpos.store</p>
                    </div>
                </div>

                {/* Final Spacer */}
                <div className="h-4" />
            </div>
        </div>
    );
});

Receipt.displayName = 'Receipt';