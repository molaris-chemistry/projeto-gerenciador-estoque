package com.reagentes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MovimentacaoDTO {
    private Long id;

    @NotBlank(message = "Tipo é obrigatório")
    private String tipo; // ENTRADA ou RETIRADA

    @NotNull(message = "ID do reagente é obrigatório")
    private Long reagenteId;

    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser positiva")
    private BigDecimal quantidade;

    // MUDANÇA 1: Validação corrigida de @NotBlank para @NotNull (para Long)
    @NotNull(message = "Matéria é obrigatória")
    private Long materiaId;

    // MUDANÇA 2: Validação corrigida de @NotBlank para @NotNull (para Long)
    @NotNull(message = "Turma é obrigatória")
    private Long turmaId;

    private LocalDateTime data;

    // Campos opcionais para exibição no frontend (não validados)
    private String reagenteNome;
    private String materias;
    private String turma;
    private String unidade;

    // Construtores
    public MovimentacaoDTO() {}

    // MUDANÇA 3: Construtor corrigido para aceitar Longs
    public MovimentacaoDTO(Long id, String tipo, Long reagenteId, BigDecimal quantidade,
                           Long materiaId, Long turmaId, LocalDateTime data) {
        this.id = id;
        this.tipo = tipo;
        this.reagenteId = reagenteId;
        this.quantidade = quantidade;
        this.materiaId = materiaId;
        this.turmaId = turmaId;
        this.data = data;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getReagenteId() {
        return reagenteId;
    }

    public void setReagenteId(Long reagenteId) {
        this.reagenteId = reagenteId;
    }

    public BigDecimal getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(BigDecimal quantidade) {
        this.quantidade = quantidade;
    }

    // MUDANÇA 4: Getters e Setters corretos para materiaId
    public Long getMateriaId() {
        return materiaId;
    }

    public void setMateriaId(Long materiaId) {
        this.materiaId = materiaId;
    }

    // MUDANÇA 5: Getters e Setters corretos para turmaId
    public Long getTurmaId() {
        return turmaId;
    }

    public void setTurmaId(Long turmaId) {
        this.turmaId = turmaId;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    // Getters e Setters para campos de exibição
    public String getReagenteNome() {
        return reagenteNome;
    }

    public void setReagenteNome(String reagenteNome) {
        this.reagenteNome = reagenteNome;
    }

    public String getMateria() {
        return materias;
    }

    public void setMateria(String materia) {
        this.materias = materia;
    }

    public String getTurma() {
        return turma;
    }

    public void setTurma(String turma) {
        this.turma = turma;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    @Override
    public String toString() {
        return "MovimentacaoDTO{" +
                "id=" + id +
                ", tipo='" + tipo + '\'' +
                ", reagenteId=" + reagenteId +
                ", quantidade=" + quantidade +
                ", materiaId=" + materiaId +
                ", turmaId=" + turmaId +
                ", data=" + data +
                '}';
    }
}