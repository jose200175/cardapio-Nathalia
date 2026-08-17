import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { INITIAL_PRODUCTS, type Product } from "../data/menu";
import {
  supabase,
  isSupabaseConfigured,
  type ProductRow,
} from "../lib/supabase";

interface MenuContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
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
    category: row.category,
  };
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      // Sem banco configurado: usa os produtos padrão apenas para exibição.
      setProducts(INITIAL_PRODUCTS);
      setError(
        "Banco de dados não configurado. Exibindo cardápio padrão (as alterações não serão salvas).",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
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
        })
        .eq("id", product.id);
      if (dbError) throw new Error(dbError.message);
      await refresh();
    },
    [refresh],
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
      loading,
      error,
      addProduct,
      updateProduct,
      removeProduct,
      refresh,
    }),
    [products, loading, error, addProduct, updateProduct, removeProduct, refresh],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu deve ser usado dentro de MenuProvider");
  return ctx;
}
