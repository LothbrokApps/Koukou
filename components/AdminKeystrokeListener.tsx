'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const AdminKeystrokeListener = () => {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let buffer = '';
    const secret = 'koukou2026';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys alone
      if (e.key.length !== 1) return;

      buffer += e.key.toLowerCase();
      if (buffer.length > 20) {
        buffer = buffer.slice(-20);
      }

      if (buffer.endsWith(secret)) {
        setShowToast(true);
        setTimeout(() => {
          router.push('/admin');
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  if (!showToast) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-koukou-black text-koukou-gold border border-koukou-gold px-6 py-3 rounded shadow-2xl flex items-center gap-3 animate-fadeIn">
      <span className="text-lg">✨</span>
      <span className="font-bold text-sm tracking-wider uppercase">
        Acceso concedido: Abriendo Panel KOUKOU Admin...
      </span>
    </div>
  );
};
