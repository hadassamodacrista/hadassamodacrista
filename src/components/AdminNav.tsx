"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const links = [
    { href: "/admin", label: "Produtos" },
    { href: "/admin/configuracoes", label: "Configurações" }
  ];

  return (
    <header className="border-b border-blush-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <span className="font-serif text-base text-blush-900">Painel Hadassa</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href
                  ? "font-semibold text-blush-800"
                  : "text-blush-600 hover:text-blush-800"
              }
            >
              {l.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="text-blush-600 hover:text-blush-800">
            Ver site
          </Link>
          <button onClick={handleLogout} className="text-blush-600 hover:text-red-600">
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
