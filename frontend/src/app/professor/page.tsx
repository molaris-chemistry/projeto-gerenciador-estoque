"use client";

import { useEffect, useState } from "react";
import { produtoService } from "@/services/produto.service";
import { ordemServicoService } from "@/services/ordemServico.service";
import { LogOut, ShoppingCart, Beaker, Wrench, FlaskConical, PackageOpen, Minus, Plus, Trash2, Info } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";

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

interface ItemCarrinho {
  produtoId: number;
  nome: string;
  quantidade: number;
  maxDisponivel: number;
  detalhes: string;
}

interface OrdemServico {
  id: number;
  dataCriacao: string;
  status: string;
  tipo: string;
}

export default function ProfessorPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [minhasOS, setMinhasOS] = useState<OrdemServico[]>([]);
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<"CATALOGO" | "MINHAS_OS">("CATALOGO");

  useEffect(() => {
    carregarDados();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const carregarDados = async () => {
    try {
      const data = await produtoService.listar();
      setProdutos(data);
      const osData = await ordemServicoService.listarMinhas();
      setMinhasOS(osData);
    } catch (e: any) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        router.push("/");
      }
    }
  };

  const getDetalhes = (p: Produto) => {
    if (p.tipoItem === 'INSUMO') return `${p.concentracao || ''} ${p.estadoFisico || ''}`;
    if (p.tipoItem === 'VIDRARIA') return `${p.capacidadeMl ? p.capacidadeMl + 'mL' : ''} ${p.subTipoVidraria || ''}`;
    if (p.tipoItem === 'EQUIPAMENTO') return `${p.fabricante || ''} ${p.modelo || ''} ${p.voltagem || ''}`;
    return "";
  };

  const adicionarAoCarrinho = (p: Produto) => {
    setCarrinho((prev) => {
      const existing = prev.find((item) => item.produtoId === p.id);
      if (existing) {
        if (existing.quantidade >= p.quantidadeDisponivel) {
          alert(`Você não pode solicitar mais do que o disponível em estoque (${p.quantidadeDisponivel}).`);
          return prev;
        }
        return prev.map((item) => item.produtoId === p.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      if (p.quantidadeDisponivel < 1) {
        alert("Produto indisponível no momento.");
        return prev;
      }
      return [...prev, { 
        produtoId: p.id, 
        nome: p.nome, 
        quantidade: 1, 
        maxDisponivel: p.quantidadeDisponivel,
        detalhes: getDetalhes(p)
      }];
    });
  };

  const alterarQuantidade = (produtoId: number, delta: number) => {
    setCarrinho(prev => prev.map(item => {
      if (item.produtoId === produtoId) {
        const novaQtd = item.quantidade + delta;
        if (novaQtd > item.maxDisponivel) {
          alert(`Quantidade máxima disponível atingida (${item.maxDisponivel}).`);
          return item;
        }
        return { ...item, quantidade: novaQtd };
      }
      return item;
    }).filter(item => item.quantidade > 0));
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho(prev => prev.filter(item => item.produtoId !== produtoId));
  };

  const enviarSolicitacao = async () => {
    if (carrinho.length === 0) return;
    try {
      const payload = {
        solicitanteEmail: localStorage.getItem("email"),
        itens: carrinho.map(i => ({ produtoId: i.produtoId, quantidade: i.quantidade }))
      };
      await ordemServicoService.solicitarAlocacao(payload);
      setCarrinho([]);
      carregarDados();
      setAbaAtiva("MINHAS_OS");
      setShowModal(false);
    } catch (e) {
      console.error(e);
      alert("Erro ao solicitar. Verifique o estoque.");
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push("/");
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
              <th className="p-4 font-semibold text-center">Disponível</th>
              <th className="p-4 font-semibold text-center w-32">Solicitar</th>
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
                      <span className="text-xs text-foreground/50">{p.categoria?.nome} • Local: {p.localizacao}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-foreground/70">{getDetalhes(p) || '-'}</td>
                  <td className="p-4 font-bold text-primary text-center text-lg">{p.quantidadeDisponivel}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => adicionarAoCarrinho(p)} 
                      disabled={p.quantidadeDisponivel === 0}
                      className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Adicionar
                    </button>
                  </td>
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-card border-b border-black/5 dark:border-white/5 p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-lg">
            <Beaker size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Portal do Professor</h1>
            <p className="text-xs text-foreground/50">Solicitação de Materiais</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={logout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors" aria-label="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-8 flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto w-full">
        <div className="flex-1 flex flex-col">
          {/* Abas */}
          <div className="flex gap-4 mb-6 border-b border-black/5 dark:border-white/5 pb-2">
             <button 
                onClick={() => setAbaAtiva("CATALOGO")}
                className={`pb-2 px-4 font-bold transition-colors border-b-2 ${abaAtiva === 'CATALOGO' ? 'border-primary text-primary' : 'border-transparent text-foreground/50 hover:text-foreground'}`}
             >
                Catálogo de Itens
             </button>
             <button 
                onClick={() => setAbaAtiva("MINHAS_OS")}
                className={`pb-2 px-4 font-bold transition-colors border-b-2 ${abaAtiva === 'MINHAS_OS' ? 'border-primary text-primary' : 'border-transparent text-foreground/50 hover:text-foreground'}`}
             >
                Minhas Solicitações
             </button>
          </div>

          {abaAtiva === "CATALOGO" && (
            <>
              {/* Barra de Pesquisa Larga */}
              <div className="mb-6 w-full">
                <input 
                  type="text" 
                  placeholder="Pesquisar itens por nome..." 
                  className="w-full px-6 py-4 rounded-xl bg-card border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm text-lg" 
                  value={busca} 
                  onChange={(e) => setBusca(e.target.value)} 
                />
              </div>

              {renderTabela("Insumos e Reagentes", <FlaskConical size={18} className="text-pink-500" />, insumos)}
              {renderTabela("Vidrarias", <Beaker size={18} className="text-blue-500" />, vidrarias)}
              {renderTabela("Equipamentos", <Wrench size={18} className="text-orange-500" />, equipamentos)}
            </>
          )}

          {abaAtiva === "MINHAS_OS" && (
            <div className="bg-card border border-black/5 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-black/5 dark:border-white/5">
                <h2 className="text-lg font-bold">Histórico de Solicitações</h2>
              </div>
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/5 dark:bg-white/5">
                  <tr>
                    <th className="p-4 font-semibold">OS ID</th>
                    <th className="p-4 font-semibold">Data</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Tipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {minhasOS.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Você ainda não fez nenhuma solicitação.</td></tr>
                  ) : (
                    minhasOS.map(os => (
                      <tr key={os.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold">#{os.id}</td>
                        <td className="p-4">{new Date(os.dataCriacao).toLocaleString('pt-BR')}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            os.status === 'PENDENTE' ? 'bg-amber-500/10 text-amber-600' : 
                            os.status === 'APROVADO' ? 'bg-green-500/10 text-green-600' :
                            'bg-blue-500/10 text-blue-600'
                          }`}>
                            {os.status}
                          </span>
                        </td>
                        <td className="p-4">{os.tipo}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar do Carrinho */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ShoppingCart size={24} className="text-primary"/> Resumo da Solicitação</h2>
            
            {carrinho.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center gap-4 text-foreground/40">
                <PackageOpen size={48} strokeWidth={1} />
                <p>Nenhum item selecionado</p>
              </div>
            ) : (
              <ul className="space-y-4 mb-8 max-h-[50vh] overflow-y-auto pr-2">
                {carrinho.map(item => (
                  <li key={item.produtoId} className="flex justify-between items-center p-4 bg-background border border-black/5 dark:border-white/5 rounded-lg shadow-sm">
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-sm truncate">{item.nome}</p>
                      <p className="text-xs text-foreground/50 truncate flex items-center gap-1 mt-1">
                         <Info size={12} /> {item.detalhes || 'Sem especificação'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
                      <button onClick={() => alterarQuantidade(item.produtoId, -1)} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors text-foreground/70 hover:text-red-500">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold w-4 text-center text-sm">{item.quantidade}</span>
                      <button onClick={() => alterarQuantidade(item.produtoId, 1)} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors text-foreground/70 hover:text-green-500">
                        <Plus size={14} />
                      </button>
                      <button onClick={() => removerDoCarrinho(item.produtoId)} className="p-1 ml-1 text-red-500/50 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <button 
              onClick={() => setShowModal(true)}
              disabled={carrinho.length === 0}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Enviar Ordem de Serviço
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold mb-4 text-center">Confirmar Solicitação</h3>
            <p className="text-foreground/70 text-center mb-8">
              Você está prestes a enviar uma Ordem de Serviço com <strong>{carrinho.reduce((acc, curr) => acc + curr.quantidade, 0)} itens</strong> para o laboratório. Deseja prosseguir?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 font-bold rounded-xl transition-colors">
                Cancelar
              </button>
              <button onClick={enviarSolicitacao} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-md transition-colors">
                Confirmar Envio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
