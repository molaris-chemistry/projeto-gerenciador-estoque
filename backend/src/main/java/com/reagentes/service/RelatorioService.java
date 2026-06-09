package com.reagentes.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.reagentes.model.Movimentacao;
import com.reagentes.model.Reagente;
import com.reagentes.repository.MovimentacaoRepository;
import com.reagentes.repository.ReagenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class RelatorioService {

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private ReagenteRepository reagenteRepository;

    public byte[] gerarRelatorioGeralPdf() throws Exception {
        List<Reagente> reagentes = reagenteRepository.findAll();

        // Método com JOIN FETCH para carregamento Eager
        List<Movimentacao> movimentacoes = movimentacaoRepository.findAllWithDetailsOrderByDataDesc();

        return gerarPdfComDados("Relatório Geral", reagentes, movimentacoes, null);
    }

    public byte[] gerarRelatorioSemestralPdf(int ano) throws Exception {
        LocalDateTime inicioPrimeiroSemestre = LocalDateTime.of(ano, 1, 1, 0, 0, 0);
        LocalDateTime fimPrimeiroSemestre = LocalDateTime.of(ano, 6, 30, 23, 59, 59);
        LocalDateTime inicioSegundoSemestre = LocalDateTime.of(ano, 7, 1, 0, 0, 0);
        LocalDateTime fimSegundoSemestre = LocalDateTime.of(ano, 12, 31, 23, 59, 59);

        List<Movimentacao> movsPrimeiroSemestre = movimentacaoRepository.findByDataBetween(inicioPrimeiroSemestre, fimPrimeiroSemestre);
        List<Movimentacao> movsSegundoSemestre = movimentacaoRepository.findByDataBetween(inicioSegundoSemestre, fimSegundoSemestre);

        Map<String, Map<String, Map<String, BigDecimal>>> primeiroSemestre = agruparPorMateriaTurmaReagente(movsPrimeiroSemestre);
        Map<String, Map<String, Map<String, BigDecimal>>> segundoSemestre = agruparPorMateriaTurmaReagente(movsSegundoSemestre);

        Map<String, Object> semestresAgrupados = new HashMap<>();
        semestresAgrupados.put("primeiro_semestre", primeiroSemestre);
        semestresAgrupados.put("segundo_semestre", segundoSemestre);

        return gerarPdfComDados("Relatório Semestral " + ano, null, null, semestresAgrupados);
    }

    // Lógica de Geração de PDF (iText)
    private byte[] gerarPdfComDados(String titulo, List<Reagente> reagentes, List<Movimentacao> movimentacoes, Map<String, Object> semestresAgrupados) throws DocumentException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, outputStream);
        document.open();

        Font fontTitulo = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.BLACK);
        Font fontCabecalho = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE); 
        Font fontCorpo = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);

        document.add(new Paragraph(titulo + "\n\n", fontTitulo));

        // --- 1. RELATÓRIO GERAL: DETALHES DE MOVIMENTAÇÃO ---
        if (movimentacoes != null && !movimentacoes.isEmpty()) {
            document.add(new Paragraph("Movimentações Detalhadas:", fontCorpo));
            document.add(new Paragraph("\n"));

            // Novo: Tabela com apenas Reagente e Quantidade
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(70);
            table.setSpacingBefore(10f);

            float[] columnWidths = {3f, 1.5f};
            table.setWidths(columnWidths);

            // Cabeçalho
            String[] headers = {"Reagente", "Quantidade"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, fontCabecalho));
                cell.setBackgroundColor(BaseColor.DARK_GRAY);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5);
                table.addCell(cell);
            }
            // Agrupa quantidades por reagente com sinal: ENTRADA positivo, RETIRADA negativo
            Map<String, BigDecimal> totaisPorReagenteSigned = new HashMap<>();
            for (Movimentacao mov : movimentacoes) {
                String nomeReagente = (mov.getReagente() != null) ? mov.getReagente().getNome() : "N/A";
                BigDecimal quantidade = mov.getQuantidade() != null ? mov.getQuantidade() : BigDecimal.ZERO;
                String tipo = mov.getTipo() != null ? mov.getTipo().toUpperCase() : "";
                BigDecimal signed = quantidade;
                if ("RETIRADA".equals(tipo)) signed = quantidade.negate();
                totaisPorReagenteSigned.merge(nomeReagente, signed, BigDecimal::add);
            }

            // Preenche tabela: mostra, para cada reagente, a quantidade total (negativa quando retirada)
            for (Map.Entry<String, BigDecimal> entry : totaisPorReagenteSigned.entrySet()) {
                table.addCell(new Phrase(entry.getKey(), fontCorpo));
                BigDecimal v = entry.getValue();
                String qty = (v == null) ? "0" : (v.signum() < 0 ? ("-" + v.abs().toString()) : v.toString());
                table.addCell(new Phrase(qty, fontCorpo));
            }

            document.add(table);
        } else if (movimentacoes != null) {
            document.add(new Paragraph("Nenhuma movimentação encontrada para o relatório geral.", fontCorpo));
        }

        // --- 2. RELATÓRIO SEMESTRAL: Resumo ---
        if (semestresAgrupados != null) {
            document.add(new Paragraph("\n\nResumo Semestral por Matéria:", fontCorpo));
            for (String semestreKey : new String[]{"primeiro_semestre", "segundo_semestre"}) {
                Map<String, Map<String, Map<String, BigDecimal>>> agrupamentoSemestre = (Map<String, Map<String, Map<String, BigDecimal>>>) semestresAgrupados.get(semestreKey);
                if (agrupamentoSemestre != null && !agrupamentoSemestre.isEmpty()) {
                    document.add(new Paragraph("\n--- " + (semestreKey.equals("primeiro_semestre") ? "1º SEMESTRE" : "2º SEMESTRE") + " ---", fontCabecalho));

                    // Ordena matérias
                    java.util.List<String> materias = new java.util.ArrayList<>(agrupamentoSemestre.keySet());
                    java.util.Collections.sort(materias);

                    // Gera layout em grade parecido com o modelo: 2 colunas por linha
                    int columnsPerRow = 2;
                    PdfPTable outerTable = new PdfPTable(columnsPerRow);
                    outerTable.setWidthPercentage(100);
                    float[] outerWidths = new float[columnsPerRow];
                    for (int i = 0; i < columnsPerRow; i++) outerWidths[i] = 1f;
                    outerTable.setWidths(outerWidths);

                    for (String materia : materias) {
                        Map<String, Map<String, BigDecimal>> turmasMap = agrupamentoSemestre.get(materia);
                        // Cria tabela interna para a matéria
                        PdfPTable materiaTable = new PdfPTable(1);
                        materiaTable.setWidthPercentage(100);

                        PdfPCell materiaHeader = new PdfPCell(new Phrase(materia, fontCabecalho));
                        materiaHeader.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        materiaHeader.setHorizontalAlignment(Element.ALIGN_CENTER);
                        materiaHeader.setPadding(6);
                        materiaTable.addCell(materiaHeader);

                        if (turmasMap != null && !turmasMap.isEmpty()) {
                            java.util.List<String> turmas = new java.util.ArrayList<>(turmasMap.keySet());
                            java.util.Collections.sort(turmas);
                            for (String turma : turmas) {
                                // Turma label
                                PdfPCell turmaCell = new PdfPCell(new Phrase("Turma: " + turma, fontCorpo));
                                turmaCell.setBorder(Rectangle.NO_BORDER);
                                turmaCell.setPaddingTop(4);
                                turmaCell.setPaddingBottom(2);
                                materiaTable.addCell(turmaCell);

                                // Tabela de reagentes dentro da turma
                                PdfPTable inner = new PdfPTable(2);
                                inner.setWidthPercentage(100);
                                inner.setSpacingBefore(2f);
                                inner.setWidths(new float[]{3f, 1.5f});

                                PdfPCell hc1 = new PdfPCell(new Phrase("REAGENTE:", fontCabecalho));
                                hc1.setBackgroundColor(BaseColor.GRAY);
                                hc1.setPadding(4);
                                inner.addCell(hc1);
                                PdfPCell hc2 = new PdfPCell(new Phrase("QUANTIDADE:", fontCabecalho));
                                hc2.setBackgroundColor(BaseColor.GRAY);
                                hc2.setPadding(4);
                                inner.addCell(hc2);

                                Map<String, BigDecimal> reagentesMap = turmasMap.get(turma);
                                java.util.List<String> nomesReagentes = new java.util.ArrayList<>();
                                if (reagentesMap != null) {
                                    nomesReagentes.addAll(reagentesMap.keySet());
                                }
                                java.util.Collections.sort(nomesReagentes);
                                for (String nomeReagente : nomesReagentes) {
                                    inner.addCell(new Phrase(nomeReagente, fontCorpo));
                                    BigDecimal v = reagentesMap.get(nomeReagente);
                                    String qty;
                                    if (v == null) {
                                        qty = "0";
                                    } else if (v.signum() < 0) {
                                        qty = "-" + v.abs().toString();
                                    } else {
                                        qty = v.toString();
                                    }
                                    inner.addCell(new Phrase(qty, fontCorpo));
                                }

                                PdfPCell innerCell = new PdfPCell(inner);
                                innerCell.setPadding(4);
                                materiaTable.addCell(innerCell);
                            }
                        } else {
                            PdfPCell none = new PdfPCell(new Phrase("Nenhuma turma", fontCorpo));
                            none.setBorder(Rectangle.NO_BORDER);
                            materiaTable.addCell(none);
                        }

                        // Adiciona a tabela da matéria como célula na tabela externa
                        PdfPCell wrapper = new PdfPCell(materiaTable);
                        wrapper.setPadding(6);
                        outerTable.addCell(wrapper);
                    }

                    // Se não completou a última linha, adiciona células vazias
                    int remainder = materias.size() % columnsPerRow;
                    if (remainder != 0) {
                        for (int i = 0; i < (columnsPerRow - remainder); i++) {
                            PdfPCell empty = new PdfPCell(new Phrase(""));
                            empty.setBorder(Rectangle.NO_BORDER);
                            outerTable.addCell(empty);
                        }
                    }

                    document.add(outerTable);
                }
            }
        }
        // --- FIM DOS RELATÓRIOS ---

        document.close();

        return outputStream.toByteArray();
    }

    private Map<String, Map<String, BigDecimal>> agruparMovimentacoesPorMateriaEReagente(List<Movimentacao> movimentacoes) {
        Map<String, Map<String, BigDecimal>> agrupamento = new HashMap<>();
        for (Movimentacao mov : movimentacoes) {
            String nomeMateria = (mov.getMateria() != null) ? mov.getMateria().getNome() : "N/A";
            String nomeReagente = (mov.getReagente() != null) ? mov.getReagente().getNome() : "N/A";
            BigDecimal quantidade = mov.getQuantidade();
            agrupamento.computeIfAbsent(nomeMateria, k -> new HashMap<>());
            Map<String, BigDecimal> reagentes = agrupamento.get(nomeMateria);
            reagentes.merge(nomeReagente, quantidade, BigDecimal::add);
        }
        return agrupamento;
    }

    private Map<String, Map<String, Map<String, BigDecimal>>> agruparPorMateriaTurmaReagente(List<Movimentacao> movimentacoes) {
        Map<String, Map<String, Map<String, BigDecimal>>> agrupamento = new HashMap<>();
        for (Movimentacao mov : movimentacoes) {
            String nomeMateria = (mov.getMateria() != null) ? mov.getMateria().getNome() : "N/A";
            String nomeTurma = "N/A";
            if (mov.getTurma() != null) {
                String sala = mov.getTurma().getSala() != null ? mov.getTurma().getSala() : "";
                String nome = mov.getTurma().getNome() != null ? mov.getTurma().getNome() : "";
                nomeTurma = (sala + " " + nome).trim();
                if (nomeTurma.isEmpty()) nomeTurma = "N/A";
            }
            String nomeReagente = (mov.getReagente() != null) ? mov.getReagente().getNome() : "N/A";
            BigDecimal quantidade = mov.getQuantidade();

            // Acumula quantidades com sinal: ENTRADA = +, RETIRADA = -
            BigDecimal signed = quantidade != null ? quantidade : BigDecimal.ZERO;
            String tipo = mov.getTipo() != null ? mov.getTipo().toUpperCase() : "";
            if ("RETIRADA".equals(tipo)) {
                signed = signed.negate();
            }

            agrupamento.computeIfAbsent(nomeMateria, k -> new HashMap<>());
            Map<String, Map<String, BigDecimal>> turmas = agrupamento.get(nomeMateria);
            turmas.computeIfAbsent(nomeTurma, k -> new HashMap<>());
            Map<String, BigDecimal> reagentes = turmas.get(nomeTurma);
            reagentes.merge(nomeReagente, signed, BigDecimal::add);
        }
        return agrupamento;
    }
}