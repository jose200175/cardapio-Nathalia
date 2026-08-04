import hotDog from "../assets/hotDog.png";
import { ChevronRight } from "lucide-react";

function Teste() {
  return (
    <section>
      <a
        href="#"
        className="w-fit flex flex-row items-center bg-neutral-50 p-6 border rounded-2xl shadow-xs md:max-w-xl md:flex-row "
      >
        <img
          src={hotDog}
          className="object-cover w-auto rounded h-30 md:h-auto md:w-48 mb-4 md:mb-0"
          alt=""
        />
        <div className="flex flex-col justify-between m-2 md:p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-heading">
            Cachorro-Quente
          </h5>
          <p className="mb-6 text-body">Cachorro muito quente</p>
          <button
            type="button"
            className="inline-flex items-center w-fit text-body bg-neutral-100 box-border border-2 border-neutral-200 rounded pb-1 pt-1 pl-2 pr-2"
          >
            R$5,00
            <ChevronRight />
          </button>
        </div>
      </a>
    </section>
  );
}

export default Teste;
