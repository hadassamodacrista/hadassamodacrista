import { ProductForm } from "@/components/ProductForm";

export default function NovoProdutoPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-blush-900">Novo produto</h1>
      <ProductForm
        initial={{
          name: "",
          category: "",
          description: "",
          price: "",
          sizes: "",
          colors: "",
          active: true,
          featured: false,
          images: []
        }}
      />
    </div>
  );
}
