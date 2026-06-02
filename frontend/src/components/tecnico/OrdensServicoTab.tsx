"use client";

import { useEffect, useState } from "react";
import { ordemServicoService } from "@/services/ordemServico.service";

export function OrdensServicoTab() {
  const [ordens, setOrdens] = useState<any[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarOrdens();
  }, []);

  const carregarOrdens = async () => {
    try {
      const data = await ordemServicoService.listar();
      const sorted = data.sort((a: any, b: any) => b.id - a.id);
      setOrdens(sorted);
    } catch (e) {
      console.error(e);
    }
  };

  const aprovarAlocacao = async (id: number) => {
    if (!window.confirm("Confirma a aprovação e separação física destes itens? Isso abaterá o estoque do laboratório de forma imediata.")) {
      return;
    }
    try {
      await ordemServicoService.aprovar(id);
      carregarOrdens();
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data || "Erro ao aprovar OS");
    }
  };

  const receberDevolucao = async (id: number) => {
    try {
      await ordemServicoService.receberDevolucao(id);
      carregarOrdens();
    } catch (e: any) {
      alert(e.response?.data || "Erro ao receber devolução");
    }
  };

  const ordensFiltradas = ordens.filter(os => 
    os.solicitante.nome.toLowerCase().includes(busca.toLowerCase()) || 
    os.id.toString().includes(busca) ||
    os.status.toLowerCase().includes(busca.toLowerCase()) ||
    os.tipo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Ordens de Serviço</h2>
      
      <div className="mb-6">
        <input type="text" placeholder="Pesquisar por ID, solicitante ou status..." className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-card border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <div className="grid gap-6">
        {ordensFiltradas.length === 0 ? (
           <p className="text-foreground/50">Nenhuma ordem de serviço registrada ou encontrada.</p>
        ) : (
          ordensFiltradas.map((os) => (
            <div key={os.id} className="bg-card border border-black/5 dark:border-white/5 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start gap-4 shadow-sm">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="font-bold text-lg">OS #{os.id}</span>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${os.tipo === 'ALOCACAO' ? 'bg-blue-500/10 text-blue-600' : 'bg-purple-500/10 text-purple-600'}`}>
                        {os.tipo}
                     </span>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${os.status === 'PENDENTE' || os.status === 'DEVOLUCAO_PENDENTE' ? 'bg-yellow-500/10 text-yellow-600' : 
                          os.status === 'APROVADO' || os.status === 'DEVOLVIDO' ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-500'}`}>
                        {os.status}
                     </span>
                  </div>
                  <p className="text-sm font-medium mb-1">Solicitante: {os.solicitante.nome} ({os.solicitante.email})</p>
                  <p className="text-xs text-foreground/50 mb-4">Criada em: {new Date(os.dataCriacao).toLocaleString()}</p>
                  
                  {/* Resumo dos itens solicitados */}
                  <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4">
                     <h4 className="text-sm font-bold mb-2">Itens Solicitados:</h4>
                     <ul className="text-sm space-y-1">
                        {os.itens?.map((item: any) => (
                          <li key={item.id} className="flex gap-2">
                            <span className="font-bold">{item.quantidade}x</span>
                            <span>{item.produto?.nome || 'Produto Indisponível'}</span>
                          </li>
                        ))}
                        {(!os.itens || os.itens.length === 0) && <p className="text-foreground/50">Nenhum detalhe disponível para esta versão legada.</p>}
                     </ul>
                  </div>
               </div>

               <div className="flex flex-col gap-2 w-full md:w-auto h-full justify-center">
                  {os.status === "PENDENTE" && os.tipo === "ALOCACAO" && (
                    <button onClick={() => aprovarAlocacao(os.id)} className="w-full md:w-48 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 shadow-md transition-all active:scale-95">
                       Aprovar e Separar
                    </button>
                  )}
                  {os.status === "APROVADO" && os.tipo === "ALOCACAO" && (
                     <div className="text-sm text-green-600 font-bold bg-green-500/10 px-4 py-2 rounded-lg text-center">
                        Itens Separados
                     </div>
                  )}
                  {os.status === "DEVOLUCAO_PENDENTE" && os.tipo === "DEVOLUCAO" && (
                    <button onClick={() => receberDevolucao(os.id)} className="w-full md:w-48 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 shadow-md transition-all active:scale-95">
                       Confirmar Recebimento
                    </button>
                  )}
                  {os.status === "DEVOLVIDO" && os.tipo === "DEVOLUCAO" && (
                     <div className="text-sm text-gray-500 font-bold bg-gray-500/10 px-4 py-2 rounded-lg text-center">
                        Devolução Concluída
                     </div>
                  )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
