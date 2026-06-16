import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui";
import {
  Radius as BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "@/constants/theme";

const FontSize = Typography.size;
const FontWeight = Typography.weight;
import { useDashboard } from "@/contexts/DashboardContext";
import type { Reagente } from "@/types";

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  color: string;
};

function StatCard({ icon, label, value, color }: StatCardProps) {
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
  if (!iso) return "—";
  const [datePart] = iso.split("T");
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

type AlertaItemProps = {
  reagente: Reagente;
  tipo: "vencendo" | "estoqueMinimo";
};

function AlertaItem({ reagente, tipo }: AlertaItemProps) {
  const isVencendo = tipo === "vencendo";
  const color = isVencendo ? Colors.warning : Colors.error;
  const icon = isVencendo ? "time-outline" : "alert-circle-outline";

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
                  ? ` • mínimo ${reagente.quantidadeMinima} ${reagente.unidade}`
                  : "")}
          </Text>
        </View>
        <View style={[styles.alertaTag, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.alertaTagText, { color }]}>
            {isVencendo ? "VENCENDO" : "ESTOQUE BAIXO"}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export default function DashboardScreen() {
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

  const semAlertas = totalAlertas === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Visão geral do estoque</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
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
          {/* Cards de estatísticas */}
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
              <Ionicons
                name="cloud-offline-outline"
                size={16}
                color={Colors.error}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Lista de alertas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alertas</Text>

            {semAlertas ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={40}
                  color={Colors.success}
                />
                <Text style={styles.emptyText}>
                  Nenhum alerta no momento. Estoque em dia!
                </Text>
              </View>
            ) : (
              <View style={{ gap: Spacing.md }}>
                {alertas.estoqueMinimo.map((r) => (
                  <AlertaItem
                    key={`min-${r.id}`}
                    reagente={r}
                    tipo="estoqueMinimo"
                  />
                ))}
                {alertas.vencendo.map((r) => (
                  <AlertaItem
                    key={`venc-${r.id}`}
                    reagente={r}
                    tipo="vencendo"
                  />
                ))}
              </View>
            )}
          </View>
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
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 15,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.25)",
  },
  errorText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  alertaCard: {
    padding: Spacing.lg,
  },
  alertaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  alertaIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  alertaNome: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  alertaDetalhe: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  alertaTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  alertaTagText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
