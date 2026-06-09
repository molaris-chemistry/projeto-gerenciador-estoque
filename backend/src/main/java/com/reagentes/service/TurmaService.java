package com.reagentes.service;

import com.reagentes.model.Turma;
import com.reagentes.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TurmaService {

    @Autowired
    private TurmaRepository turmaRepository;

    public List<Turma> findAll() {
        return turmaRepository.findAllByOrderBySalaAscNomeAsc();
    }

    public Optional<Turma> findById(Long id) {
        return turmaRepository.findById(id);
    }

    public List<Turma> findByNome(String nome) {
        return turmaRepository.findByNomeIgnoreCase(nome);
    }

    public Turma save(Turma turma) {
        if (turmaRepository.existsByNomeIgnoreCase(turma.getNome())) {
            throw new RuntimeException("Já existe uma turma com o nome " + turma.getNome());
        }
        return turmaRepository.save(turma);
    }

    public void deleteById(Long id) {
        turmaRepository.deleteById(id);
    }
}

