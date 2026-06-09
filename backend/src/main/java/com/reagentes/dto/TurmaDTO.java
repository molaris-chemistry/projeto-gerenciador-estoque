package com.reagentes.dto;

import jakarta.validation.constraints.NotBlank;

public class TurmaDTO {
    private Long id;
    
    @NotBlank(message = "Sala é obrigatória")
    private String sala;
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    // Construtores
    public TurmaDTO() {}
    
    public TurmaDTO(Long id, String sala, String nome) {
        this.id = id;
        this.sala = sala;
        this.nome = nome;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getSala() {
        return sala;
    }
    
    public void setSala(String sala) {
        this.sala = sala;
    }
    
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
}

