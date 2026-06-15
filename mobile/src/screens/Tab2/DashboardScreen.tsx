import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { StatCard } from '../../components/StatCard';
import { BarChart } from '../../components/BarChart';
import { DonutChart } from '../../components/DonutChart';
import { TimelineItem } from '../../components/TimelineItem';
import {
  MOCK_REAGENTES,
  MOCK_MOVIMENTACOES,
  MOCK_DASHBOARD_STATS,
} from '../../data/mockData';
import type { Tab2StackParamList } from '../../types';

type DashboardNavProp = NativeStackNavigationProp<Tab2StackParamList, 'Dashboard'>;

function getTopReagentesChartData() {
  return [...MOCK_REAGENTES]
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 8)
    .map((r, i) => ({
      label: r.nome.length > 14 ? r.nome.slice(0, 13) + '…' : r.nome,
      value: r.quantidade,
      unit: r.unidade,
      color: Colors.chart[i % Colors.chart.length],
    }));
}

function getMovimentacoesByMateriaChartData() {
  const counts: Record<string, number> = {};
  MOCK_MOVIMENTACOES.forEach(m => {
    counts[m.materia] = (counts[m.materia] ?? 0) + 1;
  });
  return Object.entries(counts).map(([label, value], i) => ({
    label,
    value,
    color: Colors.chart[i % Colors.chart.length],
  }));
}

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavProp>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await new Promise(resolve => setTimeout(resolve, 1200));
    setRefreshing(false);
  }, []);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  })();

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const barData = getTopReagentesChartData();
  const donutData = getMovimentacoesByMateriaChartData();
  const recentActivity = [...MOCK_MOVIMENTACOES]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
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

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.headerTitle}>Painel de Estoque</Text>
            <Text style={styles.headerDate}>{today}</Text>
          </View>
          <View style={styles.alertBubble}>
            {MOCK_DASHBOARD_STATS.lowStockCount > 0 && (
              <View style={styles.alertDot}>
                <Text style={styles.alertDotText}>{MOCK_DASHBOARD_STATS.lowStockCount}</Text>
              </View>
            )}
            <Text style={styles.alertIcon}>🔔</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          <StatCard
            icon="🧪"
            title="Reagentes"
            value={MOCK_DASHBOARD_STATS.totalReagentes}
            subtitle="no estoque"
            accentColor={Colors.cyan}
          />
          <StatCard
            icon="🔄"
            title="Movimentações"
            value={MOCK_DASHBOARD_STATS.totalMovimentacoes}
            subtitle="registradas"
            accentColor={Colors.violet}
          />
          <StatCard
            icon="👥"
            title="Turmas"
            value={MOCK_DASHBOARD_STATS.totalTurmas}
            subtitle="ativas"
            accentColor={Colors.success}
          />
          <StatCard
            icon="⚠️"
            title="Estoque Baixo"
            value={MOCK_DASHBOARD_STATS.lowStockCount}
            subtitle="itens críticos"
            accentColor={Colors.danger}
          />
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionAccent, { backgroundColor: Colors.cyan }]} />
              <Text style={styles.sectionTitle}>Visão do Estoque</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Reagentes')} hitSlop={8}>
              <Text style={styles.sectionLink}>Ver todos →</Text>
            </Pressable>
          </View>
          <Text style={styles.sectionSubtitle}>Top 8 reagentes por quantidade</Text>
          <View style={styles.card}>
            <BarChart data={barData} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionAccent, { backgroundColor: Colors.violet }]} />
              <Text style={styles.sectionTitle}>Uso por Matéria</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>Movimentações registradas por disciplina</Text>
          <View style={[styles.card, styles.donutCard]}>
            <DonutChart
              data={donutData}
              size={160}
              centerLabel={String(MOCK_DASHBOARD_STATS.totalMovimentacoes)}
              centerSubLabel="movimentações"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionAccent, { backgroundColor: Colors.success }]} />
              <Text style={styles.sectionTitle}>Atividade Recente</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>Últimas 5 movimentações</Text>
          <View style={styles.timelineCard}>
            {recentActivity.map((m, i) => (
              <TimelineItem key={m.id} movimentacao={m} isLast={i === recentActivity.length - 1} />
            ))}
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing['5xl'],
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerDate: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  alertBubble: {
    position: 'relative',
    width: 44,
    height: 44,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  alertDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.danger,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  alertDotText: {
    fontSize: 10,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  alertIcon: {
    fontSize: 20,
  },

  statsRow: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },

  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: Radius.full,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    marginLeft: Spacing.md + 4,
  },
  sectionLink: {
    fontSize: Typography.size.sm,
    color: Colors.cyan,
    fontWeight: Typography.weight.semibold,
  },

  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  donutCard: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  timelineCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    padding: Spacing.lg,
    ...Shadow.sm,
  },

  footer: {
    height: Spacing['2xl'],
  },
});
