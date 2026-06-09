package com.reagentes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reagentes")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Reagente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false, unique = true, length = 100)
    private String nome;

    @NotNull(message = "Quantidade é obrigatória")
    @PositiveOrZero(message = "Quantidade deve ser positiva ou zero")
    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidade = BigDecimal.ZERO;

    @NotBlank(message = "Unidade é obrigatória")
    @Column(nullable = false, length = 10)
    private String unidade = "g";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "reagente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Movimentacao> movimentacoes;
}
