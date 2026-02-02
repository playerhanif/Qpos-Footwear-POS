import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    users: User[];
    isAuthenticated: boolean;
    login: (pin: string) => Promise<boolean>;
    logout: () => void;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (id: string, data: Partial<User>) => void;
    deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: User[] = [
    { id: '1', name: 'Admin User', role: 'ADMIN', pin: '1234', isActive: true },
    { id: '2', name: 'Cashier Jane', role: 'CASHIER', pin: '0000', isActive: true },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('qpos-users');
        return saved ? JSON.parse(saved) : DEFAULT_USERS;
    });

    // Save users to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('qpos-users', JSON.stringify(users));
    }, [users]);

    // Check for persisted session on load
    useEffect(() => {
        const savedSession = localStorage.getItem('qpos-session');
        if (savedSession) {
            setUser(JSON.parse(savedSession));
        }
    }, []);

    const login = async (pin: string): Promise<boolean> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundUser = users.find(u => u.pin === pin);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('qpos-session', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('qpos-session');
    };

    const addUser = (newUser: Omit<User, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setUsers(prev => [...prev, { ...newUser, id, isActive: true }]);
    };

    const updateUser = (id: string, data: Partial<User>) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    };

    const deleteUser = (id: string) => {
        setUsers(prev => {
            if (prev.length <= 1) {
                alert("Cannot delete the last user.");
                return prev;
            }
            return prev.filter(u => u.id !== id);
        });
    };

    return (
        <AuthContext.Provider value={{ user, users, isAuthenticated: !!user, login, logout, addUser, updateUser, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
