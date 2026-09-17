import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CATEGORIES, INITIAL_PRODUCTS, type Product } from "../data/menu";
import {
  supabase,
  isSupabaseConfigured,
  type ProductRow,
} from "../lib/supabase";

interface MenuContextValue {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  addCategory: (name: string) => Promise<void>;
  removeCategory: (name: string) => Promise<void>;
  moveCategory: (name: string, direction: "up" | "down") => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  moveProduct: (id: string, direction: "up" | "down") => Promise<void>;
  refresh: () => Promise<void>;
}

const MenuContext = createContext<MenuContextValue | null>(null);

// Converte a linha do banco para o formato usado na interface.
function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price) || 0,
    image: row.image ?? "",
    imageFit: row.image_fit ?? "cover",
    imagePosition: row.image_position ?? "center",
    category: row.category,
    sortOrder: row.sort_order,
  };
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      // Sem banco configurado: usa os produtos padrão apenas para exibição.
      setProducts(INITIAL_PRODUCTS);
      setCategories([...CATEGORIES]);
      setError(
        "Banco de dados não configurado. Exibindo cardápio padrão (as alterações não serão salvas).",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("name")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (categoryError) {
      console.log("[v0] Erro ao carregar categorias:", categoryError.message);
    } else {
      setCategories(categoryData.map((category) => category.name));
    }
    const { data, error: dbError } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (dbError) {
      console.log("[v0] Erro ao carregar produtos:", dbError.message);
      setError("Não foi possível carregar os produtos.");
      setProducts([]);
    } else {
      setProducts((data as ProductRow[]).map(rowToProduct));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addCategory = useCallback(
    async (name: string) => {
      const normalized = name.trim();
      if (!normalized) throw new Error("Informe o nome da categoria.");
      const { error: dbError } = await supabase.from("categories").insert({
        name: normalized,
        sort_order: categories.length + 1,
      });
      if (dbError) throw new Error(dbError.message);
      await refresh();
    },
    [categories.length, refresh],
  );

  const removeCategory = useCallback(
    async (name: string) => {
      const hasProducts = products.some((product) => product.category === name);
      if (hasProducts) throw new Error("Remova ou mova os produtos desta categoria antes.");
      const { error: dbError } = await supabase.from("categories").delete().eq("name", name);
      if (dbError) throw new Error(dbError.message);
      await refresh();
    },
    [products, refresh],
  );

  const moveCategory = useCallback(
    async (name: string, direction: "up" | "down") => {
      const index = categories.indexOf(name);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= categories.length) return;
      const reordered = [...categories];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      const results = await Promise.all(
        reordered.map((category, sort_order) =>
          supabase
            .from("categories")
            .update({ sort_order })
            .eq("name", category),
        ),
      );
      const dbError = results.find((result) => result.error)?.error;
      if (dbError) throw new Error(dbError.message);
      await refresh();
    },
    [categories, refresh],
  );

  const addProduct = useCallback(
    async (product: Omit<Product, "id">) => {
      const maxOrder = products.reduce(
        (max, _p, i) => Math.max(max, i + 1),
        products.length,
      );
      const { error: dbError } = await supabase.from("products").insert({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        image_fit: product.imageFit ?? "cover",
        image_position: product.imagePosition ?? "center",
        sort_order: maxOrder + 1,
      });
      if (dbError) throw new Error(dbError.message);
      await refresh();
    },
    [products, refresh],
  );

  const updateProduct = useCallback(
    async (product: Product) => {
      const { error: dbError } = await supabase
        .from("products")
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          image_fit: product.imageFit ?? "cover",
          image_position: product.imagePosition ?? "center",
        })
        .eq("id", product.id);
      if (dbError) throw new Error(dbError.message);
      await refresh();
    },
    [refresh],
  );

  const moveProduct = useCallback(
    async (id: string, direction: "up" | "down") => {
      const product = products.find((item) => item.id === id);
      if (!product) return;
      const siblings = products.filter((item) => item.category === product.category);
      const index = siblings.findIndex((item) => item.id === id);
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= siblings.length) return;
      const reordered = [...siblings];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      const updates = reordered.map((item, sort_order) =>
        supabase.from("products").update({ sort_order }).eq("id", item.id),
      );
      const results = await Promise.all(updates);
      const dbError = results.find((result) => result.error)?.error;
      if (dbError) throw new Error(dbError.message);
      await refresh();
    },
    [products, refresh],
  );

  const removeProduct = useCallback(
    async (id: string) => {
      const { error: dbError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      if (dbError) throw new Error(dbError.message);
      await refresh();
    },
    [refresh],
  );

  const value = useMemo<MenuContextValue>(
    () => ({
      products,
      categories,
      loading,
      addCategory,
      removeCategory,
      moveCategory,
      error,
      addProduct,
      updateProduct,
      removeProduct,
      moveProduct,
      refresh,
    }),
    [products, categories, loading, error, addCategory, removeCategory, moveCategory, addProduct, updateProduct, removeProduct, moveProduct, refresh],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu deve ser usado dentro de MenuProvider");
  return ctx;
}
