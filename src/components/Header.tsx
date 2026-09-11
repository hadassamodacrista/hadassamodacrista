"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/categories";

export function Header({ storeName }: { storeName: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("busca") ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (term.trim()) params.set("busca", term.trim());
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  const activeCategory = searchParams.get("categoria");

  return (
    <header className="sticky top-0 z-40 border-b border-blush-200 bg-blush-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={48} />
          <span className="hidden font-serif text-lg font-semibold text-blush-800 sm:block">
            {storeName}
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex w-full max-w-xs items-center">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar vestido..."
            className="w-full rounded-l-full border border-blush-300 bg-white px-4 py-2 text-sm text-blush-900 outline-none focus:border-blush-500"
          />
          <button
            type="submit"
            className="rounded-r-full border border-l-0 border-blush-300 bg-blush-600 px-4 py-2 text-sm text-white transition hover:bg-blush-700"
          >
            Buscar
          </button>
        </form>
      </div>

      <nav className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-2 px-4 pb-3 text-sm">
        <Link
          href="/"
          className={`transition hover:text-blush-700 ${
            !activeCategory ? "font-semibold text-blush-800" : "text-blush-600"
          }`}
        >
          Todos
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/?categoria=${encodeURIComponent(cat)}`}
            className={`transition hover:text-blush-700 ${
              activeCategory === cat ? "font-semibold text-blush-800" : "text-blush-600"
            }`}
          >
            {cat}
          </Link>
        ))}
      </nav>
    </header>
  );
}
