import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

async function getOrCreateSettings() {
  const existing = await db.storeSettings.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  return db.storeSettings.create({ data: { id: 1 } });
}

export async function GET() {
  const settings = await getOrCreateSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { storeName, tagline, whatsapp, instagram, mpAccessToken, mpPublicKey } = body;

  await getOrCreateSettings();

  const settings = await db.storeSettings.update({
    where: { id: 1 },
    data: {
      storeName: storeName || undefined,
      tagline: tagline || undefined,
      whatsapp: whatsapp ?? undefined,
      instagram: instagram ?? undefined,
      mpAccessToken: mpAccessToken ?? undefined,
      mpPublicKey: mpPublicKey ?? undefined
    }
  });

  return NextResponse.json(settings);
}
