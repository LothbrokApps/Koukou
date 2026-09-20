'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cartContext';
import { ShoppingBag, Heart, Search, Menu, X, Sparkles, SlidersHorizontal } from 'lucide-react';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  onCategorySelect?: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onCategorySelect }) => {
  const { cartCount, wishlist, setIsCartOpen, setIsQuizOpen, setIsBoxBuilderOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (category?: string) => {
    setMobileMenuOpen(false);
    if (category && onCategorySelect) {
      onCategorySelect(category);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-300 ${
          scrolled ? 'shadow-md border-b border-koukou-border/60 py-1' : 'border-b border-koukou-border'
        }`}
      >
        <div className="max-w-[1400px] h-[74px] mx-auto px-4 md:px-[4%] flex items-center justify-between">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-koukou-black hover:text-koukou-gold transition"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-1">
            <span className="text-3xl font-black tracking-tighter text-koukou-black">
              KOU<span className="text-koukou-gold group-hover:text-koukou-goldLight transition-colors">KOU</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold uppercase tracking-wider text-koukou-black">
            <Link
              href="#inicio"
              className="hover:text-koukou-gold transition-colors duration-200"
              onClick={() => handleNavClick()}
            >
              Inicio
            </Link>
            <Link
              href="#productos"
              className="hover:text-koukou-gold transition-colors duration-200"
              onClick={() => handleNavClick('Todos')}
            >
              Catálogo
            </Link>
            <button
              onClick={() => {
                setIsBoxBuilderOpen(true);
              }}
              className="text-koukou-gold hover:text-koukou-goldLight flex items-center gap-1 font-bold transition-transform hover:scale-105"
            >
              <Sparkles size={15} />
              Arma tu Caja
            </button>
            <Link
              href="#chocolates"
              className="hover:text-koukou-gold transition-colors duration-200"
              onClick={() => handleNavClick('chocolates')}
            >
              Bonbons
            </Link>
            <Link
              href="#productos"
              className="hover:text-koukou-gold transition-colors duration-200"
              onClick={() => handleNavClick('reposteria')}
            >
              Repostería
            </Link>
            <Link
              href="#productos"
              className="hover:text-koukou-gold transition-colors duration-200"
              onClick={() => handleNavClick('cafe')}
            >
              Café
            </Link>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="hover:text-koukou-gold transition-colors duration-200 flex items-center gap-1 text-gray-700"
            >
              Descubre tu Sabor
            </button>
            <Link
              href="#contacto"
              className="hover:text-koukou-gold transition-colors duration-200"
            >
              Contacto
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4 text-koukou-black">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-koukou-gold transition-colors relative"
              title="Buscar productos o sabores"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              href="#productos"
              className="p-2 hover:text-koukou-gold transition-colors relative hidden sm:block"
              title="Favoritos"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-koukou-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:text-koukou-gold transition-colors relative flex items-center"
              title="Ver mi pedido"
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-koukou-gold text-black font-extrabold text-[11px] rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Switcher */}
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#14110f] text-white hover:bg-koukou-gold hover:text-black transition-all rounded"
              title="Panel Administrativo"
            >
              <SlidersHorizontal size={13} />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-koukou-border px-6 py-5 flex flex-col gap-4 text-sm font-semibold tracking-wide animate-fadeIn">
            <Link
              href="#inicio"
              className="py-2 border-b border-gray-100"
              onClick={() => handleNavClick()}
            >
              Inicio
            </Link>
            <Link
              href="#productos"
              className="py-2 border-b border-gray-100"
              onClick={() => handleNavClick('Todos')}
            >
              Catálogo Completo
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsBoxBuilderOpen(true);
              }}
              className="py-2 border-b border-gray-100 text-left text-koukou-gold font-bold flex items-center gap-2"
            >
              <Sparkles size={16} />
              Arma tu Caja de Bonbons
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsQuizOpen(true);
              }}
              className="py-2 border-b border-gray-100 text-left flex items-center gap-2"
            >
              ✨ Descubre tu Chocolate
            </button>
            <Link
              href="#chocolates"
              className="py-2 border-b border-gray-100"
              onClick={() => handleNavClick('chocolates')}
            >
              Bonbons KOUKOU
            </Link>
            <Link
              href="#productos"
              className="py-2 border-b border-gray-100"
              onClick={() => handleNavClick('reposteria')}
            >
              Repostería & Alfajores
            </Link>
            <Link
              href="#productos"
              className="py-2 border-b border-gray-100"
              onClick={() => handleNavClick('cafe')}
            >
              Café & Bebidas
            </Link>
            <Link
              href="#contacto"
              className="py-2 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
            <Link
              href="/admin"
              className="py-2 text-koukou-gold font-bold flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <SlidersHorizontal size={16} />
              Panel Administrador KOUKOU
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
