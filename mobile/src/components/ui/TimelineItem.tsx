import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from "@/constants/theme";
import { formatDataMovimentacao, getRelativeTime, formatQuantidade } from '@/utils/formatters';
import type { Movimentacao } from '@/types';

interface TimelineItemProps {
  movimentacao: Movimentacao;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ movimentacao, isLast = false }) => {
  const isEntrada = movimentacao.tipo === 'ENTRADA';
  const dotColor = isEntrada ? Colors.success : Colors.danger;
  const bgColor = isEntrada ? Colors.successBg : Colors.dangerBg;
  const borderColor = isEntrada ? Colors.successDim : Colors.dangerDim;

  return (
    <View style={styles.wrapper}>
      <View style={styles.leftColumn}>
        <View style={[styles.dot, { backgroundColor: dotColor, shadowColor: dotColor }]} />
        {!isLast && <View style={[styles.connector, { backgroundColor: Colors.surfaceBorder }]} />}
      </View>

      <View style={[styles.card, { backgroundColor: bgColor, borderColor }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.tipoBadge, { backgroundColor: dotColor }]}>
            <Text style={styles.tipoText}>{isEntrada ? '↑ ENTRADA' : '↓ SAÍDA'}</Text>
          </View>

          <Text style={[styles.quantidade, { color: dotColor }]}>
            {formatQuantidade(movimentacao.quantidade, movimentacao.unidade || "")}
          </Text>
        </View>

        <Text style={styles.reagenteName}>{movimentacao.reagenteNome}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Text style={styles.metaIcon}>📚</Text>
            <Text style={styles.metaText} numberOfLines={1}>
              {movimentacao.materia}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaIcon}>👥</Text>
            <Text style={styles.metaText} numberOfLines={1}>
              {movimentacao.turma}
            </Text>
          </View>
        </View>

        <Text style={styles.date}>
          {getRelativeTime(movimentacao.data)} · {formatDataMovimentacao(movimentacao.data)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  leftColumn: {
    alignItems: 'center',
    width: 16,
    paddingTop: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  connector: {
    flex: 1,
    width: 2,
    marginTop: 4,
    borderRadius: Radius.full,
  },
  card: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipoBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  tipoText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  quantidade: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.extrabold,
  },
  reagenteName: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  metaIcon: {
    fontSize: 11,
  },
  metaText: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
    maxWidth: 110,
  },
  date: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
