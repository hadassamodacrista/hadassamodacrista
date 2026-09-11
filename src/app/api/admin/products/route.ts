import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET() {
  const products = await db.product.findMany({
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, category, price, active, featured, sizes, colors, stock, images } = body;

  if (!name || !category) {
    return NextResponse.json({ error: "Nome e categoria são obrigatórios" }, { status: 400 });
  }

  let slug = slugify(name);
  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const product = await db.product.create({
    data: {
      slug,
      name,
      description: description || null,
      category,
      price: price === "" || price === null || price === undefined ? null : Number(price),
      active: active !== false,
      featured: !!featured,
      sizes: sizes || null,
      colors: colors || null,
      stock: stock === "" || stock === null || stock === undefined ? null : Number(stock),
      images: {
        create: (images || []).map((img: { url: string; color?: string }, i: number) => ({
          url: img.url,
          color: img.color || null,
          position: i
        }))
      }
    },
    include: { images: true }
  });

  return NextResponse.json(product, { status: 201 });
}
