import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuth } from '../contexts/AuthContext';
import type { User, UserRole } from '../types';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: User;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, initialData }) => {
    const { addUser, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        pin: '',
        role: 'CASHIER' as UserRole,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                pin: initialData.pin,
                role: initialData.role,
            });
        } else {
            setFormData({
                name: '',
                pin: '',
                role: 'CASHIER',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (initialData) {
            updateUser(initialData.id, formData);
        } else {
            addUser({ ...formData, isActive: true });
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
                            {initialData ? 'Edit User' : 'Add New User'}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <Input
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. John Doe"
                            required
                        />

                        <Input
                            label="Access PIN (4 Digits)"
                            value={formData.pin}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setFormData({ ...formData, pin: val });
                            }}
                            placeholder="0000"
                            required
                            maxLength={4}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="CASHIER">Cashier (Billing Only)</option>
                                <option value="ADMIN">Admin (Full Access)</option>
                            </select>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" icon={Save}>
                                {initialData ? 'Update User' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
