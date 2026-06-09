package com.reagentes.service;

import com.reagentes.dto.MovimentacaoDTO; // Importar o DTO
import com.reagentes.model.Materia;
import com.reagentes.model.Movimentacao;
import com.reagentes.model.Reagente;
import com.reagentes.model.Turma;
import com.reagentes.repository.MateriaRepository; // Importar Repositório
import com.reagentes.repository.MovimentacaoRepository;
import com.reagentes.repository.ReagenteRepository; // Importar Repositório
import com.reagentes.repository.TurmaRepository;   // Importar Repositório
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

    // --- MUDANÇA 1: Injetar os Repositórios para buscar por ID ---
    @Autowired
    private ReagenteRepository reagenteRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    // (Os services que já estavam aqui podem ser usados para outros métodos)
    @Autowired
    private MateriaService materiaService;


    public List<Movimentacao> findAll() {
        return movimentacaoRepository.findAllWithDetailsOrderByDataDesc();
    }

    public Optional<Movimentacao> findById(Long id) {
        // Usar o método com JOIN FETCH para carregar as relações
        return movimentacaoRepository.findByIdWithDetails(id);
    }

    // --- MUDANÇA 2: Criar um novo método 'save' que aceita o DTO ---
    @Transactional
    public Movimentacao save(MovimentacaoDTO dto) {
        // 1. Buscar as entidades pelos IDs do DTO
        Reagente reagente = reagenteRepository.findById(dto.getReagenteId())
                .orElseThrow(() -> new RuntimeException("Reagente não encontrado com id: " + dto.getReagenteId()));

        Materia materia = materiaRepository.findById(dto.getMateriaId())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com id: " + dto.getMateriaId()));

        Turma turma = turmaRepository.findById(dto.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com id: " + dto.getTurmaId()));

        // 2. Criar a nova entidade Movimentacao
        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setTipo(dto.getTipo());
        movimentacao.setQuantidade(dto.getQuantidade());
        movimentacao.setData(LocalDateTime.now()); // Sempre usar a data/hora do servidor

        // 3. Associar as entidades
        movimentacao.setReagente(reagente);
        movimentacao.setMateria(materia);
        movimentacao.setTurma(turma);

        // 4. Chamar a lógica de negócio (atualizar estoque)
        reagenteService.updateQuantidade(
                movimentacao.getReagente().getId(),
                movimentacao.getQuantidade(),
                movimentacao.getTipo()
        );

        // 5. Salvar a nova movimentação
        Movimentacao saved = movimentacaoRepository.save(movimentacao);
        // 6. Buscar novamente com JOIN FETCH para garantir que as relações estão carregadas
        return movimentacaoRepository.findByIdWithDetails(saved.getId())
                .orElse(saved);
    }

    // Opcional: Manter o método save(Movimentacao) antigo se ele for usado em outro lugar,
    // mas o método save(MovimentacaoDTO) é o que o controller deve chamar.
    // Para evitar confusão, comentei o 'save' antigo.

    /*
    @Transactional
    public Movimentacao save(Movimentacao movimentacao) {
        if (movimentacao.getReagente() == null || movimentacao.getReagente().getId() == null) {
            throw new IllegalArgumentException("Não é possível salvar a movimentação: o reagente é obrigatório e deve ter um ID válido.");
        }
        reagenteService.updateQuantidade(movimentacao.getReagente().getId(),
                movimentacao.getQuantidade(),
                movimentacao.getTipo());
        return movimentacaoRepository.save(movimentacao);
    }
    */

    @Transactional
    public void deleteById(Long id) {
        // Usar o método com JOIN FETCH para carregar as relações
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

    // O seu método antigo estava quase certo, mas 'turmaService.findByNome' é perigoso
    // se não for único. Vou manter sua lógica, mas saiba que ela pode falhar.
    @Transactional(readOnly = true)
    public List<Movimentacao> findByMateria(String nomeMateria) {
        Optional<Materia> materiaOpt = materiaService.findByNome(nomeMateria);
        if (materiaOpt.isEmpty()) {
            return List.of();
        }
        Materia materia = materiaOpt.get();
        return movimentacaoRepository.findByMateriaOrderByDataDesc(materia);
    }


    public List<Movimentacao> findByDataBetween(LocalDateTime inicio, LocalDateTime fim) {
        return movimentacaoRepository.findByDataBetween(inicio, fim);
    }
}