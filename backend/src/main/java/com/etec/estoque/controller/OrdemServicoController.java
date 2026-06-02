package com.etec.estoque.controller;

import com.etec.estoque.dto.ItemOSDTO;
import com.etec.estoque.dto.OrdemServicoDTO;
import com.etec.estoque.model.OrdemServico;
import com.etec.estoque.service.OrdemServicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordens-servico")
@RequiredArgsConstructor
public class OrdemServicoController {

    private final OrdemServicoService osService;

    @GetMapping
    public ResponseEntity<List<OrdemServico>> listar() {
        return ResponseEntity.ok(osService.listar());
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<OrdemServico>> listarMinhas() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        try {
            return ResponseEntity.ok(osService.listarMinhas(auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/alocar")
    public ResponseEntity<?> solicitarAlocacao(@RequestBody OrdemServicoDTO dto) {
        try {
            return ResponseEntity.ok(osService.solicitarAlocacao(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/aprovar")
    public ResponseEntity<?> aprovarOS(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        try {
            return ResponseEntity.ok(osService.aprovarOS(id, auth.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/concluir")
    public ResponseEntity<?> concluirAlocacao(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(osService.concluirAlocacao(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/receber-devolucao")
    public ResponseEntity<?> receberDevolucao(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        try {
            return ResponseEntity.ok(osService.receberDevolucao(id, auth.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
