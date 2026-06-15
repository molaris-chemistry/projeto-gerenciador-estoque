package com.reagentes.service;

import com.reagentes.dto.MovimentacaoDTO;
import com.reagentes.model.Materia;
import com.reagentes.model.Movimentacao;
import com.reagentes.model.Reagente;
import com.reagentes.model.Turma;
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

    @Autowired
    private MateriaService materiaService;

    public List<Movimentacao> findAll() {
        return movimentacaoRepository.findAllWithDetailsOrderByDataDesc();
    }

    public Optional<Movimentacao> findById(Long id) {
        return movimentacaoRepository.findByIdWithDetails(id);
    }

    @Transactional
    public Movimentacao save(MovimentacaoDTO dto) {
        Reagente reagente = reagenteRepository.findById(dto.getReagenteId())
                .orElseThrow(() -> new RuntimeException("Reagente não encontrado com id: " + dto.getReagenteId()));

        Materia materia = materiaRepository.findById(dto.getMateriaId())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com id: " + dto.getMateriaId()));

        Turma turma = turmaRepository.findById(dto.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com id: " + dto.getTurmaId()));

        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setTipo(dto.getTipo());
        movimentacao.setQuantidade(dto.getQuantidade());
        movimentacao.setData(LocalDateTime.now());
        movimentacao.setReagente(reagente);
        movimentacao.setMateria(materia);
        movimentacao.setTurma(turma);

        reagenteService.updateQuantidade(
                movimentacao.getReagente().getId(),
                movimentacao.getQuantidade(),
                movimentacao.getTipo()
        );

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

        String tipoReverso = movimentacao.getTipo().equals("ENTRADA") ? "RETIRADA" : "ENTRADA";
        reagenteService.updateQuantidade(movimentacao.getReagente().getId(),
                movimentacao.getQuantidade(),
                tipoReverso);
        movimentacaoRepository.deleteById(id);
    }

    public List<Movimentacao> findByReagente(Reagente reagente) {
        return movimentacaoRepository.findByReagenteOrderByDataDesc(reagente);
    }

    public List<Movimentacao> findByTipo(String tipo) {
        return movimentacaoRepository.findByTipoOrderByDataDesc(tipo);
    }

    @Transactional(readOnly = true)
    public List<Movimentacao> findByTurma(Long turmaId) {
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com id: " + turmaId));
        return movimentacaoRepository.findByTurmaOrderByDataDesc(turma);
    }

    @Transactional(readOnly = true)
    public List<Movimentacao> findByNomeDaTurma(String nomeTurma) {
        return movimentacaoRepository.findByTurmaNomeOrderByDataDesc(nomeTurma);
    }

    @Transactional(readOnly = true)
    public List<Movimentacao> findByMateria(String nomeMateria) {
        Optional<Materia> materiaOpt = materiaService.findByNome(nomeMateria);
        if (materiaOpt.isEmpty()) {
            return List.of();
        }
        return movimentacaoRepository.findByMateriaOrderByDataDesc(materiaOpt.get());
    }

    public List<Movimentacao> findByDataBetween(LocalDateTime inicio, LocalDateTime fim) {
        return movimentacaoRepository.findByDataBetween(inicio, fim);
    }
}
