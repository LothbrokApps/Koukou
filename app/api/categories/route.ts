import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_CATEGORIES } from '@/lib/defaultData';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });
    if (!categories || categories.length === 0) {
      return NextResponse.json(DEFAULT_CATEGORIES);
    }
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(DEFAULT_CATEGORIES);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, image } = body;
    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const category = await prisma.category.create({
      data: {
        id: slug,
        slug,
        name,
        icon: icon || '🍫',
        image: image || null,
        active: true,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}
