import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_PRODUCTS } from '@/lib/defaultData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const admin = searchParams.get('admin');

    const where: any = {};
    if (!admin) {
      where.active = true;
    }
    if (category && category !== 'Todos') {
      where.categoryId = category;
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!products || products.length === 0) {
      return NextResponse.json(DEFAULT_PRODUCTS);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.warn('Prisma error in /api/products, serving fallback:', error);
    return NextResponse.json(DEFAULT_PRODUCTS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, categoryId, price, comparePrice, stock, image, description, featured, badge, allowedFlavors } = body;

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json({ error: 'Nombre, categoría y precio son obligatorios' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const product = await prisma.product.create({
      data: {
        slug,
        name,
        categoryId,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: stock !== undefined ? parseInt(stock) : 50,
        image: image || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b',
        description: description || '',
        featured: Boolean(featured),
        badge: badge || null,
        allowedFlavors: allowedFlavors || null,
        active: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
