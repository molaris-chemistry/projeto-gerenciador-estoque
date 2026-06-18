package com.reagentes.service.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.reagentes.dto.auth.AuthRequest;
import com.reagentes.dto.auth.RegisterRequest;
import com.reagentes.model.user.User;
import com.reagentes.repository.UserRepository;
import com.reagentes.infra.exception.ApiException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public void register(RegisterRequest request) {
    throw ApiException.forbidden("Cadastro público desabilitado. Use uma conta pré-cadastrada.");
  }

  public User login(AuthRequest request) {
    String normalizedEmail = normalizeEmail(request.email());
    
    User user = userRepository.findByEmail(normalizedEmail).orElseThrow(() -> ApiException.badRequest("Credenciais inválidas"));

    if(!passwordEncoder.matches(request.password(), user.getPassword())){
      throw ApiException.badRequest("Credenciais inválidas");
    }

    return user;
  }

  private String normalizeEmail(String email){
    return email.trim().toLowerCase();
  }
}
