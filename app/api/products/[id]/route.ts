import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, categoryId, price, comparePrice, stock, image, description, featured, active, badge, allowedFlavors } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;
    if (price !== undefined) dataToUpdate.price = parseFloat(price);
    if (comparePrice !== undefined) dataToUpdate.comparePrice = comparePrice ? parseFloat(comparePrice) : null;
    if (stock !== undefined) dataToUpdate.stock = parseInt(stock);
    if (image !== undefined) dataToUpdate.image = image;
    if (description !== undefined) dataToUpdate.description = description;
    if (featured !== undefined) dataToUpdate.featured = Boolean(featured);
    if (active !== undefined) dataToUpdate.active = Boolean(active);
    if (badge !== undefined) dataToUpdate.badge = badge;
    if (allowedFlavors !== undefined) dataToUpdate.allowedFlavors = allowedFlavors;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
