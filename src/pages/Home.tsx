import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import CategorySection from "../components/CategorySection";
import { CATEGORIES } from "../data/menu";
import { useMenu } from "../context/MenuContext";

function Home() {
  const { products, loading, error } = useMenu();

  return (
    <div className="min-h-screen bg-amber-50">
      <NavBar />

      <header className="bg-red-800 pb-10 pt-4 text-center">
        <p className="mx-auto max-w-md px-6 font-serif text-sm font-bold text-yellow-100 text-balance sm:max-w-2xl sm:text-lg">
          AQUI, CADA PÃO, CADA DOCE E CADA REFEIÇÃO TEM MÃOS, DEDICAÇÃO E
          HISTÓRIA.
        </p>
        <p className="mx-auto mt-3 max-w-2xl px-6 font-serif text-base text-yellow-100/90 text-pretty">
          Tudo é preparado diariamente pela nossa equipe:
        </p>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-12">
        {loading ? (
          <p className="py-16 text-center font-serif text-lg text-red-900/70">
            Carregando o cardápio...
          </p>
        ) : error ? (
          <p className="py-16 text-center font-serif text-lg text-red-700">
            {error}
          </p>
        ) : products.length === 0 ? (
          <p className="py-16 text-center font-serif text-lg text-red-900/70">
            Nenhum produto disponível no momento.
          </p>
        ) : (
          CATEGORIES.map((category) => (
            <CategorySection
              key={category}
              title={category}
              products={products.filter((p) => p.category === category)}
            />
          ))
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Home;
