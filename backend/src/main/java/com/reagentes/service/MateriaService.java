package com.reagentes.service;

import com.reagentes.model.Materia;
import com.reagentes.repository.MateriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MateriaService {

    @Autowired
    private MateriaRepository materiaRepository;

    public List<Materia> findAll() {
        return materiaRepository.findAllByOrderByNomeAsc();
    }

    public Optional<Materia> findById(Long id) {
        return materiaRepository.findById(id);
    }

    public Optional<Materia> findByNome(String nome) {
        return materiaRepository.findByNomeIgnoreCase(nome);
    }

    public Materia save(Materia materia) {
        if (materiaRepository.existsByNomeIgnoreCase(materia.getNome())) {
            throw new RuntimeException("Já existe uma matéria com o nome " + materia.getNome());
        }
        return materiaRepository.save(materia);
    }

    public void deleteById(Long id) {
        materiaRepository.deleteById(id);
    }
}

