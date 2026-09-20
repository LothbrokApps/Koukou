'use client';

import React from 'react';
import { StoreContent } from '@/lib/types';
import { useCart } from '@/lib/cartContext';
import { Sparkles, Gift } from 'lucide-react';

interface BannerSectionProps {
  content?: StoreContent | null;
}

export const BannerSection: React.FC<BannerSectionProps> = ({ content }) => {
  const { setIsBoxBuilderOpen } = useCart();

  const kicker = content?.bannerKicker || 'KOUKOU MOMENTS';
  const title = content?.bannerTitle || 'Un chocolate. Un momento.';
  const description =
    content?.bannerDescription || 'Regala, comparte o simplemente date el gusto.';
  const image =
    content?.bannerImage ||
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=85';

  return (
    <section
      className="relative max-w-[1320px] mx-auto my-12 min-h-[220px] sm:min-h-[240px] p-8 sm:p-14 text-white sm:rounded-lg overflow-hidden flex flex-col justify-center shadow-lg"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(5, 5, 5, 0.9) 0%, rgba(5, 5, 5, 0.45) 100%), url("${image}")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="relative z-10 max-w-xl">
        <span className="text-[11px] font-bold text-koukou-gold uppercase tracking-[3px] block mb-2">
          {kicker}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-2 text-white">
          {title}
        </h2>
        <p className="text-gray-200 text-sm sm:text-base mb-6 font-light">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              const el = document.getElementById('productos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-gold text-xs sm:text-sm font-bold uppercase tracking-wider py-3 px-6 rounded-sm shadow-md"
          >
            VER COLECCIÓN
          </button>
          <button
            onClick={() => setIsBoxBuilderOpen(true)}
            className="px-5 py-3 text-xs sm:text-sm font-bold bg-white/10 hover:bg-white text-white hover:text-black border border-white/40 transition rounded-sm flex items-center gap-2"
          >
            <Gift size={16} />
            <span>Cajas para Regalo</span>
          </button>
        </div>
      </div>
    </section>
  );
};
