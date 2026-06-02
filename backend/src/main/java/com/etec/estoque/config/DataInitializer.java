package com.etec.estoque.config;

import com.etec.estoque.model.Usuario;
import com.etec.estoque.model.enums.Role;
import com.etec.estoque.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            Usuario tecnicoAdmin = Usuario.builder()
                    .nome("Administrador Técnico")
                    .email("admin@etec.sp.gov.br")
                    .senha(passwordEncoder.encode("senha123"))
                    .role(Role.ROLE_TECNICO)
                    .build();
            usuarioRepository.save(tecnicoAdmin);
            
            System.out.println("Usuário técnico administrador padrão criado.");
            System.out.println("Email: admin@etec.sp.gov.br | Senha: senha123");
        }
    }
}
