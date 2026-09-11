import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCheckoutPreference } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "Produto não informado" }, { status: 400 });
  }

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { images: { orderBy: { position: "asc" }, take: 1 } }
  });

  if (!product || !product.active) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
  if (!product.price) {
    return NextResponse.json({ error: "Este produto ainda não tem preço definido" }, { status: 400 });
  }

  const settings = await db.storeSettings.findUnique({ where: { id: 1 } });
  if (!settings?.mpAccessToken) {
    return NextResponse.json(
      { error: "Pagamento online ainda não configurado. Fale com a loja pelo WhatsApp." },
      { status: 400 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  try {
    const preference = await createCheckoutPreference({
      accessToken: settings.mpAccessToken,
      productName: product.name,
      productId: product.id,
      price: product.price,
      imageUrl: product.images[0]?.url
        ? new URL(product.images[0].url, siteUrl).toString()
        : undefined,
      siteUrl
    });

    return NextResponse.json({ initPoint: preference.init_point });
  } catch (err) {
    console.error("Erro ao criar preferência Mercado Pago", err);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento. Verifique a chave do Mercado Pago." },
      { status: 500 }
    );
  }
}
