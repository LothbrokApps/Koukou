'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Sparkles,
  Sliders,
  Settings,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Check,
  TrendingUp,
  Store,
  MessageCircle,
  Search,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Product, Order, Flavor, Category, Promotion, StoreContent, StoreSettings, Coupon } from '@/lib/types';
import { MediaView } from '@/components/MediaView';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'flavors' | 'orders' | 'content' | 'promotions' | 'coupons' | 'settings'>('dashboard');
  const [loading, setLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [content, setContent] = useState<StoreContent | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Form states for Product modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: 'chocolates',
    price: '',
    comparePrice: '',
    stock: '50',
    image: '',
    description: '',
    badge: '',
    featured: false,
    allowedFlavors: '',
  });

  // Form states for Flavor modal
  const [isFlavorModalOpen, setIsFlavorModalOpen] = useState(false);
  const [flavorForm, setFlavorForm] = useState({
    name: '',
    description: '',
    intensity: 'Medio',
    sweetness: 'Equilibrado',
    isNew: false,
  });

  // Form states for Content (Regla 80%)
  const [contentForm, setContentForm] = useState<StoreContent>({
    id: 'singleton',
    heroKicker: '',
    heroTitle: '',
    heroDescription: '',
    heroImage: '',
    featureKicker: '',
    featureTitle: '',
    featureDescription: '',
    featureImage: '',
    bannerKicker: '',
    bannerTitle: '',
    bannerDescription: '',
    bannerImage: '',
  });

  // Form states for Settings (Regla 80%)
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({
    id: 'singleton',
    storeName: '',
    whatsappPhone: '',
    location: '',
    schedule: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    currency: 'MXN',
    seoTitle: '',
    seoDescription: '',
  });

  // Refresh all admin data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, fRes, oRes, cRes, prRes, cpRes, ctRes, sRes, anRes] = await Promise.all([
        fetch('/api/products?admin=true'),
        fetch('/api/flavors?all=true'),
        fetch('/api/orders'),
        fetch('/api/categories'),
        fetch('/api/promotions'),
        fetch('/api/coupons'),
        fetch('/api/content'),
        fetch('/api/settings'),
        fetch('/api/analytics'),
      ]);

      const [pData, fData, oData, cData, prData, cpData, ctData, sData, anData] = await Promise.all([
        pRes.json(),
        fRes.json(),
        oRes.json(),
        cRes.json(),
        prRes.json(),
        cpRes.json(),
        ctRes.json(),
        sRes.json(),
        anRes.json(),
      ]);

      setProducts(pData || []);
      setFlavors(fData || []);
      setOrders(oData || []);
      setCategories(cData || []);
      setPromotions(prData || []);
      setCoupons(cpData || []);
      setContent(ctData);
      if (ctData) setContentForm(ctData);
      setSettings(sData);
      if (sData) setSettingsForm(sData);
      setAnalytics(anData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Product CRUD
  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name,
        categoryId: prod.categoryId,
        price: prod.price.toString(),
        comparePrice: prod.comparePrice ? prod.comparePrice.toString() : '',
        stock: prod.stock.toString(),
        image: prod.image,
        description: prod.description,
        badge: prod.badge || '',
        featured: prod.featured,
        allowedFlavors: prod.allowedFlavors || '',
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        categoryId: categories[0]?.id || 'chocolates',
        price: '',
        comparePrice: '',
        stock: '50',
        image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
        description: '',
        badge: '',
        featured: false,
        allowedFlavors: '',
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Completa nombre y precio');
      return;
    }

    try {
      if (editingProduct) {
        // Update
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
      } else {
        // Create
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error al guardar el producto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProductActive = async (prod: Product) => {
    try {
      await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !prod.active }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Flavor CRUD (Regla especial Bonbon)
  const handleCreateFlavor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flavorForm.name) return;
    try {
      await fetch('/api/flavors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flavorForm),
      });
      setIsFlavorModalOpen(false);
      setFlavorForm({ name: '', description: '', intensity: 'Medio', sweetness: 'Equilibrado', isNew: false });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFlavor = async (flavor: Flavor) => {
    try {
      await fetch(`/api/flavors/${flavor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !flavor.active }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFlavor = async (id: string) => {
    if (!confirm('¿Eliminar este sabor?')) return;
    try {
      await fetch(`/api/flavors/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Order Status update
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Content Save (Regla 80%)
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentForm),
      });
      alert('¡Contenido de la tienda actualizado con éxito!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error al guardar contenido');
    }
  };

  // Settings Save (Regla 80%)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      alert('¡Configuración de KOUKOU guardada con éxito!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error al guardar configuración');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#090909] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black tracking-tight text-white">
            KOU<span className="text-koukou-gold">KOU</span>
            <span className="text-xs ml-2 px-2 py-0.5 bg-koukou-gold/20 text-koukou-gold border border-koukou-gold/40 rounded uppercase font-semibold">
              ADMIN PANEL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchData}
            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"
            title="Recargar datos"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <Link
            href="/"
            className="bg-white hover:bg-koukou-gold text-black text-xs font-bold px-4 py-2 rounded transition flex items-center gap-1.5 shadow"
          >
            <Store size={14} />
            <span>VER TIENDA KOUKOU</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#14110f] border-r border-white/5 p-4 flex md:flex-col gap-1 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded text-xs font-semibold flex items-center gap-2.5 transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-koukou-gold text-black font-bold shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 size={16} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-3 rounded text-xs font-semibold flex items-center gap-2.5 transition whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-koukou-gold text-black font-bold shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package size={16} />
            <span>Productos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('flavors')}
            className={`w-full text-left px-4 py-3 rounded text-xs font-semibold flex items-center gap-2.5 transition whitespace-nowrap ${
              activeTab === 'flavors'
                ? 'bg-koukou-gold text-black font-bold shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles size={16} />
            <span>Sabores Bonbons ({flavors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded text-xs font-semibold flex items-center gap-2.5 transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-koukou-gold text-black font-bold shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag size={16} />
            <span>Pedidos ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full text-left px-4 py-3 rounded text-xs font-semibold flex items-center gap-2.5 transition whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-koukou-gold text-black font-bold shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon size={16} />
            <span>Contenido & Textos</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded text-xs font-semibold flex items-center gap-2.5 transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-koukou-gold text-black font-bold shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={16} />
            <span>Configuración KOUKOU</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
          {/* ================= DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Dashboard Comercial</h1>
                  <p className="text-xs text-gray-400">
                    Resumen en vivo de ventas, inventario y pedidos de KOUKOU Chocolatería.
                  </p>
                </div>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1c1715] p-5 rounded-lg border border-white/5 shadow">
                  <span className="text-xs text-gray-400 block mb-1">Ventas Totales</span>
                  <strong className="text-2xl font-bold text-koukou-gold block">
                    ${analytics?.totalSales ? analytics.totalSales.toFixed(2) : '0.00'} MXN
                  </strong>
                  <span className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                    <TrendingUp size={12} /> Calculado en tiempo real
                  </span>
                </div>

                <div className="bg-[#1c1715] p-5 rounded-lg border border-white/5 shadow">
                  <span className="text-xs text-gray-400 block mb-1">Pedidos Registrados</span>
                  <strong className="text-2xl font-bold text-white block">
                    {analytics?.totalOrders || orders.length}
                  </strong>
                  <span className="text-[10px] text-koukou-gold mt-1 block">
                    {analytics?.pendingOrders || 0} pendientes de entrega
                  </span>
                </div>

                <div className="bg-[#1c1715] p-5 rounded-lg border border-white/5 shadow">
                  <span className="text-xs text-gray-400 block mb-1">Catálogo Activo</span>
                  <strong className="text-2xl font-bold text-white block">
                    {analytics?.activeProducts || products.length} productos
                  </strong>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {flavors.length} sabores de bonbon
                  </span>
                </div>

                <div className="bg-[#1c1715] p-5 rounded-lg border border-white/5 shadow">
                  <span className="text-xs text-gray-400 block mb-1">Valor Inventario</span>
                  <strong className="text-2xl font-bold text-white block">
                    ${analytics?.catalogValue ? analytics.catalogValue.toLocaleString() : '0'} MXN
                  </strong>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    En stock disponible
                  </span>
                </div>
              </div>

              {/* Charts & Status Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders by Status */}
                <div className="bg-[#1c1715] p-6 rounded-lg border border-white/5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-gold mb-4">
                    Distribución de Estados de Pedido
                  </h3>
                  <div className="space-y-3">
                    {['Nuevo', 'Preparando', 'Listo', 'Entregado'].map((status) => {
                      const count = orders.filter((o) => o.status === status).length;
                      const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                      return (
                        <div key={status} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-300">{status}</span>
                            <span className="font-bold text-gray-400">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                status === 'Nuevo'
                                  ? 'bg-blue-500'
                                  : status === 'Preparando'
                                  ? 'bg-amber-500'
                                  : status === 'Listo'
                                  ? 'bg-purple-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Categories Breakdown */}
                <div className="bg-[#1c1715] p-6 rounded-lg border border-white/5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-gold mb-4">
                    Productos por Categoría
                  </h3>
                  <div className="space-y-3">
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.categoryId === cat.id).length;
                      return (
                        <div key={cat.id} className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                          <span className="text-gray-300 flex items-center gap-2">
                            <span>{cat.icon || '🍫'}</span>
                            <span>{cat.name}</span>
                          </span>
                          <span className="font-bold bg-white/5 px-2 py-0.5 rounded text-koukou-gold">
                            {count} productos
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-[#1c1715] p-6 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-gold">
                    Últimos Pedidos de Clientes
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Ver todos ({orders.length}) →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-gray-400 border-b border-white/10">
                        <th className="py-2.5">Folio</th>
                        <th className="py-2.5">Cliente</th>
                        <th className="py-2.5">Total</th>
                        <th className="py-2.5">Modalidad</th>
                        <th className="py-2.5">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-white/5">
                          <td className="py-3 font-bold text-koukou-gold">{order.orderNumber}</td>
                          <td className="py-3 text-white">{order.customerName || 'Cliente anónimo'}</td>
                          <td className="py-3 font-bold text-white">${order.total.toFixed(2)}</td>
                          <td className="py-3 text-gray-400">{order.deliveryType === 'delivery' ? '🛵 Envío' : '🏪 Pickup'}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 rounded bg-white/10 text-[11px] font-semibold">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= PRODUCTOS ================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Catálogo de Productos</h1>
                  <p className="text-xs text-gray-400">
                    Crea, edita, actualiza precios, imágenes, descripciones e inventario sin tocar código.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenProductModal()}
                  className="bg-koukou-gold hover:bg-white text-black text-xs font-bold px-4 py-2.5 rounded transition flex items-center gap-1.5 shadow"
                >
                  <Plus size={16} />
                  <span>NUEVO PRODUCTO</span>
                </button>
              </div>

              {/* Product Table */}
              <div className="bg-[#1c1715] rounded-lg border border-white/5 overflow-hidden shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-[#14110f] text-gray-400 border-b border-white/10 uppercase tracking-wider text-[11px]">
                        <th className="p-4">Imagen</th>
                        <th className="p-4">Producto</th>
                        <th className="p-4">Categoría</th>
                        <th className="p-4">Precio</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition">
                          <td className="p-4">
                            <div className="w-12 h-12 rounded overflow-hidden bg-black/40 border border-white/10">
                              <MediaView
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                showPlayIcon
                              />
                            </div>
                          </td>
                          <td className="p-4">
                            <strong className="text-white text-sm block">{p.name}</strong>
                            <span className="text-[11px] text-gray-400 line-clamp-1">{p.description}</span>
                            {p.badge && (
                              <span className="inline-block mt-1 text-[9px] font-bold bg-koukou-gold text-black px-1.5 py-0.2 rounded">
                                {p.badge}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-gray-300">
                            {p.category?.name || p.categoryId}
                          </td>
                          <td className="p-4 font-bold text-koukou-gold text-sm">
                            ${p.price.toFixed(2)}
                            {p.comparePrice && (
                              <span className="text-gray-500 line-through text-xs block font-normal">
                                ${p.comparePrice.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-white">
                            {p.stock} pzas
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleProductActive(p)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
                                p.active
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
                              }`}
                            >
                              {p.active ? 'Activo' : 'Inactivo'}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenProductModal(p)}
                              className="p-1.5 bg-white/10 hover:bg-koukou-gold hover:text-black rounded transition"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded transition"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SABORES BONBONS ================= */}
          {activeTab === 'flavors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Gestión de Sabores de Bonbon</h1>
                  <p className="text-xs text-gray-400">
                    Sistema de variantes especiales. Agrega y activa o desactiva sabores en la tienda y en el armador de cajas sin tocar código.
                  </p>
                </div>

                <button
                  onClick={() => setIsFlavorModalOpen(true)}
                  className="bg-koukou-gold hover:bg-white text-black text-xs font-bold px-4 py-2.5 rounded transition flex items-center gap-1.5 shadow"
                >
                  <Plus size={16} />
                  <span>AGREGAR SABOR</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {flavors.map((fl) => (
                  <div
                    key={fl.id}
                    className="bg-[#1c1715] p-5 rounded-lg border border-white/5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>🍫</span>
                          <span>{fl.name}</span>
                        </h3>
                        <button
                          onClick={() => handleToggleFlavor(fl)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            fl.active ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'
                          }`}
                        >
                          {fl.active ? 'Disponible' : 'Agotado'}
                        </button>
                      </div>

                      <p className="text-xs text-gray-400 mb-3">
                        {fl.description || 'Sabor artesanal KOUKOU.'}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <span className="px-2 py-0.5 bg-white/5 rounded">
                          Intensidad: {fl.intensity || 'Medio'}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 rounded">
                          Dulzor: {fl.sweetness || 'Equilibrado'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => handleDeleteFlavor(fl.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 size={13} /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= PEDIDOS ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
                  <p className="text-xs text-gray-400">
                    Control de órdenes recibidas por WhatsApp y tienda online, con cambio de estado en vivo.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#1c1715] p-6 rounded-lg border border-white/5 shadow flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-koukou-gold">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white font-medium">
                          {order.deliveryType === 'delivery' ? '🛵 Envío a Domicilio' : '🏪 Pickup en Tienda'}
                        </span>
                      </div>

                      <div className="text-xs text-gray-300">
                        <strong>Cliente:</strong> {order.customerName || 'No especificado'}{' '}
                        {order.customerPhone && (
                          <a
                            href={`https://wa.me/${order.customerPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:underline ml-2"
                          >
                            💬 WhatsApp: {order.customerPhone}
                          </a>
                        )}
                      </div>

                      {order.customerAddress && (
                        <div className="text-xs text-gray-400">
                          <strong>Dirección:</strong> {order.customerAddress}
                        </div>
                      )}

                      {order.notes && (
                        <div className="text-xs text-koukou-gold italic">
                          <strong>Nota:</strong> {order.notes}
                        </div>
                      )}

                      {/* Items list */}
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Artículos:
                        </span>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-300 flex justify-between">
                            <span>
                              {item.quantity}x {item.productName}{' '}
                              {item.flavor && <em className="text-koukou-gold">({item.flavor})</em>}
                            </span>
                            <span className="font-semibold text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Status & Total */}
                    <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Total Pedido:</span>
                        <strong className="text-2xl font-black text-koukou-gold block mb-4">
                          ${order.total.toFixed(2)} MXN
                        </strong>

                        <label className="text-[11px] uppercase font-bold text-gray-400 block mb-1">
                          Estado del pedido:
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="w-full bg-[#14110f] border border-white/20 text-white rounded p-2 text-xs font-semibold outline-none"
                        >
                          <option value="Nuevo">Nuevo</option>
                          <option value="Confirmado">Confirmado</option>
                          <option value="Preparando">Preparando</option>
                          <option value="Listo">Listo para entrega</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </div>

                      {order.customerPhone && (
                        <a
                          href={`https://wa.me/${order.customerPhone}?text=${encodeURIComponent(
                            `¡Hola ${order.customerName || ''}! Te escribimos de KOUKOU Chocolatería sobre tu pedido ${order.orderNumber}. Su estado actual es: ${order.status}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-bold py-2 rounded text-center flex items-center justify-center gap-1.5 transition"
                        >
                          <MessageCircle size={14} />
                          <span>Contactar Cliente</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= CONTENIDO (Regla del 80%) ================= */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Edición de Contenido Comercial (Regla del 80%)</h1>
                <p className="text-xs text-gray-400">
                  Modifica textos del Hero, imágenes principales, secciones y mensajes promocionales de KOUKOU sin tocar código.
                </p>
              </div>

              <form onSubmit={handleSaveContent} className="space-y-6 max-w-3xl">
                {/* Hero section */}
                <div className="bg-[#1c1715] p-6 rounded-lg border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-gold">
                    1. Hero Principal (Cabecera)
                  </h3>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Etiqueta Kicker:</label>
                    <input
                      type="text"
                      value={contentForm.heroKicker}
                      onChange={(e) => setContentForm({ ...contentForm, heroKicker: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Título Hero (H1):</label>
                    <input
                      type="text"
                      value={contentForm.heroTitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Descripción Hero:</label>
                    <textarea
                      rows={3}
                      value={contentForm.heroDescription}
                      onChange={(e) => setContentForm({ ...contentForm, heroDescription: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">URL Imagen Hero:</label>
                    <input
                      type="text"
                      value={contentForm.heroImage}
                      onChange={(e) => setContentForm({ ...contentForm, heroImage: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Feature section */}
                <div className="bg-[#1c1715] p-6 rounded-lg border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-gold">
                    2. Sección Especialidad (Bonbons KOUKOU)
                  </h3>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Título Sección:</label>
                    <input
                      type="text"
                      value={contentForm.featureTitle}
                      onChange={(e) => setContentForm({ ...contentForm, featureTitle: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Descripción:</label>
                    <textarea
                      rows={3}
                      value={contentForm.featureDescription}
                      onChange={(e) => setContentForm({ ...contentForm, featureDescription: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">URL Imagen:</label>
                    <input
                      type="text"
                      value={contentForm.featureImage}
                      onChange={(e) => setContentForm({ ...contentForm, featureImage: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Banner section */}
                <div className="bg-[#1c1715] p-6 rounded-lg border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-gold">
                    3. Banner Inferior (KOUKOU Moments)
                  </h3>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Título Banner:</label>
                    <input
                      type="text"
                      value={contentForm.bannerTitle}
                      onChange={(e) => setContentForm({ ...contentForm, bannerTitle: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Descripción Banner:</label>
                    <input
                      type="text"
                      value={contentForm.bannerDescription}
                      onChange={(e) => setContentForm({ ...contentForm, bannerDescription: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">URL Imagen Banner:</label>
                    <input
                      type="text"
                      value={contentForm.bannerImage}
                      onChange={(e) => setContentForm({ ...contentForm, bannerImage: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-koukou-gold hover:bg-white text-black text-xs font-bold py-3.5 px-8 rounded uppercase tracking-wider transition shadow-lg"
                >
                  GUARDAR TODOS LOS CAMBIOS DE CONTENIDO
                </button>
              </form>
            </div>
          )}

          {/* ================= CONFIGURACIÓN (Regla del 80%) ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Configuración Comercial de KOUKOU</h1>
                <p className="text-xs text-gray-400">
                  Ajusta el número de WhatsApp oficial, ubicación en Saltillo, horarios y redes sociales.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                <div className="bg-[#1c1715] p-6 rounded-lg border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-gold">
                    Canales de Contacto & Tienda
                  </h3>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">
                      WhatsApp Oficial (con código de país ej. 528440000000):
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappPhone: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">
                      Ubicación de Tienda (Saltillo):
                    </label>
                    <input
                      type="text"
                      value={settingsForm.location}
                      onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">
                      Horarios de Atención:
                    </label>
                    <input
                      type="text"
                      value={settingsForm.schedule}
                      onChange={(e) => setSettingsForm({ ...settingsForm, schedule: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Instagram:</label>
                      <input
                        type="text"
                        value={settingsForm.instagram}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                        className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Facebook:</label>
                      <input
                        type="text"
                        value={settingsForm.facebook}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                        className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">TikTok:</label>
                      <input
                        type="text"
                        value={settingsForm.tiktok}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tiktok: e.target.value })}
                        className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1c1715] p-6 rounded-lg border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-koukou-gold">
                    SEO & Meta Tags
                  </h3>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Título SEO:</label>
                    <input
                      type="text"
                      value={settingsForm.seoTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Descripción SEO:</label>
                    <textarea
                      rows={2}
                      value={settingsForm.seoDescription}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seoDescription: e.target.value })}
                      className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-koukou-gold hover:bg-white text-black text-xs font-bold py-3.5 px-8 rounded uppercase tracking-wider transition shadow-lg"
                >
                  GUARDAR CONFIGURACIÓN COMERCIAL
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL PRODUCTO ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1c1715] border border-white/10 w-full max-w-xl rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Nombre del Producto:</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Categoría:</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Precio (MXN):</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Precio Comparación (opcional):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={productForm.comparePrice}
                    onChange={(e) => setProductForm({ ...productForm, comparePrice: e.target.value })}
                    className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Stock / Inventario:</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">
                  URL de la Imagen o Video (admite Google Drive, Dropbox, YouTube, MP4):
                </label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/... o https://drive.google.com/file/d/..."
                  className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none font-mono text-xs"
                />
                {productForm.image && (
                  <div className="mt-2 p-2 bg-black/40 rounded border border-white/10 flex items-center gap-3">
                    <div className="w-14 h-14 rounded overflow-hidden bg-[#14110f] shrink-0 border border-white/10">
                      <MediaView src={productForm.image} alt="Preview" className="w-full h-full object-cover" showPlayIcon />
                    </div>
                    <div className="text-[11px] text-gray-400">
                      <span className="text-green-400 font-bold block">✓ Vista previa en vivo</span>
                      <span>Transformación para carga rápida automática (Drive CDN / Video activo)</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Etiqueta Badge (ej. Top ventas, Edición especial):</label>
                <input
                  type="text"
                  value={productForm.badge}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">
                  Sabores permitidos (separados por coma, opcional):
                </label>
                <input
                  type="text"
                  placeholder="Carajillo, Pimienta, Vainilla, Leche quemada"
                  value={productForm.allowedFlavors}
                  onChange={(e) => setProductForm({ ...productForm, allowedFlavors: e.target.value })}
                  className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Descripción:</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="featuredCheck" className="text-gray-300 cursor-pointer">
                  Destacar este producto en la página principal
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-koukou-gold hover:bg-white text-black rounded font-bold uppercase tracking-wider"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL SABOR ================= */}
      {isFlavorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1c1715] border border-white/10 w-full max-w-md rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Agregar Sabor de Bonbon</h2>

            <form onSubmit={handleCreateFlavor} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Nombre del Sabor:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Avellana Crujiente, Maracuyá..."
                  value={flavorForm.name}
                  onChange={(e) => setFlavorForm({ ...flavorForm, name: e.target.value })}
                  className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Descripción o notas de cata:</label>
                <textarea
                  rows={2}
                  placeholder="ej. Ganache suave infusionada con..."
                  value={flavorForm.description}
                  onChange={(e) => setFlavorForm({ ...flavorForm, description: e.target.value })}
                  className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Intensidad:</label>
                  <select
                    value={flavorForm.intensity}
                    onChange={(e) => setFlavorForm({ ...flavorForm, intensity: e.target.value })}
                    className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                  >
                    <option value="Suave">Suave</option>
                    <option value="Medio">Medio</option>
                    <option value="Intenso">Intenso</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Dulzor:</label>
                  <select
                    value={flavorForm.sweetness}
                    onChange={(e) => setFlavorForm({ ...flavorForm, sweetness: e.target.value })}
                    className="w-full bg-[#14110f] border border-white/20 rounded p-2.5 text-white outline-none"
                  >
                    <option value="Bajo">Bajo</option>
                    <option value="Equilibrado">Equilibrado</option>
                    <option value="Dulce">Dulce</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="newFlavorCheck"
                  checked={flavorForm.isNew}
                  onChange={(e) => setFlavorForm({ ...flavorForm, isNew: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="newFlavorCheck" className="text-gray-300 cursor-pointer">
                  Marcar como nuevo sabor
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFlavorModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-koukou-gold hover:bg-white text-black rounded font-bold uppercase tracking-wider"
                >
                  Crear Sabor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
