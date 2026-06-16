package com.reagentes.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRequest(

  @Email(message = "Email deve ser válido")
  @NotBlank(message = "Email é obrigatório")
  String email,

  @NotBlank(message = "Senha é obrigatória")
  String password
) {}
