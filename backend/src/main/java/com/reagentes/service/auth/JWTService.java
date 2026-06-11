package com.reagentes.service.auth;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.reagentes.model.user.User;
import com.reagentes.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class JWTService {

  private final UserRepository userRepository;
  
  private final static String TOKEN_PREFIX = "Bearer ";
  private final static String AMERICA_SAO_PAULO_OFFSET = "-03:00";
  private final static String REFRESH_TOKEN_TYPE = "refresh";
  private final static String ACCESS_TOKEN_TYPE = "access";

  @Value("${jwt.secret}")
  private String secret;

  @Value("${jwt.issuer}")
  private String issuer;

  @Value("${jwt.expiration-time-in-days}")
  private Integer expirationTimeInDats;

  public String generateToken(UserDetails userDetails) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      return JWT.create()
        .withIssuer(secret)
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

  public User extractUser(String bearerToken) throws UsernameNotFoundException {
    String token = extractJWTToken(bearerToken);
    String subject = extractSubject(token);
    return userRepository.findByEmail(subject).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
  }

  public User extractUserFromRefreshToken(String refreshToken) throws UsernameNotFoundException, IllegalArgumentException {
    if (isTokenExpired(refreshToken)) {
      throw new IllegalArgumentException("Refresh token está expirado");
    }

    if (!isRefreshToken(refreshToken)) {
      throw new IllegalArgumentException("Token não é um refresh token");
    }

    String subject = extractSubject(refreshToken);
    return userRepository.findByEmail(subject).orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

  public boolean isTokenExpired(String token) {
    return LocalDateTime.now().toInstant(ZoneOffset.of(AMERICA_SAO_PAULO_OFFSET)).isAfter(getTokenExpirationDate(token));
  }

  public Instant getTokenExpirationDate(String token) {
    DecodedJWT decodedJWT = JWT.decode(token);
    return decodedJWT.getExpiresAtAsInstant();
  }

  private boolean isRefreshToken(String token) {
    try {
      DecodedJWT decodedJWT = JWT.decode(token);
      String tokenType = decodedJWT.getClaim("type").asString();
      return REFRESH_TOKEN_TYPE.equals(tokenType);
    } catch (Exception e) {
      return false;
    }
  }

  private String extractSubject(String token) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      return JWT.require(algorithm)
        .withIssuer(issuer)
        .build()
        .verify(token)
        .getSubject();
    } catch (JWTVerificationException exception) {
      return "";
    }
  }

  private String extractJWTToken(String bearerToken) {
    return bearerToken.replace(TOKEN_PREFIX, "");
  }

  private Instant generateExpirationDate() {
    return LocalDateTime.now().plusDays(expirationTimeInDats)
      .toInstant(ZoneOffset.of(AMERICA_SAO_PAULO_OFFSET));
  }

  private Instant generateRefreshTokenExpirationDate() {
    return LocalDateTime.now().plusDays(30)
      .toInstant(ZoneOffset.of(AMERICA_SAO_PAULO_OFFSET));
  }
}
