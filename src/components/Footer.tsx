import { Phone, MapPin, Clock } from "lucide-react";
import { CONTACT } from "../data/contact";

function Footer() {
  return (
    <footer className="mt-16 bg-red-900 text-yellow-50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <img
            src="/logo-ideal.png"
            alt={CONTACT.storeName}
            className="mb-4 h-24 w-auto object-contain"
          />
          <p className="text-sm text-yellow-100/80 leading-relaxed">
            Pães, doces e salgados feitos com carinho todos os dias.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-yellow-400">Contato</h4>
          <a
            href={`tel:${CONTACT.phoneDisplay.replace(/\D/g, "")}`}
            className="flex items-center gap-2 text-sm hover:text-yellow-400 transition-colors"
          >
            <Phone className="h-4 w-4 flex-shrink-0" />
            {CONTACT.phoneDisplay}
          </a>
          <p className="mt-3 flex items-start gap-2 text-sm text-yellow-100/80">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            {CONTACT.address}
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-yellow-400">
            Horário de funcionamento
          </h4>
          <p className="flex items-start gap-2 text-sm text-yellow-100/80">
            <Clock className="h-4 w-4 flex-shrink-0" />
            {CONTACT.hours}
          </p>
        </div>
      </div>

      <div className="border-t border-red-800 py-4 text-center text-xs text-yellow-100/60">
        © {new Date().getFullYear()} {CONTACT.storeName}. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}

export default Footer;
