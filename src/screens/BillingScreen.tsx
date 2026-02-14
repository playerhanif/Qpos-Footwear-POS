import React, { useState, useMemo } from 'react';
import { Search, Grid, List as ListIcon, Trash2, Minus, Plus, Tag, X, Ticket } from 'lucide-react';
import { CategoryTabs } from '../components/CategoryTabs';
import { ProductGrid } from '../components/ProductGrid';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CATEGORIES } from '../utils/mockData';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { useCustomers } from '../hooks/useCustomers';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency } from '../utils/format';
import { useNavigate } from 'react-router-dom';


export const BillingScreen: React.FC = () => {
    const navigate = useNavigate();
    const { taxRate } = useSettingsStore();
    const { customers } = useCustomers();
    const { products } = useProducts();
    const { items, removeFromCart, updateQuantity, getSubtotal, setCustomer, customerId, discount, setDiscount, clearDiscount, getDiscountAmount, applyCoupon, couponCode } = useCartStore();

    // Local State
    const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [discountInput, setDiscountInput] = useState('');
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');

    // Coupon State
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [couponInput, setCouponInput] = useState('');

    // Sync local selected customer with store
    const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setCustomer(val ? parseInt(val) : undefined);
    };

    // Derived State
    const activeCustomer = useMemo(() => {
        return customers.find(c => c.id === customerId);
    }, [customerId, customers]);

    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const taxableAmount = subtotal - discountAmount;
    // taxRate is stored as decimal (e.g. 0.18 for 18%)
    const taxAmount = taxableAmount * taxRate;
    const totalAmount = taxableAmount + taxAmount;

    const handleApplyDiscount = () => {
        const value = parseFloat(discountInput);
        if (!isNaN(value) && value > 0) {
            setDiscount(discountType, value);
            setIsDiscountOpen(false);
            setDiscountInput('');
            setIsCouponOpen(false); // Close coupon if discount applied manually
        }
    };

    const handleApplyCoupon = () => {
        if (!couponInput.trim()) return;

        const success = applyCoupon(couponInput);
        if (success) {
            setIsCouponOpen(false);
            setCouponInput('');
            setIsDiscountOpen(false); // Close manual discount if coupon applied
        } else {
            alert('Invalid coupon code');
        }
    };

    // Filter products based on category and search query
    const filteredProducts = useMemo(() => {
        let result = products;

        // Filter by category
        if (activeCategoryId !== 1) { // 1 is 'All'
            result = result.filter(p => p.categoryId === activeCategoryId);
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.sku.toLowerCase().includes(query)
            );
        }

        return result;
    }, [activeCategoryId, searchQuery, products]);

    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50 relative">
            {/* Left Panel - Products (Visible if !isCartOpen on mobile) */}
            <div className={`flex-1 flex flex-col min-w-0 pr-0 border-r border-gray-200 ${isCartOpen ? 'hidden md:flex' : 'flex'}`}>
                {/* Top Bar */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Products ({filteredProducts.length})</h2>
                        <div className="flex items-center space-x-3">
                            <Input
                                placeholder="Search products..."
                                icon={Search}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 hidden sm:block"
                            />
                            {/* Mobile Search */}
                            <Input
                                placeholder="Search..."
                                icon={Search}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-32 sm:hidden"
                            />
                            <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="bg-white shadow-sm text-primary-600 rounded-md h-8 w-8 px-0"
                                >
                                    <Grid size={18} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 rounded-md h-8 w-8 px-0"
                                >
                                    <ListIcon size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <CategoryTabs
                        categories={CATEGORIES}
                        activeCategoryId={activeCategoryId}
                        onSelect={setActiveCategoryId}
                    />
                </div>

                {/* Product Grid Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 custom-scrollbar mb-16 md:mb-0">
                    <ProductGrid
                        products={filteredProducts}
                        onProductClick={handleProductClick}
                    />
                </div>
            </div>

            {/* Right Panel - Order Summary (Visible if isCartOpen on mobile) */}
            <div className={`
                w-full md:w-[420px] bg-white flex flex-col shadow-xl z-20 
                absolute inset-0 md:static transform transition-transform duration-300 ease-in-out
                ${isCartOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                {/* Cart Header */}
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="mr-3 md:hidden p-1 hover:bg-gray-100 rounded-full"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h2 className="text-lg font-bold text-gray-900">Current Order</h2>
                    </div>

                    {/* Customer Select */}
                    <div className="relative w-48 md:w-auto">
                        <select
                            value={customerId || ''}
                            onChange={handleCustomerChange}
                            className="w-full pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                        >
                            <option value="">Guest Customer</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
                {activeCustomer && (
                    <div className="px-4 pb-2">
                        <div className="text-xs text-primary-600 bg-primary-50 p-2 rounded flex justify-between">
                            <span>Visits: {activeCustomer.totalPurchases}</span>
                            <span>Spent: {formatCurrency(activeCustomer.totalSpent)}</span>
                        </div>
                    </div>
                )}

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-lg font-medium text-gray-500">Cart is empty</p>
                            <p className="text-sm">Scan items or tap to add</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-300 transition-colors shadow-sm">
                                    {/* Item Image */}
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-gray-900 text-sm truncate mr-2">{item.productName}</h4>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-error-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">Size: {item.sizeUk} • {item.color}</p>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-colors text-gray-600"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-colors text-gray-600"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <span className="font-bold text-sm text-gray-900">
                                                {formatCurrency(item.totalPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span className="text-sm">Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>

                        {/* Discount Section */}
                        {discount ? (
                            <div className="flex justify-between text-success-600">
                                <span className="text-sm flex items-center">
                                    Discount ({discount.type === 'percentage' ? `${discount.value}%` : 'Fixed'})
                                    <button onClick={clearDiscount} className="ml-2 hover:text-error-600">
                                        <X size={14} />
                                    </button>
                                </span>
                                <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                            </div>
                        ) : (
                            <div>
                                {isDiscountOpen ? (
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setDiscountType('percentage')}
                                                className={`flex-1 text-xs py-1 rounded ${discountType === 'percentage' ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-white border border-gray-200 text-gray-600'}`}
                                            >
                                                Percentage (%)
                                            </button>
                                            <button
                                                onClick={() => setDiscountType('fixed')}
                                                className={`flex-1 text-xs py-1 rounded ${discountType === 'fixed' ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-white border border-gray-200 text-gray-600'}`}
                                            >
                                                Fixed Amount
                                            </button>
                                        </div>
                                        <div className="flex space-x-2">
                                            <input
                                                type="number"
                                                value={discountInput}
                                                onChange={(e) => setDiscountInput(e.target.value)}
                                                placeholder={discountType === 'percentage' ? "Ex: 10" : "Ex: 500"}
                                                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500"
                                            />
                                            <button
                                                onClick={handleApplyDiscount}
                                                className="bg-primary-600 text-white text-xs px-3 py-1 rounded hover:bg-primary-700"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsDiscountOpen(true)}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                    >
                                        <Tag size={14} className="mr-1" />
                                        Add Discount
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Coupon Section - Only show if no manual discount or if it's a coupon discount */}
                        {!discount || (discount && couponCode) ? (
                            <div>
                                {couponCode ? (
                                    <div className="flex justify-between text-blue-600">
                                        <span className="text-sm flex items-center">
                                            <Ticket size={14} className="mr-1" />
                                            Coupon: {couponCode}
                                            <button onClick={clearDiscount} className="ml-2 hover:text-error-600">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        {isCouponOpen ? (
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2 space-y-2">
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="text"
                                                        value={couponInput}
                                                        onChange={(e) => setCouponInput(e.target.value)}
                                                        placeholder="Enter Coupon Code"
                                                        className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 uppercase"
                                                    />
                                                    <button
                                                        onClick={handleApplyCoupon}
                                                        className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setIsCouponOpen(true)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center mt-2"
                                            >
                                                <Ticket size={14} className="mr-1" />
                                                Have a Coupon?
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : null}

                        <div className="flex justify-between text-gray-600">
                            <span className="text-sm">Tax ({(taxRate * 100).toFixed(0)}%)</span>
                            <span className="font-medium">{formatCurrency(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                            <span>Total</span>
                            <span>{formatCurrency(totalAmount)}</span>
                        </div>
                    </div>

                    <Button
                        fullWidth
                        size="lg"
                        variant="primary"
                        disabled={items.length === 0}
                        className="shadow-xl shadow-primary-500/20"
                        onClick={() => navigate('/payment')}
                    >
                        Pay {formatCurrency(totalAmount)}
                    </Button>
                </div>
            </div>

            {/* Mobile Bottom Cart Bar (Visible if !isCartOpen) */}
            {!isCartOpen && items.length > 0 && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-30">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full bg-slate-900 text-white rounded-xl py-3 px-4 flex items-center justify-between shadow-lg"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="bg-primary-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                {items.reduce((acc, item) => acc + item.quantity, 0)}
                            </div>
                            <span className="font-medium">View Order</span>
                        </div>
                        <span className="font-bold">{formatCurrency(totalAmount)}</span>
                    </button>
                </div>
            )}

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
            />
        </div>
    );
};

// Helper for empty cart icon
function ShoppingCart(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
    );
}
