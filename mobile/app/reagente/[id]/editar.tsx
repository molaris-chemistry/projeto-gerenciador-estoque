import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { ReagenteFormScreen } from '@/components/ReagenteFormScreen';
import { useAuth } from '@/contexts/AuthContext';
import { reagenteToFormValues } from '@/hooks/useReagenteForm';
import { getApiErrorMessage } from '@/services/api';
import { fetchReagenteById, updateReagente } from '@/services/reagentes';
import { Colors } from '@/constants/theme';
import type { Reagente, ReagentePayload } from '@/types';

export default function EditarReagenteScreen() {
  const router = useRouter();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const reagenteId = Number(id);

  const [reagente, setReagente] = useState<Reagente | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!reagenteId || Number.isNaN(reagenteId)) {
      setLoading(false);
      return;
    }

    fetchReagenteById(reagenteId)
      .then(setReagente)
      .catch(() => setReagente(null))
      .finally(() => setLoading(false));
  }, [reagenteId]);

  if (!authLoading && !isAdmin) {
    return <Redirect href="/" />;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!reagente) {
    return <Redirect href="/" />;
  }

  const handleSubmit = async (payload: ReagentePayload) => {
    try {
      setIsSubmitting(true);
      await updateReagente(reagenteId, payload);
      Alert.alert('Sucesso', 'Reagente atualizado com sucesso');
      router.replace(`/reagente/${reagenteId}`);
    } catch (error) {
      Alert.alert(
        'Erro',
        getApiErrorMessage(error, 'Não foi possível atualizar o reagente.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReagenteFormScreen
      title="Editar Reagente"
      subtitle={reagente.nome}
      submitLabel="Salvar alterações"
      initialValues={reagenteToFormValues(reagente)}
      isSubmitting={isSubmitting}
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
