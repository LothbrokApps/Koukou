import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_CONTENT } from '@/lib/defaultData';

export async function GET() {
  try {
    let content = await prisma.storeContent.findUnique({
      where: { id: 'singleton' },
    });

    if (!content) {
      return NextResponse.json(DEFAULT_CONTENT);
    }

    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(DEFAULT_CONTENT);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const updated = await prisma.storeContent.upsert({
      where: { id: 'singleton' },
      update: body,
      create: { id: 'singleton', ...body },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar contenido' }, { status: 500 });
  }
}
