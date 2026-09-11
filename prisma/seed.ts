import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";

const db = new PrismaClient();

function slugify(text: string): string {
  const diacritics = new RegExp(
    String.fromCharCode(91, 92, 117, 48, 51, 48, 48, 45, 92, 117, 48, 51, 54, 102, 93),
    "g"
  );
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(diacritics, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type SeedItem = { name: string; category: string; img: string; localUrl: string | null };

async function main() {
  await db.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, storeName: "Hadassa", tagline: "Moda com Propósito" }
  });

  const raw = readFileSync(path.join(process.cwd(), "prisma", "seed-data.json"), "utf-8");
  const items: SeedItem[] = JSON.parse(raw);

  for (const item of items) {
    if (!item.localUrl) continue;
    const slug = slugify(item.name);
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) continue;

    await db.product.create({
      data: {
        slug,
        name: item.name,
        category: item.category,
        description:
          "Peça linda e elegante, ideal para ocasiões especiais. Fale com a gente para saber tamanhos e cores disponíveis.",
        price: null,
        active: true,
        featured: false,
        sizes: "P, M, G, GG",
        images: { create: [{ url: item.localUrl, position: 0 }] }
      }
    });
    console.log("Criado:", item.name);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
