package com.reagentes.service;

import com.reagentes.dto.MovimentacaoDTO;
import com.reagentes.model.Movimentacao;
import com.reagentes.model.Reagente;
import com.reagentes.model.TipoMovimentacao;
import com.reagentes.repository.MateriaRepository;
import com.reagentes.repository.MovimentacaoRepository;
import com.reagentes.repository.ReagenteRepository;
import com.reagentes.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MovimentacaoService {

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private ReagenteService reagenteService;

    @Autowired
    private ReagenteRepository reagenteRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    public List<Movimentacao> findAll() {
        return movimentacaoRepository.findAllWithDetailsOrderByDataDesc();
    }

    public List<Movimentacao> findFiltered(
            Long reagenteId,
            Long turmaId,
            Long materiaId,
            TipoMovimentacao tipo,
            LocalDateTime de,
            LocalDateTime ate) {
        return movimentacaoRepository.findWithFilters(reagenteId, turmaId, materiaId, tipo, de, ate);
    }

    public Optional<Movimentacao> findById(Long id) {
        return movimentacaoRepository.findByIdWithDetails(id);
    }

    @Transactional
    public Movimentacao save(MovimentacaoDTO dto) {
        var reagente = reagenteRepository.findById(dto.getReagenteId())
                .orElseThrow(() -> new RuntimeException("Reagente não encontrado com id: " + dto.getReagenteId()));

        var materia = materiaRepository.findById(dto.getMateriaId())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com id: " + dto.getMateriaId()));

        var turma = turmaRepository.findById(dto.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com id: " + dto.getTurmaId()));

        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setTipo(dto.getTipo());
        movimentacao.setQuantidade(dto.getQuantidade());
        movimentacao.setData(LocalDateTime.now());
        movimentacao.setReagente(reagente);
        movimentacao.setMateria(materia);
        movimentacao.setTurma(turma);

        reagenteService.updateQuantidade(reagente.getId(), movimentacao.getQuantidade(), movimentacao.getTipo());

        Movimentacao saved = movimentacaoRepository.save(movimentacao);
        return movimentacaoRepository.findByIdWithDetails(saved.getId()).orElse(saved);
    }

    @Transactional
    public void deleteById(Long id) {
        Movimentacao movimentacao = movimentacaoRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada com id " + id));

        if (movimentacao.getReagente() == null || movimentacao.getReagente().getId() == null) {
            throw new RuntimeException("Dados de reagente inconsistentes na movimentação. Não é possível reverter o estoque.");
        }

        TipoMovimentacao tipoReverso = movimentacao.getTipo() == TipoMovimentacao.ENTRADA
                ? TipoMovimentacao.RETIRADA
                : TipoMovimentacao.ENTRADA;

        reagenteService.updateQuantidade(movimentacao.getReagente().getId(), movimentacao.getQuantidade(), tipoReverso);
        movimentacaoRepository.deleteById(id);
    }

    public List<Movimentacao> findByReagente(Reagente reagente) {
        return movimentacaoRepository.findByReagenteOrderByDataDesc(reagente);
    }

    public List<Movimentacao> findByTipo(TipoMovimentacao tipo) {
        return movimentacaoRepository.findByTipoOrderByDataDesc(tipo);
    }
}
