// Informacoes de contato da padaria.
// Ajuste estes valores com os dados reais.
export const CONTACT = {
  storeName: "Panificação Ideal",
  phoneDisplay: "(11) 3333-4444",
  // Numero para o WhatsApp no formato internacional, apenas digitos.
  whatsappNumber: "5511999999999",
  whatsappMessage: "Olá! Gostaria de fazer um pedido.",
  address: "Rua das Delícias, 123 - Centro",
  hours: "Seg a Sáb: 6h às 20h | Dom: 6h às 13h",
};

export function whatsappLink(): string {
  const text = encodeURIComponent(CONTACT.whatsappMessage);
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${text}`;
}
