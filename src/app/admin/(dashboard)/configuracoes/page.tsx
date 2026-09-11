"use client";

import { useEffect, useState } from "react";

type Settings = {
  storeName: string;
  tagline: string;
  whatsapp: string | null;
  instagram: string | null;
  mpAccessToken: string | null;
  mpPublicKey: string | null;
};

export default function ConfiguracoesPage() {
  const [values, setValues] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then(setValues);
  }, []);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    if (!values) return;
    setValues({ ...values, [key]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setSavedMsg(null);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    setSaving(false);
    setSavedMsg(res.ok ? "Configurações salvas!" : "Erro ao salvar.");
  }

  if (!values) return <p className="text-blush-500">Carregando...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-serif text-2xl text-blush-900">Configurações da loja</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-blush-700">Nome da loja</label>
          <input
            type="text"
            value={values.storeName}
            onChange={(e) => set("storeName", e.target.value)}
            className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-blush-700">Frase / slogan</label>
          <input
            type="text"
            value={values.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-blush-700">
            WhatsApp (com DDD e código do país, ex: 5511999999999)
          </label>
          <input
            type="text"
            value={values.whatsapp ?? ""}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="5511999999999"
            className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-blush-700">Instagram (usuário)</label>
          <input
            type="text"
            value={values.instagram ?? ""}
            onChange={(e) => set("instagram", e.target.value)}
            placeholder="hadassamoda"
            className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
          />
        </div>

        <div className="rounded-xl border border-blush-200 bg-white p-4">
          <h2 className="font-medium text-blush-900">Mercado Pago</h2>
          <p className="mt-1 text-xs text-blush-600">
            Cole aqui o Access Token da sua aplicação em{" "}
            <a
              href="https://www.mercadopago.com.br/developers/panel/app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              developers.mercadopago.com
            </a>
            . Enquanto isso não estiver preenchido, o botão "Comprar agora" do site mostra uma
            mensagem pedindo para falar pelo WhatsApp.
          </p>
          <div className="mt-3">
            <label className="block text-xs font-medium text-blush-700">Access Token</label>
            <input
              type="password"
              value={values.mpAccessToken ?? ""}
              onChange={(e) => set("mpAccessToken", e.target.value)}
              placeholder="APP_USR-..."
              className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
            />
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium text-blush-700">Public Key (opcional)</label>
            <input
              type="text"
              value={values.mpPublicKey ?? ""}
              onChange={(e) => set("mpPublicKey", e.target.value)}
              placeholder="APP_USR-..."
              className="mt-1 w-full rounded-lg border border-blush-300 px-3 py-2 text-sm outline-none focus:border-blush-500"
            />
          </div>
        </div>

        {savedMsg && <p className="text-sm text-green-700">{savedMsg}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-blush-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-blush-800 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar configurações"}
        </button>
      </form>
    </div>
  );
}
