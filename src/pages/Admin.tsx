import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Pencil, X } from "lucide-react";
import {
  CATEGORIES,
  formatPrice,
  type Category,
  type Product,
} from "../data/menu";
import { useMenu } from "../context/MenuContext";
import AdminGate from "../components/AdminGate";

interface FormState {
  name: string;
  description: string;
  price: string;
  image: string;
  category: Category;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: CATEGORIES[0],
};

function AdminContent() {
  const { products, addProduct, updateProduct, removeProduct } = useMenu();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const price = Number.parseFloat(form.price.replace(",", "."));
    if (!form.name.trim() || Number.isNaN(price) || price < 0) return;

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      image: form.image.trim(),
      category: form.category,
    };

    if (editingId) {
      updateProduct({ ...data, id: editingId });
    } else {
      addProduct(data);
    }
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: product.category as Category,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100";

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-red-900 px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="font-serif text-2xl text-yellow-400">
            Administração do Cardápio
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-red-700 px-3 py-1.5 text-sm text-yellow-50 hover:bg-red-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Ver cardápio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-bold text-red-900">
            {editingId ? "Editar produto" : "Adicionar novo produto"}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Nome
              </label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Pão de Queijo"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Categoria
              </label>
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Category })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Preço (R$)
              </label>
              <input
                className={inputClass}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Ex: 4,50"
                inputMode="decimal"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                URL da imagem
              </label>
              <input
                className={inputClass}
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Descrição
              </label>
              <textarea
                className={inputClass}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Breve descrição do produto"
                rows={2}
              />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-yellow-400 hover:bg-red-900 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {editingId ? "Salvar alterações" : "Adicionar produto"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
            )}
          </div>
        </form>

        <h2 className="mb-4 text-lg font-bold text-red-900">
          Produtos cadastrados ({products.length})
        </h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 border-b border-neutral-100 p-4 last:border-b-0"
            >
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-neutral-800">
                  {product.name}
                </p>
                <p className="text-xs text-neutral-500">{product.category}</p>
              </div>
              <span className="font-semibold text-red-700">
                {formatPrice(product.price)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(product)}
                  aria-label={`Editar ${product.name}`}
                  className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-red-700 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeProduct(product.id)}
                  aria-label={`Remover ${product.name}`}
                  className="rounded-md p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="p-6 text-center text-sm text-neutral-500">
              Nenhum produto cadastrado ainda.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function Admin() {
  return (
    <AdminGate>
      <AdminContent />
    </AdminGate>
  );
}

export default Admin;
