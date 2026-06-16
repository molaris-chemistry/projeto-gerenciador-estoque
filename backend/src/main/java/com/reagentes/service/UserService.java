package com.reagentes.service;

import org.springframework.stereotype.Service;

import com.reagentes.infra.exception.ApiException;
import com.reagentes.model.user.User;
import com.reagentes.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
  
  private final UserRepository userRepository;

  public User getProfileByEmail(String email){
    return userRepository.findByEmail(normalizeEmail(email)).orElseThrow(() -> ApiException.notFound("Usuário não encontrado"));
  }

  private String normalizeEmail(String email){
    return email.trim().toLowerCase();
  }
}
