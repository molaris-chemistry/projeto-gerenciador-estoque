package com.etec.estoque.repository;

import com.etec.estoque.model.ItemOrdemServico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemOrdemServicoRepository extends JpaRepository<ItemOrdemServico, Long> {
    List<ItemOrdemServico> findByOrdemServicoId(Long ordemServicoId);
}
