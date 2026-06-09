package com.reagentes.controller;

import com.reagentes.dto.TurmaDTO;
import com.reagentes.model.Turma;
import com.reagentes.service.TurmaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/turmas")
public class TurmaController {

    @Autowired
    private TurmaService turmaService;

    @GetMapping
    public ResponseEntity<List<TurmaDTO>> getAllTurmas() {
        List<TurmaDTO> turmaDTOs = turmaService.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(turmaDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaDTO> getTurmaById(@PathVariable Long id) {
        return turmaService.findById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TurmaDTO> createTurma(@Valid @RequestBody TurmaDTO turmaDTO) {
        try {
            Turma savedTurma = turmaService.save(convertToEntity(turmaDTO));
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedTurma));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTurma(@PathVariable Long id) {
        try {
            turmaService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private TurmaDTO convertToDto(Turma turma) {
        return new TurmaDTO(turma.getId(), turma.getSala(), turma.getNome());
    }

    private Turma convertToEntity(TurmaDTO turmaDTO) {
        Turma turma = new Turma();
        turma.setId(turmaDTO.getId());
        turma.setSala(turmaDTO.getSala());
        turma.setNome(turmaDTO.getNome());
        return turma;
    }
}
