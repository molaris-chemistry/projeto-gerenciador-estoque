package com.reagentes.service.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.reagentes.dto.auth.AuthRequest;
import com.reagentes.dto.auth.RegisterRequest;
import com.reagentes.model.user.User;
import com.reagentes.model.user.UserRole;
import com.reagentes.repository.UserRepository;
import com.reagentes.infra.exception.ApiException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public void register(RegisterRequest request) {
    String normalizedName = normalizeName(request.name());
    String normalizedEmail = normalizeEmail(request.email());
    
    if (userRepository.existsByEmail(normalizedEmail)) {
      throw ApiException.conflict("Esse e-mail já está em uso");
    }

    var encryptedPassword = passwordEncoder.encode(request.password());

    User user = User.builder()
      .name(normalizedName)
      .email(normalizedEmail)
      .password(encryptedPassword)
      .role(UserRole.ALUNO)
      .build();

    userRepository.save(user);
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

  private String normalizeName(String name){
    return name.trim().replaceAll("\\s+", " ");
  }
}
