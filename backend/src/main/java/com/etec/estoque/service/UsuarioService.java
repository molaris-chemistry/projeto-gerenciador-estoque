package com.etec.estoque.service;

import com.etec.estoque.dto.UsuarioDTO;
import com.etec.estoque.model.Usuario;
import com.etec.estoque.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Transactional
    public Optional<UsuarioDTO> criarUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.findByEmail(usuarioDTO.getEmail()).isPresent()) {
            return Optional.empty();
        }

        Usuario usuario = Usuario.builder()
                .nome(usuarioDTO.getNome())
                .email(usuarioDTO.getEmail())
                .senha(passwordEncoder.encode(usuarioDTO.getSenha()))
                .role(usuarioDTO.getRole())
                .build();

        Usuario salvo = usuarioRepository.save(usuario);
        return Optional.of(convertToDto(salvo));
    }

    @Transactional
    public boolean deletarUsuario(Long id) {
        Usuario user = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if ("admin@etec.sp.gov.br".equals(user.getEmail())) {
            throw new IllegalArgumentException("Admin não pode ser deletado.");
        }
        usuarioRepository.deleteById(id);
        return true;
    }

    @Transactional
    public Usuario atualizarUsuario(Long id, Usuario dadosAtualizados) {
        Usuario user = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        user.setNome(dadosAtualizados.getNome());
        user.setEmail(dadosAtualizados.getEmail());
        user.setRole(dadosAtualizados.getRole());
        
        if (dadosAtualizados.getSenha() != null && !dadosAtualizados.getSenha().trim().isEmpty()) {
            user.setSenha(passwordEncoder.encode(dadosAtualizados.getSenha()));
        }
        return usuarioRepository.save(user);
    }

    private UsuarioDTO convertToDto(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setRole(usuario.getRole());
        return dto;
    }
}
