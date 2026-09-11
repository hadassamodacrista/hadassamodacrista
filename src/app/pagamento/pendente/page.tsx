import Link from "next/link";

export default function PagamentoPendente() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl text-amber-600">
        ⏳
      </div>
      <h1 className="font-serif text-2xl text-blush-900">Pagamento pendente</h1>
      <p className="mt-2 text-sm text-blush-700">
        Assim que o pagamento for confirmado, entraremos em contato.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-blush-700 px-6 py-3 text-sm font-medium text-white hover:bg-blush-800"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
