'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { StoreSettings } from '@/lib/types';

interface FloatingWhatsAppProps {
  settings?: StoreSettings | null;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const phone = (settings?.whatsappPhone || '528442924776').replace(/[^0-9]/g, '');
  const defaultText = encodeURIComponent('¡Hola KOUKOU! Me gustaría consultar disponibilidad de chocolates y hacer un pedido.');

  return (
    <a
      href={`https://wa.me/${phone}?text=${defaultText}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-5 bottom-5 z-40 w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl whatsapp-pulse transition-all duration-300 hover:scale-110"
      aria-label="Contactar a KOUKOU por WhatsApp"
      title="Hablar con KOUKOU en WhatsApp (844 292 4776)"
    >
      <MessageCircle size={28} />
    </a>
  );
};
