package com.reagentes.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

  @Size(min = 3, message = "Nome deve conter pelo menos 3 caracteres")
  @NotBlank(message = "Nome é obrigatória")
  String name,

  @Email(message = "Email deve ser válido")
  @NotBlank(message = "Email é obrigatório")
  String email,

  @NotBlank(message = "Senha é obrigatória")
  String password
) {}
