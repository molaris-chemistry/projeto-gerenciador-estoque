package com.reagentes.repository;

import com.reagentes.model.Reagente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReagenteRepository extends JpaRepository<Reagente, Long> {
    
    /**
     * Busca reagente por nome (case insensitive)
     */
    Optional<Reagente> findByNomeIgnoreCase(String nome);
    
    /**
     * Busca reagentes que contenham o termo no nome (case insensitive)
     */
    @Query("SELECT r FROM Reagente r WHERE LOWER(r.nome) LIKE LOWER(CONCAT('%', :termo, '%'))")
    List<Reagente> findByNomeContainingIgnoreCase(@Param("termo") String termo);
    
    /**
     * Verifica se existe reagente com o nome (case insensitive)
     */
    boolean existsByNomeIgnoreCase(String nome);
    
    /**
     * Busca reagentes ordenados por nome
     */
    List<Reagente> findAllByOrderByNomeAsc();
    
    /**
     * Busca reagentes com quantidade baixa (menor que o limite especificado)
     */
    @Query("SELECT r FROM Reagente r WHERE r.quantidade < :limite")
    List<Reagente> findReagentesComEstoqueBaixo(@Param("limite") Double limite);
}

