# KOUKOU Chocolatería | Web Comercial & Admin Panel

Aplicación web comercial moderna, ultra-rápida, responsive y escalable para **KOUKOU Chocolatería** (Saltillo, Coahuila).

Diseñada bajo los más altos estándares de UX/UI para chocolatería de alta gama con estética **negro, chocolate, crema, blanco y dorado**, microinteracciones y cumplimiento estricto de la **Regla del 80%** (el administrador gestiona catálogo, contenido, banners, WhatsApp, inventario, precios y variantes sin tocar código).

---

## 🚀 Tecnologías Principales (Stack)

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Iconografía & Efectos**: Lucide React, Canvas Confetti
- **Base de Datos & ORM**: [Prisma](https://www.prisma.io/) (SQLite de fábrica listo para usar sin configuración previa, y compatible 100% con PostgreSQL en producción)
- **API**: REST API Endpoints nativos (`/api/*`)
- **Integraciones**: WhatsApp Business Order Generator con formato estructurado, sistema de cupones, arquitectura desacoplada para pasarela de pagos.

---

## 📁 Estructura del Proyecto

```
├── app/
│   ├── layout.tsx              # Layout raíz con Providers y modales globales
│   ├── page.tsx                # KOUKOU Storefront principal
│   ├── globals.css             # Paleta de colores KOUKOU, fuentes y animaciones
│   ├── admin/
│   │   └── page.tsx            # KOUKOU ADMIN Panel completo
│   └── api/                    # REST API Endpoints
│       ├── analytics/          # KPIs, ventas y métricas para el dashboard
│       ├── categories/         # CRUD de categorías
│       ├── content/            # Modificación de Hero, textos y banners (Regla 80%)
│       ├── coupons/            # Creación y validación de cupones (ej. KOUKOU10)
│       ├── flavors/            # Sistema de variantes exclusivas de Bonbons
│       ├── orders/             # Gestión de pedidos y estados
│       ├── products/           # CRUD de catálogo, precios, stock e imágenes
│       ├── recommendations/    # Algoritmo "Descubre tu chocolate"
│       └── settings/           # Configuración (WhatsApp, horarios, SEO)
├── components/
│   ├── Topbar.tsx              # Barra superior con anuncio y WhatsApp
│   ├── Header.tsx              # Navegación luxury, buscador, wishlist y carrito
│   ├── Hero.tsx                # Hero section dinámica y editable
│   ├── Promos.tsx              # Grid de promociones interactivas
│   ├── CategoriesBar.tsx       # Filtro horizontal de categorías
│   ├── ProductsGrid.tsx        # Grid de productos con hover y quick-add
│   ├── ProductModal.tsx        # Vista rápida, cata y selector de sabores
│   ├── BoxBuilderModal.tsx     # "Arma tu caja de Bonbons" (4, 6, 9, 12, 16 pzas)
│   ├── DiscoverQuizModal.tsx   # Quiz interactivo "Descubre tu chocolate"
│   ├── FeatureSection.tsx      # Especialidad en Bonbons KOUKOU
│   ├── BannerSection.tsx       # Banner de momentos y regalos
│   ├── Benefits.tsx            # Beneficios de compra
│   ├── CartDrawer.tsx          # Carrito lateral, cupones y checkout WhatsApp
│   ├── FloatingWhatsApp.tsx    # Botón flotante pulsante de WhatsApp
│   ├── SearchModal.tsx         # Buscador en vivo
│   └── Footer.tsx              # Footer institucional con datos de Saltillo
├── lib/
│   ├── prisma.ts               # Instancia singleton de Prisma Client
│   ├── cartContext.tsx         # Estado global de Carrito, Wishlist y Modales
│   └── types.ts                # Tipado TypeScript unificado
├── prisma/
│   └── schema.prisma           # Esquema relacional de base de datos
├── database/
│   └── schema.sql              # Definición SQL para PostgreSQL / SQLite
├── scripts/
│   └── seed.js                 # Seed con catálogo oficial de KOUKOU
├── public/
│   └── assets/                 # Imágenes originales de KOUKOU
└── .env.example                # Variables de entorno documentadas
```

---

## 🛠️ Instalación y Puesta en Marcha

### 1. Requisitos
- Node.js 18.x o superior (Probado en Node v20/v24)
- npm 9+

### 2. Clonar / Acceder al directorio
```bash
cd "/Users/rangel/Desktop/ANTIGRAVITY/KOUKOU/Oficial to"
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Variables de Entorno
Copia el archivo de ejemplo `.env.example` a `.env`:
```bash
cp .env.example .env
```
Contenido por defecto (`.env`):
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_WHATSAPP="528440000000"
ADMIN_ACCESS_KEY="koukou2026"
```

### 5. Inicializar la Base de Datos & Semilla
Sincroniza el esquema e inserta los datos oficiales de KOUKOU (Bonbons, Alfajores, Repostería, Café, Sabores, Promociones y Configuración):
```bash
npm run db:push
npm run db:seed
```

### 6. Ejecutar en Modo Desarrollo
```bash
npm run dev
```
Abre tu navegador en:
- **Tienda KOUKOU**: [http://localhost:3000](http://localhost:3000)
- **Panel Administrador**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🌟 Experiencias Incluidas

### 1. KOUKOU STORE (Cliente)
- **Catálogo Completo**: Bonbons KOUKOU, Repostería, Alfajores (Douce), Café & Frappé, Barras de Cacao Bean-to-Bar, Especiales.
- **Arma tu Caja de Bonbons**: Constructor interactivo de cajas de 4, 6, 9, 12 o 16 piezas con selección pieza a pieza de sabores.
- **Descubre tu Chocolate (Quiz)**: Test de 5 preguntas sobre dulzor, textura, estilo y exotismo con recomendaciones automáticas.
- **Favoritos (Wishlist)**: Guardado en memoria local sin necesidad de registro forzoso.
- **Buscador en Vivo**: Filtra por ingredientes, sabores o categorías.
- **Carrito Desplegable**:
  - Cálculo instantáneo de subtotal, descuentos y total.
  - Aplicador de cupones (ejemplo: `KOUKOU10`, `CHOCOLOVE`).
  - Elección de entrega: Pickup en tienda Saltillo o Envío a domicilio.
  - Generador de mensaje de WhatsApp con formato enriquecido para cerrar la venta directamente.
  - Arquitectura lista para conectar pagos con tarjeta (Stripe / Mercado Pago).

### 2. KOUKOU ADMIN (Administración)
- **Dashboard en tiempo real**: Ventas totales, pedidos recibidos, pedidos pendientes, catálogo activo, valor del inventario y gráficas de distribución.
- **Gestión de Productos**: Crear, editar precios, descuentos, imágenes, descripciones, stock y visibilidad.
- **Gestión de Sabores (Variantes)**: Crear nuevos sabores de Bonbons (Pimienta, Vainilla, Leche quemada, Tocino, Carajillo, Café, Caramelo, Chai, Whiskey Manzana...) y activar/desactivar existencias.
- **Control de Pedidos**: Pipeline de estados (`Nuevo`, `Confirmado`, `Preparando`, `Listo`, `Entregado`, `Cancelado`) con botón directo para chatear con el cliente en WhatsApp.
- **Edición de Contenido (Regla del 80%)**: Modificar en segundos el Hero (título, kicker, textos, foto), banners y textos institucionales.
- **Configuración Comercial**: Teléfono oficial de WhatsApp, dirección en Saltillo, horarios de atención, links a Instagram/Facebook/TikTok y metas de SEO.

---

## 🚢 Despliegue en Producción (Vercel / PostgreSQL)

1. Para usar **PostgreSQL** en servicios como Supabase, Neon o Railway, cambia en `.env`:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@servidor.com:5432/koukou?schema=public"
   ```
   Y en `prisma/schema.prisma` cambia `provider = "sqlite"` a `provider = "postgresql"`.
2. Ejecuta:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
3. Construye la aplicación:
   ```bash
   npm run build
   npm run start
   ```

---

*Desarrollado con dedicación para KOUKOU Chocolatería · Saltillo, Coahuila.*
