"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";

export type ProductImageValue = { url: string; color: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: string;
  sizes: string;
  colors: string;
  active: boolean;
  featured: boolean;
  images: ProductImageValue[];
};

export function ProductForm({ initial }: { initial: ProductFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: ProductImageValue[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Falha no upload");
        uploaded.push({ url: data.url, color: "" });
      }
      set("images", [...values.images, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    set(
      "images",
      values.images.filter((i) => i.url !== url)
    );
  }

  function setImageColor(url: string, color: string) {
    set(
      "images",
      values.images.map((i) => (i.url === url ? { ...i, color } : i))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: values.name,
      category: values.category,
      description: values.description,
      price: values.price === "" ? null : Number(values.price),
      sizes: values.sizes,
      colors: values.colors,
      active: values.active,
      featured: values.featured,
      images: values.images
    };

    const url = values.id ? `/api/admin/products/${values.id}` : "/api/admin/products";
    const method = values.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Não foi possível salvar o produto.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="block text-xs font-medium text-blush-700">Nome do produto</label>
        <input
          type="text"
          required
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-blush-700">Categoria</label>
        <select
          required
          value={values.category}
          onChange={(e) => set("category", e.target.value)}
          className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
        >
          <option value="">Selecione...</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-blush-700">Preço (R$)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={values.price}
          onChange={(e) => set("price", e.target.value)}
          placeholder="Deixe em branco para 'Consulte o preço'"
          className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-blush-700">Descrição</label>
        <textarea
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-blush-700">Tamanhos (separados por vírgula)</label>
        <input
          type="text"
          value={values.sizes}
          onChange={(e) => set("sizes", e.target.value)}
          placeholder="P, M, G, GG"
          className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-blush-700">Fotos e cores</label>
        <p className="mt-1 text-xs text-blush-500">
          Suba uma foto para cada cor disponível e escreva o nome da cor embaixo de cada uma (ex:
          Azul, Vermelho, Rosa). Isso faz aparecer as bolinhas de cor no site, como no catálogo do
          fornecedor.
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="mt-2 block text-sm text-blush-700"
        />
        {uploading && <p className="mt-1 text-xs text-blush-500">Enviando...</p>}
        {values.images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {values.images.map((img) => (
              <div key={img.url} className="w-24">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-blush-100">
                  <Image src={img.url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(img.url)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-xs text-red-600 shadow"
                  >
                    ×
                  </button>
                </div>
                <input
                  type="text"
                  value={img.color}
                  onChange={(e) => setImageColor(img.url, e.target.value)}
                  placeholder="Cor (ex: Azul)"
                  className="mt-1 w-full rounded border border-blush-300 px-2 py-1 text-xs outline-none focus:border-blush-500"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-blush-800">
          <input
            type="checkbox"
            checked={values.active}
            onChange={(e) => set("active", e.target.checked)}
          />
          Visível no site
        </label>
        <label className="flex items-center gap-2 text-sm text-blush-800">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Marcar como novidade
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-blush-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-blush-800 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full border border-blush-300 px-6 py-2.5 text-sm font-medium text-blush-700 hover:bg-blush-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
