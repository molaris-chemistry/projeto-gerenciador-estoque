import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { AlertBadge, TimelineItem } from '@/components/ui';
import { MOCK_REAGENTES, getMovimentacoesByReagente } from '@/data/mockData';
import {
  formatQuantidade,
  isLowStock,
  isExpiringSoon,
} from '@/utils/formatters';
import type { Reagente, Movimentacao } from '@/types';

export default function ReagenteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const reagenteId = Number(id);

  const [reagente, setReagente] = useState<Reagente | null>(null);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 300)); // simulate network latency
    const found = MOCK_REAGENTES.find(r => r.id === reagenteId) ?? null;
    setReagente(found);
    setMovimentacoes(getMovimentacoesByReagente(reagenteId));
  }, [reagenteId]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const totalEntradas = movimentacoes
    .filter(m => m.tipo === 'ENTRADA')
    .reduce((sum, m) => sum + m.quantidade, 0);
  const totalSaidas = movimentacoes
    .filter(m => m.tipo === 'RETIRADA')
    .reduce((sum, m) => sum + m.quantidade, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.cyan} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!reagente) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorIcon}>⚗️</Text>
          <Text style={styles.errorTitle}>Reagente não encontrado</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const lowStock = isLowStock(reagente.quantidade);
  const expiring = isExpiringSoon(undefined); // placeholder until backend exposes dataValidade
  const unitColor = reagente.unidade === 'g' || reagente.unidade === 'kg'
    ? Colors.cyan
    : Colors.violet;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.cyan}
            colors={[Colors.cyan]}
          />
        }
      >
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={4}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Catálogo</Text>
        </Pressable>

        <View style={styles.hero}>
          <View style={[styles.heroBubble, { backgroundColor: `${unitColor}20`, borderColor: `${unitColor}40` }]}>
            <Text style={[styles.heroUnit, { color: unitColor }]}>
              {reagente.unidade}
            </Text>
          </View>

          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{reagente.nome}</Text>
            <View style={styles.heroBadges}>
              {lowStock && <AlertBadge type="danger" label="Estoque Baixo" size="md" />}
              {expiring && <AlertBadge type="warning" label="Validade Próxima" size="md" />}
              {!lowStock && !expiring && <AlertBadge type="success" label="Normal" size="md" />}
            </View>
          </View>

          <View style={[styles.quantityCard, { borderColor: unitColor, backgroundColor: `${unitColor}10` }]}>
            <Text style={styles.quantityLabel}>Quantidade Atual</Text>
            <Text style={[styles.quantityValue, { color: lowStock ? Colors.danger : unitColor }]}>
              {formatQuantidade(reagente.quantidade, reagente.unidade)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={styles.infoGrid}>
            <InfoTile icon="🔢" label="ID" value={`#${reagente.id}`} />
            <InfoTile icon="⚗️" label="Unidade" value={reagente.unidade} />
            <InfoTile
              icon="↑"
              label="Total Entradas"
              value={formatQuantidade(totalEntradas, reagente.unidade)}
              color={Colors.success}
            />
            <InfoTile
              icon="↓"
              label="Total Saídas"
              value={formatQuantidade(totalSaidas, reagente.unidade)}
              color={Colors.danger}
            />
            <InfoTile
              icon="🔄"
              label="Movimentações"
              value={String(movimentacoes.length)}
            />
            <InfoTile
              icon="📋"
              label="Status"
              value={lowStock ? 'Crítico' : 'Normal'}
              color={lowStock ? Colors.danger : Colors.success}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.timelineHeader}>
            <Text style={styles.sectionTitle}>Histórico de Movimentações</Text>
            <View style={styles.timelineCount}>
              <Text style={styles.timelineCountText}>{movimentacoes.length}</Text>
            </View>
          </View>

          {movimentacoes.length === 0 ? (
            <View style={styles.noMovs}>
              <Text style={styles.noMovsIcon}>📭</Text>
              <Text style={styles.noMovsText}>Nenhuma movimentação registrada</Text>
            </View>
          ) : (
            <View style={styles.timeline}>
              {movimentacoes.map((m, i) => (
                <TimelineItem
                  key={m.id}
                  movimentacao={m}
                  isLast={i === movimentacoes.length - 1}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface InfoTileProps {
  icon: string;
  label: string;
  value: string;
  color?: string;
}

const InfoTile: React.FC<InfoTileProps> = ({ icon, label, value, color = Colors.textPrimary }) => (
  <View style={tileStyles.tile}>
    <Text style={tileStyles.icon}>{icon}</Text>
    <Text style={tileStyles.label}>{label}</Text>
    <Text style={[tileStyles.value, { color }]}>{value}</Text>
  </View>
);

const tileStyles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    padding: Spacing.md,
    gap: 4,
  },
  icon: {
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weight.medium,
  },
  value: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxxxxl,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  errorIcon: {
    fontSize: 52,
  },
  errorTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  backButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.cyan,
  },
  backButtonText: {
    color: Colors.cyan,
    fontWeight: Typography.weight.semibold,
    fontSize: Typography.size.sm,
  },

  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  backArrow: {
    fontSize: Typography.size.xl,
    color: Colors.cyan,
    fontWeight: Typography.weight.bold,
  },
  backText: {
    fontSize: Typography.size.sm,
    color: Colors.cyan,
    fontWeight: Typography.weight.semibold,
  },

  hero: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  heroBubble: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroUnit: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.extrabold,
  },
  heroInfo: {
    gap: Spacing.sm,
  },
  heroName: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  quantityCard: {
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    padding: Spacing.lg,
    alignItems: 'center'
  },
  quantityLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.xs,
  },
  quantityValue: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.extrabold,
    letterSpacing: -1,
  },

  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  timelineCount: {
    backgroundColor: Colors.cyan,
    borderRadius: Radius.full,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  timelineCountText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.background,
  },
  timeline: {
    gap: 0,
  },
  noMovs: {
    alignItems: 'center',
    padding: Spacing.xxxl,
    gap: Spacing.md,
  },
  noMovsIcon: {
    fontSize: 40,
  },
  noMovsText: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  footer: {
    height: Spacing.xxl,
  },
});
