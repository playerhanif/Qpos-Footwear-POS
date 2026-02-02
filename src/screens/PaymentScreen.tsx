import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Smartphone, Split } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/format';
import { PaymentMethodCard } from '../components/PaymentMethodCard';
import { PaymentSuccess } from '../components/PaymentSuccess';
import { Receipt } from '../components/Receipt';
import { useProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';
import { useCustomers } from '../hooks/useCustomers';
import { useSettingsStore } from '../store/settingsStore';
import type { OrderItem, Payment, Order } from '../types';

type PaymentMethod = 'cash' | 'card' | 'upi' | 'split';

export const PaymentScreen: React.FC = () => {
    const navigate = useNavigate();
    const { getSubtotal, items, clearCart, customerId, setCustomer } = useCartStore();
    const { adjustStock } = useProducts();
    const { addOrder } = useSales();
    const { recordVisit } = useCustomers();
    const receiptRef = useRef<HTMLDivElement>(null);

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [amountTendered, setAmountTendered] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    // In a real app, this would come from the backend response
    const [orderId] = useState(Math.floor(Math.random() * 10000).toString());
    const { taxRate } = useSettingsStore();

    const subtotal = getSubtotal();
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    const tenderedValue = parseFloat(amountTendered) || 0;
    const changeAmount = Math.max(0, tenderedValue - totalAmount);
    const remainingAmount = Math.max(0, totalAmount - tenderedValue);

    // ...

    // Print handler
    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: `Receipt-${orderId}`,
        onAfterPrint: () => console.log('Print completed'),
    });

    // If cart is empty, redirect back
    useEffect(() => {
        if (items.length === 0 && !showSuccess) {
            navigate('/billing');
        }
    }, [items, navigate, showSuccess]);

    const handlePayment = async () => {
        if (!selectedMethod) return;

        setIsProcessing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Deduct stock for each item
        items.forEach(item => {
            adjustStock(item.productId, item.variantId, -item.quantity, 'SALE');
        });

        // Record Order in Sales History
        // Map CartItems to OrderItems
        const orderItems: OrderItem[] = items.map((item) => ({
            id: 0, // Placeholder
            orderId: 0, // Placeholder
            variantId: item.variantId,
            productName: item.productName,
            sizeUk: item.sizeUk,
            color: item.color,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountAmount: item.discountAmount,
            taxAmount: item.taxAmount,
            totalPrice: item.totalPrice
        }));

        const payment: Payment = {
            id: 0,
            orderId: 0,
            paymentMethod: selectedMethod as 'cash' | 'card' | 'upi' | 'other',
            amount: totalAmount,
            paymentDate: new Date().toISOString()
        };

        const newOrder = {
            orderNumber: orderId,
            customerId: customerId,
            cashierId: 1, // TODO: Get from auth
            orderDate: new Date().toISOString(),
            subtotal: subtotal,
            discountAmount: 0, // TODO: Cart discount
            taxAmount: taxAmount,
            totalAmount: totalAmount,
            paymentStatus: 'paid',
            items: orderItems,
            payments: [payment]
        };

        await addOrder(newOrder as any as Order);

        if (customerId) {
            recordVisit(customerId, totalAmount);
        }

        setIsProcessing(false);
        setShowSuccess(true);
    };

    const handleComplete = () => {
        clearCart();
        setCustomer(undefined);
        navigate('/billing');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hidden Receipt for Printing */}
            <div className="hidden">
                <Receipt
                    ref={receiptRef}
                    orderId={orderId}
                    items={items}
                    subtotal={subtotal}
                    taxAmount={taxAmount}
                    totalAmount={totalAmount}
                    paymentMethod={selectedMethod || 'Unknown'}
                    amountTendered={selectedMethod === 'cash' ? tenderedValue : undefined}
                    changeAmount={selectedMethod === 'cash' ? changeAmount : undefined}
                    date={new Date().toISOString()}
                />
            </div>

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/billing')}>
                        Back
                    </Button>
                    <h1 className="text-xl font-bold text-gray-900">Checkout & Payment</h1>
                </div>
                <div className="text-sm text-gray-500">
                    Order ID: #{orderId}
                </div>
            </div>

            <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Col: Payment Methods */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-800">Select Payment Method</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PaymentMethodCard
                            id="cash"
                            name="Cash"
                            icon={Banknote}
                            description="Pay with physical cash"
                            selected={selectedMethod === 'cash'}
                            onClick={() => setSelectedMethod('cash')}
                        />
                        <PaymentMethodCard
                            id="card"
                            name="Card"
                            icon={CreditCard}
                            description="Credit or Debit Card"
                            selected={selectedMethod === 'card'}
                            onClick={() => setSelectedMethod('card')}
                        />
                        <PaymentMethodCard
                            id="upi"
                            name="UPI / QR"
                            icon={Smartphone}
                            description="GPay, PhonePe, Paytm"
                            selected={selectedMethod === 'upi'}
                            onClick={() => setSelectedMethod('upi')}
                        />
                        <PaymentMethodCard
                            id="split"
                            name="Split Payment"
                            icon={Split}
                            description="Split between methods"
                            selected={selectedMethod === 'split'}
                            onClick={() => setSelectedMethod('split')}
                            disabled
                        />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-6">
                        <h3 className="font-bold text-gray-800 mb-4">Payment Details</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-gray-600">
                                <span>Total Due</span>
                                <span className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
                            </div>

                            {selectedMethod === 'cash' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 pt-4 border-t border-gray-100"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount Tendered</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                            <input
                                                type="number"
                                                value={amountTendered}
                                                onChange={(e) => setAmountTendered(e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-bold"
                                                placeholder="0.00"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {tenderedValue > 0 && (
                                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                            <span className="text-gray-600">Change to Return</span>
                                            <span className={`text-lg font-bold ${changeAmount > 0 ? 'text-success-600' : 'text-gray-900'}`}>
                                                {formatCurrency(changeAmount)}
                                            </span>
                                        </div>
                                    )}

                                    {remainingAmount > 0.01 && (
                                        <div className="text-sm text-error-500 font-medium">
                                            Remaining due: {formatCurrency(remainingAmount)}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Col: Summary & Action */}
                <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div>
                                        <h4 className="font-medium text-gray-900 line-clamp-1">{item.productName}</h4>
                                        <p className="text-sm text-gray-500">{item.sizeUk} • {item.color} x {item.quantity}</p>
                                    </div>
                                    <span className="font-medium text-gray-900">{formatCurrency(item.totalPrice)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax (18%)</span>
                            <span>{formatCurrency(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                            <span>Total</span>
                            <span>{formatCurrency(totalAmount)}</span>
                        </div>

                        <Button
                            size="xl"
                            fullWidth
                            variant="primary"
                            disabled={!selectedMethod || isProcessing || (selectedMethod === 'cash' && remainingAmount > 1)}
                            loading={isProcessing}
                            onClick={handlePayment}
                            className="mt-4 shadow-lg shadow-primary-500/30"
                        >
                            {isProcessing ? 'Processing...' : `Complete Payment`}
                        </Button>
                    </div>
                </div>
            </div>

            <PaymentSuccess
                isOpen={showSuccess}
                totalAmount={totalAmount}
                orderId={orderId}
                onClose={handleComplete}
                onPrint={handlePrint}
            />
        </div>
    );
};
