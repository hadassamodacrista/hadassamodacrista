"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function ChromeWrapper({
  storeName,
  whatsapp,
  instagram,
  children
}: {
  storeName: string;
  whatsapp: string | null;
  instagram: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="min-h-screen bg-blush-50">{children}</div>;
  }

  return (
    <>
      <Header storeName={storeName} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <Footer storeName={storeName} instagram={instagram} />
      <WhatsAppFloat whatsapp={whatsapp} />
    </>
  );
}
