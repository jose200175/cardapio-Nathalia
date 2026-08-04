import { type Product } from "../data/menu";
import ProductCard from "./ProductCard";

interface CategorySectionProps {
  title: string;
  products: Product[];
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function CategorySection({ title, products }: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <section id={slugify(title)} className="scroll-mt-24">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-2xl font-serif font-bold text-red-900">{title}</h2>
        <span className="h-px flex-1 bg-amber-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export { slugify };
export default CategorySection;
