package com.etec.estoque.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrdemServicoDTO {
    private String solicitanteEmail;
    private List<ItemOSDTO> itens;
}
