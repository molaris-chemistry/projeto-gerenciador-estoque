"use client";

import { useEffect, useState } from "react";
import { produtoService } from "@/services/produto.service";
import { Beaker, FlaskConical, Wrench } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
  localizacao: string;
  perigoso: boolean;
  tipoItem: string;
  categoria: { nome: string };
  pesoMolar?: number;
  concentracao?: string;
  estadoFisico?: string;
  capacidadeMl?: number;
  subTipoVidraria?: string;
  fabricante?: string;
  modelo?: string;
  voltagem?: string;
}

export function CatalogoTab() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const data = await produtoService.listar();
      setProdutos(data);
    } catch (e) {
      console.error(e);
    }
  };

  const getDetalhes = (p: Produto) => {
    if (p.tipoItem === 'INSUMO') return `${p.concentracao || ''} ${p.estadoFisico || ''}`;
    if (p.tipoItem === 'VIDRARIA') return `${p.capacidadeMl ? p.capacidadeMl + 'mL' : ''} ${p.subTipoVidraria || ''}`;
    if (p.tipoItem === 'EQUIPAMENTO') return `${p.fabricante || ''} ${p.modelo || ''} ${p.voltagem || ''}`;
    return "";
  };

  const renderTabela = (titulo: string, icon: React.ReactNode, itens: Produto[]) => (
    <div className="mb-8 bg-card border border-black/5 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-black/5 dark:bg-white/5 p-4 font-bold flex items-center gap-2 text-foreground/80">
        {icon} {titulo}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5">
            <tr>
              <th className="p-4 font-semibold w-1/3">Item / Categoria</th>
              <th className="p-4 font-semibold">Especificações</th>
              <th className="p-4 font-semibold text-center">Disponível / Total</th>
              <th className="p-4 font-semibold">Localização</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {itens.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Nenhum item encontrado nesta categoria.</td></tr>
            ) : (
              itens.map(p => (
                <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">
                    <div className="flex flex-col">
                      <span className="text-base">{p.nome} {p.perigoso && <span className="text-[10px] ml-2 px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full font-bold uppercase tracking-wider">Atenção</span>}</span>
                      <span className="text-xs text-foreground/50">{p.categoria?.nome}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-foreground/70">{getDetalhes(p) || '-'}</td>
                  <td className="p-4 font-bold text-center text-lg">
                    <span className="text-primary">{p.quantidadeDisponivel}</span>
                    <span className="text-foreground/30 text-sm mx-1">/</span>
                    <span className="text-foreground/50 text-sm">{p.quantidadeTotal}</span>
                  </td>
                  <td className="p-4 text-foreground/70">{p.localizacao}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const produtosFiltrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
  const vidrarias = produtosFiltrados.filter(p => p.tipoItem === 'VIDRARIA');
  const insumos = produtosFiltrados.filter(p => p.tipoItem === 'INSUMO');
  const equipamentos = produtosFiltrados.filter(p => p.tipoItem === 'EQUIPAMENTO');

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Visualização do Catálogo (Visão do Professor)</h2>
      
      <div className="mb-6 w-full">
        <input 
          type="text" 
          placeholder="Pesquisar itens no catálogo..." 
          className="w-full px-6 py-4 rounded-xl bg-card border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm text-lg" 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
        />
      </div>

      {renderTabela("Insumos e Reagentes", <FlaskConical size={18} className="text-pink-500" />, insumos)}
      {renderTabela("Vidrarias", <Beaker size={18} className="text-blue-500" />, vidrarias)}
      {renderTabela("Equipamentos", <Wrench size={18} className="text-orange-500" />, equipamentos)}
    </div>
  );
}
