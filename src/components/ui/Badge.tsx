import React from 'react';

export interface BadgeProps {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    size?: 'sm' | 'base';
    className?: string;
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'neutral',
    size = 'base',
    className = '',
    children,
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';

    const variantStyles = {
        success: 'bg-success-100 text-success-700',
        warning: 'bg-warning-100 text-warning-700',
        error: 'bg-error-100 text-error-700',
        info: 'bg-primary-100 text-primary-700',
        neutral: 'bg-gray-100 text-gray-700',
    };

    const sizeStyles = {
        sm: 'px-2 py-0.5 text-xs',
        base: 'px-3 py-1 text-sm',
    };

    return (
        <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
            {children}
        </span>
    );
};
