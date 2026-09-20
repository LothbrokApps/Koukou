'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { StoreSettings } from '@/lib/types';
import { X, Trash2, Plus, Minus, Tag, MessageCircle, CreditCard, Check, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  settings?: StoreSettings | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ settings }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [notes, setNotes] = useState('');
  const [loadingOrder, setLoadingOrder] = useState(false);

  const phone = settings?.whatsappPhone || '528440000000';

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponMsg(null);
    const res = await applyCoupon(couponCode);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponCode('');
  };

  const handleWhatsAppCheckout = async () => {
    if (!cart.length) return;

    setLoadingOrder(true);
    let orderNumber = 'KOU-' + Date.now().toString().slice(-4);

    try {
      // 1. Register order in database
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerAddress: deliveryType === 'delivery' ? customerAddress : 'Pasa a recoger en tienda',
          deliveryType,
          paymentMethod: 'whatsapp',
          subtotal,
          discount,
          total,
          notes,
          items: cart,
        }),
      });

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        orderNumber = orderData.orderNumber;
      }
    } catch (err) {
      console.error('Error saving order:', err);
    } finally {
      setLoadingOrder(false);
    }

    // 2. Format luxurious WhatsApp message
    let message = `🍫 *PEDIDO KOUKOU CHOCOLATERÍA* 🍫%0A`;
    message += `📋 *Folio:* ${orderNumber}%0A`;
    if (customerName) message += `👤 *Cliente:* ${encodeURIComponent(customerName)}%0A`;
    if (customerPhone) message += `📱 *Teléfono:* ${encodeURIComponent(customerPhone)}%0A`;
    message += `🚚 *Modalidad:* ${deliveryType === 'delivery' ? 'Envío a domicilio' : 'Pickup en tienda (Saltillo)'}%0A`;
    if (deliveryType === 'delivery' && customerAddress) {
      message += `📍 *Dirección:* ${encodeURIComponent(customerAddress)}%0A`;
    }
    if (notes) message += `📝 *Notas:* ${encodeURIComponent(notes)}%0A`;

    message += `%0A*DETALLE DEL PEDIDO:*%0A`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${encodeURIComponent(item.name)}* x${item.quantity}%0A`;
      if (item.flavor) {
        message += `   • _Sabor / Relleno:_ ${encodeURIComponent(item.flavor)}%0A`;
      }
      message += `   • _Precio:_ $${(item.price * item.quantity).toFixed(2)} MXN%0A`;
    });

    message += `%0A-------------------------------%0A`;
    message += `*Subtotal:* $${subtotal.toFixed(2)} MXN%0A`;
    if (discount > 0) {
      message += `*Descuento (${coupon?.code || 'Cupón'}):* -$${discount.toFixed(2)} MXN%0A`;
    }
    message += `*TOTAL A PAGAR: $${total.toFixed(2)} MXN*%0A`;
    message += `-------------------------------%0A`;
    message += `%0A_¡Gracias por elegir KOUKOU! En breve confirmaremos tu orden._`;

    // 3. Clear cart and open WhatsApp
    clearCart();
    setIsCartOpen(false);

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleOnlinePaymentMock = () => {
    alert('Arquitectura de pago en línea preparada para Mercado Pago / Stripe / OpenPay. Continuando con checkout por WhatsApp.');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-[440px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-koukou-border flex items-center justify-between bg-koukou-cream/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            <span className="font-bold text-sm tracking-wider uppercase text-koukou-black">
              Tu Pedido KOUKOU
            </span>
            <span className="text-xs text-gray-400">({cart.length} artículos)</span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <span className="text-5xl mb-3">🍫</span>
              <p className="font-serif text-lg text-koukou-black mb-1">Tu carrito está vacío</p>
              <p className="text-xs text-gray-500 max-w-xs mb-5">
                Agrega bonbons, alfajores o café artesanal para deleitar tu paladar.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-gold py-2.5 px-6 rounded text-xs font-bold uppercase tracking-wider"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 flex gap-3 items-start">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded bg-koukou-cream shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-koukou-black line-clamp-1">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition"
                      title="Eliminar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {item.flavor && (
                    <span className="text-[11px] text-[#b58329] font-medium block truncate mt-0.5">
                      Sabor: {item.flavor}
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-0.5 hover:bg-gray-100 text-gray-600 text-xs"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-0.5 hover:bg-gray-100 text-gray-600 text-xs"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-koukou-black">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout & Summary Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-koukou-border bg-white shadow-lg flex flex-col gap-4">
            {/* Coupon input */}
            <div>
              {coupon ? (
                <div className="bg-green-50 border border-green-200 rounded p-2 flex items-center justify-between text-xs text-green-800">
                  <div className="flex items-center gap-1.5">
                    <Tag size={13} className="text-green-600" />
                    <span>Cupón <strong>{coupon.code}</strong> aplicado</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-red-600 hover:underline font-semibold"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código de cupón (ej. KOUKOU10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 text-xs border border-gray-300 rounded px-3 py-1.5 outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-gray-100 hover:bg-koukou-gold hover:text-black text-gray-800 text-xs font-bold px-3 py-1.5 rounded transition"
                  >
                    Aplicar
                  </button>
                </form>
              )}
              {couponMsg && (
                <span
                  className={`text-[11px] mt-1 block ${
                    couponMsg.error ? 'text-red-500' : 'text-green-600'
                  }`}
                >
                  {couponMsg.text}
                </span>
              )}
            </div>

            {/* Delivery Option */}
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`flex-1 py-1.5 rounded border text-center font-semibold transition ${
                  deliveryType === 'pickup'
                    ? 'bg-koukou-black text-white border-koukou-black'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                🏪 Recoger en tienda
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`flex-1 py-1.5 rounded border text-center font-semibold transition ${
                  deliveryType === 'delivery'
                    ? 'bg-koukou-black text-white border-koukou-black'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                🛵 Envío Saltillo
              </button>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Tu Nombre completo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded px-3 py-1.5 outline-none"
              />
              {deliveryType === 'delivery' && (
                <input
                  type="text"
                  placeholder="Dirección completa y colonia en Saltillo"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded px-3 py-1.5 outline-none"
                />
              )}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)} MXN</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Descuento cupón</span>
                  <span>-${discount.toFixed(2)} MXN</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-koukou-black pt-1">
                <span>Total</span>
                <span className="text-[#b58329]">${total.toFixed(2)} MXN</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2">
              <button
                disabled={loadingOrder}
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <MessageCircle size={18} />
                <span>{loadingOrder ? 'Generando Pedido...' : 'PEDIR POR WHATSAPP'}</span>
              </button>

              <button
                onClick={handleOnlinePaymentMock}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] uppercase tracking-wider rounded flex items-center justify-center gap-2 transition"
              >
                <CreditCard size={14} />
                <span>Tarjeta o Transferencia (Próximamente)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
