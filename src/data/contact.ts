// Informacoes de contato da padaria.
// Ajuste estes valores com os dados reais.
export const CONTACT = {
  storeName: "Panificação Ideal",
  phoneDisplay: "(79) 9 9628-2836",
  // Numero para o WhatsApp no formato internacional, apenas digitos.
  whatsappNumber: "5579996282836",
  whatsappMessage: "Olá! Gostaria de fazer um pedido.",
  address: "Av. Franklin de Campos Sobral, 1779, Grageru",
  hours: "Seg a Sáb: 6h às 20h | Dom: 7h às 12h",
};

export function whatsappLink(): string {
  const text = encodeURIComponent(CONTACT.whatsappMessage);
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${text}`;
}
