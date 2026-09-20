'use client';

import React from 'react';
import { StoreContent } from '@/lib/types';
import { useCart } from '@/lib/cartContext';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeatureSectionProps {
  content?: StoreContent | null;
  onExplore?: () => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ content, onExplore }) => {
  const { setIsBoxBuilderOpen } = useCart();

  const kicker = content?.featureKicker || 'ESPECIALIDAD KOUKOU';
  const title = content?.featureTitle || 'Chocolate con personalidad.';
  const description =
    content?.featureDescription ||
    'Nuestros bonbons son el corazón de KOUKOU: pequeños chocolates rellenos creados para sorprender desde el primer mordisco. Cada ganache equilibra cacao fino y texturas inolvidables.';
  const image =
    content?.featureImage ||
    'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1200&q=85';

  return (
    <section
      id="chocolates"
      className="max-w-[1320px] mx-auto my-12 bg-koukou-cream grid grid-cols-1 md:grid-cols-2 min-h-[320px] sm:rounded-lg overflow-hidden border border-koukou-border/60 shadow-sm"
    >
      <div
        className="min-h-[280px] md:min-h-[360px] bg-center bg-cover"
        style={{ backgroundImage: `url("${image}")` }}
      />

      <div className="p-8 sm:p-12 md:p-14 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-koukou-gold font-bold text-xs uppercase tracking-[3px] mb-3">
          <Sparkles size={14} />
          <span>{kicker}</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-koukou-black mb-4 leading-tight">
          {title}
        </h2>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 font-light">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => {
              if (onExplore) onExplore();
              else {
                const el = document.getElementById('productos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-dark text-xs sm:text-sm font-bold uppercase tracking-wider py-3.5 px-6 rounded-sm shadow-md"
          >
            <span>EXPLORAR BONBONS</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => setIsBoxBuilderOpen(true)}
            className="text-xs sm:text-sm font-bold text-koukou-gold hover:underline py-3 px-2 flex items-center gap-1"
          >
            <span>Personalizar caja de sabores</span>
            <Sparkles size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
