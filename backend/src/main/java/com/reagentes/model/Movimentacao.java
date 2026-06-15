package com.reagentes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Movimentacao {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tipo é obrigatório")
    @Column(nullable = false, length = 10)
    private String tipo;

    @NotNull(message = "Reagente é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reagente_id", nullable = false)
    private Reagente reagente;

    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser positiva")
    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materia_id", nullable = false)
    private Materia materia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @NotNull(message = "Data é obrigatória")
    @Column(nullable = false)
    private LocalDateTime data = LocalDateTime.now();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public String getNomeMateriaSeguro() {
        return materia != null ? materia.getNome() : "N/A";
    }

    public String getNomeTurmaSeguro() {
        return turma != null ? turma.getNome() : "N/A";
    }
}
