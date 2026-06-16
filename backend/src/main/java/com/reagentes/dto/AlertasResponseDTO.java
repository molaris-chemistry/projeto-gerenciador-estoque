package com.reagentes.dto;

import java.util.List;

public class AlertasResponseDTO {

    private List<ReagenteDTO> vencendo;
    private List<ReagenteDTO> estoqueMinimo;

    public AlertasResponseDTO() {}

    public AlertasResponseDTO(List<ReagenteDTO> vencendo, List<ReagenteDTO> estoqueMinimo) {
        this.vencendo = vencendo;
        this.estoqueMinimo = estoqueMinimo;
    }

    public List<ReagenteDTO> getVencendo() {
        return vencendo;
    }

    public void setVencendo(List<ReagenteDTO> vencendo) {
        this.vencendo = vencendo;
    }

    public List<ReagenteDTO> getEstoqueMinimo() {
        return estoqueMinimo;
    }

    public void setEstoqueMinimo(List<ReagenteDTO> estoqueMinimo) {
        this.estoqueMinimo = estoqueMinimo;
    }
}
