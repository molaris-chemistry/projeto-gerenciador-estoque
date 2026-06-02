"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashboardTab } from "@/components/tecnico/DashboardTab";
import { CategoriasTab } from "@/components/tecnico/CategoriasTab";
import { ProdutosTab } from "@/components/tecnico/ProdutosTab";
import { UsuariosTab } from "@/components/tecnico/UsuariosTab";
import { OrdensServicoTab } from "@/components/tecnico/OrdensServicoTab";
import { CatalogoTab } from "@/components/tecnico/CatalogoTab";
import { LayoutDashboard, Package, Tags, Users, ClipboardList, LogOut, BookOpen } from "lucide-react";

export default function TecnicoDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ROLE_TECNICO") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-black/5 dark:border-white/5 flex flex-col h-screen sticky top-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">Painel Técnico</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab("produtos")} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'produtos' ? 'bg-primary/10 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <Package size={20} /> Produtos (Gestão)
          </button>
          <button onClick={() => setActiveTab("catalogo")} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'catalogo' ? 'bg-primary/10 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <BookOpen size={20} /> Catálogo (Visão)
          </button>
          <button onClick={() => setActiveTab("categorias")} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'categorias' ? 'bg-primary/10 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <Tags size={20} /> Categorias
          </button>
          <button onClick={() => setActiveTab("usuarios")} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'usuarios' ? 'bg-primary/10 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <Users size={20} /> Usuários
          </button>
          <button onClick={() => setActiveTab("os")} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'os' ? 'bg-primary/10 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <ClipboardList size={20} /> Ordens de Serviço
          </button>
        </nav>
        <div className="p-4 border-t border-black/5 dark:border-white/5">
          <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-500 font-medium">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <header className="flex justify-end items-center mb-8">
          <ThemeToggle />
        </header>

        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "categorias" && <CategoriasTab />}
        {activeTab === "produtos" && <ProdutosTab />}
        {activeTab === "catalogo" && <CatalogoTab />}
        {activeTab === "usuarios" && <UsuariosTab />}
        {activeTab === "os" && <OrdensServicoTab />}

      </main>
    </div>
  );
}
