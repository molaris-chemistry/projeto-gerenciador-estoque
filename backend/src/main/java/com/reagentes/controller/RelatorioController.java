package com.reagentes.controller;

import com.reagentes.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "http://localhost:5173")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    // Relatório Geral (Espera PDF e retorna 200 OK ou 5xx Erro)
    @GetMapping(value = "/geral", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> gerarRelatorioGeral() {
        try {
            byte[] pdfBytes = relatorioService.gerarRelatorioGeralPdf();

            // Retorna o PDF
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"relatorio_geral.pdf\"")
                    .contentLength(pdfBytes.length)
                    .body(pdfBytes);

        } catch (UnsupportedOperationException e) {
            // Se a lógica de PDF no Service ainda não foi implementada (Erro 501)
            String errorMessage = "Lógica de geração de PDF não implementada. (Erro 501)";

            return ResponseEntity.status(501)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body(errorMessage.getBytes());

        } catch (Exception e) {
            e.printStackTrace();
            // Erro genérico na geração do PDF (Erro 500)
            String errorMessage = "Erro interno ao gerar PDF: " + e.getMessage();

            return ResponseEntity.internalServerError()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body(errorMessage.getBytes());
        }
    }

    // Relatório Semestral (Espera PDF e retorna 200 OK ou 5xx Erro)
    @GetMapping(value = "/semestral/{ano}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> gerarRelatorioSemestral(@PathVariable int ano) {
        try {
            byte[] pdfBytes = relatorioService.gerarRelatorioSemestralPdf(ano);

            // Retorna o PDF
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"relatorio_semestral_" + ano + ".pdf\"")
                    .contentLength(pdfBytes.length)
                    .body(pdfBytes);

        } catch (UnsupportedOperationException e) {
            // Se a lógica de PDF no Service ainda não foi implementada (Erro 501)
            String errorMessage = "Lógica de geração de PDF Semestral não implementada. (Erro 501)";

            return ResponseEntity.status(501)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body(errorMessage.getBytes());

        } catch (Exception e) {
            e.printStackTrace();
            // Erro genérico na geração do PDF (Erro 500)
            String errorMessage = "Erro interno ao gerar PDF Semestral: " + e.getMessage();

            return ResponseEntity.internalServerError()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body(errorMessage.getBytes()); // CORRIGIDO: .getBytes() na String
        }
    }
}