'use client';

import React from 'react';
import { Category } from '@/lib/types';

interface CategoriesBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (slug: string) => void;
}

export const CategoriesBar: React.FC<CategoriesBarProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
      <button
        onClick={() => onSelect('Todos')}
        className={`px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 rounded whitespace-nowrap border ${
          selectedCategory === 'Todos'
            ? 'bg-koukou-black text-white border-koukou-black shadow-md'
            : 'bg-white text-koukou-black border-koukou-border hover:border-koukou-gold hover:text-koukou-gold'
        }`}
      >
        Todos
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 rounded whitespace-nowrap border flex items-center gap-2 ${
            selectedCategory === cat.id
              ? 'bg-koukou-black text-white border-koukou-black shadow-md'
              : 'bg-white text-koukou-black border-koukou-border hover:border-koukou-gold hover:text-koukou-gold'
          }`}
        >
          {cat.icon && <span>{cat.icon}</span>}
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
};
