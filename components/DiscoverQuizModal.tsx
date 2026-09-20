'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { Product } from '@/lib/types';
import { X, Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Plus } from 'lucide-react';

export const DiscoverQuizModal: React.FC = () => {
  const { isQuizOpen, setIsQuizOpen, addToCart, setSelectedProduct } = useCart();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    sweetness: '',
    texture: '',
    style: '',
    drink: '',
    exotic: '',
  });
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isQuizOpen) return null;

  const handleSelect = (key: string, val: string) => {
    const nextAnswers = { ...answers, [key]: val };
    setAnswers(nextAnswers);

    if (step < 5) {
      setStep(step + 1);
    } else {
      // Final step submit
      submitQuiz(nextAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: typeof answers) => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalAnswers),
      });
      const data = await res.json();
      setResults(data.recommendations || []);
      setStep(6);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({
      sweetness: '',
      texture: '',
      style: '',
      drink: '',
      exotic: '',
    });
    setResults([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-2xl border border-koukou-border overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-koukou-cream/50 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-koukou-gold text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles size={14} />
              <span>Sommelier de Chocolate</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-koukou-black">
              Descubre tu Chocolate KOUKOU
            </h2>
          </div>

          <button
            onClick={() => setIsQuizOpen(false)}
            className="w-8 h-8 bg-koukou-black text-white hover:bg-koukou-gold hover:text-black rounded-full flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quiz Steps */}
        <div className="p-6 sm:p-8">
          {step <= 5 && (
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <span>Pregunta {step} de 5</span>
                <span>{Math.round((step / 5) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-koukou-gold h-full transition-all duration-300"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Question 1 */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-koukou-black mb-5 text-center">
                ¿Cómo prefieres el perfil de dulzor?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelect('sweetness', 'dulce')}
                  className="p-5 rounded border border-gray-200 hover:border-koukou-gold hover:bg-koukou-cream/40 text-left transition"
                >
                  <span className="text-2xl mb-2 block">🍯</span>
                  <strong className="block text-sm text-koukou-black mb-1">Dulce & Goloso</strong>
                  <p className="text-xs text-gray-500">Notas de leche quemada, caramelo suave o dulce de leche.</p>
                </button>
                <button
                  onClick={() => handleSelect('sweetness', 'intenso')}
                  className="p-5 rounded border border-gray-200 hover:border-koukou-gold hover:bg-koukou-cream/40 text-left transition"
                >
                  <span className="text-2xl mb-2 block">🍫</span>
                  <strong className="block text-sm text-koukou-black mb-1">Intenso & Cacao Profundo</strong>
                  <p className="text-xs text-gray-500">Cacao 70%, notas amargas finas y tostados elegantes.</p>
                </button>
              </div>
            </div>
          )}

          {/* Question 2 */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-koukou-black mb-5 text-center">
                ¿Qué textura despierta más tu antojo?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelect('texture', 'cremoso')}
                  className="p-5 rounded border border-gray-200 hover:border-koukou-gold hover:bg-koukou-cream/40 text-left transition"
                >
                  <span className="text-2xl mb-2 block">🍮</span>
                  <strong className="block text-sm text-koukou-black mb-1">Cremoso & Sedoso</strong>
                  <p className="text-xs text-gray-500">Ganaches que se funden en el paladar, rellenos untuosos.</p>
                </button>
                <button
                  onClick={() => handleSelect('texture', 'crujiente')}
                  className="p-5 rounded border border-gray-200 hover:border-koukou-gold hover:bg-koukou-cream/40 text-left transition"
                >
                  <span className="text-2xl mb-2 block">🍪</span>
                  <strong className="block text-sm text-koukou-black mb-1">Crujiente & Contrastante</strong>
                  <p className="text-xs text-gray-500">Galleta horneada, nuez de la región o sal de mar crujiente.</p>
                </button>
              </div>
            </div>
          )}

          {/* Question 3 */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-koukou-black mb-5 text-center">
                ¿Cuál es tu estilo al degustar?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelect('style', 'clasico')}
                  className="p-5 rounded border border-gray-200 hover:border-koukou-gold hover:bg-koukou-cream/40 text-left transition"
                >
                  <span className="text-2xl mb-2 block">👑</span>
                  <strong className="block text-sm text-koukou-black mb-1">Clásico & Sofisticado</strong>
                  <p className="text-xs text-gray-500">Recetas tradicionales elevadas al nivel de alta chocolatería.</p>
                </button>
                <button
                  onClick={() => handleSelect('style', 'atrevido')}
                  className="p-5 rounded border border-gray-200 hover:border-koukou-gold hover:bg-koukou-cream/40 text-left transition"
                >
                  <span className="text-2xl mb-2 block">🔥</span>
                  <strong className="block text-sm text-koukou-black mb-1">Atrevido & Curioso</strong>
                  <p className="text-xs text-gray-500">Pimienta, reducción de whiskey, carajillo o especias chai.</p>
                </button>
              </div>
            </div>
          )}

          {/* Question 4 */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-koukou-black mb-5 text-center">
                ¿Qué bebida te acompaña mejor?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelect('drink', 'cafe')}
                  className="p-5 rounded border border-gray-200 hover:border-koukou-gold hover:bg-koukou-cream/40 text-left transition"
                >
                  <span className="text-2xl mb-2 block">☕</span>
                  <strong className="block text-sm text-koukou-black mb-1">Amante del Buen Café</strong>
                  <p className="text-xs text-gray-500">Espresso, frappé o carajillo para un maridaje perfecto.</p>
                </button>
                <button
                  onClick={() => handleSelect('drink', 'chocolate')}
                  className="p-5 rounded border border-gray-200 hover:border-koukou-gold hover:bg-koukou-cream/40 text-left transition"
                >
                  <span className="text-2xl mb-2 block">🍫</span>
                  <strong className="block text-sm text-koukou-black mb-1">Puro Chocolate</strong>
                  <p className="text-xs text-gray-500">El cacao es el protagonista indiscutible en cada bocado.</p>
                </button>
              </div>
            </div>
          )}

          {/* Question 5 */}
          {step === 5 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-koukou-black mb-5 text-center">
                ¿Te atreves con sabores exóticos o ahumados?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  disabled={loading}
                  onClick={() => handleSelect('exotic', 'si')}
                  className="p-5 rounded border border-gray-200 hover:border-koukou-gold hover:bg-koukou-cream/40 text-left transition"
                >
                  <span className="text-2xl mb-2 block">✨</span>
                  <strong className="block text-sm text-koukou-black mb-1">¡Sí, sorpréndeme!</strong>
                  <p className="text-xs text-gray-500">Tocino ahumado, maracuyá ácido o pimienta rosa.</p>
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleSelect('exotic', 'no')}
                  className="p-5 rounded border border-gray-200 hover:border-koukou-gold hover:bg-koukou-cream/40 text-left transition"
                >
                  <span className="text-2xl mb-2 block">🍃</span>
                  <strong className="block text-sm text-koukou-black mb-1">Prefiero notas sutiles</strong>
                  <p className="text-xs text-gray-500">Vainilla pura, leche quemada suave y cacaos nobles.</p>
                </button>
              </div>
            </div>
          )}

          {/* Results Step 6 */}
          {step === 6 && (
            <div>
              <div className="text-center mb-6">
                <span className="text-3xl mb-1 block">🍫✨</span>
                <h3 className="text-2xl font-serif font-bold text-koukou-black">
                  Tus Chocolates Ideales
                </h3>
                <p className="text-xs text-gray-500">
                  Basado en tu paladar, estos productos de KOUKOU son tu match perfecto:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {results.map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 bg-gray-50 rounded border border-gray-200 flex items-center justify-between gap-3"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded bg-koukou-cream shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-koukou-black truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mb-1">
                        {product.description}
                      </p>
                      <span className="text-xs font-black text-koukou-gold">
                        ${product.price.toFixed(2)} MXN
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        addToCart({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          quantity: 1,
                          category: product.category?.name,
                        });
                      }}
                      className="bg-koukou-black hover:bg-koukou-gold hover:text-black text-white p-2 rounded text-[11px] font-bold shrink-0 transition"
                      title="Agregar al pedido"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={resetQuiz}
                  className="text-xs text-gray-500 hover:text-koukou-gold flex items-center gap-1 font-semibold"
                >
                  <RotateCcw size={14} />
                  <span>Volver a responder</span>
                </button>

                <button
                  onClick={() => setIsQuizOpen(false)}
                  className="btn-gold py-2.5 px-5 rounded text-xs font-bold uppercase tracking-wider"
                >
                  <span>Explorar Catálogo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
