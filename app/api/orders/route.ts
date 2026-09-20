import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerAddress, deliveryType, paymentMethod, subtotal, discount, total, notes, items } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'El pedido no tiene artículos' }, { status: 400 });
    }

    const count = await prisma.order.count();
    const orderNumber = `KOU-${1000 + count + 1}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName || 'Cliente KOUKOU',
        customerPhone: customerPhone || '',
        customerAddress: customerAddress || '',
        deliveryType: deliveryType || 'pickup',
        paymentMethod: paymentMethod || 'whatsapp',
        status: 'Nuevo',
        subtotal: parseFloat(subtotal),
        discount: discount ? parseFloat(discount) : 0,
        total: parseFloat(total),
        notes: notes || '',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || null,
            productName: item.name,
            image: item.image,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
            flavor: item.flavor || null,
            boxFlavors: item.boxFlavors ? (Array.isArray(item.boxFlavors) ? item.boxFlavors.join(', ') : item.boxFlavors) : null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error al registrar pedido' }, { status: 500 });
  }
}
