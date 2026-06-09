package com.reagentes.controller;

import com.reagentes.dto.MovimentacaoDTO;
import com.reagentes.model.Movimentacao;
// Imports desnecessários de Entidade foram removidos (Materia, Turma, Reagente)
// Imports desnecessários de Service foram removidos (MateriaService, TurmaService, ReagenteService)
import com.reagentes.service.MovimentacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movimentacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoService movimentacaoService;

    // Removemos os outros services, pois o MovimentacaoService
    // agora cuida de toda a lógica.

    @GetMapping
    public ResponseEntity<List<MovimentacaoDTO>> getAllMovimentacoes() {
        try {
            List<Movimentacao> movimentacoes = movimentacaoService.findAll();
            List<MovimentacaoDTO> movimentacaoDTOs = movimentacoes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(movimentacaoDTOs);
        } catch (Exception e) {
            e.printStackTrace();
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
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // --- MUDANÇA 1: MÉTODO CREATE CORRIGIDO ---
    // Agora ele passa o DTO diretamente para o service.
    @PostMapping
    public ResponseEntity<?> createMovimentacao(@Valid @RequestBody MovimentacaoDTO movimentacaoDTO) {
        System.out.println("DTO recebido: " + movimentacaoDTO);
        try {
            // O Service recebe o DTO e faz toda a lógica de buscar IDs e salvar
            Movimentacao savedMovimentacao = movimentacaoService.save(movimentacaoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedMovimentacao));
        } catch (RuntimeException e) {
            // Se o service lançar um erro (ex: "Turma não encontrada"), retornamos 400 com mensagem
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage() != null ? e.getMessage() : "Erro ao processar movimentação");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            // Outros erros
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Erro desconhecido";
            errorResponse.put("error", "Erro interno do servidor: " + errorMessage);
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

    // --- MUDANÇA 2: convertToDto CORRIGIDO ---
    // Agora ele passa os IDs (Long) para o DTO, em vez de Strings.
    // Também preenche os campos de nome para exibição no frontend.
    private MovimentacaoDTO convertToDto(Movimentacao movimentacao) {

        Long materiaId = (movimentacao.getMateria() != null)
                ? movimentacao.getMateria().getId()
                : null;

        Long turmaId = (movimentacao.getTurma() != null)
                ? movimentacao.getTurma().getId()
                : null;

        Long reagenteId = (movimentacao.getReagente() != null)
                ? movimentacao.getReagente().getId()
                : null;

        MovimentacaoDTO dto = new MovimentacaoDTO(
                movimentacao.getId(),
                movimentacao.getTipo(),
                reagenteId,
                movimentacao.getQuantidade(),
                materiaId,  // Passando o ID (Long)
                turmaId,    // Passando o ID (Long)
                movimentacao.getData()
        );

        // Preencher campos de nome para exibição no frontend
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

    // --- MUDANÇA 3: convertToEntity REMOVIDO ---
    // Este método era a causa do erro 400 e não é mais necessário.
    // O MovimentacaoService agora cuida dessa conversão.
}