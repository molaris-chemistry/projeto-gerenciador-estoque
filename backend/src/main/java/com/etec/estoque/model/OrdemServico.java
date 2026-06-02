package com.etec.estoque.model;

import com.etec.estoque.model.enums.StatusOS;
import com.etec.estoque.model.enums.TipoOS;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_ordens_servico")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdemServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "solicitante_id", nullable = false)
    private Usuario solicitante; // Professor

    @ManyToOne
    @JoinColumn(name = "tecnico_id")
    private Usuario tecnicoResponsavel; // Tecnico que aprovou/separou

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusOS status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoOS tipo;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    private LocalDateTime dataAtualizacao;

    @OneToMany(mappedBy = "ordemServico", fetch = FetchType.EAGER)
    private java.util.List<ItemOrdemServico> itens;

    @PrePersist
    public void prePersist() {
        this.dataCriacao = LocalDateTime.now();
        this.dataAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }
}
