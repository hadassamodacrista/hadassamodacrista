import Link from "next/link";

export function Footer({ storeName, instagram }: { storeName: string; instagram: string | null }) {
  return (
    <footer className="mt-16 border-t border-blush-200 bg-blush-50 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-blush-700">
        <p className="font-serif text-base text-blush-800">{storeName} · Moda com Propósito</p>
        {instagram && (
          <a
            href={`https://instagram.com/${instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blush-900"
          >
            @{instagram.replace("@", "")}
          </a>
        )}
        <p className="text-xs text-blush-500">
          © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
        </p>
        <Link href="/admin/login" className="text-xs text-blush-300 hover:text-blush-500">
          Área administrativa
        </Link>
      </div>
    </footer>
  );
}
