"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authService.login({
        email,
        senha,
      });

      const { token, role } = res;
      // In a real app we'd use cookies (e.g. nookies) and a context provider
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

      if (role === "ROLE_TECNICO") {
        router.push("/tecnico");
      } else {
        router.push("/professor");
      }
    } catch (err: any) {
      setError("Email ou senha inválidos.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground relative transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-2xl shadow-xl border border-black/5 dark:border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left group-hover:scale-x-100 transition-transform duration-500"></div>
        
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Gestão de Estoque</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Faça login para acessar sua conta
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="senha">
              Senha
            </label>
            <div className="relative">
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow pr-10"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/50 hover:text-foreground/80"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg font-medium shadow-md shadow-primary/30 transform transition-all active:scale-95"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
