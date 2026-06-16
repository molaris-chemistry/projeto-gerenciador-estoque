package com.reagentes.service.auth;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.reagentes.model.user.User;
import com.reagentes.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JWTService {

  private final UserRepository userRepository;

  private static final String REFRESH_TOKEN_TYPE = "refresh";
  private static final String ACCESS_TOKEN_TYPE = "access";

  @Value("${jwt.secret}")
  private String secret;

  @Value("${jwt.issuer}")
  private String issuer;

  @Value("${jwt.expiration-time-in-days}")
  private Integer expirationTimeInDays;

  public String generateToken(UserDetails userDetails) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      return JWT.create()
        .withIssuer(issuer)
        .withSubject(userDetails.getUsername())
        .withClaim("type", ACCESS_TOKEN_TYPE)
        .withExpiresAt(generateExpirationDate())
        .sign(algorithm);
    } catch (JWTCreationException exception) {
      throw new RuntimeException("Aconteceu um erro durante a geração do token", exception);
    }
  }

  public String generateRefreshToken(UserDetails userDetails) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      return JWT.create()
        .withIssuer(issuer)
        .withSubject(userDetails.getUsername())
        .withClaim("type", REFRESH_TOKEN_TYPE)
        .withExpiresAt(generateRefreshTokenExpirationDate())
        .sign(algorithm);
    } catch (JWTCreationException exception) {
      throw new RuntimeException("Aconteceu um erro durante a geração do refresh token", exception);
    }
  }

  public User extractUser(String token) throws UsernameNotFoundException, JWTVerificationException {
    String subject = extractSubject(token);
    return userRepository.findByEmail(subject)
        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
  }

  public User extractUserFromRefreshToken(String refreshToken) throws UsernameNotFoundException, IllegalArgumentException {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      DecodedJWT decodedJWT = JWT.require(algorithm)
          .withIssuer(issuer)
          .withClaim("type", REFRESH_TOKEN_TYPE)
          .build()
          .verify(refreshToken);
      String subject = decodedJWT.getSubject();
      return userRepository.findByEmail(subject)
          .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    } catch (TokenExpiredException e) {
      throw new IllegalArgumentException("Refresh token está expirado");
    } catch (JWTVerificationException e) {
      throw new IllegalArgumentException("Token inválido");
    }
  }

  public boolean isTokenExpired(String token) {
    return Instant.now().isAfter(getTokenExpirationDate(token));
  }

  public Instant getTokenExpirationDate(String token) {
    DecodedJWT decodedJWT = JWT.decode(token);
    return decodedJWT.getExpiresAtAsInstant();
  }

  private String extractSubject(String token) {
    Algorithm algorithm = Algorithm.HMAC256(secret);
    return JWT.require(algorithm)
        .withIssuer(issuer)
        .build()
        .verify(token)
        .getSubject();
  }

  private Instant generateExpirationDate() {
    return Instant.now().plusSeconds(expirationTimeInDays * 86400L);
  }

  private Instant generateRefreshTokenExpirationDate() {
    return Instant.now().plusSeconds(30 * 86400L);
  }
}
