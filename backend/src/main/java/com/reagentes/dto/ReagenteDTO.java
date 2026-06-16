package com.reagentes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ReagenteDTO {
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotNull(message = "Quantidade é obrigatória")
    @PositiveOrZero(message = "Quantidade deve ser positiva ou zero")
    private BigDecimal quantidade;

    @NotBlank(message = "Unidade é obrigatória")
    private String unidade;

    private LocalDate dataValidade;

    @PositiveOrZero(message = "Quantidade mínima deve ser positiva ou zero")
    private BigDecimal quantidadeMinima;

    public ReagenteDTO() {}

    public ReagenteDTO(Long id, String nome, BigDecimal quantidade, String unidade) {
        this(id, nome, quantidade, unidade, null, null);
    }

    public ReagenteDTO(
            Long id,
            String nome,
            BigDecimal quantidade,
            String unidade,
            LocalDate dataValidade,
            BigDecimal quantidadeMinima) {
        this.id = id;
        this.nome = nome;
        this.quantidade = quantidade;
        this.unidade = unidade;
        this.dataValidade = dataValidade;
        this.quantidadeMinima = quantidadeMinima;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(BigDecimal quantidade) {
        this.quantidade = quantidade;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    public LocalDate getDataValidade() {
        return dataValidade;
    }

    public void setDataValidade(LocalDate dataValidade) {
        this.dataValidade = dataValidade;
    }

    public BigDecimal getQuantidadeMinima() {
        return quantidadeMinima;
    }

    public void setQuantidadeMinima(BigDecimal quantidadeMinima) {
        this.quantidadeMinima = quantidadeMinima;
    }
}
