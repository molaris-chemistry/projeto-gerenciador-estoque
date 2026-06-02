package com.etec.estoque.service;

import com.etec.estoque.model.Produto;
import com.etec.estoque.repository.CategoriaRepository;
import com.etec.estoque.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    public Optional<Produto> buscarProduto(Long id) {
        return produtoRepository.findById(id);
    }

    @Transactional
    public Produto criarProduto(Produto produto) {
        if(produto.getCategoria() != null && produto.getCategoria().getId() != null) {
            categoriaRepository.findById(produto.getCategoria().getId())
                    .ifPresent(produto::setCategoria);
        }
        return produtoRepository.save(produto);
    }

    @Transactional
    public Optional<Produto> atualizarProduto(Long id, Produto produto) {
        return produtoRepository.findById(id)
                .map(p -> {
                    p.setNome(produto.getNome());
                    p.setQuantidadeTotal(produto.getQuantidadeTotal());
                    p.setQuantidadeDisponivel(produto.getQuantidadeDisponivel());
                    p.setLocalizacao(produto.getLocalizacao());
                    p.setPerigoso(produto.getPerigoso());
                    p.setLocalDescarte(produto.getLocalDescarte());
                    p.setTipoItem(produto.getTipoItem());
                    p.setPesoMolar(produto.getPesoMolar());
                    p.setConcentracao(produto.getConcentracao());
                    p.setEstadoFisico(produto.getEstadoFisico());
                    p.setCapacidadeMl(produto.getCapacidadeMl());
                    p.setSubTipoVidraria(produto.getSubTipoVidraria());
                    p.setFabricante(produto.getFabricante());
                    p.setModelo(produto.getModelo());
                    p.setVoltagem(produto.getVoltagem());
                    if(produto.getCategoria() != null && produto.getCategoria().getId() != null) {
                        categoriaRepository.findById(produto.getCategoria().getId())
                                .ifPresent(p::setCategoria);
                    }
                    return produtoRepository.save(p);
                });
    }

    @Transactional
    public void deletarProduto(Long id) {
        produtoRepository.deleteById(id);
    }
}
