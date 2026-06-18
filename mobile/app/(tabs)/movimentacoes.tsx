import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Input, Picker } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { scrollableListStyle, scrollableScreen } from "@/constants/layout";
import { getApiErrorMessage } from "@/services/api";
import { confirmDestructive } from "@/utils/confirm";
import {
  Radius as BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "@/constants/theme";

const FontSize = Typography.size;
const FontWeight = Typography.weight;
import {
  createMovimentacao,
  deleteMovimentacao,
  fetchMaterias,
  fetchMovimentacoes,
  fetchReagentes,
  fetchTurmas,
} from "@/services/movimentacoes";
import type { Materia, Movimentacao, Reagente, Turma } from "@/types";

type MovementType = "ENTRADA" | "RETIRADA" | "ALL";

export default function MovimentacoesScreen() {
  const { isAdmin, isTeacher } = useAuth();
  const canRegister = isAdmin || isTeacher;
  const [activeTab, setActiveTab] = useState<MovementType>("ALL");

  const [formData, setFormData] = useState({
    tipo: "" as "ENTRADA" | "RETIRADA" | "",
    reagenteId: "",
    quantidade: "",
    materiaId: "",
    turmaId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isQuantidadeFocused, setIsQuantidadeFocused] = useState(false);

  const [reagentes, setReagentes] = useState<Reagente[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [isLoadingMovimentacoes, setIsLoadingMovimentacoes] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedReagente = reagentes.find((r) => String(r.id) === formData.reagenteId);
  const selectedUnit = selectedReagente ? selectedReagente.unidade : "";

  const loadOptions = useCallback(async () => {
    try {
      setIsLoadingOptions(true);
      const [reagentesData, materiasData, turmasData] = await Promise.all([
        fetchReagentes(),
        fetchMaterias(),
        fetchTurmas(),
      ]);
      setReagentes(reagentesData);
      setMaterias(materiasData);
      setTurmas(turmasData);
    } catch (error) {
      console.error("Erro ao carregar opções:", error);
      Alert.alert("Erro", "Não foi possível carregar as opções");
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadOptions();
    }, [loadOptions]),
  );

  const handleOpenForm = useCallback(async () => {
    await loadOptions();
    setShowForm(true);
  }, [loadOptions]);

  const loadMovimentacoes = useCallback(async () => {
    try {
      setIsLoadingMovimentacoes(true);
      const data = await fetchMovimentacoes();
      const filtered =
        activeTab === "ALL" ? data : data.filter((m) => m.tipo === activeTab);
      setMovimentacoes(filtered);
    } catch (error) {
      console.error("Erro ao carregar movimentações:", error);
      Alert.alert(
        "Erro",
        getApiErrorMessage(error, "Não foi possível carregar as movimentações"),
      );
    } finally {
      setIsLoadingMovimentacoes(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadMovimentacoes();
  }, [loadMovimentacoes]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMovimentacoes();
    setIsRefreshing(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tipo) newErrors.tipo = "Tipo é obrigatório";
    if (!formData.reagenteId) newErrors.reagenteId = "Reagente é obrigatório";
    if (!formData.quantidade) newErrors.quantidade = "Quantidade é obrigatória";
    else if (
      Number.isNaN(parseFloat(formData.quantidade)) ||
      parseFloat(formData.quantidade) <= 0
    )
      newErrors.quantidade = "Quantidade deve ser um número positivo";
    if (!formData.materiaId) newErrors.materiaId = "Matéria é obrigatória";
    if (!formData.turmaId) newErrors.turmaId = "Turma é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        tipo: formData.tipo as "ENTRADA" | "RETIRADA",
        reagenteId: parseInt(formData.reagenteId, 10),
        quantidade: parseFloat(formData.quantidade),
        materiaId: parseInt(formData.materiaId, 10),
        turmaId: parseInt(formData.turmaId, 10),
      };

      await createMovimentacao(payload);
      Alert.alert("Sucesso", "Movimentação registrada com sucesso");
      setFormData({
        tipo: "",
        reagenteId: "",
        quantidade: "",
        materiaId: "",
        turmaId: "",
      });
      setShowForm(false);
      setErrors({});
      await loadMovimentacoes();
    } catch (error) {
      console.error("Erro ao criar movimentação:", error);
      Alert.alert(
        "Erro",
        getApiErrorMessage(error, "Não foi possível registrar a movimentação. Tente novamente."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMovimentacao = useCallback(
    (item: Movimentacao) => {
      confirmDestructive({
        title: "Excluir movimentação",
        message: `Deseja excluir a movimentação de "${item.reagenteNome}"? O estoque será revertido.`,
        onConfirm: async () => {
          try {
            await deleteMovimentacao(item.id);
            Alert.alert("Sucesso", "Movimentação excluída");
            await loadMovimentacoes();
          } catch (error) {
            Alert.alert(
              "Erro",
              getApiErrorMessage(error, "Não foi possível excluir a movimentação"),
            );
          }
        },
      });
    },
    [loadMovimentacoes],
  );

  const getTypeColor = (tipo: "ENTRADA" | "RETIRADA") => {
    return tipo === "ENTRADA" ? Colors.success : Colors.error;
  };

  const getTypeIcon = (tipo: "ENTRADA" | "RETIRADA") => {
    return tipo === "ENTRADA" ? "arrow-down-circle" : "arrow-up-circle";
  };

  const renderMovimentacaoItem = ({ item }: { item: Movimentacao }) => (
    <Card style={styles.movimentacaoCard}>
      <View style={styles.movimentacaoHeader}>
        <View style={styles.movimentacaoTitleContainer}>
          <View
            style={[
              styles.typeIconContainer,
              {
                backgroundColor: `${getTypeColor(item.tipo)}20`,
              },
            ]}
          >
            <Ionicons
              name={getTypeIcon(item.tipo)}
              size={20}
              color={getTypeColor(item.tipo)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.reagenteName}>{item.reagenteNome}</Text>
            <Text style={styles.materiaTurma}>
              {item.materia} • {item.turma}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantity}>{item.quantidade}</Text>
            <Text style={styles.unit}>{item.unidade}</Text>
          </View>
          {isAdmin && (
            <TouchableOpacity
              onPress={() => handleDeleteMovimentacao(item)}
              hitSlop={8}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.movimentacaoFooter}>
        <View style={styles.typeTag}>
          <Text
            style={[styles.typeTagText, { color: getTypeColor(item.tipo) }]}
          >
            {item.tipo}
          </Text>
        </View>
        <Text style={styles.date}>
          {new Date(item.data).toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!showForm || !canRegister ? (
        <>
          {/* Lista de Movimentações */}
          {isLoadingMovimentacoes && !isRefreshing ? (
            <View style={{ flex: 1 }}>
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Text style={styles.title}>Movimentações</Text>
                </View>
                <Text style={styles.subtitle}>Registre e acompanhe as entradas e saídas</Text>
              </View>
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            </View>
          ) : (
            <FlatList
              style={scrollableListStyle}
              data={movimentacoes}
              renderItem={renderMovimentacaoItem}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.listContainer}
              nestedScrollEnabled
              ListHeaderComponent={
                <View>
                  <View style={styles.header}>
                    <View style={styles.headerTitleRow}>
                      <Text style={styles.title}>Movimentações</Text>
                    </View>
                    <Text style={styles.subtitle}>Registre e acompanhe as entradas e saídas</Text>
                  </View>

                  <View style={styles.filterTabs}>
                    {(["ALL", "ENTRADA", "RETIRADA"] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.filterTab,
                          activeTab === type && styles.filterTabActive,
                        ]}
                        onPress={() => setActiveTab(type)}
                      >
                        <Text
                          style={[
                            styles.filterTabText,
                            activeTab === type && styles.filterTabTextActive,
                          ]}
                        >
                          {type === "ALL" ? "Todas" : type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.actionBar}>
                    {canRegister && (
                      <Button
                        title="+ Registrar Movimentação"
                        variant="primary"
                        size="md"
                        onPress={handleOpenForm}
                        style={{ flex: 1 }}
                      />
                    )}
                  </View>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>📋</Text>
                  <Text style={styles.emptyText}>
                    {activeTab === "ALL"
                      ? "Nenhuma movimentação registrada"
                      : `Nenhuma ${activeTab === "ENTRADA" ? "entrada" : "retirada"} registrada`}
                  </Text>
                </View>
              }
              refreshControl={
                Platform.OS === 'web' ? undefined : (
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    tintColor={Colors.primary}
                  />
                )
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.formContainer}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: Spacing.xxxl }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <Text style={styles.title}>Nova Movimentação</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowForm(false);
                    setErrors({});
                    setFormData({
                      tipo: "",
                      reagenteId: "",
                      quantidade: "",
                      materiaId: "",
                      turmaId: "",
                    });
                  }}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>Preencha os campos abaixo para registrar</Text>
            </View>

            <Card style={styles.formCard}>
              {isLoadingOptions ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              ) : (
                <>
                  <Picker
                    label="Tipo de Movimentação"
                    placeholder="Selecionar tipo"
                    options={[
                      { id: "ENTRADA", label: "🟢 Entrada" },
                      { id: "RETIRADA", label: "🔴 Retirada" },
                    ]}
                    selectedValue={formData.tipo}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        tipo: value as "ENTRADA" | "RETIRADA",
                      })
                    }
                    error={errors.tipo}
                  />

                  <Picker
                    label="Reagente"
                    placeholder="Selecionar reagente"
                    options={reagentes.map((r) => ({
                      id: r.id,
                      label: `${r.nome} (${r.unidade})`,
                    }))}
                    selectedValue={
                      formData.reagenteId
                        ? parseInt(formData.reagenteId, 10)
                        : undefined
                    }
                    onValueChange={(value) =>
                      setFormData({ ...formData, reagenteId: String(value) })
                    }
                    error={errors.reagenteId}
                  />

                  {/* Quantidade */}
                  <Input
                    label={selectedUnit ? `Quantidade (${selectedUnit})` : "Quantidade"}
                    placeholder="Digite a quantidade"
                    keyboardType="decimal-pad"
                    value={
                      isQuantidadeFocused
                        ? formData.quantidade
                        : formData.quantidade
                          ? `${formData.quantidade} ${selectedUnit || "g"}`
                          : ""
                    }
                    onFocus={() => setIsQuantidadeFocused(true)}
                    onBlur={() => setIsQuantidadeFocused(false)}
                    onChangeText={(text) => {
                      let cleaned = text.replace(",", ".");
                      cleaned = cleaned.replace(/[^0-9.]/g, "");
                      const parts = cleaned.split(".");
                      if (parts.length > 2) {
                        cleaned = parts[0] + "." + parts.slice(1).join("");
                      }
                      setFormData({ ...formData, quantidade: cleaned });
                    }}
                    error={errors.quantidade}
                  />

                  {/* Matéria */}
                  <Picker
                    label="Matéria"
                    placeholder="Selecionar matéria"
                    options={materias.map((m) => ({
                      id: m.id,
                      label: m.nome,
                    }))}
                    selectedValue={
                      formData.materiaId
                        ? parseInt(formData.materiaId, 10)
                        : undefined
                    }
                    onValueChange={(value) =>
                      setFormData({ ...formData, materiaId: String(value) })
                    }
                    error={errors.materiaId}
                  />

                  {/* Turma */}
                  <Picker
                    label="Turma"
                    placeholder="Selecionar turma"
                    options={turmas.map((t) => ({
                      id: t.id,
                      label: `${t.sala} - ${t.nome}`,
                    }))}
                    selectedValue={
                      formData.turmaId
                        ? parseInt(formData.turmaId, 10)
                        : undefined
                    }
                    onValueChange={(value) =>
                      setFormData({ ...formData, turmaId: String(value) })
                    }
                    error={errors.turmaId}
                  />

                  {/* Botão Submit */}
                  <Button
                    title="Registrar Movimentação"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    onPress={handleSubmit}
                    style={styles.submitButton}
                  />
                </>
              )}
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...scrollableScreen,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  filterTabActive: {
    backgroundColor: "rgba(108, 99, 255, 0.2)",
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.primary,
  },
  actionBar: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    gap: Spacing.md,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  formCard: {
    marginBottom: Spacing.xl,
  },
  formTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  movimentacaoCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  movimentacaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  movimentacaoTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  reagenteName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  materiaTurma: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  quantityContainer: {
    alignItems: "flex-end",
  },
  quantity: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  unit: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  movimentacaoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  typeTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(108, 99, 255, 0.1)",
  },
  typeTagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
  },
});
