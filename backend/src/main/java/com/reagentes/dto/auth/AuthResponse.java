package com.reagentes.dto.auth;

import com.reagentes.model.user.UserRole;

public record AuthResponse(
  String accessToken,
  String refreshToken,
  UserRole role
) {
  public static AuthResponse of(String accessToken, String refreshToken, UserRole role) {
    return new AuthResponse(accessToken, refreshToken, role);
  }
}
