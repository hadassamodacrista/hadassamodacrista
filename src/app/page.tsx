import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ categoria?: string; busca?: string }>;
}) {
  const { categoria, busca } = await searchParams;
  const products = await db.product.findMany({
    where: {
      active: true,
      ...(categoria ? { category: categoria } : {}),
      ...(busca ? { name: { contains: busca } } : {})
    },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  });

  return (
    <div>
      <div className="mb-8 rounded-2xl bg-blush-100 px-6 py-10 text-center">
        <h1 className="font-serif text-2xl text-blush-900 sm:text-3xl">
          Vestidos e moda cristã com elegância e propósito
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-blush-700">
          Confira nosso catálogo e escolha seu vestido favorito. Compre online com segurança pelo
          Mercado Pago ou fale com a gente pelo WhatsApp.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-blush-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              price={p.price}
              imageUrl={p.images[0]?.url}
              colors={p.images.map((i) => i.color).filter((c): c is string => !!c?.trim())}
              featured={p.featured}
            />
          ))}
        </div>
      )}
    </div>
  );
}
