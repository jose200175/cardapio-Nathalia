import { ChevronRight } from "lucide-react";
import { formatPrice, type Product } from "../data/menu";
import { whatsappLink } from "../data/contact";

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-4 bg-white border border-amber-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <img
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
      />
      <div className="flex flex-1 flex-col">
        <h3 className="text-lg font-bold text-red-900">{product.name}</h3>
        <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-red-700">
            {formatPrice(product.price)}
          </span>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-red-800 px-3 py-1.5 text-sm font-medium text-yellow-400 hover:bg-red-900 transition-colors"
          >
            Pedir
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
