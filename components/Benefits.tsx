'use client';

import React from 'react';
import { StoreSettings } from '@/lib/types';
import { Award, PackageCheck, MessageCircle } from 'lucide-react';

interface BenefitsProps {
  settings?: StoreSettings | null;
}

export const Benefits: React.FC<BenefitsProps> = ({ settings }) => {
  const phone = settings?.whatsappPhone || '528440000000';

  return (
    <div className="max-w-[1320px] mx-auto my-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 border border-koukou-border bg-white rounded shadow-xs divide-y md:divide-y-0 md:divide-x divide-koukou-border">
        {/* Benefit 1 */}
        <div className="p-7 sm:p-8 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-koukou-cream flex items-center justify-center text-koukou-gold shrink-0">
            <Award size={26} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-black mb-1">
              Elaboración Artesanal
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cacao seleccionado y recetas preparadas diariamente con devoción por el detalle.
            </p>
          </div>
        </div>

        {/* Benefit 2 */}
        <div className="p-7 sm:p-8 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-koukou-cream flex items-center justify-center text-koukou-gold shrink-0">
            <PackageCheck size={26} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-black mb-1">
              Cajas & Regalos Personalizados
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Arma combinaciones de sabores a medida para cumpleaños, eventos y empresas.
            </p>
          </div>
        </div>

        {/* Benefit 3 */}
        <div className="p-7 sm:p-8 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-koukou-cream flex items-center justify-center text-[#25d366] shrink-0">
            <MessageCircle size={26} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-black mb-1">
              Atención Directa por WhatsApp
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Haz tu pedido y coordina entrega o pickup en Saltillo al instante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
