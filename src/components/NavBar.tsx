import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu se o usuário clicar fora dele
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <section className="w-screen bg-red-800">
      {/* Topo da Navbar: Alinhamento horizontal com espaço para o botão */}
      <div className="flex items-center justify-around px-6 py-4 max-w-6xl mx-auto">
        <h1 className="text-yellow-500 text-2xl font-serif">
          Panificação Ideal
        </h1>

        {/* Container do Botão Dropdown Principal */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-red-950 text-white px-4 py-2 rounded-md border border-red-700 hover:bg-yellow-500 hover:text-red-950 transition-all font-medium shadow-md"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Menu Suspenso (Dropdown) com todas as opções */}
          {isMenuOpen && (
            <ul className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-2xl z-50 py-1 text-gray-800 animate-in fade-in zoom-in-95 duration-100">
              <li>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    alert("Navegando para Menu");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-800 font-medium transition-colors border-b border-gray-100"
                >
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    alert("Navegando para Produtos");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-800 font-medium transition-colors border-b border-gray-100"
                >
                  Produtos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    alert("Navegando para Eventos");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-800 font-medium transition-colors border-b border-gray-100"
                >
                  Eventos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    alert("Navegando para Contato");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-800 font-medium transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default NavBar;
