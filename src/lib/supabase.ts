import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined) ??
  (import.meta.env.SUPABASE_URL as string | undefined);
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ??
  (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  (import.meta.env.SUPABASE_ANON_KEY as string | undefined) ??
  (import.meta.env.SUPABASE_PUBLISHABLE_KEY as string | undefined);

// Indica se as credenciais do Supabase estão configuradas.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "[v0] Supabase não configurado: defina as variáveis públicas VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ambiente de build do Netlify.",
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
);

// Formato da linha da tabela public.products
export interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sort_order: number;
  image_fit: "cover" | "contain";
  image_position: string;
  created_at?: string;
}
