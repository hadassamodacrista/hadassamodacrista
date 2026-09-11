import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } }
  });
  if (!product) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, description, category, price, active, featured, sizes, colors, stock, images } = body;

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });

  let slug = existing.slug;
  if (name && name !== existing.name) {
    const candidate = slugify(name);
    const clash = await db.product.findFirst({
      where: { slug: candidate, NOT: { id } }
    });
    slug = clash ? `${candidate}-${Date.now().toString(36)}` : candidate;
  }

  const product = await db.product.update({
    where: { id },
    data: {
      slug,
      name: name ?? existing.name,
      description: description ?? existing.description,
      category: category ?? existing.category,
      price: price === undefined ? existing.price : price === "" || price === null ? null : Number(price),
      active: active !== undefined ? !!active : existing.active,
      featured: featured !== undefined ? !!featured : existing.featured,
      sizes: sizes ?? existing.sizes,
      colors: colors ?? existing.colors,
      stock: stock === undefined ? existing.stock : stock === "" || stock === null ? null : Number(stock),
      ...(images
        ? {
            images: {
              deleteMany: {},
              create: images.map((img: { url: string; color?: string }, i: number) => ({
                url: img.url,
                color: img.color || null,
                position: i
              }))
            }
          }
        : {})
    },
    include: { images: { orderBy: { position: "asc" } } }
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
