'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cartContext';
import { Heart, Plus, Star } from 'lucide-react';
import { MediaView } from './MediaView';

interface ProductsGridProps {
  products: Product[];
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ products }) => {
  const { addToCart, isWishlisted, toggleWishlist, setSelectedProduct } = useCart();

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 bg-koukou-cream/30 rounded border border-dashed border-koukou-border my-6">
        <p className="text-lg font-serif">No se encontraron productos en esta categoría.</p>
        <p className="text-xs text-gray-400 mt-1">Prueba seleccionando otra sección o busca en el catálogo.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-koukou-border">
      {products.map((product) => {
        const wish = isWishlisted(product.id);

        return (
          <article
            key={product.id}
            className="group relative bg-white border-r border-b border-koukou-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:z-10 flex flex-col justify-between"
          >
            {/* Image / Media Container */}
            <div className="relative h-[210px] sm:h-[260px] overflow-hidden bg-[#f5f1eb]">
              {/* Category / Sale Tag */}
              <span
                className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 text-white ${
                  product.badge?.toLowerCase().includes('vendido') || product.badge?.toLowerCase().includes('top')
                    ? 'bg-koukou-gold text-black font-extrabold'
                    : product.comparePrice
                    ? 'bg-koukou-danger'
                    : 'bg-koukou-black'
                }`}
              >
                {product.badge || (product.category ? product.category.name : 'KOUKOU')}
              </span>

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 flex items-center justify-center shadow-md transition-all active:scale-90"
                aria-label="Guardar en favoritos"
              >
                <Heart
                  size={18}
                  className={wish ? 'fill-red-500 text-red-500' : ''}
                />
              </button>

              {/* Product Media (Supports Image, Google Drive transformed CDN & Video) */}
              <MediaView
                src={product.image}
                alt={product.name}
                onClick={() => setSelectedProduct(product)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                showPlayIcon
              />
            </div>

            {/* Product Info */}
            <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 text-koukou-gold text-xs mb-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-koukou-gold text-koukou-gold" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 ml-1 font-medium">({product.rating || '5.0'})</span>
                </div>

                {/* Category label */}
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                  {product.category?.name || 'Chocolatería'}
                </span>

                {/* Title */}
                <h3
                  onClick={() => setSelectedProduct(product)}
                  className="text-xs sm:text-sm font-bold text-koukou-black hover:text-koukou-gold transition-colors mt-1 mb-2 line-clamp-2 min-h-[36px] cursor-pointer"
                >
                  {product.name}
                </h3>
              </div>

              {/* Bottom Price & Add Action */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-col">
                  {product.comparePrice && (
                    <span className="text-[11px] text-gray-400 line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-sm sm:text-base font-extrabold text-[#b58329]">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (product.allowedFlavors) {
                      setSelectedProduct(product);
                    } else {
                      addToCart({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                        category: product.category?.name,
                      });
                    }
                  }}
                  className="bg-koukou-black hover:bg-koukou-gold hover:text-black text-white px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-sm flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <Plus size={13} />
                  <span>{product.allowedFlavors ? 'Elegir' : 'Agregar'}</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
