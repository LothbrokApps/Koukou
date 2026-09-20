'use client';

import React from 'react';
import { StoreSettings } from '@/lib/types';

interface TopbarProps {
  settings?: StoreSettings | null;
}

export const Topbar: React.FC<TopbarProps> = ({ settings }) => {
  const phone = settings?.whatsappPhone || '528442924776';
  const location = settings?.location || 'Saltillo, Coahuila';

  return (
    <div className="bg-koukou-black text-white px-4 md:px-[4%] py-2 text-xs flex justify-between items-center border-b border-white/10 tracking-wide">
      <div className="flex items-center gap-2">
        <span className="text-[#d9b76a] font-bold tracking-wider uppercase">
          {settings?.storeName || 'KOUKOU CHOCOLATERÍA'}
        </span>
        <span className="hidden sm:inline-block text-white/40">|</span>
        <span className="hidden sm:inline text-gray-300 font-light">
          Chocolates artesanales de alta gama
        </span>
      </div>

      <div className="flex items-center gap-4 text-[11px] md:text-xs">
        <span className="hidden md:inline text-gray-300">
          📍 {location}
        </span>
        <span className="hidden md:inline-block text-white/40">•</span>
        <a
          href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#e5b95c] hover:underline font-medium flex items-center gap-1.5"
        >
          <span>💬 WhatsApp: 844 292 4776</span>
        </a>
      </div>
    </div>
  );
};
