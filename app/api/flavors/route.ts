import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_FLAVORS } from '@/lib/defaultData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');

    const where: any = {};
    if (!all) {
      where.active = true;
    }

    const flavors = await prisma.flavor.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    if (!flavors || flavors.length === 0) {
      return NextResponse.json(DEFAULT_FLAVORS);
    }

    return NextResponse.json(flavors);
  } catch (error) {
    return NextResponse.json(DEFAULT_FLAVORS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, intensity, sweetness, isNew, colorCode } = body;

    if (!name) {
      return NextResponse.json({ error: 'El nombre del sabor es obligatorio' }, { status: 400 });
    }

    const flavor = await prisma.flavor.create({
      data: {
        name,
        category: 'Bonbon',
        description: description || null,
        intensity: intensity || 'Medio',
        sweetness: sweetness || 'Equilibrado',
        isNew: Boolean(isNew),
        colorCode: colorCode || '#c99535',
        active: true,
      },
    });

    return NextResponse.json(flavor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear sabor' }, { status: 500 });
  }
}
