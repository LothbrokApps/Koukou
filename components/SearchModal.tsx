'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cartContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { setSelectedProduct } = useCart();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="text-koukou-gold" size={22} />
          <input
            type="text"
            placeholder="Buscar por nombre, sabor, ingrediente (ej. Carajillo, Alfajor, Bonbon)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-base outline-none text-koukou-black placeholder-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading && (
            <div className="text-center py-8 text-sm text-gray-500">
              Buscando delicias...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500">
              No encontramos productos que coincidan con &ldquo;{query}&rdquo;.
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="divide-y divide-gray-100">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    onClose();
                  }}
                  className="py-3 px-2 flex items-center justify-between hover:bg-koukou-cream/50 cursor-pointer rounded transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded bg-koukou-cream"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-koukou-black">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-koukou-gold text-sm">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="block text-[11px] text-gray-400">Ver producto</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!query && (
            <div className="py-4 text-xs text-gray-400 text-center">
              Escribe algo para comenzar a buscar en el catálogo oficial de KOUKOU.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
