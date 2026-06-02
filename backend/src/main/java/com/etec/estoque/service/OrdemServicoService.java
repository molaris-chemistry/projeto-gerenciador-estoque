package com.etec.estoque.service;

import com.etec.estoque.dto.ItemOSDTO;
import com.etec.estoque.dto.OrdemServicoDTO;
import com.etec.estoque.model.ItemOrdemServico;
import com.etec.estoque.model.OrdemServico;
import com.etec.estoque.model.Produto;
import com.etec.estoque.model.Usuario;
import com.etec.estoque.model.enums.StatusOS;
import com.etec.estoque.model.enums.TipoOS;
import com.etec.estoque.repository.ItemOrdemServicoRepository;
import com.etec.estoque.repository.OrdemServicoRepository;
import com.etec.estoque.repository.ProdutoRepository;
import com.etec.estoque.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdemServicoService {

    private final OrdemServicoRepository osRepository;
    private final ItemOrdemServicoRepository itemOSRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<OrdemServico> listar() {
        return osRepository.findAll();
    }

    public List<OrdemServico> listarMinhas(String email) {
        Usuario solicitante = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return osRepository.findBySolicitanteId(solicitante.getId());
    }

    @Transactional
    public OrdemServico solicitarAlocacao(OrdemServicoDTO dto) {
        Usuario solicitante = usuarioRepository.findByEmail(dto.getSolicitanteEmail())
                .orElseThrow(() -> new RuntimeException("Solicitante não encontrado"));

        OrdemServico os = OrdemServico.builder()
                .solicitante(solicitante)
                .status(StatusOS.PENDENTE)
                .tipo(TipoOS.ALOCACAO)
                .build();
        os = osRepository.save(os);

        for (ItemOSDTO itemDto : dto.getItens()) {
            Produto p = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
            
            if (p.getQuantidadeDisponivel() < itemDto.getQuantidade()) {
                throw new IllegalArgumentException("Quantidade indisponível para o produto: " + p.getNome());
            }

            ItemOrdemServico item = ItemOrdemServico.builder()
                    .ordemServico(os)
                    .produto(p)
                    .quantidade(itemDto.getQuantidade())
                    .build();
            itemOSRepository.save(item);
        }

        return os;
    }

    @Transactional
    public OrdemServico aprovarOS(Long id, String emailTecnico) {
        OrdemServico os = osRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OS não encontrada"));
        
        if (os.getStatus() != StatusOS.PENDENTE) {
            throw new IllegalArgumentException("OS não está pendente");
        }

        Usuario tecnico = usuarioRepository.findByEmail(emailTecnico)
                .orElseThrow(() -> new RuntimeException("Técnico não encontrado"));

        List<ItemOrdemServico> itens = itemOSRepository.findByOrdemServicoId(id);
        for (ItemOrdemServico item : itens) {
            Produto p = item.getProduto();
            if (p.getQuantidadeDisponivel() < item.getQuantidade()) {
                throw new IllegalArgumentException("Estoque insuficiente para " + p.getNome());
            }
            p.setQuantidadeDisponivel(p.getQuantidadeDisponivel() - item.getQuantidade());
            produtoRepository.save(p);
        }

        os.setStatus(StatusOS.APROVADO);
        os.setTecnicoResponsavel(tecnico);
        return osRepository.save(os);
    }

    @Transactional
    public OrdemServico concluirAlocacao(Long id) {
        OrdemServico osAlocacao = osRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OS não encontrada"));
        
        if (osAlocacao.getStatus() != StatusOS.APROVADO) {
            throw new IllegalArgumentException("OS precisa estar aprovada para ser concluída");
        }

        osAlocacao.setStatus(StatusOS.CONCLUIDO);
        osRepository.save(osAlocacao);

        // Gera OS de Devolucao
        OrdemServico osDevolucao = OrdemServico.builder()
                .solicitante(osAlocacao.getSolicitante())
                .status(StatusOS.DEVOLUCAO_PENDENTE)
                .tipo(TipoOS.DEVOLUCAO)
                .build();
        osDevolucao = osRepository.save(osDevolucao);

        List<ItemOrdemServico> itens = itemOSRepository.findByOrdemServicoId(id);
        for (ItemOrdemServico item : itens) {
            ItemOrdemServico devItem = ItemOrdemServico.builder()
                    .ordemServico(osDevolucao)
                    .produto(item.getProduto())
                    .quantidade(item.getQuantidade())
                    .build();
            itemOSRepository.save(devItem);
        }

        return osDevolucao;
    }

    @Transactional
    public OrdemServico receberDevolucao(Long id, String emailTecnico) {
        OrdemServico osDevolucao = osRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OS não encontrada"));
        
        if (osDevolucao.getStatus() != StatusOS.DEVOLUCAO_PENDENTE) {
            throw new IllegalArgumentException("OS não é uma devolução pendente");
        }

        Usuario tecnico = usuarioRepository.findByEmail(emailTecnico)
                .orElseThrow(() -> new RuntimeException("Técnico não encontrado"));

        List<ItemOrdemServico> itens = itemOSRepository.findByOrdemServicoId(id);
        for (ItemOrdemServico item : itens) {
            Produto p = item.getProduto();
            p.setQuantidadeDisponivel(p.getQuantidadeDisponivel() + item.getQuantidade());
            produtoRepository.save(p);
        }

        osDevolucao.setStatus(StatusOS.DEVOLVIDO);
        osDevolucao.setTecnicoResponsavel(tecnico);
        return osRepository.save(osDevolucao);
    }
}
