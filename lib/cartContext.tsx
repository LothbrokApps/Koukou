'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, Coupon } from './types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  total: number;
  coupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Selected Product for Quick View Modal
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Modals for innovations
  isQuizOpen: boolean;
  setIsQuizOpen: (open: boolean) => void;
  isBoxBuilderOpen: boolean;
  setIsBoxBuilderOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBoxBuilderOpen, setIsBoxBuilderOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('koukou_cart_v2');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('koukou_wishlist_v2');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error('Error loading localStorage', e);
    }
    setMounted(true);
  }, []);

  // Save cart
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('koukou_cart_v2', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  // Save wishlist
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('koukou_wishlist_v2', JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCart((prev) => {
      // Look for identical product + flavor + box combination
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.flavor === item.flavor &&
          JSON.stringify(i.boxFlavors || []) === JSON.stringify(item.boxFlavors || [])
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          ...item,
          id: `${item.productId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  if (coupon && subtotal >= coupon.minPurchase) {
    if (coupon.discountPercent) {
      discount = (subtotal * coupon.discountPercent) / 100;
    } else if (coupon.discountAmount) {
      discount = Math.min(subtotal, coupon.discountAmount);
    }
  }

  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCoupon(data.coupon);
        return { success: true, message: `¡Cupón ${data.coupon.code} aplicado con éxito!` };
      } else {
        return { success: false, message: data.message || 'Cupón inválido o expirado' };
      }
    } catch {
      return { success: false, message: 'Error validando cupón' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        subtotal,
        discount,
        total,
        coupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isWishlisted,
        selectedProduct,
        setSelectedProduct,
        isQuizOpen,
        setIsQuizOpen,
        isBoxBuilderOpen,
        setIsBoxBuilderOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
