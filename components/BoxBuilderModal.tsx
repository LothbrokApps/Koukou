'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { Flavor } from '@/lib/types';
import { X, Sparkles, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BoxSize {
  size: number;
  label: string;
  price: number;
}

const BOX_SIZES: BoxSize[] = [
  { size: 4, label: 'Caja 4 Bonbons', price: 150 },
  { size: 6, label: 'Caja 6 Bonbons (Favorita)', price: 210 },
  { size: 9, label: 'Caja 9 Bonbons', price: 310 },
  { size: 12, label: 'Caja 12 Bonbons (Deluxe)', price: 390 },
  { size: 16, label: 'Caja 16 Bonbons (Colección)', price: 495 },
];

export const BoxBuilderModal: React.FC = () => {
  const { isBoxBuilderOpen, setIsBoxBuilderOpen, addToCart } = useCart();
  const [selectedBox, setSelectedBox] = useState<BoxSize>(BOX_SIZES[1]); // Default 6 pieces
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isBoxBuilderOpen) {
      setLoading(true);
      fetch('/api/flavors')
        .then((res) => res.json())
        .then((data) => setFlavors(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));

      // Reset slots to match current box size
      setSlots(new Array(selectedBox.size).fill(''));
    }
  }, [isBoxBuilderOpen]);

  // When changing box size
  const handleBoxSizeChange = (box: BoxSize) => {
    setSelectedBox(box);
    setSlots(new Array(box.size).fill(''));
  };

  const addFlavorToSlot = (flavorName: string) => {
    const emptyIndex = slots.findIndex((s) => s === '');
    if (emptyIndex !== -1) {
      const updated = [...slots];
      updated[emptyIndex] = flavorName;
      setSlots(updated);

      // Check if this filled the last slot
      if (emptyIndex === slots.length - 1) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#c99535', '#e5b95c', '#14110f'],
          });
        } catch {}
      }
    }
  };

  const removeSlot = (index: number) => {
    const updated = [...slots];
    updated[index] = '';
    setSlots(updated);
  };

  const fillRemainingRandomly = () => {
    if (!flavors.length) return;
    const updated = [...slots];
    for (let i = 0; i < updated.length; i++) {
      if (!updated[i]) {
        const randomFlavor = flavors[Math.floor(Math.random() * flavors.length)].name;
        updated[i] = randomFlavor;
      }
    }
    setSlots(updated);
  };

  const filledCount = slots.filter((s) => s !== '').length;
  const isComplete = filledCount === selectedBox.size;

  const handleAddToCart = () => {
    if (!isComplete) return;

    // Group flavors for display
    const counts: Record<string, number> = {};
    slots.forEach((f) => {
      counts[f] = (counts[f] || 0) + 1;
    });
    const summary = Object.entries(counts)
      .map(([flavor, count]) => (count > 1 ? `${count}x ${flavor}` : flavor))
      .join(', ');

    addToCart({
      productId: `custom-box-${selectedBox.size}`,
      name: `${selectedBox.label} Personalizada`,
      price: selectedBox.price,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
      quantity: 1,
      flavor: summary,
      boxFlavors: slots,
      category: 'Chocolates & Bonbons',
    });

    setIsBoxBuilderOpen(false);
  };

  if (!isBoxBuilderOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-lg shadow-2xl border border-koukou-border flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-koukou-cream/40">
          <div>
            <div className="inline-flex items-center gap-1.5 text-koukou-gold text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles size={14} />
              <span>Experiencia KOUKOU</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-koukou-black">
              Arma tu Caja de Bonbons
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Escoge el tamaño y selecciona tus sabores favoritos pieza por pieza.
            </p>
          </div>

          <button
            onClick={() => setIsBoxBuilderOpen(false)}
            className="w-9 h-9 bg-koukou-black text-white hover:bg-koukou-gold hover:text-black rounded-full flex items-center justify-center transition shadow"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 flex flex-col lg:flex-row gap-8">
          {/* Left Column: Tray & Selection */}
          <div className="lg:w-1/2 flex flex-col justify-between">
            <div>
              {/* Step 1: Select Box Size */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-koukou-black block mb-2">
                  1. Tamaño de caja:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BOX_SIZES.map((box) => {
                    const isSelected = selectedBox.size === box.size;
                    return (
                      <button
                        key={box.size}
                        onClick={() => handleBoxSizeChange(box)}
                        className={`p-2.5 text-left rounded border transition text-xs flex flex-col justify-between ${
                          isSelected
                            ? 'bg-koukou-black text-white border-koukou-black shadow'
                            : 'bg-gray-50 hover:bg-white text-gray-800 border-gray-200'
                        }`}
                      >
                        <span className="font-bold">{box.size} Bonbons</span>
                        <span className={`text-[11px] ${isSelected ? 'text-koukou-gold' : 'text-gray-500'}`}>
                          ${box.price} MXN
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Visual Tray */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-koukou-black">
                    2. Bandeja de selección ({filledCount}/{selectedBox.size}):
                  </label>
                  {filledCount < selectedBox.size && (
                    <button
                      onClick={fillRemainingRandomly}
                      className="text-xs text-koukou-gold font-bold hover:underline flex items-center gap-1"
                    >
                      <Sparkles size={12} />
                      Completar aleatorio
                    </button>
                  )}
                </div>

                {/* Slots Grid */}
                <div
                  className={`grid gap-2.5 p-4 rounded-lg bg-[#1a1412] border border-[#351b12] shadow-inner ${
                    selectedBox.size === 4
                      ? 'grid-cols-2'
                      : selectedBox.size === 6
                      ? 'grid-cols-3'
                      : selectedBox.size === 9
                      ? 'grid-cols-3'
                      : selectedBox.size === 12
                      ? 'grid-cols-4'
                      : 'grid-cols-4'
                  }`}
                >
                  {slots.map((slot, idx) => (
                    <div
                      key={idx}
                      onClick={() => slot && removeSlot(idx)}
                      className={`h-20 rounded-md border flex flex-col items-center justify-center p-1.5 text-center transition-all cursor-pointer relative group ${
                        slot
                          ? 'bg-[#2b1f1a] border-koukou-gold/70 text-white shadow-md'
                          : 'bg-[#120e0c] border-dashed border-white/20 text-gray-500 hover:border-koukou-gold/40'
                      }`}
                    >
                      {slot ? (
                        <>
                          <span className="text-xl mb-0.5">🍫</span>
                          <span className="text-[11px] font-bold text-koukou-goldLight leading-tight line-clamp-2">
                            {slot}
                          </span>
                          <span className="absolute inset-0 bg-red-900/90 text-white text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                            <Trash2 size={12} /> Quitar
                          </span>
                        </>
                      ) : (
                        <>
                          <Plus size={16} className="text-gray-500 mb-1" />
                          <span className="text-[10px] text-gray-500">Espacio {idx + 1}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total summary */}
            <div className="pt-4 border-t border-gray-200 mt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block">Total de la caja:</span>
                <span className="text-2xl font-black text-koukou-gold">
                  ${selectedBox.price.toFixed(2)} MXN
                </span>
              </div>

              <button
                disabled={!isComplete}
                onClick={handleAddToCart}
                className={`btn-gold py-3 px-6 rounded text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                  !isComplete ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : ''
                }`}
              >
                <CheckCircle2 size={17} />
                <span>AGREGAR CAJA</span>
              </button>
            </div>
          </div>

          {/* Right Column: Flavor Picker list */}
          <div className="lg:w-1/2 bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-koukou-black mb-3">
              3. Elige un sabor para colocar en el siguiente espacio vacío:
            </h3>

            {loading ? (
              <div className="py-8 text-center text-xs text-gray-400">
                Cargando sabores disponibles...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {flavors.map((flavor) => (
                  <button
                    key={flavor.id}
                    disabled={isComplete}
                    onClick={() => addFlavorToSlot(flavor.name)}
                    className="p-3 bg-white hover:bg-koukou-cream/50 text-left rounded border border-gray-200 hover:border-koukou-gold transition flex flex-col justify-between shadow-2xs group disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-xs text-koukou-black group-hover:text-koukou-gold transition-colors">
                        {flavor.name}
                      </span>
                      {flavor.isNew && (
                        <span className="text-[9px] font-bold bg-koukou-gold text-black px-1.5 py-0.5 rounded">
                          NUEVO
                        </span>
                      )}
                    </div>
                    {flavor.description && (
                      <p className="text-[11px] text-gray-500 line-clamp-2 mb-2 leading-tight">
                        {flavor.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-100">
                      <span>{flavor.intensity || 'Equilibrado'}</span>
                      <span className="text-koukou-gold font-bold group-hover:translate-x-0.5 transition-transform">
                        + Añadir
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
