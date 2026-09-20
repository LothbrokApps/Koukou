export interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string | null;
  image?: string | null;
  order: number;
  active: boolean;
}

export interface Flavor {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  intensity?: string | null;
  sweetness?: string | null;
  active: boolean;
  isNew: boolean;
  colorCode?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  category?: Category;
  price: number;
  comparePrice?: number | null;
  stock: number;
  image: string;
  description: string;
  featured: boolean;
  active: boolean;
  rating: number;
  badge?: string | null;
  allowedFlavors?: string | null;
  createdAt?: string | Date;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  flavor?: string;
  boxFlavors?: string[];
  category?: string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle?: string | null;
  kicker?: string | null;
  buttonText: string;
  buttonLink: string;
  image: string;
  isDark: boolean;
  active: boolean;
  order: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
  minPurchase: number;
  active: boolean;
}

export interface StoreContent {
  id: string;
  heroKicker: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  featureKicker: string;
  featureTitle: string;
  featureDescription: string;
  featureImage: string;
  bannerKicker: string;
  bannerTitle: string;
  bannerDescription: string;
  bannerImage: string;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  whatsappPhone: string;
  location: string;
  schedule: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  currency: string;
  seoTitle: string;
  seoDescription: string;
}

export interface OrderItemData {
  id?: string;
  productId?: string;
  productName: string;
  image?: string;
  price: number;
  quantity: number;
  flavor?: string;
  boxFlavors?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  deliveryType: string;
  paymentMethod: string;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string | null;
  items: OrderItemData[];
  createdAt: string | Date;
}
