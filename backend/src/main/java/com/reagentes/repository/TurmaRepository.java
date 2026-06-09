package com.reagentes.repository;

import com.reagentes.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {

    List<Turma> findByNomeIgnoreCase(String nome);

    List<Turma> findBySala(String sala);

    List<Turma> findAllByOrderBySalaAscNomeAsc();

    boolean existsByNomeIgnoreCase(String nome);
}
