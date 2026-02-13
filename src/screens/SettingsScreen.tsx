import React, { useState } from 'react';
import { Save, Store, AlertTriangle, RotateCcw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useSettingsStore } from '../store/settingsStore';
import { useSales } from '../hooks/useSales';
import { useCartStore } from '../store/cartStore';

export const SettingsScreen: React.FC = () => {
    const {
        storeName, storeAddress, storePhone, taxRate,
        updateSettings, resetSettings
    } = useSettingsStore();

    const { clearHistory } = useSales();
    const { clearCart } = useCartStore();

    // Local state for form to avoid excessive re-renders/writes
    const [formData, setFormData] = useState({
        storeName,
        storeAddress,
        storePhone,
        taxRate: (taxRate * 100).toString(), // Display as percentage
    });

    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        updateSettings({
            storeName: formData.storeName,
            storeAddress: formData.storeAddress,
            storePhone: formData.storePhone,
            taxRate: parseFloat(formData.taxRate) / 100,
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleResetDatabase = () => {
        if (window.confirm('Are you sure? This will delete ALL sales history and reset settings. Inventory will remain.')) {
            clearHistory();
            clearCart();
            resetSettings();
            setFormData({
                storeName: 'Qpos Store',
                storeAddress: '123 Retail St, Market City',
                storePhone: '+91 98765 43210',
                taxRate: '18',
            });
            alert('System reset complete.');
        }
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500">Manage your store preferences and data</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Store Profile */}
                    <Card className="p-6">
                        <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                                <Store size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Store Profile</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Store Name"
                                    value={formData.storeName}
                                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                    placeholder="e.g. My Fashion Store"
                                />
                                <Input
                                    label="Phone Number"
                                    value={formData.storePhone}
                                    onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                                    placeholder="e.g. +91 98765 43210"
                                />
                            </div>
                            <Input
                                label="Address"
                                value={formData.storeAddress}
                                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                                placeholder="e.g. 123 Main St, Tech City"
                            />

                            <div className="w-1/3">
                                <Input
                                    label="Tax Rate (%)"
                                    type="number"
                                    value={formData.taxRate}
                                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                                    placeholder="18"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={handleSave}
                                icon={Save}
                                size="lg"
                                className={isSaved ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                                {isSaved ? 'Saved!' : 'Save Changes'}
                            </Button>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="p-6 border-error-200 bg-error-50">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-error-100 text-error-600 rounded-lg">
                                <AlertTriangle size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-error-900">Danger Zone</h2>
                        </div>

                        <p className="text-error-700 mb-6">
                            Resetting the database will clear all your sales history, cart, and restore default settings.
                            Your inventory products will NOT be deleted.
                        </p>

                        <Button
                            variant="secondary"
                            className="bg-white border-error-200 text-error-600 hover:bg-error-50 hover:border-error-300 hover:text-error-700"
                            icon={RotateCcw}
                            onClick={handleResetDatabase}
                        >
                            Reset Database & History
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};
