import { whatsappDigits } from "@/lib/whatsapp";

export function WhatsAppFloat({ whatsapp }: { whatsapp: string | null }) {
  if (!whatsapp) return null;
  const digits = whatsappDigits(whatsapp);
  const href = `https://wa.me/${digits}?text=${encodeURIComponent("Olá! Vi o catálogo da Hadassa e gostaria de mais informações.")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
      aria-label="Falar no WhatsApp"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.86 9.86 0 0 0 4.62 1.15h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.78 14.03c-.24.68-1.39 1.29-1.92 1.34-.49.05-1.03.24-3.5-.73-2.97-1.17-4.87-4.17-5.02-4.36-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37h.57c.18 0 .43-.03.66.5.24.55.82 1.9.9 2.04.07.15.12.31.02.5-.1.2-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.64 2.02 1.13 1.01 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.17-.2.73-.85.93-1.14.2-.3.4-.24.65-.15.27.1 1.7.8 2 .95.3.15.5.22.57.35.08.13.08.75-.16 1.43Z" />
      </svg>
      WhatsApp
    </a>
  );
}
