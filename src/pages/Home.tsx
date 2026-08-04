import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import CategorySection from "../components/CategorySection";
import { CATEGORIES } from "../data/menu";
import { useMenu } from "../context/MenuContext";

function Home() {
  const { products } = useMenu();

  return (
    <div className="min-h-screen bg-amber-50">
      <NavBar />

      <header className="bg-red-800 pb-10 pt-4 text-center">
        <p className="mx-auto max-w-xl px-6 font-serif text-lg text-yellow-100">
          Nosso cardápio de delícias fresquinhas, feitas todos os dias.
        </p>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-12">
        {CATEGORIES.map((category) => (
          <CategorySection
            key={category}
            title={category}
            products={products.filter((p) => p.category === category)}
          />
        ))}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Home;
