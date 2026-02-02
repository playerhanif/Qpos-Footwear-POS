import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User as UserIcon, Phone, Mail } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useCustomers } from '../hooks/useCustomers';
import type { Customer } from '../types';

interface CustomerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Customer;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({ isOpen, onClose, initialData }) => {
    const { addCustomer, updateCustomer } = useCustomers();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPhone(initialData.phone);
            setEmail(initialData.email || '');
        } else {
            setName('');
            setPhone('');
            setEmail('');
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (initialData) {
            await updateCustomer(initialData.id, { name, phone, email });
        } else {
            await addCustomer({ name, phone, email, address: '', city: '', state: '', pincode: '' });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-900">
                            {initialData ? 'Edit Customer' : 'Add New Customer'}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <Input
                            label="Customer Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Alice Smith"
                            icon={UserIcon}
                            required
                        />

                        <Input
                            label="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 555-0123"
                            icon={Phone}
                            required
                        />

                        <Input
                            label="Email Address (Optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alice@example.com"
                            type="email"
                            icon={Mail}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" icon={Save}>
                                {initialData ? 'Update Customer' : 'Save Customer'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
