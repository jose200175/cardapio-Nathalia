import { formatPrice, type Product } from "../data/menu";

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
        <div className="mt-3">
          <span className="text-lg font-bold text-red-700">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
