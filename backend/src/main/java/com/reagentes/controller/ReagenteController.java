package com.reagentes.controller;

import com.reagentes.dto.ReagenteDTO;
import com.reagentes.model.Reagente;
import com.reagentes.service.ReagenteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reagentes")
@CrossOrigin(origins = "http://localhost:5173")
public class ReagenteController {

    @Autowired
    private ReagenteService reagenteService;

    @GetMapping
    public ResponseEntity<List<ReagenteDTO>> getAllReagentes() {
        List<Reagente> reagentes = reagenteService.findAll();
        List<ReagenteDTO> reagenteDTOs = reagentes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reagenteDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReagenteDTO> getReagenteById(@PathVariable Long id) {
        return reagenteService.findById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ReagenteDTO>> searchReagentes(@RequestParam String q) {
        List<Reagente> reagentes = reagenteService.searchByNome(q);
        List<ReagenteDTO> reagenteDTOs = reagentes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reagenteDTOs);
    }

    @PostMapping
    public ResponseEntity<ReagenteDTO> createReagente(@Valid @RequestBody ReagenteDTO reagenteDTO) {
        if (reagenteService.existsByNome(reagenteDTO.getNome())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // 409 Conflict
        }
        Reagente reagente = convertToEntity(reagenteDTO);
        Reagente savedReagente = reagenteService.save(reagente);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedReagente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReagenteDTO> updateReagente(@PathVariable Long id, @Valid @RequestBody ReagenteDTO reagenteDTO) {
        try {
            Reagente updatedReagente = reagenteService.update(id, convertToEntity(reagenteDTO));
            return ResponseEntity.ok(convertToDto(updatedReagente));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReagente(@PathVariable Long id) {
        try {
            reagenteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private ReagenteDTO convertToDto(Reagente reagente) {
        return new ReagenteDTO(reagente.getId(), reagente.getNome(), reagente.getQuantidade(), reagente.getUnidade());
    }

    private Reagente convertToEntity(ReagenteDTO reagenteDTO) {
        Reagente reagente = new Reagente();
        reagente.setId(reagenteDTO.getId());
        reagente.setNome(reagenteDTO.getNome());
        reagente.setQuantidade(reagenteDTO.getQuantidade());
        reagente.setUnidade(reagenteDTO.getUnidade());
        return reagente;
    }
}

