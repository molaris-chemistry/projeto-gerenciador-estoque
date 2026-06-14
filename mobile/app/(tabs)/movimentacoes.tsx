import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
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
import {
  BorderRadius,
  Colors,
  FontSize,
  FontWeight,
  Spacing,
} from "@/constants/Colors";
import {
  createMovimentacao,
  fetchMaterias,
  fetchMovimentacoes,
  fetchReagentes,
  fetchTurmas,
} from "@/services/movimentacoes";
import type { Materia, Movimentacao, Reagente, Turma } from "@/types";

type MovementType = "ENTRADA" | "RETIRADA" | "ALL";

export default function MovimentacoesScreen() {
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

  useEffect(() => {
    const loadOptions = async () => {
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
    };

    loadOptions();
  }, []);

  const loadMovimentacoes = useCallback(async () => {
    try {
      setIsLoadingMovimentacoes(true);
      const data = await fetchMovimentacoes();
      const filtered =
        activeTab === "ALL" ? data : data.filter((m) => m.tipo === activeTab);
      setMovimentacoes(filtered);
    } catch (error) {
      console.error("Erro ao carregar movimentações:", error);
      Alert.alert("Erro", "Não foi possível carregar as movimentações");
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
        "Não foi possível registrar a movimentação. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <View style={styles.quantityContainer}>
          <Text style={styles.quantity}>{item.quantidade}</Text>
          <Text style={styles.unit}>{item.unidade}</Text>
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
      <View style={styles.header}>
        <Text style={styles.title}>Movimentações</Text>
        <Text style={styles.subtitle}>
          Registre entradas e saídas de reagentes
        </Text>
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
        <Button
          title={showForm ? "Cancelar" : "+ Adicionar Movimentação"}
          variant={showForm ? "secondary" : "primary"}
          size="md"
          onPress={() => setShowForm(!showForm)}
          style={{ flex: 1 }}
        />
      </View>

      {showForm && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
            <Card style={styles.formCard}>
              <Text style={styles.formTitle}>Nova Movimentação</Text>

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
                    label="Quantidade em grama"
                    placeholder="Digite a quantidade"
                    keyboardType="decimal-pad"
                    value={
                      isQuantidadeFocused
                        ? formData.quantidade
                        : formData.quantidade
                          ? `${formData.quantidade} g`
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

      {/* Lista de Movimentações */}
      {!showForm &&
        (isLoadingMovimentacoes && !isRefreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : movimentacoes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>
              {activeTab === "ALL"
                ? "Nenhuma movimentação registrada"
                : `Nenhuma ${activeTab === "ENTRADA" ? "entrada" : "retirada"
                } registrada`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={movimentacoes}
            renderItem={renderMovimentacaoItem}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={true}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={Colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        ))}
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
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
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  movimentacaoCard: {
    marginBottom: 0,
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
});
