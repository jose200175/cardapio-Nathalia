import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    // Expõe as chaves públicas do Supabase ao navegador.
    // Usa VITE_* se existir, senão cai para as chaves NEXT_PUBLIC_* do projeto.
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        env.VITE_SUPABASE_URL ??
          env.NEXT_PUBLIC_SUPABASE_URL ??
          process.env.VITE_SUPABASE_URL ??
          process.env.NEXT_PUBLIC_SUPABASE_URL ??
          process.env.SUPABASE_URL ??
          "",
      ),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY ??
          env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
          env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
          process.env.VITE_SUPABASE_ANON_KEY ??
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
          process.env.SUPABASE_ANON_KEY ??
          process.env.SUPABASE_PUBLISHABLE_KEY ??
          "",
      ),
    },
  };
});
