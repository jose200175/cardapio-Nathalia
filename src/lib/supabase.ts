import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Indica se as credenciais do Supabase estão configuradas.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "[v0] Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (ou as chaves NEXT_PUBLIC_ correspondentes).",
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
  created_at?: string;
}
