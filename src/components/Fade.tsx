import { useEffect, useRef, useState } from "react";

interface FadeOutSectionProps {
  children: React.ReactNode;
}

export default function FadeOutSection({ children }: FadeOutSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [opacity, setOpacity] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const elementHeight = rect.height;
      const elementTop = rect.top;

      // Calcula quanto do elemento já saiu do topo da tela
      if (elementTop < 0) {
        // Reduz a opacidade gradualmente até chegar a 0
        const newOpacity = Math.max(
          0,
          1 - Math.abs(elementTop) / elementHeight,
        );
        setOpacity(newOpacity);
      } else {
        // Se o elemento ainda não passou do topo, mantém 100% visível
        setOpacity(1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ opacity: opacity }}
      className="will-change-opacity transition-opacity duration-75 ease-out"
    >
      {children}
    </div>
  );
}
