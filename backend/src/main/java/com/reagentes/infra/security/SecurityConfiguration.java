package com.reagentes.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import static org.springframework.http.HttpMethod.OPTIONS;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
  
  private final SecurityFilter securityFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    return httpSecurity
      .cors(withDefaults())
      .csrf(csrf -> csrf.disable())
      .sessionManagement(session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.POST, "/auth/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/relatorios/**").hasRole("TECNICO")
        .requestMatchers(HttpMethod.POST, "/api/reagentes").hasRole("TECNICO")
        .requestMatchers(HttpMethod.PUT, "/api/reagentes/**").hasRole("TECNICO")
        .requestMatchers(HttpMethod.DELETE, "/api/reagentes/**").hasRole("TECNICO")
        .requestMatchers(HttpMethod.GET, "/api/reagentes/**").authenticated()
        .requestMatchers(HttpMethod.POST, "/api/movimentacoes").hasAnyRole("TECNICO", "PROFESSOR")
        .requestMatchers(HttpMethod.DELETE, "/api/movimentacoes/**").hasRole("TECNICO")
        .requestMatchers(HttpMethod.GET, "/api/movimentacoes/**").authenticated()
        .requestMatchers(HttpMethod.POST, "/api/materias").hasRole("TECNICO")
        .requestMatchers(HttpMethod.DELETE, "/api/materias/**").hasRole("TECNICO")
        .requestMatchers(HttpMethod.GET, "/api/materias/**").authenticated()
        .requestMatchers(HttpMethod.POST, "/api/turmas").hasRole("TECNICO")
        .requestMatchers(HttpMethod.DELETE, "/api/turmas/**").hasRole("TECNICO")
        .requestMatchers(HttpMethod.GET, "/api/turmas/**").authenticated()
        .requestMatchers(OPTIONS).permitAll()
        .anyRequest().authenticated()
      )
      .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
      .build();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
