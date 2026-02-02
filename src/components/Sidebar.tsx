import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, BarChart3, Settings, Package, LogOut, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
    const { user, logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['ADMIN'] },
        { icon: ShoppingCart, label: 'Billing', path: '/billing', roles: ['ADMIN', 'CASHIER'] },
        { icon: Package, label: 'Inventory', path: '/inventory', roles: ['ADMIN'] },
        { icon: Users, label: 'Customers', path: '/customers', roles: ['ADMIN'] },
        { icon: BarChart3, label: 'Reports', path: '/reports', roles: ['ADMIN'] },
        { icon: Users, label: 'Staff', path: '/users', roles: ['ADMIN'] },
        { icon: Settings, label: 'Settings', path: '/settings', roles: ['ADMIN'] },
    ];

    const filteredNavItems = navItems.filter(item =>
        user && item.roles.includes(user.role)
    );

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl">
            {/* Brand */}
            <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <LayoutDashboard size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Qpos</h1>
                    <p className="text-xs text-slate-400">Retail Manager</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {filteredNavItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20 font-medium'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }
            `}
                        onClick={onClose}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={22} className={isActive ? 'text-white' : 'text-slate-500'} />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User / Footer */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                >
                    <LogOut size={22} />
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-white">{user?.name}</span>
                        <span className="text-xs">Logout</span>
                    </div>
                </button>
                <div className="mt-4 px-4 text-xs text-slate-600 text-center">
                    v1.0.0 • Qpos Systems
                </div>
            </div>
        </div>
    );
};
