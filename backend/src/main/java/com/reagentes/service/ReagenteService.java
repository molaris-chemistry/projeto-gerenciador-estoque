package com.reagentes.service;

import com.reagentes.model.Reagente;
import com.reagentes.repository.ReagenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ReagenteService {

    @Autowired
    private ReagenteRepository reagenteRepository;

    public List<Reagente> findAll() {
        return reagenteRepository.findAllByOrderByNomeAsc();
    }

    public Optional<Reagente> findById(Long id) {
        return reagenteRepository.findById(id);
    }

    public Optional<Reagente> findByNome(String nome) {
        return reagenteRepository.findByNomeIgnoreCase(nome);
    }

    public List<Reagente> searchByNome(String termo) {
        return reagenteRepository.findByNomeContainingIgnoreCase(termo);
    }

    @Transactional
    public Reagente save(Reagente reagente) {
        return reagenteRepository.save(reagente);
    }

    @Transactional
    public Reagente update(Long id, Reagente reagenteDetails) {
        Reagente reagente = reagenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reagente não encontrado com id " + id));

        reagente.setNome(reagenteDetails.getNome());
        reagente.setQuantidade(reagenteDetails.getQuantidade());
        reagente.setUnidade(reagenteDetails.getUnidade());

        return reagenteRepository.save(reagente);
    }

    @Transactional
    public void deleteById(Long id) {
        reagenteRepository.deleteById(id);
    }

    @Transactional
    public void updateQuantidade(Long reagenteId, BigDecimal quantidadeAlteracao, String tipoMovimentacao) {
        Reagente reagente = reagenteRepository.findById(reagenteId)
                .orElseThrow(() -> new RuntimeException("Reagente não encontrado com id " + reagenteId));

        if ("ENTRADA".equals(tipoMovimentacao)) {
            reagente.setQuantidade(reagente.getQuantidade().add(quantidadeAlteracao));
        } else if ("RETIRADA".equals(tipoMovimentacao)) {
            if (reagente.getQuantidade().compareTo(quantidadeAlteracao) < 0) {
                throw new RuntimeException("Estoque insuficiente para a retirada de " + reagente.getNome());
            }
            reagente.setQuantidade(reagente.getQuantidade().subtract(quantidadeAlteracao));
        }
        reagenteRepository.save(reagente);
    }

    public boolean existsByNome(String nome) {
        return reagenteRepository.existsByNomeIgnoreCase(nome);
    }
}

