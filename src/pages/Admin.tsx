import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Pencil, X, Upload, ArrowUp, ArrowDown } from "lucide-react";
import {
  formatPrice,
  type Product,
} from "../data/menu";
import { useMenu } from "../context/MenuContext";
import AdminGate from "../components/AdminGate";

interface FormState {
  name: string;
  description: string;
  price: string;
  image: string;
  imageFit: "cover" | "contain";
  imagePosition: string;
  category: string;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  imageFit: "cover",
  imagePosition: "center",
  category: "",
};

// Redimensiona e comprime a imagem para não estourar o armazenamento do navegador
function resizeImage(file: File, maxSize = 600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível processar a imagem."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

function AdminContent() {
  const {
    products,
    categories,
    loading,
    error,
    addCategory,
    addProduct,
    updateProduct,
    removeProduct,
    moveProduct,
    removeCategory,
    moveCategory,
  } = useMenu();
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!editingId && !form.category && categories.length > 0) {
      setForm((current) => ({ ...current, category: categories[0] }));
    }
  }, [categories, editingId, form.category]);

  const handleAddCategory = async () => {
    setCategoryError(null);
    try {
      await addCategory(newCategory);
      setForm((current) => ({ ...current, category: newCategory.trim() }));
      setNewCategory("");
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Erro ao criar categoria.",
      );
    }
  };

  const handleCategoryAction = async (action: () => Promise<void>) => {
    setCategoryError(null);
    try {
      await action();
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Não foi possível atualizar as categorias.",
      );
    }
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Selecione um arquivo de imagem.");
      return;
    }
    try {
      const dataUrl = await resizeImage(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Erro ao carregar a imagem.",
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const price = Number.parseFloat(form.price.replace(",", "."));
    if (!form.name.trim() || Number.isNaN(price) || price < 0) return;

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      image: form.image.trim(),
      imageFit: form.imageFit,
      imagePosition: form.imagePosition,
      category: form.category,
    };

    setSaving(true);
    setSaveError(null);
    try {
      if (editingId) {
        await updateProduct({ ...data, id: editingId });
      } else {
        await addProduct(data);
      }
      setForm({ ...emptyForm, category: data.category });
      setEditingId(null);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? `Erro ao salvar: ${err.message}`
          : "Erro ao salvar o produto.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!window.confirm(`Remover "${name}" do cardápio?`)) return;
    setDeletingId(id);
    setSaveError(null);
    try {
      await removeProduct(id);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? `Erro ao remover: ${err.message}`
          : "Erro ao remover o produto.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      imageFit: product.imageFit ?? "cover",
      imagePosition: product.imagePosition ?? "center",
      category: product.category,
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
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex gap-2">
                <input
                  className={inputClass}
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder="Nova categoria"
                  aria-label="Nome da nova categoria"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleAddCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => void handleAddCategory()}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-red-950 hover:bg-yellow-400"
                >
                  <Plus className="h-4 w-4" />
                  Criar
                </button>
              </div>
              {categoryError && (
                <p className="mt-1 text-xs text-red-600">{categoryError}</p>
              )}
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
                Foto do produto
              </label>
              <div className="flex items-start gap-3">
                {form.image ? (
                  <img
                    src={form.image || "/placeholder.svg"}
                    alt="Pré-visualização"
                    className="h-16 w-16 flex-shrink-0 rounded-lg border border-neutral-200"
                    style={{ objectFit: form.imageFit, objectPosition: form.imagePosition }}
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
                    <Upload className="h-5 w-5" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100">
                    <Upload className="h-4 w-4" />
                    {form.image ? "Trocar foto" : "Enviar foto"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFile}
                    />
                  </label>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="w-fit text-xs text-red-600 hover:underline"
                    >
                      Remover foto
                    </button>
                  )}
                </div>
              </div>
              {uploadError && (
                <p className="mt-1 text-xs text-red-600">{uploadError}</p>
              )}
              <input
                className={`${inputClass} mt-2`}
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="Ou cole um link direto da imagem (https://...)"
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <select className={inputClass} value={form.imageFit} onChange={(e) => setForm({ ...form, imageFit: e.target.value as "cover" | "contain" })} aria-label="Enquadramento da imagem">
                  <option value="cover">Preencher quadro</option>
                  <option value="contain">Mostrar imagem inteira</option>
                </select>
                <select className={inputClass} value={form.imagePosition} onChange={(e) => setForm({ ...form, imagePosition: e.target.value })} aria-label="Posição da imagem">
                  <option value="center">Centro</option>
                  <option value="top">Topo</option>
                  <option value="bottom">Base</option>
                  <option value="left">Esquerda</option>
                  <option value="right">Direita</option>
                </select>
              </div>
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

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-yellow-400 hover:bg-red-900 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {saving
                ? "Salvando..."
                : editingId
                  ? "Salvar alterações"
                  : "Adicionar produto"}
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
          {saveError && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {saveError}
            </p>
          )}
        </form>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-red-900">Organização das categorias</h2>
              <p className="mt-1 text-sm text-neutral-500">
                A ordem abaixo é a mesma exibida no cardápio para os clientes.
              </p>
            </div>
            <span className="hidden text-xs font-medium uppercase tracking-wide text-neutral-400 sm:block">
              Arraste pela ordem usando as setas
            </span>
          </div>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div
                key={category}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-800">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-semibold text-neutral-800">
                  {category}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => void handleCategoryAction(() => moveCategory(category, "up"))}
                    className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-500 transition-colors hover:border-red-200 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Mover ${category} para cima`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === categories.length - 1}
                    onClick={() => void handleCategoryAction(() => moveCategory(category, "down"))}
                    className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-500 transition-colors hover:border-red-200 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Mover ${category} para baixo`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Excluir a categoria ${category}?`)) {
                        void handleCategoryAction(() => removeCategory(category));
                      }
                    }}
                    className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-500 transition-colors hover:border-red-200 hover:text-red-700"
                    aria-label={`Excluir categoria ${category}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {categoryError && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {categoryError}
            </p>
          )}
        </section>

        <h2 className="mb-4 text-lg font-bold text-red-900">
          Produtos cadastrados ({products.length})
        </h2>
        {error && (
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {error}
          </p>
        )}
        {loading && (
          <p className="mb-4 text-sm text-neutral-500">Carregando produtos...</p>
        )}
        <div className="space-y-5">
          {categories.map((category) => {
            const categoryProducts = products
              .filter((product) => product.category === category)
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

            if (categoryProducts.length === 0) return null;

            return (
              <section key={category} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-4 py-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-red-900">{category}</h3>
                    <p className="text-xs text-red-900/60">
                      {categoryProducts.length} {categoryProducts.length === 1 ? "produto" : "produtos"}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-neutral-500">Ordem do cardápio</span>
                </div>
                <div>
                  {categoryProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3 border-b border-neutral-100 p-4 last:border-b-0 sm:gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500">
                        {index + 1}
                      </span>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-14 w-14 flex-shrink-0 rounded-lg"
                        style={{ objectFit: product.imageFit ?? "cover", objectPosition: product.imagePosition ?? "center" }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-neutral-800">{product.name}</p>
                        <p className="truncate text-xs text-neutral-500">{product.description}</p>
                      </div>
                      <span className="hidden font-semibold text-red-700 sm:block">{formatPrice(product.price)}</span>
                      <div className="flex gap-1">
                        <button type="button" disabled={index === 0} onClick={() => void moveProduct(product.id, "up")} aria-label={`Mover ${product.name} para cima`} className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-25"><ArrowUp className="h-4 w-4" /></button>
                        <button type="button" disabled={index === categoryProducts.length - 1} onClick={() => void moveProduct(product.id, "down")} aria-label={`Mover ${product.name} para baixo`} className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-25"><ArrowDown className="h-4 w-4" /></button>
                        <button type="button" onClick={() => startEdit(product)} aria-label={`Editar ${product.name}`} className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-red-700 transition-colors"><Pencil className="h-4 w-4" /></button>
                        <button type="button" onClick={() => handleRemove(product.id, product.name)} disabled={deletingId === product.id} aria-label={`Remover ${product.name}`} className="rounded-md p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
          {products.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">Nenhum produto cadastrado ainda.</div>
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
