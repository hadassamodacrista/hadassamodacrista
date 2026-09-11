import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const extra = JSON.parse(
  await readFile(new URL("./extra-images.json", import.meta.url), "utf-8")
);
const seedData = JSON.parse(
  await readFile(new URL("./seed-data.json", import.meta.url), "utf-8")
);

function slugify(text) {
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

function baseId(url) {
  const m = url.match(/\/(\d{5})-(xl|lg|og)\.webp/);
  return m ? m[1] : null;
}

const outDir = path.join(process.cwd(), "public", "products", "seed");
await mkdir(outDir, { recursive: true });

let totalAdded = 0;

for (const [slug, urls] of Object.entries(extra)) {
  const seedItem = seedData.find((s) => slugify(s.name) === slug);
  const originalId = seedItem ? baseId(seedItem.img) : null;

  const product = await db.product.findUnique({
    where: { slug },
    include: { images: true }
  });
  if (!product) {
    console.log("SKIP (produto não encontrado):", slug);
    continue;
  }

  const newUrls = urls.filter((u) => baseId(u) !== originalId).slice(0, 5);

  if (newUrls.length > 0 && product.images[0] && !product.images[0].color) {
    await db.productImage.update({
      where: { id: product.images[0].id },
      data: { color: "Cor 1" }
    });
  }

  let position = product.images.length;
  for (let i = 0; i < newUrls.length; i++) {
    const url = newUrls[i];
    const id = baseId(url);
    const fileName = `${slug}-cor${i + 2}.webp`;
    const dest = path.join(outDir, fileName);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(dest, buf);
    } catch (err) {
      console.error("FALHOU baixar", slug, id, err.message);
      continue;
    }

    await db.productImage.create({
      data: {
        url: `/products/seed/${fileName}`,
        position: position++,
        color: `Cor ${i + 2}`,
        productId: product.id
      }
    });
    totalAdded++;
  }

  console.log(`${slug}: +${newUrls.length} fotos`);
}

console.log("Total de fotos adicionadas:", totalAdded);
await db.$disconnect();
