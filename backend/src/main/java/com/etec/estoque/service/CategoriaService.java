package com.etec.estoque.service;

import com.etec.estoque.model.Categoria;
import com.etec.estoque.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    @Transactional
    public Categoria criarCategoria(Categoria categoria) {
        categoria.setTipoItem(categoria.getTipoItem());
        return categoriaRepository.save(categoria);
    }

    @Transactional
    public Optional<Categoria> atualizarCategoria(Long id, Categoria categoria) {
        return categoriaRepository.findById(id)
                .map(cat -> {
                    cat.setNome(categoria.getNome());
                    return categoriaRepository.save(cat);
                });
    }

    @Transactional
    public void deletarCategoria(Long id) {
        categoriaRepository.deleteById(id);
    }
}
