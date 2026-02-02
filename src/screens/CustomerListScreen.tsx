import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Phone, Mail, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCustomers } from '../hooks/useCustomers';
import type { Customer } from '../types';
import { CustomerFormModal } from '../components/CustomerFormModal';
import { formatCurrency } from '../utils/format';

export const CustomerListScreen: React.FC = () => {
    const { customers, deleteCustomer } = useCustomers();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedCustomer(undefined);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            await deleteCustomer(id);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage customer database and loyalty</p>
                </div>
                <Button onClick={handleAdd} icon={Plus}>Add Customer</Button>
            </div>

            {/* Toolbar */}
            <div className="px-8 py-6">
                <div className="max-w-md">
                    <Input
                        placeholder="Search by name, phone, or email..."
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 px-8 pb-8 overflow-hidden">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4">Customer Details</div>
                        <div className="col-span-3">Contact Info</div>
                        <div className="col-span-2 text-right">Visits</div>
                        <div className="col-span-2 text-right">Total Spent</div>
                        <div className="col-span-1 text-center">Actions</div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredCustomers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <UserIcon size={48} className="mb-4 text-gray-300" />
                                <p>No customers found.</p>
                            </div>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <div key={customer.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors">
                                    <div className="col-span-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{customer.name}</h3>
                                                <p className="text-xs text-gray-500">Since {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3 text-sm text-gray-600 space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <Phone size={14} className="text-gray-400" />
                                            <span>{customer.phone}</span>
                                        </div>
                                        {customer.email && (
                                            <div className="flex items-center space-x-2">
                                                <Mail size={14} className="text-gray-400" />
                                                <span>{customer.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2 text-right text-sm font-medium text-gray-900">
                                        {customer.totalPurchases}
                                    </div>

                                    <div className="col-span-2 text-right text-sm font-bold text-gray-900">
                                        {formatCurrency(customer.totalSpent)}
                                    </div>

                                    <div className="col-span-1 flex justify-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(customer)}
                                            className="text-gray-400 hover:text-primary-600 p-1 rounded transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.id)}
                                            className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <CustomerFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedCustomer}
            />
        </div>
    );
};
