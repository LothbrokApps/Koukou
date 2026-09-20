'use client';

import React from 'react';
import { StoreContent } from '@/lib/types';
import { useCart } from '@/lib/cartContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { transformMediaUrl, isVideoUrl, isYoutubeOrVimeo } from '@/lib/mediaUtils';

interface HeroProps {
  content?: StoreContent | null;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  const { setIsBoxBuilderOpen } = useCart();

  const kicker = content?.heroKicker || 'KOUKOU · CHOCOLATERÍA';
  const title = content?.heroTitle || 'Momentos chidos con una mordida.';
  const description =
    content?.heroDescription ||
    'Chocolate, café y repostería creados para convertir cualquier momento en algo especial.';
  const rawImage =
    content?.heroImage ||
    'https://images.unsplash.com/photo-1575377427642-087cf684f29d?auto=format&fit=crop&w=1800&q=85';

  const mediaSrc = transformMediaUrl(rawImage);
  const isVideo = isVideoUrl(rawImage);
  const isEmbed = isYoutubeOrVimeo(rawImage);

  return (
    <section
      id="inicio"
      className="relative w-full min-h-[540px] sm:min-h-[620px] lg:min-h-[680px] overflow-hidden flex items-center text-white shadow-2xl"
    >
      {/* Background Media: full width edge-to-edge */}
      {isVideo ? (
        <video
          src={mediaSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : isEmbed ? (
        <iframe
          src={mediaSrc}
          title="Hero Video Background"
          className="absolute inset-0 w-full h-full object-cover border-0 pointer-events-none z-0 scale-125"
          allow="autoplay; muted"
        />
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-center bg-cover z-0 transition-all duration-700"
          style={{ backgroundImage: `url("${mediaSrc}")` }}
        />
      )}

      {/* Dark Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 z-10" />

      {/* Content Container (aligned to grid) */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 py-16 sm:py-24">
        <div className="max-w-[660px]">
          <div className="inline-flex items-center gap-2 text-[#e6bd62] text-xs sm:text-sm tracking-[4px] font-bold uppercase mb-4 px-3 py-1.5 rounded bg-black/50 border border-[#e6bd62]/35 backdrop-blur-md">
            <Sparkles size={14} className="text-[#e6bd62]" />
            <span>{kicker}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-[68px] font-bold leading-[1.06] mb-6 tracking-tight text-white drop-shadow-md">
            {title}
          </h1>

          <p className="text-gray-200 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-xl font-light drop-shadow">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#productos"
              className="btn-gold rounded text-sm sm:text-base font-bold shadow-xl hover:scale-105"
            >
              <span>DESCUBRIR KOUKOU</span>
              <ArrowRight size={18} />
            </a>

            <button
              onClick={() => setIsBoxBuilderOpen(true)}
              className="px-6 py-3.5 bg-black/60 hover:bg-white hover:text-black text-white border border-white/60 font-semibold text-sm sm:text-base transition-all rounded backdrop-blur-md flex items-center gap-2 shadow-lg"
            >
              <Sparkles size={16} className="text-koukou-gold" />
              <span>Arma tu Caja Personalizada</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
