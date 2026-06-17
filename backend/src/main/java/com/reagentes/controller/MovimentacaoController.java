package com.reagentes.controller;

import com.reagentes.dto.MovimentacaoDTO;
import com.reagentes.model.Movimentacao;
import com.reagentes.model.TipoMovimentacao;
import com.reagentes.service.MovimentacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movimentacoes")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoService movimentacaoService;

    @GetMapping
    public ResponseEntity<List<MovimentacaoDTO>> getAllMovimentacoes(
            @RequestParam(required = false) Long reagenteId,
            @RequestParam(required = false) Long turmaId,
            @RequestParam(required = false) Long materiaId,
            @RequestParam(required = false) TipoMovimentacao tipo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime de,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ate) {
        try {
            boolean hasFilters = reagenteId != null || turmaId != null || materiaId != null
                    || tipo != null || de != null || ate != null;

            List<MovimentacaoDTO> dtos = (hasFilters
                    ? movimentacaoService.findFiltered(reagenteId)
                    : movimentacaoService.findAll())
                    .stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimentacaoDTO> getMovimentacaoById(@PathVariable Long id) {
        try {
            return movimentacaoService.findById(id)
                    .map(this::convertToDto)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createMovimentacao(@Valid @RequestBody MovimentacaoDTO movimentacaoDTO) {
        try {
            Movimentacao saved = movimentacaoService.save(movimentacaoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(saved));
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage() != null ? e.getMessage() : "Erro ao processar movimentação");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro interno do servidor: " + (e.getMessage() != null ? e.getMessage() : "Erro desconhecido"));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovimentacao(@PathVariable Long id) {
        try {
            movimentacaoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private MovimentacaoDTO convertToDto(Movimentacao movimentacao) {
        MovimentacaoDTO dto = new MovimentacaoDTO(
                movimentacao.getId(),
                movimentacao.getTipo(),
                movimentacao.getReagente() != null ? movimentacao.getReagente().getId() : null,
                movimentacao.getQuantidade(),
                movimentacao.getMateria() != null ? movimentacao.getMateria().getId() : null,
                movimentacao.getTurma() != null ? movimentacao.getTurma().getId() : null,
                movimentacao.getData());

        if (movimentacao.getReagente() != null) {
            dto.setReagenteNome(movimentacao.getReagente().getNome());
            dto.setUnidade(movimentacao.getReagente().getUnidade());
        }
        if (movimentacao.getMateria() != null) {
            dto.setMateria(movimentacao.getMateria().getNome());
        }
        if (movimentacao.getTurma() != null) {
            dto.setTurma(movimentacao.getTurma().getNome());
        }

        return dto;
    }
}
