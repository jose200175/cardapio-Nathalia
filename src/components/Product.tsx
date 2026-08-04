import hotDog from "../assets/hotDog.png";
import laranja from "../assets/laranja.png";

function Product() {
  return (
    <section className="flex justify-around">
      <div className="flex items-center w-90 bg-amber-200 border rounded-xl p-3 m-3">
        <img className="w-auto h-20 rounded-2xl" src={hotDog} alt="" />
        <div className="pl-3">
          <p className="text-xl text-amber-950 pt-3 pb-3">Cachorro-Quente</p>
          <p>pão com cachorro muito quente! Não usamos carne de cachorro!</p>
          <p className="text-red-500">R$5,00</p>
        </div>
      </div>
      <div className="flex items-center w-90 bg-amber-200 border rounded-xl p-3 m-3">
        <img className="w-auto h-20 rounded-2xl" src={laranja} alt="" />
        <div className="pl-3">
          <p className="text-xl text-amber-950 pt-3 pb-3">Suco de Laranja</p>
          <p>suquinho de laranja! Refrenscante pra cachorro!</p>
          <p className="text-red-500">R$3,00</p>
        </div>
      </div>
    </section>
  );
}
export default Product;
