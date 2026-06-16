package com.reagentes.dto;

import java.time.LocalDateTime;

import com.reagentes.model.user.User;
import com.reagentes.model.user.UserRole;

public record UserDTO(
  Long id,
  String name,
  String email,
  UserRole role,
  LocalDateTime createdAt
) {
  public static UserDTO from(User user) {
    return new UserDTO(
      user.getId(),
      user.getName(),
      user.getEmail(),
      user.getRole(),
      user.getCreatedAt()
    );
  }
}
