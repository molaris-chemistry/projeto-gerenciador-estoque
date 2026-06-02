"use client";

import { useEffect, useState } from "react";
import { produtoService } from "@/services/produto.service";
import { ordemServicoService } from "@/services/ordemServico.service";

export function DashboardTab() {
  const [stats, setStats] = useState({ produtos: 0, osPendentes: 0, devolucoesPendentes: 0 });
  const [ultimosProdutos, setUltimosProdutos] = useState<any[]>([]);
  const [osRecentes, setOsRecentes] = useState<any[]>([]);

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    try {
      const [prods, os] = await Promise.all([
        produtoService.listar(),
        ordemServicoService.listar()
      ]);

      const pendentes = os.filter((o: any) => o.status === "PENDENTE").length;
      const devolucoes = os.filter((o: any) => o.status === "DEVOLUCAO_PENDENTE").length;

      setStats({ produtos: prods.length, osPendentes: pendentes, devolucoesPendentes: devolucoes });
      
      setUltimosProdutos(prods.sort((a: any, b: any) => b.id - a.id).slice(0, 5));
      setOsRecentes(os.sort((a: any, b: any) => b.id - a.id).slice(0, 5));
      
    } catch (e) {
      console.error("Erro ao carregar resumo", e);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-card rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total de Produtos</h3>
          <p className="text-3xl font-bold text-primary">{stats.produtos}</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Alocações Pendentes</h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.osPendentes}</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Devoluções Pendentes</h3>
          <p className="text-3xl font-bold text-red-500">{stats.devolucoesPendentes}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-black/5 dark:border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Últimos Produtos Cadastrados</h3>
          <table className="w-full text-left text-sm">
             <thead className="bg-black/5 dark:bg-white/5">
                <tr>
                   <th className="p-3">Nome</th>
                   <th className="p-3">Tipo</th>
                   <th className="p-3">Estoque</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {ultimosProdutos.length === 0 ? (
                  <tr><td colSpan={3} className="p-3 text-center">Nenhum produto</td></tr>
                ) : (
                  ultimosProdutos.map(p => (
                     <tr key={p.id}>
                        <td className="p-3">{p.nome}</td>
                        <td className="p-3 text-xs">{p.tipoItem}</td>
                        <td className="p-3 font-medium">{p.quantidadeDisponivel} / {p.quantidadeTotal}</td>
                     </tr>
                  ))
                )}
             </tbody>
          </table>
        </div>

        <div className="bg-card border border-black/5 dark:border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Últimas Tarefas (OS)</h3>
          <table className="w-full text-left text-sm">
             <thead className="bg-black/5 dark:bg-white/5">
                <tr>
                   <th className="p-3">OS</th>
                   <th className="p-3">Status</th>
                   <th className="p-3">Tipo</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {osRecentes.length === 0 ? (
                  <tr><td colSpan={3} className="p-3 text-center">Nenhuma ordem</td></tr>
                ) : (
                  osRecentes.map(os => (
                     <tr key={os.id}>
                        <td className="p-3 font-medium">#{os.id}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold 
                            ${os.status === 'PENDENTE' || os.status === 'DEVOLUCAO_PENDENTE' ? 'bg-yellow-500/10 text-yellow-600' : 
                              os.status === 'APROVADO' ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-500'}`}>
                            {os.status}
                          </span>
                        </td>
                        <td className="p-3 text-xs">{os.tipo}</td>
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
