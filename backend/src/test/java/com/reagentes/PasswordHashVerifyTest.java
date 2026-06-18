package com.reagentes;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordHashVerifyTest {

  /** Bcrypt hash for password "123456" — must match seed migrations. */
  private static final String HASH_123456 =
    "$2a$10$83Bgzxbsv/4JFHSNjTd8vuJx49vIGXwQI8qJf4NRtQAZSGN/9CVGm";

  @Test
  void hash123456IsValid() {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    assertTrue(encoder.matches("123456", HASH_123456));
  }
}
