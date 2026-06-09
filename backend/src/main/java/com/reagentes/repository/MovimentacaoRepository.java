package com.reagentes.repository;

import com.reagentes.model.Materia;
import com.reagentes.model.Movimentacao;
import com.reagentes.model.Reagente;
import com.reagentes.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {

    @Query("SELECT m FROM Movimentacao m " +
            "JOIN FETCH m.reagente r " +
            "LEFT JOIN FETCH m.materia ma " +
            "LEFT JOIN FETCH m.turma t " +
            "ORDER BY m.data DESC")
    List<Movimentacao> findAllWithDetailsOrderByDataDesc();

    @Query("SELECT m FROM Movimentacao m " +
            "JOIN FETCH m.reagente r " +
            "LEFT JOIN FETCH m.materia ma " +
            "LEFT JOIN FETCH m.turma t " +
            "WHERE m.id = :id")
    Optional<Movimentacao> findByIdWithDetails(@Param("id") Long id);

    List<Movimentacao> findByReagenteOrderByDataDesc(Reagente reagente);

    List<Movimentacao> findByTipoOrderByDataDesc(String tipo);

    List<Movimentacao> findByMateriaOrderByDataDesc(Materia materia);

    List<Movimentacao> findByTurmaOrderByDataDesc(Turma turma);

    @Query("SELECT m FROM Movimentacao m WHERE m.data BETWEEN :inicio AND :fim ORDER BY m.data DESC")
    List<Movimentacao> findByDataBetween(@Param("inicio") LocalDateTime inicio,
                                         @Param("fim") LocalDateTime fim);

    @Query("SELECT m FROM Movimentacao m WHERE m.reagente = :reagente AND m.data BETWEEN :inicio AND :fim ORDER BY m.data DESC")
    List<Movimentacao> findByReagenteAndDataBetween(@Param("reagente") Reagente reagente,
                                                    @Param("inicio") LocalDateTime inicio,
                                                    @Param("fim") LocalDateTime fim);

    @Query("SELECT COUNT(m) FROM Movimentacao m WHERE m.tipo = :tipo AND m.data BETWEEN :inicio AND :fim")
    Long countByTipoAndDataBetween(@Param("tipo") String tipo,
                                   @Param("inicio") LocalDateTime inicio,
                                   @Param("fim") LocalDateTime fim);

    @Query("SELECT m FROM Movimentacao m JOIN m.turma t WHERE t.nome = :nomeTurma ORDER BY m.data DESC")
    List<Movimentacao> findByTurmaNomeOrderByDataDesc(@Param("nomeTurma") String nomeTurma);
}
