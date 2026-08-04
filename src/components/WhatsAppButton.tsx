import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../data/contact";

function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/40 transition-transform hover:scale-110 hover:bg-green-600"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="sr-only">Falar no WhatsApp</span>
    </a>
  );
}

export default WhatsAppButton;
