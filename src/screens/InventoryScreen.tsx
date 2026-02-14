import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, AlertTriangle, Package, History, CheckCircle, XCircle, Download, Upload } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';
import { parseCSV } from '../utils/csvImport';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../utils/format';
import { ProductFormModal } from '../components/ProductFormModal';
import { StockAdjustmentModal } from '../components/StockAdjustmentModal';
import { StockHistoryModal } from '../components/StockHistoryModal';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';

export const InventoryScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyModalProduct, setHistoryModalProduct] = useState<Product | null>(null);
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();

    const handleAdjustStock = (product: Product) => {
        setStockModalProduct(product);
        setIsStockModalOpen(true);
    };

    const handleViewHistory = (product: Product) => {
        setHistoryModalProduct(product);
        setIsHistoryModalOpen(true);
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = products.map(p => ({
            Name: p.name,
            SKU: p.sku,
            Category: p.category?.name || '',
            Brand: p.brand?.name || '',
            Price: p.basePrice,
            Stock: p.variants?.reduce((acc, v) => acc + v.stockQuantity, 0) || 0,
            ImageUrl: p.imageUrl || ''
        }));
        exportToCSV(data, `inventory-${new Date().toISOString().split('T')[0]}`);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            if (text) {
                try {
                    const data = parseCSV(text);
                    let addedCount = 0;

                    // Basic validation and import
                    // In a real app, strict validation is needed
                    for (const row of data) {
                        if (row.Name && row.Price) {
                            // Minimal mapping for demo
                            await addProduct({
                                name: row.Name,
                                sku: row.SKU || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                basePrice: parseFloat(row.Price) || 0,
                                categoryId: 1, // Default to first category if not found
                                brandId: 1,
                                description: row.Description || '',
                                imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', // Placeholder
                                variants: [
                                    {
                                        id: Date.now(),
                                        sizeUk: 8,
                                        color: 'Default',
                                        stockQuantity: parseInt(row.Stock) || 0,
                                        priceAdjustment: 0
                                    }
                                ]
                            } as any);
                            addedCount++;
                        }
                    }
                    alert(`Successfully imported ${addedCount} products.`);
                    // Reset input
                    if (fileInputRef.current) fileInputRef.current.value = '';
                } catch (error) {
                    console.error('Import failed', error);
                    alert('Failed to import products. Please check the CSV format.');
                }
            }
        };
        reader.readAsText(file);
    };

    const filteredProducts = products.filter(product => {
        const query = searchQuery.toLowerCase();
        return (
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query) ||
            (product.category?.name || '').toLowerCase().includes(query)
        );
    });

    const handleSaveProduct = (productData: any) => {
        if (selectedProduct) {
            updateProduct(selectedProduct.id, productData);
        } else {
            addProduct(productData);
        }
        setIsAddModalOpen(false);
        setSelectedProduct(null);
    };

    const handleEditProduct = (product: any) => {
        setSelectedProduct(product);
        setIsAddModalOpen(true);
    };

    const handleDeleteProduct = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    // Status Badge Helper
    const StockStatusBadge = ({ count }: { count: number }) => {
        if (count === 0) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    <XCircle size={12} className="mr-1" />
                    Out of Stock
                </span>
            );
        }
        if (count < 10) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <AlertTriangle size={12} className="mr-1" />
                    Low Stock
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <CheckCircle size={12} className="mr-1" />
                In Stock
            </span>
        );
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Top Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your products and stock levels</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="primary"
                        icon={Plus}
                        size="lg"
                        className="shadow-lg shadow-primary-500/20"
                        onClick={() => {
                            setSelectedProduct(null);
                            setIsAddModalOpen(true);
                        }}
                    >
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="px-8 py-6 flex items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search products by name, SKU..."
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" icon={Filter}>
                        Filter
                    </Button>
                    <Button variant="outline" icon={Upload} onClick={handleImportClick}>
                        Import
                    </Button>
                    <Button variant="outline" icon={Download} onClick={handleExport}>
                        Export
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 px-8 pb-8 overflow-hidden">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-5">Product Details</div>
                        <div className="col-span-2">SKU</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-center">Stock Level</div>
                        <div className="col-span-1 text-center">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredProducts.map((product) => {
                            const totalStock = product.variants?.reduce((acc, v) => acc + v.stockQuantity, 0) || 0;
                            return (
                                <div key={product.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors">
                                    {/* Product */}
                                    <div className="col-span-5 flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                                            <p className="text-xs text-gray-500">{product.category?.name || 'Uncategorized'} • {product.brand?.name || 'Generic'}</p>
                                        </div>
                                    </div>

                                    {/* SKU */}
                                    <div className="col-span-2 text-sm text-gray-600 font-mono">
                                        {product.sku}
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-2 text-right text-sm font-medium text-gray-900">
                                        {formatCurrency(product.basePrice)}
                                    </div>

                                    {/* Stock Status */}
                                    <div className="col-span-2 text-center">
                                        <StockStatusBadge count={totalStock} />
                                        <p className="text-xs text-gray-400 mt-1">
                                            {totalStock} units
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 flex justify-center space-x-2">
                                        <button
                                            onClick={() => handleViewHistory(product)}
                                            className="text-gray-400 hover:text-purple-600 p-1 rounded-md hover:bg-purple-50 transition-colors"
                                            title="View Stock History"
                                        >
                                            <History size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleAdjustStock(product)}
                                            className="text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                            title="Adjust Stock"
                                        >
                                            <Package size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="text-gray-400 hover:text-primary-600 p-1 rounded-md hover:bg-primary-50 transition-colors"
                                            title="Edit Product"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                                            title="Delete Product"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Pagination */}
                    <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                        <p className="text-xs text-gray-500">Showing {products.length} of {products.length} products</p>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" disabled>Previous</Button>
                            <Button variant="outline" size="sm" disabled>Next</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <ProductFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveProduct}
                initialData={selectedProduct}
            />

            {stockModalProduct && (
                <StockAdjustmentModal
                    isOpen={isStockModalOpen}
                    onClose={() => setIsStockModalOpen(false)}
                    product={stockModalProduct}
                />
            )}

            {historyModalProduct && (
                <StockHistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    product={historyModalProduct}
                />
            )}
        </div>
    );
};
