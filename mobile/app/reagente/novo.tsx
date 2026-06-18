import { useState } from 'react';
import { Alert } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import axios from 'axios';
import { ReagenteFormScreen } from '@/components/ReagenteFormScreen';
import { useAuth } from '@/contexts/AuthContext';
import { getApiErrorMessage } from '@/services/api';
import { createReagente } from '@/services/reagentes';
import type { ReagentePayload } from '@/types';

export default function NovoReagenteScreen() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && !isAdmin) {
    return <Redirect href="/" />;
  }

  const handleSubmit = async (payload: ReagentePayload) => {
    try {
      setIsSubmitting(true);
      const created = await createReagente(payload);
      Alert.alert('Sucesso', 'Reagente cadastrado com sucesso');
      router.replace(`/reagente/${created.id}`);
    } catch (error) {
      const message = axios.isAxiosError(error) && error.response?.status === 409
        ? 'Já existe um reagente com este nome.'
        : getApiErrorMessage(error, 'Não foi possível cadastrar o reagente.');
      Alert.alert('Erro', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReagenteFormScreen
      title="Novo Reagente"
      subtitle="Cadastre um reagente no estoque"
      submitLabel="Cadastrar"
      isSubmitting={isSubmitting}
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
