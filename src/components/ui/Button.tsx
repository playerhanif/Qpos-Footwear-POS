import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'base' | 'lg' | 'xl';
    loading?: boolean;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'base',
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 active:from-primary-800 active:to-primary-700 shadow-md hover:shadow-lg focus:ring-primary-500',
        secondary: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500',
        outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500',
        ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500',
        danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 shadow-md hover:shadow-lg focus:ring-error-500',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm rounded-md min-h-[36px]',
        base: 'px-4 py-2 text-base rounded-md min-h-[44px]',
        lg: 'px-6 py-3 text-lg rounded-lg min-h-[52px]',
        xl: 'px-8 py-4 text-xl rounded-xl min-h-[60px]',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    const iconSize = {
        sm: 16,
        base: 20,
        lg: 24,
        xl: 28,
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Loading...
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && (
                        <Icon size={iconSize[size]} className="mr-2" />
                    )}
                    {children}
                    {Icon && iconPosition === 'right' && (
                        <Icon size={iconSize[size]} className="ml-2" />
                    )}
                </>
            )}
        </button>
    );
};
