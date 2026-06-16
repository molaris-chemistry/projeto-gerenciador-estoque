package com.reagentes.dto;

import com.reagentes.model.TipoMovimentacao;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MovimentacaoDTO {
    private Long id;

    @NotNull(message = "Tipo é obrigatório")
    private TipoMovimentacao tipo;

    @NotNull(message = "ID do reagente é obrigatório")
    private Long reagenteId;

    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser positiva")
    private BigDecimal quantidade;

    @NotNull(message = "Matéria é obrigatória")
    private Long materiaId;

    @NotNull(message = "Turma é obrigatória")
    private Long turmaId;

    private LocalDateTime data;

    private String reagenteNome;
    private String materia;
    private String turma;
    private String unidade;

    public MovimentacaoDTO() {}

    public MovimentacaoDTO(Long id, TipoMovimentacao tipo, Long reagenteId, BigDecimal quantidade,
                           Long materiaId, Long turmaId, LocalDateTime data) {
        this.id = id;
        this.tipo = tipo;
        this.reagenteId = reagenteId;
        this.quantidade = quantidade;
        this.materiaId = materiaId;
        this.turmaId = turmaId;
        this.data = data;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TipoMovimentacao getTipo() { return tipo; }
    public void setTipo(TipoMovimentacao tipo) { this.tipo = tipo; }

    public Long getReagenteId() { return reagenteId; }
    public void setReagenteId(Long reagenteId) { this.reagenteId = reagenteId; }

    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }

    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }

    public Long getTurmaId() { return turmaId; }
    public void setTurmaId(Long turmaId) { this.turmaId = turmaId; }

    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }

    public String getReagenteNome() { return reagenteNome; }
    public void setReagenteNome(String reagenteNome) { this.reagenteNome = reagenteNome; }

    public String getMateria() { return materia; }
    public void setMateria(String materia) { this.materia = materia; }

    public String getTurma() { return turma; }
    public void setTurma(String turma) { this.turma = turma; }

    public String getUnidade() { return unidade; }
    public void setUnidade(String unidade) { this.unidade = unidade; }
}
