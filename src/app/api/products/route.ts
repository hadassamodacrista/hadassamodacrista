import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("categoria");
  const search = req.nextUrl.searchParams.get("busca");

  const products = await db.product.findMany({
    where: {
      active: true,
      ...(category ? { category } : {}),
      ...(search
        ? { name: { contains: search } }
        : {})
    },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  });

  return NextResponse.json(products);
}
