'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { Flavor } from '@/lib/types';
import { X, Star, Check, ShoppingBag, Plus, Minus, Sparkles } from 'lucide-react';
import { MediaView } from './MediaView';

export const ProductModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsBoxBuilderOpen } = useCart();
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loadingFlavors, setLoadingFlavors] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
      setLoadingFlavors(true);
      fetch('/api/flavors')
        .then((res) => res.json())
        .then((data) => {
          setFlavors(data);
          if (data && data.length > 0) {
            if (selectedProduct.allowedFlavors) {
              const allowed = selectedProduct.allowedFlavors.split(',').map((f) => f.trim());
              const match = data.find((f: Flavor) => allowed.includes(f.name));
              setSelectedFlavor(match ? match.name : data[0].name);
            } else {
              setSelectedFlavor(data[0].name);
            }
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingFlavors(false));
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const allowedList = selectedProduct.allowedFlavors
    ? selectedProduct.allowedFlavors.split(',').map((f) => f.trim())
    : null;

  const displayedFlavors = allowedList
    ? flavors.filter((f) => allowedList.includes(f.name))
    : flavors;

  const isBox = selectedProduct.name.toLowerCase().includes('caja');

  const handleAdd = () => {
    addToCart({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      quantity,
      flavor: displayedFlavors.length > 0 ? selectedFlavor : undefined,
      category: selectedProduct.category?.name,
    });
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded shadow-2xl border border-koukou-border flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-koukou-black text-white hover:bg-koukou-gold hover:text-black rounded-full flex items-center justify-center transition-all shadow-md"
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>

        {/* Product Image / Media Container */}
        <div className="md:w-1/2 bg-[#f6f2ec] relative flex items-center justify-center min-h-[300px] md:min-h-[460px] overflow-hidden">
          <MediaView
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-cover max-h-[460px]"
          />
          {selectedProduct.badge && (
            <span className="absolute top-4 left-4 bg-koukou-black text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 z-10">
              {selectedProduct.badge}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                {selectedProduct.category?.name || 'KOUKOU Chocolatería'}
              </span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-koukou-gold text-xs">
                <Star size={13} className="fill-koukou-gold text-koukou-gold" />
                <span className="font-bold">{selectedProduct.rating || '5.0'}</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-koukou-black mb-3 leading-tight">
              {selectedProduct.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-black text-[#b58329]">
                ${selectedProduct.price.toFixed(2)} MXN
              </span>
              {selectedProduct.comparePrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${selectedProduct.comparePrice.toFixed(2)} MXN
                </span>
              )}
            </div>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
              {selectedProduct.description}
            </p>

            {/* Flavor Selection */}
            {displayedFlavors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-koukou-black">
                    Selecciona sabor / Ganache:
                  </span>
                  <span className="text-xs text-koukou-gold font-medium">
                    {selectedFlavor}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {displayedFlavors.map((flavor) => {
                    const isSelected = selectedFlavor === flavor.name;
                    return (
                      <button
                        key={flavor.id}
                        onClick={() => setSelectedFlavor(flavor.name)}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-koukou-black text-white border-koukou-black shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-koukou-gold'
                        }`}
                      >
                        {flavor.isNew && (
                          <span className="w-1.5 h-1.5 rounded-full bg-koukou-gold" />
                        )}
                        <span>{flavor.name}</span>
                        {isSelected && <Check size={12} className="text-koukou-gold" />}
                      </button>
                    );
                  })}
                </div>

                {isBox && (
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setIsBoxBuilderOpen(true);
                    }}
                    className="mt-3 text-xs text-koukou-gold font-bold flex items-center gap-1 hover:underline"
                  >
                    <Sparkles size={14} />
                    <span>¿Quieres elegir sabor por sabor en bandeja 3D? Haz clic aquí</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quantity & CTA */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">Cantidad:</span>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-1.5 font-bold text-sm min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="text-right flex-1">
                <span className="text-xs text-gray-400 block">Total artículo:</span>
                <span className="text-base font-bold text-koukou-black">
                  ${(selectedProduct.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full btn-gold py-3.5 rounded text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingBag size={18} />
              <span>AGREGAR AL PEDIDO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
