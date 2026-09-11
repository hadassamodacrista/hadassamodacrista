import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const settings = await db.storeSettings.findUnique({ where: { id: 1 } });

  return NextResponse.json({
    storeName: settings?.storeName ?? "Hadassa",
    tagline: settings?.tagline ?? "Moda com Propósito",
    whatsapp: settings?.whatsapp ?? null,
    instagram: settings?.instagram ?? null,
    mpConfigured: !!settings?.mpAccessToken
  });
}
