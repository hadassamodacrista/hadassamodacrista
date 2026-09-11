"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm, ProductFormValues } from "@/components/ProductForm";

export default function EditarProdutoPage() {
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<ProductFormValues | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((p) =>
        setInitial({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description ?? "",
          price: p.price?.toString() ?? "",
          sizes: p.sizes ?? "",
          colors: p.colors ?? "",
          stock: p.stock?.toString() ?? "",
          active: p.active,
          featured: p.featured,
          images: p.images.map((i: { url: string; color: string | null }) => ({
            url: i.url,
            color: i.color ?? ""
          }))
        })
      )
      .catch(() => setNotFound(true));
  }, [params.id]);

  if (notFound) return <p className="text-blush-500">Produto não encontrado.</p>;
  if (!initial) return <p className="text-blush-500">Carregando...</p>;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-blush-900">Editar produto</h1>
      <ProductForm initial={initial} />
    </div>
  );
}
