import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { INITIAL_PRODUCTS, type Product } from "../data/menu";

const STORAGE_KEY = "panificacao-ideal-produtos";

interface MenuContextValue {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {
    // ignora erros de leitura
  }
  return INITIAL_PRODUCTS;
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignora erros de escrita
    }
  }, [products]);

  const value = useMemo<MenuContextValue>(
    () => ({
      products,
      addProduct: (product) =>
        setProducts((prev) => [
          ...prev,
          { ...product, id: crypto.randomUUID() },
        ]),
      updateProduct: (product) =>
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? product : p)),
        ),
      removeProduct: (id) =>
        setProducts((prev) => prev.filter((p) => p.id !== id)),
    }),
    [products],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu deve ser usado dentro de MenuProvider");
  return ctx;
}
