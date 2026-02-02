import React, { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon: Icon, iconPosition = 'left', className = '', ...props }, ref) => {
        const baseStyles = 'w-full px-4 py-2 text-base border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const stateStyles = error
            ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';

        const iconPaddingStyles = Icon
            ? iconPosition === 'left'
                ? 'pl-10'
                : 'pr-10'
            : '';

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {Icon && iconPosition === 'left' && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon size={20} className="text-gray-400" />
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`${baseStyles} ${stateStyles} ${iconPaddingStyles} ${className}`}
                        {...props}
                    />
                    {Icon && iconPosition === 'right' && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Icon size={20} className="text-gray-400" />
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-sm text-error-600">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
