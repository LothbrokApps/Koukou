import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, intensity, sweetness, active, isNew, colorCode } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (intensity !== undefined) data.intensity = intensity;
    if (sweetness !== undefined) data.sweetness = sweetness;
    if (active !== undefined) data.active = Boolean(active);
    if (isNew !== undefined) data.isNew = Boolean(isNew);
    if (colorCode !== undefined) data.colorCode = colorCode;

    const updated = await prisma.flavor.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar sabor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.flavor.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar sabor' }, { status: 500 });
  }
}
