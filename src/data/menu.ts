import paoFrances from "../assets/produtos/pao-frances.png";
import paoDeQueijo from "../assets/produtos/pao-de-queijo.png";
import boloChocolate from "../assets/produtos/bolo-chocolate.png";
import coxinha from "../assets/produtos/coxinha.png";
import cafe from "../assets/produtos/cafe.png";
import sonho from "../assets/produtos/sonho.png";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const CATEGORIES = [
  "Pães",
  "Doces & Bolos",
  "Salgados",
  "Bebidas",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Pão Francês",
    description: "Crocante por fora e macio por dentro, assado na hora.",
    price: 0.75,
    image: paoFrances,
    category: "Pães",
  },
  {
    id: "2",
    name: "Pão de Queijo",
    description: "Quentinho, dourado e recheado de queijo.",
    price: 4.5,
    image: paoDeQueijo,
    category: "Pães",
  },
  {
    id: "3",
    name: "Bolo de Chocolate",
    description: "Fatia generosa com cobertura de ganache.",
    price: 8.0,
    image: boloChocolate,
    category: "Doces & Bolos",
  },
  {
    id: "4",
    name: "Sonho",
    description: "Massa fofinha recheada com creme e polvilhada com açúcar.",
    price: 6.0,
    image: sonho,
    category: "Doces & Bolos",
  },
  {
    id: "5",
    name: "Coxinha",
    description: "Salgado crocante recheado com frango cremoso.",
    price: 7.5,
    image: coxinha,
    category: "Salgados",
  },
  {
    id: "6",
    name: "Café Coado",
    description: "Café fresquinho para acompanhar seu pão.",
    price: 3.5,
    image: cafe,
    category: "Bebidas",
  },
];

export const FALLBACK_IMAGE = paoFrances;

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
