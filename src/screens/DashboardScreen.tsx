import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Package,
    AlertTriangle,
    ShoppingCart,
    Plus,
    FileText,
    Users
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSales } from '../hooks/useSales';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/format';

export const DashboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { orders } = useSales();
    const { products } = useProducts();

    // Stats Calculation
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(o => new Date(o.orderDate) >= todayStart);
    const todayRevenue = todayOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const totalOrdersCount = todayOrders.length;

    // Inventory Alerts
    const lowStockThreshold = 10;
    const lowStockProducts = products.filter(p => {
        const totalStock = p.variants?.reduce((acc, v) => acc + v.stockQuantity, 0) || 0;
        return totalStock <= lowStockThreshold;
    });

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back, {user?.name}</p>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Today's Sales"
                    value={formatCurrency(todayRevenue)}
                    icon={TrendingUp}
                    color="bg-primary-500"
                    subtext={`${totalOrdersCount} orders today`}
                />
                <StatsCard
                    title="Low Stock Items"
                    value={lowStockProducts.length.toString()}
                    icon={AlertTriangle}
                    color="bg-orange-500"
                    subtext="Items require attention"
                    onClick={() => navigate('/inventory')}
                    clickable
                />
                <StatsCard
                    title="Total Products"
                    value={products.length.toString()}
                    icon={Package}
                    color="bg-blue-500"
                    subtext="Active SKU codes"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Actions */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <QuickActionButton
                                icon={ShoppingCart}
                                label="New Sale"
                                color="text-green-600 bg-green-50 hover:bg-green-100"
                                onClick={() => navigate('/billing')}
                            />
                            <QuickActionButton
                                icon={Plus}
                                label="Add Product"
                                color="text-blue-600 bg-blue-50 hover:bg-blue-100"
                                onClick={() => navigate('/inventory')}
                            />
                            <QuickActionButton
                                icon={Users}
                                label="Manage Customers"
                                color="text-purple-600 bg-purple-50 hover:bg-purple-100"
                                onClick={() => navigate('/customers')}
                            />
                            <QuickActionButton
                                icon={FileText}
                                label="View Reports"
                                color="text-orange-600 bg-orange-50 hover:bg-orange-100"
                                onClick={() => navigate('/reports')}
                            />
                        </div>
                    </section>

                    {/* Low Stock Alerts Widget */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                <AlertTriangle size={20} className="text-orange-500 mr-2" />
                                Inventory Alerts
                            </h2>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')}>View All</Button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {lowStockProducts.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Package size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>All stock levels are healthy!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {lowStockProducts.slice(0, 5).map(product => {
                                        const stock = product.variants?.reduce((acc, v) => acc + v.stockQuantity, 0) || 0;
                                        return (
                                            <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                        <p className="text-xs text-gray-500">{product.sku}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${stock === 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                                                        }`}>
                                                        {stock} remaining
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Widgets (e.g. Recent Activity or simplified Reports) */}
                <div className="space-y-8">
                    <Card className="p-0 border-gray-200 shadow-sm overflow-hidden h-full">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-900">Recent Sales</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {todayOrders.length === 0 ? (
                                <div className="p-6 text-center text-sm text-gray-500">No sales today yet.</div>
                            ) : (
                                todayOrders.slice(0, 8).map(order => (
                                    <div key={order.id} className="p-3 flex justify-between items-center text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">#{order.orderNumber}</span>
                                            <span className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        {todayOrders.length > 0 && (
                            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                                <button onClick={() => navigate('/reports')} className="text-xs font-semibold text-primary-600 hover:text-primary-700">View All Report</button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon: Icon, color, subtext, onClick, clickable }: any) => (
    <Card
        className={`p-6 border border-gray-200 shadow-sm relative overflow-hidden group ${clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        onClick={onClick}
    >
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-xl ${color} text-white shadow-lg shadow-${color.split('-')[1]}-500/30`}>
                <Icon size={24} />
            </div>
        </div>
        {/* Decorative background circle */}
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 ${color}`} />
    </Card>
);

const QuickActionButton = ({ icon: Icon, label, color, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm ${color}`}
    >
        <Icon size={28} className="mb-2 opacity-90" />
        <span className="text-sm font-bold">{label}</span>
    </button>
);
