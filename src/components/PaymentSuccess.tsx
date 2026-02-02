import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Printer, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { formatCurrency } from '../utils/format';

interface PaymentSuccessProps {
    isOpen: boolean;
    totalAmount: number;
    orderId: string;
    onClose: () => void;
    onPrint: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
    isOpen,
    totalAmount,
    orderId,
    onClose,
    onPrint,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-center p-8"
                    >
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-24 h-24 bg-success-100 text-success-500 rounded-full flex items-center justify-center mb-6"
                            >
                                <CheckCircle size={48} strokeWidth={3} />
                            </motion.div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                            <p className="text-gray-500 mb-6">Order #{orderId} has been processed.</p>

                            <div className="bg-gray-50 rounded-2xl p-6 w-full mb-8 border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Amount Paid</p>
                                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                            </div>

                            <div className="flex flex-col w-full space-y-3">
                                <Button variant="secondary" size="lg" icon={Printer} onClick={onPrint} fullWidth>
                                    Print Receipt
                                </Button>
                                <Button variant="primary" size="lg" icon={ArrowRight} onClick={onClose} fullWidth>
                                    Start New Order
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
