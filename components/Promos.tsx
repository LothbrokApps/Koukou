'use client';

import React from 'react';
import { Promotion } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';

interface PromosProps {
  promos?: Promotion[];
  onSelectCategory?: (category: string) => void;
}

export const Promos: React.FC<PromosProps> = ({ promos, onSelectCategory }) => {
  const defaultPromos = [
    {
      id: '1',
      title: 'Bonbons KOUKOU',
      subtitle: 'Descubre nuestros rellenos exóticos.',
      kicker: 'EDICIÓN ARTESANAL',
      buttonText: 'VER CHOCOLATES',
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
      category: 'chocolates',
    },
    {
      id: '2',
      title: 'Repostería Fina',
      subtitle: 'Un antojo merece algo especial.',
      kicker: 'HORNEADO HOY',
      buttonText: 'DESCUBRIR',
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
      category: 'reposteria',
    },
    {
      id: '3',
      title: 'Café & Frappé',
      subtitle: 'El complemento perfecto para tu chocolate.',
      kicker: 'ESPECIALIDAD',
      buttonText: 'VER MENÚ',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      category: 'cafe',
    },
  ];

  const items = promos && promos.length > 0 ? promos : defaultPromos;

  return (
    <div className="max-w-[1320px] mx-auto my-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((promo: any, idx) => (
        <div
          key={promo.id || idx}
          className="group relative min-h-[160px] sm:min-h-[175px] p-7 flex flex-col justify-end overflow-hidden rounded shadow-sm border border-koukou-border/50 hover:shadow-lg transition-all duration-300"
          style={{
            backgroundImage: `url("${promo.image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent transition-opacity group-hover:from-black/90" />

          {/* Content */}
          <div className="relative z-10 text-white">
            {promo.kicker && (
              <span className="text-[10px] font-bold text-koukou-gold uppercase tracking-wider block mb-1">
                {promo.kicker}
              </span>
            )}
            <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight mb-1 text-white">
              {promo.title}
            </h3>
            <p className="text-gray-200 text-xs sm:text-sm mb-4 line-clamp-1 font-light">
              {promo.subtitle}
            </p>

            <button
              onClick={() => {
                if (onSelectCategory && promo.category) {
                  onSelectCategory(promo.category);
                } else {
                  const el = document.getElementById('productos');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white hover:bg-koukou-gold text-black text-xs font-bold py-2 px-4 rounded-sm transition-all duration-200 inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>{promo.buttonText || 'EXPLORAR'}</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
