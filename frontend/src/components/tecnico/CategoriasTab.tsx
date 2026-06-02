"use client";

import { useEffect, useState } from "react";
import { categoriaService } from "@/services/categoria.service";

interface Categoria {
  id: number;
  nome: string;
  tipoItem: string;
}

export function CategoriasTab() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({ nome: "", tipoItem: "INSUMO" });

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const data = await categoriaService.listar();
      setCategorias(data);
    } catch (e) {
      console.error(e);
    }
  };

  const criarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome) return;
    try {
      await categoriaService.criar(form);
      setForm({ nome: "", tipoItem: "INSUMO" });
      carregarCategorias();
    } catch (e) {
      console.error(e);
      alert("Erro ao criar categoria. Talvez ela já exista.");
    }
  };

  const deletarCategoria = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      await categoriaService.deletar(id);
      carregarCategorias();
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir categoria.");
    }
  };

  const categoriasFiltradas = categorias.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (c.tipoItem && c.tipoItem.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Gestão de Categorias</h2>
      
      <form onSubmit={criarCategoria} className="mb-6 bg-card p-6 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4 border-b border-black/5 dark:border-white/5 pb-2">Cadastrar Nova Categoria</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Tipo de Item Vinculado</label>
            <select className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.tipoItem} onChange={(e) => setForm({...form, tipoItem: e.target.value})}>
              <option value="INSUMO">Insumo / Reagente</option>
              <option value="VIDRARIA">Vidraria</option>
              <option value="EQUIPAMENTO">Equipamento</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Nome da Categoria</label>
            <input required type="text" className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
          </div>
          <button type="submit" className="w-full md:w-auto px-6 py-2 h-[42px] bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 shadow-md">
            Registrar Categoria
          </button>
        </div>
      </form>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou tipo..." 
          className="w-full px-4 py-2 rounded-lg bg-card border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm" 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
        />
      </div>

      <div className="bg-card border border-black/5 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/5 dark:bg-white/5">
              <tr>
                <th className="p-4 font-semibold">Nome da Categoria</th>
                <th className="p-4 font-semibold">Tipo Vinculado</th>
                <th className="p-4 font-semibold text-center w-32">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {categoriasFiltradas.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-foreground/50">Nenhuma categoria encontrada.</td></tr>
              ) : (
                categoriasFiltradas.map((c) => (
                  <tr key={c.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{c.nome}</td>
                    <td className="p-4"><span className="text-xs font-bold text-foreground/70">{c.tipoItem || 'N/A'}</span></td>
                    <td className="p-4 text-center">
                      <button onClick={() => deletarCategoria(c.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 hover:bg-red-500/10 rounded transition-colors">Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
