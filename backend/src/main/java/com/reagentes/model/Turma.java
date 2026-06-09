package com.reagentes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "turmas")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Turma {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Sala é obrigatória")
    @Column(nullable = false, length = 20)
    private String sala; // "1º Ano", "2º Ano", "3º Ano"
    
    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false, length = 10)
    private String nome; // "1ºA", "1ºB", etc.
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    

}

