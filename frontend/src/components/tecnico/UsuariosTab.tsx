"use client";

import { useEffect, useState } from "react";
import { usuarioService } from "@/services/usuario.service";
import { Eye, EyeOff, Edit2, Check, X } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export function UsuariosTab() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({ nome: "", email: "", senha: "", role: "ROLE_PROFESSOR" });
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para Edição
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nome: "", email: "", senha: "", role: "ROLE_PROFESSOR" });
  const [showEditPassword, setShowEditPassword] = useState(false);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const data = await usuarioService.listar();
      setUsuarios(data);
    } catch (e) {
      console.error(e);
    }
  };

  const criarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.senha) return;
    try {
      await usuarioService.criar(form);
      setForm({ nome: "", email: "", senha: "", role: "ROLE_PROFESSOR" });
      carregarUsuarios();
    } catch (e) {
      console.error(e);
      alert("Erro ao criar usuário. Email pode já estar em uso.");
    }
  };

  const salvarEdicao = async (id: number) => {
    try {
      await usuarioService.atualizar(id, editForm);
      setEditandoId(null);
      carregarUsuarios();
    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar usuário.");
    }
  };

  const deletarUsuario = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await usuarioService.deletar(id);
      carregarUsuarios();
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir usuário.");
    }
  };

  const iniciarEdicao = (u: Usuario) => {
    setEditandoId(u.id);
    setEditForm({ nome: u.nome, email: u.email, role: u.role, senha: "" });
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nome.toLowerCase().includes(busca.toLowerCase()) || 
    u.email.toLowerCase().includes(busca.toLowerCase()) || 
    u.role.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Gestão de Usuários</h2>
      
      <form onSubmit={criarUsuario} className="mb-8 bg-card p-6 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4 border-b border-black/5 dark:border-white/5 pb-2">Cadastrar Novo Usuário</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nome Completo</label>
            <input required type="text" className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-mail Corporativo</label>
            <input required type="email" className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha de Acesso</label>
            <div className="relative">
              <input required type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none pr-10" value={form.senha} onChange={(e) => setForm({...form, senha: e.target.value})} />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/50" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Perfil de Acesso</label>
            <select className="w-full px-4 py-2 rounded-lg bg-background border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
              <option value="ROLE_PROFESSOR">Professor (Leitura/Alocação)</option>
              <option value="ROLE_TECNICO">Técnico (Acesso Total)</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-black/5 dark:border-white/5">
          <button type="submit" className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 shadow-md">
            Registrar Usuário
          </button>
        </div>
      </form>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Pesquisar usuários por nome, email ou perfil..." 
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
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold">E-mail</th>
                <th className="p-4 font-semibold">Perfil</th>
                <th className="p-4 font-semibold">Nova Senha (Edição)</th>
                <th className="p-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {usuariosFiltrados.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-foreground/50">Nenhum usuário encontrado.</td></tr>
              ) : (
                usuariosFiltrados.map((u) => (
                  <tr key={u.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    {editandoId === u.id ? (
                       <>
                         <td className="p-4"><input type="text" className="w-full px-2 py-1 border rounded bg-background" value={editForm.nome} onChange={e => setEditForm({...editForm, nome: e.target.value})} /></td>
                         <td className="p-4"><input type="email" className="w-full px-2 py-1 border rounded bg-background" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} /></td>
                         <td className="p-4">
                           <select className="w-full px-2 py-1 border rounded bg-background" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                             <option value="ROLE_PROFESSOR">Professor</option>
                             <option value="ROLE_TECNICO">Técnico</option>
                           </select>
                         </td>
                         <td className="p-4">
                           <div className="relative">
                             <input type={showEditPassword ? "text" : "password"} placeholder="Manter atual" className="w-full px-2 py-1 border rounded bg-background pr-8" value={editForm.senha} onChange={e => setEditForm({...editForm, senha: e.target.value})} />
                             <button type="button" className="absolute inset-y-0 right-0 pr-2 flex items-center text-foreground/50" onClick={() => setShowEditPassword(!showEditPassword)}>
                               {showEditPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                             </button>
                           </div>
                         </td>
                         <td className="p-4 text-center flex items-center justify-center gap-2">
                           <button onClick={() => salvarEdicao(u.id)} className="text-green-600 hover:bg-green-500/10 p-2 rounded"><Check size={18} /></button>
                           <button onClick={() => setEditandoId(null)} className="text-red-500 hover:bg-red-500/10 p-2 rounded"><X size={18} /></button>
                         </td>
                       </>
                    ) : (
                       <>
                         <td className="p-4 font-medium text-base">{u.nome}</td>
                         <td className="p-4 text-foreground/70">{u.email}</td>
                         <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'ROLE_TECNICO' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-600'}`}>
                               {u.role === 'ROLE_TECNICO' ? 'Técnico' : 'Professor'}
                            </span>
                         </td>
                         <td className="p-4 text-foreground/30 text-xs text-center">••••••</td>
                         <td className="p-4 text-center flex items-center justify-center gap-2">
                           <button 
                             onClick={() => iniciarEdicao(u)} 
                             className="text-primary hover:bg-primary/10 p-2 rounded transition-colors"
                             title="Editar usuário"
                           >
                             <Edit2 size={16} />
                           </button>
                           <button 
                             onClick={() => deletarUsuario(u.id)} 
                             className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
                             disabled={u.email === 'admin@etec.sp.gov.br'}
                             title={u.email === 'admin@etec.sp.gov.br' ? "O admin principal não pode ser deletado" : "Excluir usuário"}
                           >
                             <Trash2 size={16} />
                           </button>
                         </td>
                       </>
                    )}
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

// Para usar o ícone Trash2, precisamos importar no topo. Editando o arquivo final com o import arrumado...
import { Trash2 } from "lucide-react";
