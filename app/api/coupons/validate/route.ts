import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) {
      return NextResponse.json({ valid: false, message: 'Ingresa un código' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.active) {
      return NextResponse.json({ valid: false, message: 'Cupón no válido o inactivo' }, { status: 404 });
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return NextResponse.json({
        valid: false,
        message: `El pedido mínimo para este cupón es de $${coupon.minPurchase.toFixed(2)}`,
      }, { status: 400 });
    }

    return NextResponse.json({ valid: true, coupon });
  } catch (error) {
    return NextResponse.json({ valid: false, message: 'Error al validar cupón' }, { status: 500 });
  }
}
