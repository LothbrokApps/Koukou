import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductModal } from '@/components/ProductModal';
import { BoxBuilderModal } from '@/components/BoxBuilderModal';
import { DiscoverQuizModal } from '@/components/DiscoverQuizModal';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { AdminKeystrokeListener } from '@/components/AdminKeystrokeListener';

export const metadata: Metadata = {
  title: 'KOUKOU | Chocolatería de Alta Gama & Bonbons',
  description: 'Chocolates finos, bonbons artesanales rellenos, alfajores y café de especialidad en Saltillo, Coahuila.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col bg-white text-koukou-black selection:bg-koukou-gold selection:text-black">
        <CartProvider>
          <AdminKeystrokeListener />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <CartDrawer />
          <ProductModal />
          <BoxBuilderModal />
          <DiscoverQuizModal />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
