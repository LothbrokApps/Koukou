import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { sweetness, texture, style, drink, exotic } = await request.json();

    // Fetch all active products
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
    });

    // Scoring engine based on quiz answers:
    // sweetness: 'dulce' | 'intenso'
    // texture: 'cremoso' | 'crujiente'
    // style: 'clasico' | 'atrevido'
    // drink: 'cafe' | 'chocolate'
    // exotic: 'si' | 'no'

    const scored = products.map((p) => {
      let score = 0;
      const lower = (p.name + ' ' + p.description).toLowerCase();

      if (sweetness === 'intenso' && (lower.includes('70%') || lower.includes('amargo') || lower.includes('intenso') || lower.includes('pimienta'))) {
        score += 3;
      }
      if (sweetness === 'dulce' && (lower.includes('dulce de leche') || lower.includes('leche quemada') || lower.includes('caramelo') || lower.includes('vainilla'))) {
        score += 3;
      }

      if (texture === 'cremoso' && (lower.includes('cremoso') || lower.includes('ganache') || lower.includes('relleno') || lower.includes('cheesecake') || lower.includes('bonbon'))) {
        score += 3;
      }
      if (texture === 'crujiente' && (lower.includes('galleta') || lower.includes('nuez') || lower.includes('sal de mar') || lower.includes('tocino') || lower.includes('chispas'))) {
        score += 3;
      }

      if (style === 'atrevido' && (lower.includes('whiskey') || lower.includes('carajillo') || lower.includes('pimienta') || lower.includes('tocino') || lower.includes('chai'))) {
        score += 4;
      }
      if (style === 'clasico' && (lower.includes('clasico') || lower.includes('caja') || lower.includes('vainilla') || lower.includes('70%'))) {
        score += 3;
      }

      if (drink === 'cafe' && (p.categoryId === 'cafe' || lower.includes('cafe') || lower.includes('carajillo') || lower.includes('espresso'))) {
        score += 4;
      }
      if (drink === 'chocolate' && (p.categoryId === 'chocolates' || p.categoryId === 'barras')) {
        score += 4;
      }

      if (exotic === 'si' && (lower.includes('whiskey') || lower.includes('pimienta') || lower.includes('tocino') || lower.includes('maracuyá') || lower.includes('chai'))) {
        score += 4;
      }

      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const recommendations = scored.slice(0, 4).map((s) => s.product);

    return NextResponse.json({ recommendations });
  } catch (error) {
    return NextResponse.json({ error: 'Error al generar recomendación' }, { status: 500 });
  }
}
