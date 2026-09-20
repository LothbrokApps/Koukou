import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_PROMOTIONS } from '@/lib/defaultData';

export async function GET() {
  try {
    const promos = await prisma.promotion.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    if (!promos || promos.length === 0) {
      return NextResponse.json(DEFAULT_PROMOTIONS);
    }
    return NextResponse.json(promos);
  } catch (error) {
    return NextResponse.json(DEFAULT_PROMOTIONS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const promo = await prisma.promotion.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        kicker: body.kicker,
        buttonText: body.buttonText || 'Pedir ahora',
        buttonLink: body.buttonLink || '#productos',
        image: body.image || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b',
        isDark: body.isDark !== undefined ? Boolean(body.isDark) : true,
        active: true,
      },
    });
    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear promoción' }, { status: 500 });
  }
}
