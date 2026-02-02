import React from 'react';

export interface CardProps {
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'base' | 'lg';
    hoverable?: boolean;
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    variant = 'default',
    padding = 'base',
    hoverable = false,
    onClick,
    className = '',
    children,
}) => {
    const baseStyles = 'bg-white rounded-lg transition-all duration-200';

    const variantStyles = {
        default: 'shadow-md',
        elevated: 'shadow-lg',
        outlined: 'border-2 border-gray-200 shadow-sm',
    };

    const paddingStyles = {
        none: '',
        sm: 'p-4',
        base: 'p-6',
        lg: 'p-8',
    };

    const hoverStyles = hoverable
        ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl'
        : '';

    const clickableStyles = onClick ? 'cursor-pointer' : '';

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
