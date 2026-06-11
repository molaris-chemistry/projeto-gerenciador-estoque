package com.reagentes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reagentes.dto.auth.AuthRequest;
import com.reagentes.dto.auth.AuthResponse;
import com.reagentes.dto.auth.RegisterRequest;
import com.reagentes.model.user.User;
import com.reagentes.service.auth.AuthService;
import com.reagentes.service.auth.JWTService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
  
  private final AuthService authService;
  private final JWTService jwtService;

  @PostMapping("/cadastro")
  public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest data) {
    authService.register(data);

    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest data) {
    User user = authService.login(data);

    String accessToken = jwtService.generateToken(user);
    String refreshToken = jwtService.generateRefreshToken(user);

    return ResponseEntity.ok(AuthResponse.of(accessToken, refreshToken));
  }
}
