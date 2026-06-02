"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[72px] h-10 bg-black/5 dark:bg-white/5 rounded-full" />;
  }

  return (
    <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-full relative w-[72px] h-10 shadow-inner">
      {/* Indicador Deslizante */}
      <div 
        className="absolute top-1 bottom-1 w-[32px] bg-white dark:bg-gray-800 rounded-full shadow-md transition-transform duration-300 ease-spring"
        style={{ transform: theme === 'dark' ? 'translateX(32px)' : 'translateX(0)' }}
      />
      
      {/* Botões Transparentes Sobrepostos */}
      <button
        onClick={() => setTheme("light")}
        className={`relative z-10 w-[32px] h-[32px] flex items-center justify-center rounded-full transition-colors ${theme === "light" ? "text-amber-500" : "text-foreground/40 hover:text-foreground/70"}`}
        aria-label="Tema Claro"
      >
        <Sun size={16} strokeWidth={2.5} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`relative z-10 w-[32px] h-[32px] flex items-center justify-center rounded-full transition-colors ${theme === "dark" ? "text-blue-400" : "text-foreground/40 hover:text-foreground/70"}`}
        aria-label="Tema Escuro"
      >
        <Moon size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
