"use client";

import { useState } from "react";
import { whatsappDigits } from "@/lib/whatsapp";

const MAX_QUANTITY = 20;

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
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function changeQuantity(delta: number) {
    setQuantity((q) => Math.min(MAX_QUANTITY, Math.max(1, q + delta)));
    setError(null);
  }

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
        body: JSON.stringify({ productId, size: selectedSize, quantity })
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
        `Olá! Tenho interesse no ${productLabel}${quantity > 1 ? ` (${quantity} unidades)` : ""}.`
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

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-blush-600">Quantidade</p>
        <div className="mt-2 inline-flex items-center rounded-full border border-blush-300">
          <button
            type="button"
            onClick={() => changeQuantity(-1)}
            className="flex h-9 w-9 items-center justify-center text-blush-700 hover:text-blush-900"
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium text-blush-900">{quantity}</span>
          <button
            type="button"
            onClick={() => changeQuantity(1)}
            className="flex h-9 w-9 items-center justify-center text-blush-700 hover:text-blush-900"
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>
      </div>

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
