import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { BuyButton } from "@/components/BuyButton";
import { ProductGallery } from "@/components/ProductGallery";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { position: "asc" } } }
  });

  if (!product || !product.active) notFound();

  const settings = await db.storeSettings.findUnique({ where: { id: 1 } });
  const sizes = product.sizes?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const manualColors = product.colors?.split(",").map((c) => c.trim()).filter(Boolean) ?? [];
  const hasImageColors = product.images.some((img) => img.color?.trim());

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <ProductGallery images={product.images} productName={product.name} />

      <div>
        <p className="text-xs uppercase tracking-wide text-blush-500">{product.category}</p>
        <h1 className="mt-1 font-serif text-2xl text-blush-900">{product.name}</h1>
        <p className="mt-3 text-2xl font-semibold text-blush-700">
          {product.price
            ? product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            : "Consulte o preço"}
        </p>

        {product.description && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-blush-800">
            {product.description}
          </p>
        )}

        {sizes.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-blush-600">Tamanhos disponíveis</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((s) => (
                <span key={s} className="rounded-full border border-blush-300 px-3 py-1 text-xs text-blush-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {!hasImageColors && manualColors.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-blush-600">Cores</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {manualColors.map((c) => (
                <span key={c} className="rounded-full border border-blush-300 px-3 py-1 text-xs text-blush-800">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <BuyButton productId={product.id} whatsapp={settings?.whatsapp ?? null} productName={product.name} />
        </div>
      </div>
    </div>
  );
}
