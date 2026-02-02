import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export const LoginScreen: React.FC = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleNumberClick = (num: string) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
            setError('');
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError('');
    };

    const handleLogin = async () => {
        if (pin.length !== 4) return;

        setIsLoading(true);
        try {
            const success = await login(pin);
            if (success) {
                navigate('/');
            } else {
                setError('Invalid PIN');
                setPin('');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col md:flex-row"
            >
                {/* Left Side: Brand (Hidden on mobile, visible on larger screens if desired, but sticking to single column for now for simplicity) */}

                <div className="p-8 w-full flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30">
                        <LayoutDashboard size={32} className="text-white" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
                    <p className="text-gray-500 mb-8">Enter your PIN to access Qpos</p>

                    {/* PIN Display */}
                    <div className="w-full mb-8">
                        <div className="flex justify-center space-x-4 mb-2">
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`w-4 h-4 rounded-full transition-all duration-200 ${i < pin.length
                                        ? 'bg-primary-600 scale-110'
                                        : 'bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="h-6 text-center">
                            {error && <span className="text-error-500 text-sm font-medium animate-pulse">{error}</span>}
                        </div>
                    </div>

                    {/* Keypad */}
                    <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleNumberClick(num.toString())}
                                className="h-16 w-full rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 transition-colors"
                            >
                                {num}
                            </button>
                        ))}
                        <div className="flex items-center justify-center">
                            {/* Empty slot */}
                        </div>
                        <button
                            onClick={() => handleNumberClick('0')}
                            className="h-16 w-full rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 transition-colors"
                        >
                            0
                        </button>
                        <button
                            onClick={handleDelete}
                            className="h-16 w-full rounded-xl hover:bg-red-50 active:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <Delete size={24} />
                        </button>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={isLoading || pin.length !== 4}
                        className={`mt-8 w-full py-4 rounded-xl flex items-center justify-center space-x-2 text-white font-bold transition-all ${pin.length === 4
                            ? 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <span>Login</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="mt-6 text-xs text-gray-400 text-center">
                        <p>Default PINs:</p>
                        <p>Admin: 1234 • Cashier: 0000</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
