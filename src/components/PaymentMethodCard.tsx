import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from './ui/Card';

interface PaymentMethodCardProps {
    id: string;
    name: string;
    icon: LucideIcon;
    selected: boolean;
    onClick: () => void;
    description?: string;
    disabled?: boolean;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
    name,
    icon: Icon,
    selected,
    onClick,
    description,
    disabled
}) => {
    return (
        <Card
            onClick={disabled ? undefined : onClick}
            padding="lg"
            className={`
        relative overflow-hidden transition-all duration-200 cursor-pointer border-2
        ${selected
                    ? 'border-primary-600 bg-primary-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                }
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
      `}
        >
            <div className="flex items-center space-x-4">
                <div className={`
          p-3 rounded-xl transition-colors
          ${selected ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}
        `}>
                    <Icon size={32} />
                </div>
                <div>
                    <h3 className={`font-bold text-lg ${selected ? 'text-primary-900' : 'text-gray-900'}`}>
                        {name}
                    </h3>
                    {description && (
                        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                    )}
                </div>
            </div>

            {/* Selection Checkmark */}
            {selected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center animate-scale-in">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}
        </Card>
    );
};
