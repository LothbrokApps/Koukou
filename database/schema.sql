-- =========================================================
-- KOUKOU CHOCOLATERÍA - DATABASE SCHEMA (PostgreSQL / SQLite)
-- =========================================================

-- Categorías
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "image" TEXT,
    "order" INTEGER DEFAULT 0,
    "active" BOOLEAN DEFAULT true
);

-- Sabores (Variantes exclusivas de Bonbons KOUKOU)
CREATE TABLE IF NOT EXISTS "Flavor" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "category" TEXT DEFAULT 'Bonbon',
    "description" TEXT,
    "intensity" TEXT,
    "sweetness" TEXT,
    "active" BOOLEAN DEFAULT true,
    "isNew" BOOLEAN DEFAULT false,
    "colorCode" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de Productos
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL REFERENCES "Category"("id"),
    "price" DOUBLE PRECISION NOT NULL,
    "comparePrice" DOUBLE PRECISION,
    "stock" INTEGER DEFAULT 50,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "featured" BOOLEAN DEFAULT false,
    "active" BOOLEAN DEFAULT true,
    "rating" DOUBLE PRECISION DEFAULT 5.0,
    "badge" TEXT,
    "allowedFlavors" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos (WhatsApp / Online)
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT PRIMARY KEY,
    "orderNumber" TEXT UNIQUE NOT NULL,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "customerAddress" TEXT,
    "deliveryType" TEXT DEFAULT 'pickup',
    "paymentMethod" TEXT DEFAULT 'whatsapp',
    "status" TEXT DEFAULT 'Nuevo',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artículos del Pedido
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "productId" TEXT REFERENCES "Product"("id"),
    "productName" TEXT NOT NULL,
    "image" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "flavor" TEXT,
    "boxFlavors" TEXT
);

-- Promociones
CREATE TABLE IF NOT EXISTS "Promotion" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "kicker" TEXT,
    "subtitle" TEXT,
    "buttonText" TEXT DEFAULT 'Pedir ahora',
    "buttonLink" TEXT DEFAULT '#productos',
    "image" TEXT NOT NULL,
    "isDark" BOOLEAN DEFAULT true,
    "active" BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0
);

-- Cupones
CREATE TABLE IF NOT EXISTS "Coupon" (
    "id" TEXT PRIMARY KEY,
    "code" TEXT UNIQUE NOT NULL,
    "discountPercent" DOUBLE PRECISION,
    "discountAmount" DOUBLE PRECISION,
    "minPurchase" DOUBLE PRECISION DEFAULT 0,
    "active" BOOLEAN DEFAULT true,
    "expiresAt" TIMESTAMP
);

-- Contenido de la tienda (Regla del 80%)
CREATE TABLE IF NOT EXISTS "StoreContent" (
    "id" TEXT PRIMARY KEY DEFAULT 'singleton',
    "heroKicker" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "featureKicker" TEXT NOT NULL,
    "featureTitle" TEXT NOT NULL,
    "featureDescription" TEXT NOT NULL,
    "featureImage" TEXT NOT NULL,
    "bannerKicker" TEXT NOT NULL,
    "bannerTitle" TEXT NOT NULL,
    "bannerDescription" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuración de la tienda (Regla del 80%)
CREATE TABLE IF NOT EXISTS "StoreSettings" (
    "id" TEXT PRIMARY KEY DEFAULT 'singleton',
    "storeName" TEXT NOT NULL,
    "whatsappPhone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "tiktok" TEXT NOT NULL,
    "currency" TEXT DEFAULT 'MXN',
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
