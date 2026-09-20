'use client';

import React from 'react';
import Link from 'next/link';
import { StoreSettings } from '@/lib/types';
import { Instagram, Facebook, MessageCircle, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  settings?: StoreSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const location = settings?.location || 'Saltillo, Coahuila, México';
  const schedule = settings?.schedule || 'Lunes a Domingo: 10:00 - 21:00';
  const phone = (settings?.whatsappPhone || '528442924776').replace(/[^0-9]/g, '');
  const facebookUrl = settings?.facebook || 'https://www.facebook.com/koukouchocolate';
  const instagramUrl = settings?.instagram || 'https://www.instagram.com/koukou.choco.slw?stkn=bzJoNzR2OWMyMzA5';

  return (
    <footer id="contacto" className="bg-[#080808] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-[4%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="text-3xl font-black tracking-tighter text-white mb-3">
            KOU<span className="text-koukou-gold">KOU</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">
            Chocolatería de autor, bonbons artesanales rellenos, alfajores y café de especialidad. Momentos chidos con una mordida.
          </p>
          <div className="text-xs text-gray-300 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-koukou-gold shrink-0" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-koukou-gold shrink-0" />
              <span>{schedule}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-[#25d366] shrink-0" />
              <span>WhatsApp: (844) 292 4776</span>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-koukou-gold mb-4">
            Catálogo KOUKOU
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <a href="#chocolates" className="hover:text-white transition">
                Bonbons Rellenos
              </a>
            </li>
            <li>
              <a href="#productos" className="hover:text-white transition">
                Alfajores Artesanales (Douce)
              </a>
            </li>
            <li>
              <a href="#productos" className="hover:text-white transition">
                Barras Bean-to-Bar
              </a>
            </li>
            <li>
              <a href="#productos" className="hover:text-white transition">
                Frappé & Café de Origen
              </a>
            </li>
            <li>
              <a href="#productos" className="hover:text-white transition">
                Cajas y Regalos Especiales
              </a>
            </li>
          </ul>
        </div>

        {/* Pedidos & Info */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-koukou-gold mb-4">
            Atención al Cliente
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                Pedidos para Eventos
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                Regalos Corporativos
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                Opciones para Cumpleaños
              </a>
            </li>
            <li>
              <Link href="/admin" className="hover:text-koukou-gold transition font-semibold text-gray-300">
                Acceso Administrador (o teclea &ldquo;koukou2026&rdquo;)
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-koukou-gold mb-4">
            Síguenos
          </h4>
          <p className="text-xs text-gray-400 mb-4">
            Conoce los sabores de temporada y novedades diarias.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-koukou-gold hover:text-black flex items-center justify-center transition shadow"
              aria-label="Instagram de KOUKOU"
              title="Instagram @koukou.choco.slw"
            >
              <Instagram size={18} />
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-koukou-gold hover:text-black flex items-center justify-center transition shadow"
              aria-label="Facebook de KOUKOU"
              title="Facebook KOUKOU Chocolate"
            >
              <Facebook size={18} />
            </a>
            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25d366] hover:text-white flex items-center justify-center transition shadow"
              aria-label="WhatsApp"
              title="WhatsApp: 844 292 4776"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-[4%] mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500">
        <div>
          © {new Date().getFullYear()} KOUKOU Chocolatería · Saltillo, Coahuila · Todos los derechos reservados.
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-4">
          <Link href="/admin" className="text-koukou-gold hover:underline font-medium">
            Panel KOUKOU Admin (Teclea: koukou2026)
          </Link>
        </div>
      </div>
    </footer>
  );
};
