'use client';

import React, { useState, useEffect } from 'react';
import { Topbar } from '@/components/Topbar';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Promos } from '@/components/Promos';
import { CategoriesBar } from '@/components/CategoriesBar';
import { ProductsGrid } from '@/components/ProductsGrid';
import { FeatureSection } from '@/components/FeatureSection';
import { BannerSection } from '@/components/BannerSection';
import { Benefits } from '@/components/Benefits';
import { Footer } from '@/components/Footer';
import { Category, Product, Promotion, StoreContent, StoreSettings } from '@/lib/types';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_PROMOTIONS,
  DEFAULT_CONTENT,
  DEFAULT_SETTINGS,
} from '@/lib/defaultData';
import { Sparkles, ArrowUpDown } from 'lucide-react';

export default function HomePage() {
  // Pre-initialize with default official KOUKOU data so it NEVER renders blank or breaks
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [promos, setPromos] = useState<Promotion[]>(DEFAULT_PROMOTIONS);
  const [content, setContent] = useState<StoreContent | null>(DEFAULT_CONTENT);
  const [settings, setSettings] = useState<StoreSettings | null>(DEFAULT_SETTINGS);

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes, promoRes, contentRes, settingsRes] = await Promise.all([
          fetch('/api/categories').catch(() => null),
          fetch('/api/products').catch(() => null),
          fetch('/api/promotions').catch(() => null),
          fetch('/api/content').catch(() => null),
          fetch('/api/settings').catch(() => null),
        ]);

        if (catRes?.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData) && catData.length) setCategories(catData);
        }
        if (prodRes?.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData) && prodData.length) setProducts(prodData);
        }
        if (promoRes?.ok) {
          const promoData = await promoRes.json();
          if (Array.isArray(promoData) && promoData.length) setPromos(promoData);
        }
        if (contentRes?.ok) {
          const contentData = await contentRes.json();
          if (contentData?.heroTitle) setContent(contentData);
        }
        if (settingsRes?.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData?.whatsappPhone) setSettings(settingsData);
        }
      } catch (err) {
        console.warn('Using default KOUKOU data:', err);
      }
    }
    loadData();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const el = document.getElementById('productos');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter and sort products
  let filtered = products;
  if (selectedCategory !== 'Todos') {
    filtered = filtered.filter((p) => p.categoryId === selectedCategory);
  }

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else {
    // Featured first
    filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* 1. Top Bar */}
      <Topbar settings={settings} />

      {/* 2. Header */}
      <Header onCategorySelect={handleCategorySelect} />

      {/* 3. Hero Section (Edge-to-Edge Full Width) */}
      <Hero content={content} />

      {/* 4. Promos Grid */}
      <Promos promos={promos} onSelectCategory={handleCategorySelect} />

      {/* 5. Products Section */}
      <section id="productos" className="max-w-[1320px] mx-auto my-12 px-4 w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-koukou-border/40 gap-4">
          <div>
            <div className="flex items-center gap-1 text-koukou-gold font-bold text-xs uppercase tracking-widest mb-1">
              <Sparkles size={13} />
              <span>ALTA CHOCOLATERÍA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-koukou-black tracking-tight">
              PRODUCTOS <span className="text-koukou-gold">DESTACADOS</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Recetas exclusivas elaboradas artesanalmente con los mejores granos de cacao.
            </p>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
              <ArrowUpDown size={13} /> Ordenar:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-white text-gray-700 outline-none font-semibold cursor-pointer hover:border-koukou-gold"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mb-6">
          <CategoriesBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        <ProductsGrid products={filtered} />
      </section>

      {/* 6. Feature Section (Chocolate con personalidad) */}
      <FeatureSection
        content={content}
        onExplore={() => handleCategorySelect('chocolates')}
      />

      {/* 7. Banner Section (KOUKOU Moments) */}
      <BannerSection content={content} />

      {/* 8. Benefits */}
      <Benefits settings={settings} />

      {/* 9. Footer */}
      <Footer settings={settings} />
    </main>
  );
}
