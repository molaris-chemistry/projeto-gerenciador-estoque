"use client";

import { useEffect, useState } from "react";
import { produtoService } from "@/services/produto.service";
import { categoriaService } from "@/services/categoria.service";

interface Produto {
  id: number;
  nome: string;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
  localizacao: string;
  perigoso: boolean;
  localDescarte: string;
  categoria: { id: number; nome: string };
  tipoItem: string;
  pesoMolar?: number;
  concentracao?: string;
  estadoFisico?: string;
  capacidadeMl?: number;
  subTipoVidraria?: string;
  fabricante?: string;
  modelo?: string;
  voltagem?: string;
}

interface Categoria {
  id: number;
  nome: string;
}

export function ProdutosTab() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({
    nome: "",
    quantidadeTotal: 0,
    localizacao: "",
    perigoso: false,
    localDescarte: "",
    categoriaId: "",
    tipoItem: "INSUMO",
    // Dinâmicos
    pesoMolar: "",
    concentracao: "",
    estadoFisico: "",
    capacidadeMl: "",
    subTipoVidraria: "",
    fabricante: "",
    modelo: "",
    voltagem: ""
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [prodData, catData] = await Promise.all([
        produtoService.listar(),
        categoriaService.listar()
      ]);
      setProdutos(prodData);
      setCategorias(catData);
    } catch (e) {
      console.error(e);
    }
  };

  const criarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.categoriaId) return;
    try {
      const payload: any = { 
        nome: form.nome,
        quantidadeTotal: form.quantidadeTotal,
        quantidadeDisponivel: form.quantidadeTotal,
        localizacao: form.localizacao,
        perigoso: form.perigoso,
        localDescarte: form.localDescarte,
        tipoItem: form.tipoItem,
        categoria: { id: parseInt(form.categoriaId) }
      };

      if (form.tipoItem === "INSUMO") {
        payload.pesoMolar = form.pesoMolar ? parseFloat(form.pesoMolar) : null;
        payload.concentracao = form.concentracao;
        payload.estadoFisico = form.estadoFisico;
      } else if (form.tipoItem === "VIDRARIA") {
        payload.capacidadeMl = form.capacidadeMl ? parseInt(form.capacidadeMl) : null;
        payload.subTipoVidraria = form.subTipoVidraria;
      } else if (form.tipoItem === "EQUIPAMENTO") {
        payload.fabricante = form.fabricante;
        payload.modelo = form.modelo;
        payload.voltagem = form.voltagem;
      }

      await produtoService.criar(payload);
      setForm({ 
        nome: "", quantidadeTotal: 0, localizacao: "", perigoso: false, localDescarte: "", categoriaId: "", tipoItem: "INSUMO",
        pesoMolar: "", concentracao: "", estadoFisico: "", capacidadeMl: "", subTipoVidraria: "", fabricante: "", modelo: "", voltagem: "" 
      });
      carregarDados();
    } catch (e) {
      console.error(e);
      alert("Erro ao criar produto");
    }
  };

  const deletarProduto = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await produtoService.deletar(id);
      carregarDados();
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir produto.");
    }
  };

  const produtosFiltrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.tipoItem.toLowerCase().includes(busca.toLowerCase()) || p.categoria?.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Gestão de Produtos e Insumos</h2>
      
      <form onSubmit={criarProduto} className="mb-8 bg-card p-6 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4 border-b border-black/5 dark:border-white/5 pb-2">Informações Base</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 items-start">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Item</label>
            <input required type="text" className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Item</label>
            <select required className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.tipoItem} onChange={(e) => setForm({...form, tipoItem: e.target.value})}>
              <option value="INSUMO">Insumo / Reagente</option>
              <option value="VIDRARIA">Vidraria</option>
              <option value="EQUIPAMENTO">Equipamento</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoria Específica</label>
            <select required className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.categoriaId} onChange={(e) => setForm({...form, categoriaId: e.target.value})}>
              <option value="">Selecione...</option>
              {categorias.filter(c => (c as any).tipoItem === form.tipoItem || !(c as any).tipoItem).map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantidade Adquirida</label>
            <input required type="number" min="0" className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.quantidadeTotal} onChange={(e) => setForm({...form, quantidadeTotal: parseInt(e.target.value)})} />
          </div>
        </div>

        <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4 border-b border-black/5 dark:border-white/5 pb-2">Especificações Técnicas</h3>
        
        {/* Renderização Dinâmica Simétrica baseada no Tipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          {form.tipoItem === "INSUMO" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Peso Molar (g/mol)</label>
                <input type="number" step="0.01" className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.pesoMolar} onChange={(e) => setForm({...form, pesoMolar: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Concentração (Texto Livre)</label>
                <input type="text" placeholder="ex: 0.5 mol/L, 98%" className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.concentracao} onChange={(e) => setForm({...form, concentracao: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado Físico</label>
                <select className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.estadoFisico} onChange={(e) => setForm({...form, estadoFisico: e.target.value})}>
                  <option value="">Selecione...</option>
                  <option value="Sólido">Sólido</option>
                  <option value="Líquido">Líquido</option>
                  <option value="Aquoso">Aquoso</option>
                  <option value="Pastoso">Pastoso</option>
                  <option value="Gasoso">Gasoso</option>
                </select>
              </div>
            </>
          )}

          {form.tipoItem === "VIDRARIA" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Capacidade (mL)</label>
                <input type="number" className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.capacidadeMl} onChange={(e) => setForm({...form, capacidadeMl: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Classificação de Precisão</label>
                <select className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.subTipoVidraria} onChange={(e) => setForm({...form, subTipoVidraria: e.target.value})}>
                  <option value="">Selecione...</option>
                  <option value="Volumétrica">Volumétrica (Alta Precisão)</option>
                  <option value="Graduada">Graduada</option>
                  <option value="Sem Graduação">Sem Graduação</option>
                </select>
              </div>
            </>
          )}

          {form.tipoItem === "EQUIPAMENTO" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Fabricante</label>
                <input type="text" placeholder="Nome da marca..." className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.fabricante} onChange={(e) => setForm({...form, fabricante: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Modelo</label>
                <input type="text" placeholder="Série/Modelo..." className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.modelo} onChange={(e) => setForm({...form, modelo: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Voltagem</label>
                <select className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.voltagem} onChange={(e) => setForm({...form, voltagem: e.target.value})}>
                  <option value="">Selecione...</option>
                  <option value="110V">110V</option>
                  <option value="220V">220V</option>
                  <option value="Bivolt">Bivolt</option>
                  <option value="Bateria/Pilhas">Bateria/Pilhas</option>
                </select>
              </div>
            </>
          )}
        </div>

        <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4 border-b border-black/5 dark:border-white/5 pb-2">Armazenamento e Risco</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-end">
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium mb-1">Armário / Prateleira / Localização</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.localizacao} onChange={(e) => setForm({...form, localizacao: e.target.value})} />
          </div>
          <div>
             <div className="flex items-center gap-3 h-[42px] px-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <input type="checkbox" id="perigoso" className="w-4 h-4 accent-red-500" checked={form.perigoso} onChange={(e) => setForm({...form, perigoso: e.target.checked})} />
                <label htmlFor="perigoso" className="text-sm font-bold text-red-600 dark:text-red-400">Classificação de Risco</label>
             </div>
          </div>
          {form.perigoso ? (
            <div>
              <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-1">Instruções de Descarte</label>
              <input required type="text" className="w-full px-4 py-2 rounded-lg bg-background border border-red-500/50 focus:ring-2 focus:ring-red-500 focus:outline-none" value={form.localDescarte} onChange={(e) => setForm({...form, localDescarte: e.target.value})} />
            </div>
          ) : (
             <div></div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex justify-end">
          <button type="submit" className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 shadow-md">
            Registrar Item no Estoque
          </button>
        </div>
      </form>

      <div className="mb-4">
        <input type="text" placeholder="Pesquisar por nome, tipo ou categoria..." className="w-full px-4 py-2 rounded-lg bg-card border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm" value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <div className="bg-card border border-black/5 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/5 dark:bg-white/5">
              <tr>
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold">Tipo</th>
                <th className="p-4 font-semibold">Categoria</th>
                <th className="p-4 font-semibold">Especificações</th>
                <th className="p-4 font-semibold text-center">Estoque</th>
                <th className="p-4 font-semibold">Localização</th>
                <th className="p-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {produtosFiltrados.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-foreground/50">Nenhum produto cadastrado no laboratório.</td></tr>
              ) : (
                produtosFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{p.nome} {p.perigoso && <span className="text-xs ml-2 px-2 py-0.5 bg-red-500/10 text-red-600 rounded-full font-bold">Risco</span>}</td>
                    <td className="p-4 text-xs font-bold text-foreground/70">{p.tipoItem}</td>
                    <td className="p-4">{p.categoria?.nome}</td>
                    <td className="p-4 text-xs">
                       {p.tipoItem === 'INSUMO' && <span className="text-foreground/70">{p.concentracao || '-'} | {p.estadoFisico || '-'}</span>}
                       {p.tipoItem === 'VIDRARIA' && <span className="text-foreground/70">{p.capacidadeMl ? p.capacidadeMl + 'mL' : '-'} | {p.subTipoVidraria || '-'}</span>}
                       {p.tipoItem === 'EQUIPAMENTO' && <span className="text-foreground/70">{p.fabricante || '-'} | {p.modelo || '-'} | {p.voltagem || '-'}</span>}
                    </td>
                    <td className="p-4 text-center"><span className="font-bold text-primary">{p.quantidadeDisponivel}</span> / {p.quantidadeTotal}</td>
                    <td className="p-4">{p.localizacao}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => deletarProduto(p.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 hover:bg-red-500/10 rounded transition-colors">Excluir</button>
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
