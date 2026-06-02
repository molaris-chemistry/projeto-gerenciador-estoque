package com.etec.estoque.dto;

import com.etec.estoque.model.enums.Role;
import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
    private String senha; // Apenas na criacao
    private Role role;
}
