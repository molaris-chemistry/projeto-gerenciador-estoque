package com.reagentes.controller;

import com.reagentes.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping(value = "/geral", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> gerarRelatorioGeral() {
        try {
            byte[] pdfBytes = relatorioService.gerarRelatorioGeralPdf();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"relatorio_geral.pdf\"")
                    .contentLength(pdfBytes.length)
                    .body(pdfBytes);
        } catch (UnsupportedOperationException e) {
            return ResponseEntity.status(501)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body("Geração de PDF não implementada.".getBytes());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body(("Erro interno ao gerar PDF: " + e.getMessage()).getBytes());
        }
    }

    @GetMapping(value = "/semestral/{ano}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> gerarRelatorioSemestral(@PathVariable int ano) {
        try {
            byte[] pdfBytes = relatorioService.gerarRelatorioSemestralPdf(ano);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"relatorio_semestral_" + ano + ".pdf\"")
                    .contentLength(pdfBytes.length)
                    .body(pdfBytes);
        } catch (UnsupportedOperationException e) {
            return ResponseEntity.status(501)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body("Geração de PDF semestral não implementada.".getBytes());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body(("Erro interno ao gerar PDF semestral: " + e.getMessage()).getBytes());
        }
    }

    @GetMapping(value = "/por-turma/{turmaId}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> gerarRelatorioPorTurma(@PathVariable Long turmaId) {
        try {
            byte[] pdfBytes = relatorioService.gerarRelatorioPorTurmaPdf(turmaId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"relatorio_turma_" + turmaId + ".pdf\"")
                    .contentLength(pdfBytes.length)
                    .body(pdfBytes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body(("Erro interno ao gerar PDF: " + e.getMessage()).getBytes());
        }
    }

    @GetMapping(value = "/por-materia/{materiaId}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> gerarRelatorioPorMateria(@PathVariable Long materiaId) {
        try {
            byte[] pdfBytes = relatorioService.gerarRelatorioPorMateriaPdf(materiaId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"relatorio_materia_" + materiaId + ".pdf\"")
                    .contentLength(pdfBytes.length)
                    .body(pdfBytes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body(("Erro interno ao gerar PDF: " + e.getMessage()).getBytes());
        }
    }
}
