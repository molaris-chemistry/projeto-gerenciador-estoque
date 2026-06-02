package com.etec.estoque.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_produtos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Integer quantidadeTotal;

    @Column(nullable = false)
    private Integer quantidadeDisponivel;

    private String localizacao;

    @Column(nullable = false)
    private Boolean perigoso;

    private String localDescarte;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private com.etec.estoque.model.enums.TipoItem tipoItem;

    // Atributos de Insumo
    private Double pesoMolar;
    private String concentracao;
    private String estadoFisico; // ex: SOLIDO, AQUOSO, PASTOSO

    // Atributos de Vidraria
    private Integer capacidadeMl;
    private String subTipoVidraria; // ex: GRADUADA, VOLUMETRICA

    // Atributos de Equipamento
    private String fabricante;
    private String modelo;
    private String voltagem;
}
