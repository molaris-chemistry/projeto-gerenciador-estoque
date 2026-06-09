package com.reagentes.dto;

import jakarta.validation.constraints.NotBlank;

public class MateriaDTO {
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    public MateriaDTO() {}

    public MateriaDTO(Long id, String nome) {
        this.id = id;
        this.nome = nome;
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
}
