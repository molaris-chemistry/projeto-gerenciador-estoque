package com.reagentes.repository;

import com.reagentes.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MateriaRepository extends JpaRepository<Materia, Long> {
    
    /**
     * Busca matéria por nome (case insensitive)
     */
    Optional<Materia> findByNomeIgnoreCase(String nome);
    
    /**
     Busca todas as matérias ordenadas por nome
     */
    List<Materia> findAllByOrderByNomeAsc();
    
    /**
     * Verifica se existe matéria com o nome (case insensitive)
     */
    boolean existsByNomeIgnoreCase(String nome);
}

