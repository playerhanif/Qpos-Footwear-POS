import React, { useState } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, CreditCard } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useSales } from '../hooks/useSales';
import { formatCurrency } from '../utils/format';
import { motion } from 'framer-motion';

export const ReportsScreen: React.FC = () => {
    const { orders } = useSales();
    const [dateFilter, setDateFilter] = useState('today');

    // Filter orders based on selected date range
    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (dateFilter === 'today') {
            return orderDate >= startOfDay;
        } else if (dateFilter === 'week') {
            const startOfWeek = new Date(startOfDay);
            startOfWeek.setDate(startOfDay.getDate() - 7);
            return orderDate >= startOfWeek;
        } else if (dateFilter === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return orderDate >= startOfMonth;
        }
        return true;
    });

    const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRevenue = orders
        .filter(o => new Date(o.orderDate) >= todayStart)
        .reduce((acc, o) => acc + o.totalAmount, 0);

    // Group orders by payment method for simple analysis
    // Type 'Order' from 'db' might have optional or specific string for paymentMethod.
    // In db, it's defined in types as 'pending' | 'partial' | 'paid' etc for status, 
    // but we need the METHOD from payments array? 
    // Wait, Order interface has `items` and `payments` array. 
    // It does NOT have top-level `paymentMethod` string in the DB schema/types anymore?
    // Let's check types/index.ts:
    // export interface Order { ... payments: Payment[]; ... }
    // export interface Payment { ... paymentMethod: 'cash' | 'card' ... }

    // We should look at payments[0].paymentMethod or aggregate multiple payments.
    // For simplicity, let's assume one payment method per order or take the first one.

    const paymentMethods = filteredOrders.reduce((acc, order) => {
        // If there are no payments, mark as unknown
        const method = order.payments?.[0]?.paymentMethod || 'unknown';
        acc[method] = (acc[method] || 0) + order.totalAmount;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
                    <p className="text-gray-500">Overview of your store performance</p>
                </div>
                <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                    {['today', 'week', 'month'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setDateFilter(filter)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${dateFilter === filter
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SummaryCard
                    title="Total Revenue"
                    value={formatCurrency(totalRevenue)}
                    icon={TrendingUp}
                    trend="+12.5%"
                    trendUp={true}
                    color="bg-primary-500"
                />
                <SummaryCard
                    title="Today's Sales"
                    value={formatCurrency(todayRevenue)}
                    icon={BarChart3}
                    trend="Just now"
                    trendUp={true}
                    color="bg-success-500"
                />
                <SummaryCard
                    title="Total Orders"
                    value={totalOrders.toString()}
                    icon={ShoppingBag}
                    trend="+5"
                    trendUp={true}
                    color="bg-blue-500"
                />
                <SummaryCard
                    title="Avg. Order Value"
                    value={formatCurrency(averageOrderValue)}
                    icon={CreditCard}
                    trend="Stable"
                    trendUp={true}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">Recent Transactions</h3>
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Order ID</th>
                                        <th className="px-6 py-4 text-left">Date</th>
                                        <th className="px-6 py-4 text-left">Items</th>
                                        <th className="px-6 py-4 text-left">Method</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                No transactions found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.slice(0, 5).map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-mono text-gray-600">#{order.orderNumber}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(order.orderDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                    {order.items.length} items
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {order.payments?.[0]?.paymentMethod || 'unknown'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                                                    {formatCurrency(order.totalAmount)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Payment Breakdown */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
                        <h3 className="font-bold text-gray-900 mb-6">Sales by Payment Method</h3>
                        <div className="space-y-4">
                            {Object.entries(paymentMethods).map(([method, amount], index) => (
                                <div key={method} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="capitalize font-medium text-gray-700">{method}</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(amount / totalRevenue) * 100}%` }}
                                            className={`h-2 rounded-full ${['bg-primary-500', 'bg-success-500', 'bg-blue-500', 'bg-orange-500'][index % 4]
                                                }`}
                                        />
                                    </div>
                                </div>
                            ))}
                            {Object.keys(paymentMethods).length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-8">No sales data yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, icon: Icon, trend, trendUp, color }: any) => (
    <Card className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                {trend}
            </span>
        </div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
    </Card>
);
