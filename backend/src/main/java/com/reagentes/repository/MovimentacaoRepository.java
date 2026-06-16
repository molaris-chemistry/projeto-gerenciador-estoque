package com.reagentes.repository;

import com.reagentes.model.Movimentacao;
import com.reagentes.model.Reagente;
import com.reagentes.model.TipoMovimentacao;
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

    @Query("SELECT m FROM Movimentacao m " +
            "JOIN FETCH m.reagente r " +
            "LEFT JOIN FETCH m.materia ma " +
            "LEFT JOIN FETCH m.turma t " +
            "WHERE (:reagenteId IS NULL OR r.id = :reagenteId) " +
            "AND (:turmaId IS NULL OR t.id = :turmaId) " +
            "AND (:materiaId IS NULL OR ma.id = :materiaId) " +
            "AND (:tipo IS NULL OR m.tipo = :tipo) " +
            "AND (:de IS NULL OR m.data >= :de) " +
            "AND (:ate IS NULL OR m.data <= :ate) " +
            "ORDER BY m.data DESC")
    List<Movimentacao> findWithFilters(
            @Param("reagenteId") Long reagenteId,
            @Param("turmaId") Long turmaId,
            @Param("materiaId") Long materiaId,
            @Param("tipo") TipoMovimentacao tipo,
            @Param("de") LocalDateTime de,
            @Param("ate") LocalDateTime ate);

    List<Movimentacao> findByReagenteOrderByDataDesc(Reagente reagente);

    List<Movimentacao> findByTipoOrderByDataDesc(TipoMovimentacao tipo);

    @Query("SELECT m FROM Movimentacao m WHERE m.reagente = :reagente AND m.data BETWEEN :de AND :ate ORDER BY m.data DESC")
    List<Movimentacao> findByReagenteAndDataBetween(@Param("reagente") Reagente reagente,
                                                    @Param("de") LocalDateTime de,
                                                    @Param("ate") LocalDateTime ate);

    @Query("SELECT COUNT(m) FROM Movimentacao m WHERE m.tipo = :tipo AND m.data BETWEEN :de AND :ate")
    Long countByTipoAndDataBetween(@Param("tipo") TipoMovimentacao tipo,
                                   @Param("de") LocalDateTime de,
                                   @Param("ate") LocalDateTime ate);
}
