"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  active: boolean;
  featured: boolean;
  images: { url: string }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(p: Product) {
    setBusyId(p.id);
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active })
    });
    await load();
    setBusyId(null);
  }

  async function remove(p: Product) {
    if (!confirm(`Excluir "${p.name}"? Essa ação não pode ser desfeita.`)) return;
    setBusyId(p.id);
    await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    await load();
    setBusyId(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-blush-900">Produtos ({products.length})</h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-full bg-blush-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blush-800"
        >
          + Novo produto
        </Link>
      </div>

      {loading ? (
        <p className="text-blush-500">Carregando...</p>
      ) : products.length === 0 ? (
        <p className="text-blush-500">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-blush-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-blush-100 text-xs uppercase text-blush-600">
              <tr>
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Visível</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-blush-100">
                  <td className="px-4 py-2">
                    <div className="relative h-12 w-10 overflow-hidden rounded bg-blush-100">
                      {p.images[0] && (
                        <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium text-blush-900">{p.name}</td>
                  <td className="px-4 py-2 text-blush-600">{p.category}</td>
                  <td className="px-4 py-2">
                    {p.price
                      ? p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                      : <span className="text-amber-600">sem preço</span>}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleActive(p)}
                      disabled={busyId === p.id}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.active ? "Visível" : "Oculto"}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/produtos/${p.id}/editar`}
                      className="mr-3 text-blush-700 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => remove(p)}
                      disabled={busyId === p.id}
                      className="text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
