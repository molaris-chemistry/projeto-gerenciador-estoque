package com.reagentes.repository;

import com.reagentes.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MateriaRepository extends JpaRepository<Materia, Long> {

    Optional<Materia> findByNomeIgnoreCase(String nome);

    List<Materia> findAllByOrderByNomeAsc();

    boolean existsByNomeIgnoreCase(String nome);
}
