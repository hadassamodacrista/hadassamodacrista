import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { position: "asc" } } }
  });

  if (!product || !product.active) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  return NextResponse.json(product);
}
