import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

const ADMIN_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? "ideal2024";
const STORAGE_KEY = "admin-auth";

interface AdminGateProps {
  children: ReactNode;
}

function AdminGate({ children }: AdminGateProps) {
  const [authorized, setAuthorized] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === "true",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (authorized) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-800">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="font-serif text-xl text-red-900">Área restrita</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Digite a senha para acessar a administração.
          </p>
        </div>

        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          autoFocus
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          placeholder="••••••••"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">Senha incorreta. Tente novamente.</p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-yellow-400 transition-colors hover:bg-red-900"
        >
          Entrar
        </button>

        <Link
          to="/"
          className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-500 transition-colors hover:text-red-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao cardápio
        </Link>
      </form>
    </div>
  );
}

export default AdminGate;
