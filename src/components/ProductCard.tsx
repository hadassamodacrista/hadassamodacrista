import Image from "next/image";
import Link from "next/link";
import { colorToHex } from "@/lib/colorSwatch";

type Props = {
  slug: string;
  name: string;
  price: number | null;
  imageUrl?: string;
  colors?: string[];
  featured?: boolean;
};

export function ProductCard({ slug, name, price, imageUrl, colors = [], featured }: Props) {
  const uniqueColors = Array.from(new Set(colors));

  return (
    <Link
      href={`/produto/${slug}`}
      className="group block overflow-hidden rounded-2xl border border-blush-200 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-blush-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-blush-400">Sem foto</div>
        )}
        {featured && (
          <span className="absolute left-2 top-2 rounded-full bg-blush-700 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
            Novidade
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate font-serif text-sm text-blush-900">{name}</h3>
        <p className="mt-1 text-sm font-semibold text-blush-700">
          {price ? price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Consulte"}
        </p>
        {uniqueColors.length > 1 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {uniqueColors.slice(0, 6).map((c) => (
              <span
                key={c}
                title={c}
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ backgroundColor: colorToHex(c) }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
