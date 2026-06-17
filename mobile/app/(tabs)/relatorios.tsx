import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useDashboard } from '@/contexts/DashboardContext';
import type { Reagente } from '@/types';
import {
  downloadRelatorioGeral,
  downloadRelatorioSemestral,
} from '@/services/relatorios';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

function formatDateBR(iso?: string | null): string {
  if (!iso) return '—';
  const [datePart] = iso.split('T');
  const [y, m, d] = datePart.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function AlertaItem({
  reagente,
  tipo,
}: {
  reagente: Reagente;
  tipo: 'vencendo' | 'estoqueMinimo';
}) {
  const isVencendo = tipo === 'vencendo';
  const color = isVencendo ? Colors.warning : Colors.error;
  const icon: keyof typeof Ionicons.glyphMap = isVencendo
    ? 'time-outline'
    : 'alert-circle-outline';

  return (
    <Card style={styles.alertaCard}>
      <View style={styles.alertaRow}>
        <View style={[styles.alertaIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.alertaNome}>{reagente.nome}</Text>
          <Text style={styles.alertaDetalhe}>
            {isVencendo
              ? `Validade: ${formatDateBR(reagente.dataValidade)}`
              : `Estoque: ${reagente.quantidade} ${reagente.unidade}` +
                (reagente.quantidadeMinima != null
                  ? ` • mín. ${reagente.quantidadeMinima} ${reagente.unidade}`
                  : '')}
          </Text>
        </View>
        <View style={[styles.alertaTag, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.alertaTagText, { color }]}>
            {isVencendo ? 'VENCENDO' : 'BAIXO'}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export default function RelatoriosScreen() {
  const {
    totalReagentes,
    movimentacoesHoje,
    alertas,
    totalAlertas,
    isLoading,
    isRefreshing,
    error,
    refresh,
  } = useDashboard();

  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [loadingGeral, setLoadingGeral] = useState(false);
  const [loadingSemestral, setLoadingSemestral] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleRelatorioGeral = async () => {
    try {
      setLoadingGeral(true);
      setDownloadError(null);
      await downloadRelatorioGeral();
    } catch (e: any) {
      setDownloadError(e?.message ?? 'Erro ao baixar relatório geral');
    } finally {
      setLoadingGeral(false);
    }
  };

  const handleRelatorioSemestral = async () => {
    try {
      setLoadingSemestral(true);
      setDownloadError(null);
      await downloadRelatorioSemestral(selectedYear);
    } catch (e: any) {
      setDownloadError(e?.message ?? 'Erro ao baixar relatório semestral');
    } finally {
      setLoadingSemestral(false);
    }
  };

  const semAlertas = totalAlertas === 0;

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor={Colors.primary}
            />
          }
        >
          <View style={styles.header}>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Visão geral e relatórios</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard
              icon="flask"
              label="Total de reagentes"
              value={totalReagentes}
              color={Colors.primary}
            />
            <StatCard
              icon="swap-horizontal"
              label="Movimentações hoje"
              value={movimentacoesHoje}
              color={Colors.cyan}
            />
            <StatCard
              icon="warning"
              label="Itens em alerta"
              value={totalAlertas}
              color={Colors.warning}
            />
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="cloud-offline-outline" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Alertas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alertas</Text>
            {semAlertas ? (
              <View style={styles.emptyAlerts}>
                <Ionicons name="shield-checkmark-outline" size={40} color={Colors.success} />
                <Text style={styles.emptyText}>Estoque em dia. Nenhum alerta.</Text>
              </View>
            ) : (
              <View style={styles.alertasList}>
                {alertas.estoqueMinimo.map((r) => (
                  <AlertaItem key={`min-${r.id}`} reagente={r} tipo="estoqueMinimo" />
                ))}
                {alertas.vencendo.map((r) => (
                  <AlertaItem key={`venc-${r.id}`} reagente={r} tipo="vencendo" />
                ))}
              </View>
            )}
          </View>

          {/* Relatórios PDF */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Relatórios PDF</Text>

            {downloadError && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{downloadError}</Text>
              </View>
            )}

            {/* Relatório Geral */}
            <Card style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={[styles.reportIcon, { backgroundColor: Colors.violetDim }]}>
                  <Ionicons name="document-text-outline" size={22} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reportTitle}>Relatório Geral</Text>
                  <Text style={styles.reportDesc}>
                    Todos os reagentes e movimentações
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.downloadBtn, loadingGeral && styles.downloadBtnDisabled]}
                onPress={handleRelatorioGeral}
                disabled={loadingGeral}
                activeOpacity={0.8}
              >
                {loadingGeral ? (
                  <ActivityIndicator size="small" color={Colors.textPrimary} />
                ) : (
                  <>
                    <Ionicons name="download-outline" size={18} color={Colors.textPrimary} />
                    <Text style={styles.downloadBtnText}>Baixar PDF</Text>
                  </>
                )}
              </TouchableOpacity>
            </Card>

            {/* Relatório Semestral */}
            <Card style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={[styles.reportIcon, { backgroundColor: Colors.cyanDim }]}>
                  <Ionicons name="calendar-outline" size={22} color={Colors.cyan} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reportTitle}>Relatório Semestral</Text>
                  <Text style={styles.reportDesc}>
                    Movimentações por semestre do ano
                  </Text>
                </View>
              </View>

              <View style={styles.yearPicker}>
                {YEAR_OPTIONS.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearOption,
                      selectedYear === year && styles.yearOptionActive,
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text
                      style={[
                        styles.yearOptionText,
                        selectedYear === year && styles.yearOptionTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.downloadBtn, loadingSemestral && styles.downloadBtnDisabled]}
                onPress={handleRelatorioSemestral}
                disabled={loadingSemestral}
                activeOpacity={0.8}
              >
                {loadingSemestral ? (
                  <ActivityIndicator size="small" color={Colors.textPrimary} />
                ) : (
                  <>
                    <Ionicons name="download-outline" size={18} color={Colors.textPrimary} />
                    <Text style={styles.downloadBtnText}>Baixar PDF {selectedYear}</Text>
                  </>
                )}
              </TouchableOpacity>
            </Card>
          </View>

          <View style={{ height: Spacing.xxxl }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    flexGrow: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.25)',
  },
  errorText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.error,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  alertasList: {
    gap: Spacing.md,
  },
  alertaCard: {
    padding: Spacing.lg,
  },
  alertaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  alertaIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertaNome: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  alertaDetalhe: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  alertaTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  alertaTagText: {
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.5,
  },
  emptyAlerts: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  reportCard: {
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  reportDesc: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  yearPicker: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  yearOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  yearOptionActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: Colors.cyan,
  },
  yearOptionText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
  },
  yearOptionTextActive: {
    color: Colors.cyan,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  downloadBtnDisabled: {
    opacity: 0.5,
  },
  downloadBtnText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
});
