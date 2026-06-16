package com.reagentes.repository;

import com.reagentes.model.Reagente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReagenteRepository extends JpaRepository<Reagente, Long> {

    Optional<Reagente> findByNomeIgnoreCase(String nome);

    @Query("SELECT r FROM Reagente r WHERE LOWER(r.nome) LIKE LOWER(CONCAT('%', :termo, '%'))")
    List<Reagente> findByNomeContainingIgnoreCase(@Param("termo") String termo);

    boolean existsByNomeIgnoreCase(String nome);

    List<Reagente> findAllByOrderByNomeAsc();

    List<Reagente> findByDataValidadeLessThanEqualAndDataValidadeIsNotNullOrderByDataValidadeAsc(LocalDate data);

    List<Reagente> findByQuantidadeLessThanEqualQuantidadeMinimaAndQuantidadeMinimaIsNotNullOrderByNomeAsc();

    @Query("SELECT r FROM Reagente r WHERE r.quantidade < :limite")
    List<Reagente> findReagentesComEstoqueBaixo(@Param("limite") Double limite);
}
