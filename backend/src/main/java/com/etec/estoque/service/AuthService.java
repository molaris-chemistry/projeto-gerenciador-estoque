package com.etec.estoque.service;

import com.etec.estoque.dto.AuthRequest;
import com.etec.estoque.dto.AuthResponse;
import com.etec.estoque.model.Usuario;
import com.etec.estoque.repository.UsuarioRepository;
import com.etec.estoque.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    public Optional<AuthResponse> authenticate(AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getSenha())
            );
        } catch (AuthenticationException e) {
            return Optional.empty();
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        Usuario usuario = usuarioRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return Optional.of(new AuthResponse(jwt, usuario.getEmail(), usuario.getRole().name()));
    }
}
