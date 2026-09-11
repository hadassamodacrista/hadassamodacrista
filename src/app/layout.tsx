import type { Metadata } from "next";
import "./globals.css";
import { db } from "@/lib/db";
import { ChromeWrapper } from "@/components/ChromeWrapper";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Hadassa · Moda com Propósito",
  description: "Catálogo de vestidos e moda cristã da Hadassa."
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await db.storeSettings.findUnique({ where: { id: 1 } }).catch(() => null);
  const storeName = settings?.storeName ?? "Hadassa";
  const whatsapp = settings?.whatsapp ?? null;
  const instagram = settings?.instagram ?? null;

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col font-sans">
        <Suspense>
          <ChromeWrapper storeName={storeName} whatsapp={whatsapp} instagram={instagram}>
            {children}
          </ChromeWrapper>
        </Suspense>
      </body>
    </html>
  );
}
