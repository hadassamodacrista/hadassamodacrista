"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { colorToHex } from "@/lib/colorSwatch";

type ProductImage = { id: string; url: string; color: string | null };

export function ProductGallery({
  images,
  productName
}: {
  images: ProductImage[];
  productName: string;
}) {
  const colors = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const img of images) {
      const c = img.color?.trim();
      if (c && !seen.has(c)) {
        seen.add(c);
        list.push(c);
      }
    }
    return list;
  }, [images]);

  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);

  const visibleImages = useMemo(() => {
    if (!selectedColor) return images;
    const filtered = images.filter((img) => img.color?.trim() === selectedColor);
    return filtered.length > 0 ? filtered : images;
  }, [images, selectedColor]);

  const [activeIndex, setActiveIndex] = useState(0);
  const main = visibleImages[activeIndex] ?? visibleImages[0];

  function selectColor(color: string) {
    setSelectedColor(color);
    setActiveIndex(0);
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-blush-100">
        {main ? (
          <Image
            src={main.url}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-blush-400">Sem foto</div>
        )}
      </div>

      {visibleImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {visibleImages.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-blush-100 ring-2 transition ${
                i === activeIndex ? "ring-blush-600" : "ring-transparent"
              }`}
            >
              <Image src={img.url} alt={productName} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {colors.length > 1 && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blush-600">
            Cor: <span className="normal-case text-blush-800">{selectedColor}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => selectColor(color)}
                title={color}
                className={`flex items-center gap-2 rounded-full border px-2 py-1 text-xs transition ${
                  selectedColor === color
                    ? "border-blush-700 bg-blush-50"
                    : "border-blush-200 hover:border-blush-400"
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-black/10"
                  style={{ backgroundColor: colorToHex(color) }}
                />
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
