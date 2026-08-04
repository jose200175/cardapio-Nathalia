import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/menu";
import { slugify } from "./CategorySection";

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
    <section className="sticky top-0 z-40 w-full bg-red-800 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center transition-transform hover:scale-105"
          aria-label="Panificação Ideal - Página inicial"
        >
          <img
            src="/logo-ideal.png"
            alt="Panificação Ideal"
            className="h-20 w-auto object-contain sm:h-24"
          />
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 rounded-md border border-red-700 bg-red-950 px-4 py-2 font-medium text-white shadow-md transition-all hover:bg-yellow-500 hover:text-red-950"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <ul className="animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-2 w-52 rounded-md border border-gray-200 bg-white py-1 text-gray-800 shadow-2xl duration-100">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <a
                    href={`#${slugify(category)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full border-b border-gray-100 px-4 py-3 text-left font-medium transition-colors hover:bg-red-50 hover:text-red-800"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default NavBar;
