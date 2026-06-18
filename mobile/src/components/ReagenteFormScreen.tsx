import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Input } from '@/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useReagenteForm } from '@/hooks/useReagenteForm';
import type { ReagenteFormValues } from '@/hooks/useReagenteForm';
import type { ReagentePayload } from '@/types';

type ReagenteFormScreenProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  initialValues?: Partial<ReagenteFormValues>;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: ReagentePayload) => Promise<void>;
};

export function ReagenteFormScreen({
  title,
  subtitle,
  submitLabel,
  initialValues,
  isSubmitting,
  onCancel,
  onSubmit,
}: ReagenteFormScreenProps) {
  const { values, errors, setField, validate } = useReagenteForm(initialValues);

  const handleSubmit = async () => {
    const payload = validate();
    if (!payload) return;
    await onSubmit(payload);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <Card style={styles.card}>
            <Input
              label="Nome"
              placeholder="Ex.: Ácido clorídrico"
              value={values.nome}
              onChangeText={(text) => setField('nome', text)}
              error={errors.nome}
              autoCapitalize="sentences"
            />

            <Input
              label="Quantidade"
              placeholder="0"
              keyboardType="decimal-pad"
              value={values.quantidade}
              onChangeText={(text) => setField('quantidade', text.replace(',', '.'))}
              error={errors.quantidade}
            />

            <Input
              label="Unidade"
              placeholder="g, mL, L, un..."
              value={values.unidade}
              onChangeText={(text) => setField('unidade', text)}
              error={errors.unidade}
              autoCapitalize="none"
            />

            <Input
              label="Data de validade (opcional)"
              placeholder="AAAA-MM-DD"
              value={values.dataValidade}
              onChangeText={(text) => setField('dataValidade', text)}
              error={errors.dataValidade}
              autoCapitalize="none"
            />

            <Input
              label="Quantidade mínima (opcional)"
              placeholder="0"
              keyboardType="decimal-pad"
              value={values.quantidadeMinima}
              onChangeText={(text) => setField('quantidadeMinima', text.replace(',', '.'))}
              error={errors.quantidadeMinima}
            />

            <Button
              title={submitLabel}
              variant="primary"
              size="lg"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxxl,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});
