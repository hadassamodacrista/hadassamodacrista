import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const data = JSON.parse(await readFile(new URL("./seed-data.json", import.meta.url)));
const outDir = path.join(process.cwd(), "public", "products", "seed");
await mkdir(outDir, { recursive: true });

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

for (const item of data) {
  const slug = slugify(item.name);
  const fileName = `${slug}.webp`;
  const dest = path.join(outDir, fileName);
  try {
    const res = await fetch(item.img);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    item.localUrl = `/products/seed/${fileName}`;
    console.log("OK", item.name);
  } catch (err) {
    console.error("FALHOU", item.name, err.message);
    item.localUrl = null;
  }
}

await writeFile(new URL("./seed-data.json", import.meta.url), JSON.stringify(data, null, 2));
console.log("Concluído.");
