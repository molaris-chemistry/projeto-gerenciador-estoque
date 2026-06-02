package com.etec.estoque.repository;

import com.etec.estoque.model.OrdemServico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {
    List<OrdemServico> findBySolicitanteId(Long solicitanteId);
}
