package com.reagentes.controller;

import com.reagentes.dto.MateriaDTO;
import com.reagentes.model.Materia;
import com.reagentes.service.MateriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    @Autowired
    private MateriaService materiaService;

    @GetMapping
    public ResponseEntity<List<MateriaDTO>> getAllMaterias() {
        List<MateriaDTO> materiaDTOs = materiaService.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(materiaDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MateriaDTO> getMateriaById(@PathVariable Long id) {
        return materiaService.findById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MateriaDTO> createMateria(@Valid @RequestBody MateriaDTO materiaDTO) {
        try {
            Materia savedMateria = materiaService.save(convertToEntity(materiaDTO));
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedMateria));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMateria(@PathVariable Long id) {
        try {
            materiaService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private MateriaDTO convertToDto(Materia materia) {
        return new MateriaDTO(materia.getId(), materia.getNome());
    }

    private Materia convertToEntity(MateriaDTO materiaDTO) {
        Materia materia = new Materia();
        materia.setId(materiaDTO.getId());
        materia.setNome(materiaDTO.getNome());
        return materia;
    }
}
