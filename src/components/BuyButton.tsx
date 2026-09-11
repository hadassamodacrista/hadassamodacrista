"use client";

import { useState } from "react";
import { whatsappDigits } from "@/lib/whatsapp";

export function BuyButton({
  productId,
  whatsapp,
  productName,
  sizes = []
}: {
  productId: string;
  whatsapp: string | null;
  productName: string;
  sizes?: string[];
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    if (sizes.length > 0 && !selectedSize) {
      setError("Escolha um tamanho antes de continuar.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, size: selectedSize })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível iniciar o pagamento.");
        return;
      }
      window.location.href = data.initPoint;
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const productLabel = selectedSize ? `${productName}, tamanho ${selectedSize}` : productName;
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsappDigits(whatsapp)}?text=${encodeURIComponent(
        `Olá! Tenho interesse no ${productLabel}.`
      )}`
    : null;

  return (
    <div className="space-y-3">
      {sizes.length > 0 && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blush-600">Tamanhos disponíveis</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSelectedSize(s);
                  setError(null);
                }}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  selectedSize === s
                    ? "border-blush-700 bg-blush-700 text-white"
                    : "border-blush-300 text-blush-800 hover:border-blush-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full rounded-full bg-blush-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-blush-800 disabled:opacity-60"
      >
        {loading ? "Processando..." : "Comprar agora"}
      </button>

      {error && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
          {whatsappHref && (
            <>
              {" "}
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="underline">
                Falar no WhatsApp
              </a>
            </>
          )}
        </div>
      )}

      {whatsappHref && !error && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full border border-blush-300 px-6 py-3 text-center text-sm font-medium text-blush-700 transition hover:bg-blush-50"
        >
          Tirar dúvidas no WhatsApp
        </a>
      )}
    </div>
  );
}
