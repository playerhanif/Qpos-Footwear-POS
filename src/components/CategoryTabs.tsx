import React from 'react';
import type { Category } from '../types';

interface CategoryTabsProps {
    categories: Category[];
    activeCategoryId: number;
    onSelect: (categoryId: number) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
    categories,
    activeCategoryId,
    onSelect,
}) => {
    return (
        <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <div className="flex space-x-3 min-w-max px-1 p-1">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelect(category.id)}
                        className={`
              px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 outline-none
              ${activeCategoryId === category.id
                                ? 'bg-primary-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-primary-600'
                            }
            `}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
