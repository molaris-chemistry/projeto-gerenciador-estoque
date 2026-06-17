package com.reagentes.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.reagentes.model.Materia;
import com.reagentes.model.Movimentacao;
import com.reagentes.model.Reagente;
import com.reagentes.model.TipoMovimentacao;
import com.reagentes.model.Turma;
import com.reagentes.repository.MateriaRepository;
import com.reagentes.repository.MovimentacaoRepository;
import com.reagentes.repository.ReagenteRepository;
import com.reagentes.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RelatorioService {

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private ReagenteRepository reagenteRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    public byte[] gerarRelatorioGeralPdf() throws Exception {
        List<Reagente> reagentes = reagenteRepository.findAll();
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

        Map<String, Object> semestresAgrupados = new HashMap<>();
        semestresAgrupados.put("primeiro_semestre", agruparPorMateriaTurmaReagente(movsPrimeiroSemestre));
        semestresAgrupados.put("segundo_semestre", agruparPorMateriaTurmaReagente(movsSegundoSemestre));

        return gerarPdfComDados("Relatório Semestral " + ano, null, null, semestresAgrupados);
    }

    public byte[] gerarRelatorioPorTurmaPdf(Long turmaId) throws Exception {
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada: " + turmaId));
        List<Movimentacao> movimentacoes = movimentacaoRepository.findByTurmaIdWithDetails(turmaId);
        String label = (turma.getSala() + " " + turma.getNome()).trim();
        return gerarPdfComDados("Relatório por Turma: " + label, null, movimentacoes, null);
    }

    public byte[] gerarRelatorioPorMateriaPdf(Long materiaId) throws Exception {
        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new IllegalArgumentException("Matéria não encontrada: " + materiaId));
        List<Movimentacao> movimentacoes = movimentacaoRepository.findByMateriaIdWithDetails(materiaId);
        return gerarPdfComDados("Relatório por Matéria: " + materia.getNome(), null, movimentacoes, null);
    }

    private byte[] gerarPdfComDados(String titulo, List<Reagente> reagentes, List<Movimentacao> movimentacoes, Map<String, Object> semestresAgrupados) throws DocumentException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, outputStream);
        document.open();

        Font fontTitulo = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.BLACK);
        Font fontCabecalho = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
        Font fontCorpo = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);

        document.add(new Paragraph(titulo + "\n\n", fontTitulo));

        if (movimentacoes != null && !movimentacoes.isEmpty()) {
            document.add(new Paragraph("Movimentações Detalhadas:", fontCorpo));
            document.add(new Paragraph("\n"));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(70);
            table.setSpacingBefore(10f);
            table.setWidths(new float[]{3f, 1.5f});

            for (String header : new String[]{"Reagente", "Quantidade"}) {
                PdfPCell cell = new PdfPCell(new Phrase(header, fontCabecalho));
                cell.setBackgroundColor(BaseColor.DARK_GRAY);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5);
                table.addCell(cell);
            }

            Map<String, BigDecimal> totaisPorReagente = new HashMap<>();
            for (Movimentacao mov : movimentacoes) {
                String nomeReagente = mov.getReagente() != null ? mov.getReagente().getNome() : "N/A";
                BigDecimal quantidade = mov.getQuantidade() != null ? mov.getQuantidade() : BigDecimal.ZERO;
                TipoMovimentacao tipo = mov.getTipo();
                BigDecimal signed = TipoMovimentacao.RETIRADA == tipo ? quantidade.negate() : quantidade;
                totaisPorReagente.merge(nomeReagente, signed, BigDecimal::add);
            }

            for (Map.Entry<String, BigDecimal> entry : totaisPorReagente.entrySet()) {
                table.addCell(new Phrase(entry.getKey(), fontCorpo));
                BigDecimal v = entry.getValue();
                String qty = v == null ? "0" : (v.signum() < 0 ? "-" + v.abs() : v.toString());
                table.addCell(new Phrase(qty, fontCorpo));
            }

            document.add(table);
        } else if (movimentacoes != null) {
            document.add(new Paragraph("Nenhuma movimentação encontrada.", fontCorpo));
        }

        if (semestresAgrupados != null) {
            document.add(new Paragraph("\n\nResumo Semestral por Matéria:", fontCorpo));

            for (String semestreKey : new String[]{"primeiro_semestre", "segundo_semestre"}) {
                @SuppressWarnings("unchecked")
                Map<String, Map<String, Map<String, BigDecimal>>> agrupamento =
                        (Map<String, Map<String, Map<String, BigDecimal>>>) semestresAgrupados.get(semestreKey);

                if (agrupamento == null || agrupamento.isEmpty()) continue;

                String semestreLabel = "primeiro_semestre".equals(semestreKey) ? "1º SEMESTRE" : "2º SEMESTRE";
                document.add(new Paragraph("\n--- " + semestreLabel + " ---", fontCabecalho));

                java.util.List<String> materias = new java.util.ArrayList<>(agrupamento.keySet());
                java.util.Collections.sort(materias);

                int columnsPerRow = 2;
                PdfPTable outerTable = new PdfPTable(columnsPerRow);
                outerTable.setWidthPercentage(100);
                outerTable.setWidths(new float[]{1f, 1f});

                for (String materia : materias) {
                    Map<String, Map<String, BigDecimal>> turmasMap = agrupamento.get(materia);
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
                            PdfPCell turmaCell = new PdfPCell(new Phrase("Turma: " + turma, fontCorpo));
                            turmaCell.setBorder(Rectangle.NO_BORDER);
                            turmaCell.setPaddingTop(4);
                            turmaCell.setPaddingBottom(2);
                            materiaTable.addCell(turmaCell);

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
                            java.util.List<String> nomesReagentes = reagentesMap != null
                                    ? new java.util.ArrayList<>(reagentesMap.keySet())
                                    : new java.util.ArrayList<>();
                            java.util.Collections.sort(nomesReagentes);

                            for (String nomeReagente : nomesReagentes) {
                                inner.addCell(new Phrase(nomeReagente, fontCorpo));
                                BigDecimal v = reagentesMap.get(nomeReagente);
                                String qty = v == null ? "0" : (v.signum() < 0 ? "-" + v.abs() : v.toString());
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

                    PdfPCell wrapper = new PdfPCell(materiaTable);
                    wrapper.setPadding(6);
                    outerTable.addCell(wrapper);
                }

                int remainder = materias.size() % columnsPerRow;
                if (remainder != 0) {
                    for (int i = 0; i < columnsPerRow - remainder; i++) {
                        PdfPCell empty = new PdfPCell(new Phrase(""));
                        empty.setBorder(Rectangle.NO_BORDER);
                        outerTable.addCell(empty);
                    }
                }

                document.add(outerTable);
            }
        }

        document.close();
        return outputStream.toByteArray();
    }

    private Map<String, Map<String, Map<String, BigDecimal>>> agruparPorMateriaTurmaReagente(List<Movimentacao> movimentacoes) {
        Map<String, Map<String, Map<String, BigDecimal>>> agrupamento = new HashMap<>();
        for (Movimentacao mov : movimentacoes) {
            String nomeMateria = mov.getMateria() != null ? mov.getMateria().getNome() : "N/A";

            String nomeTurma = "N/A";
            if (mov.getTurma() != null) {
                String sala = mov.getTurma().getSala() != null ? mov.getTurma().getSala() : "";
                String nome = mov.getTurma().getNome() != null ? mov.getTurma().getNome() : "";
                nomeTurma = (sala + " " + nome).trim();
                if (nomeTurma.isEmpty()) nomeTurma = "N/A";
            }

            String nomeReagente = mov.getReagente() != null ? mov.getReagente().getNome() : "N/A";
            BigDecimal quantidade = mov.getQuantidade() != null ? mov.getQuantidade() : BigDecimal.ZERO;
            BigDecimal signed = TipoMovimentacao.RETIRADA == mov.getTipo() ? quantidade.negate() : quantidade;

            agrupamento.computeIfAbsent(nomeMateria, k -> new HashMap<>())
                    .computeIfAbsent(nomeTurma, k -> new HashMap<>())
                    .merge(nomeReagente, signed, BigDecimal::add);
        }
        return agrupamento;
    }
}
