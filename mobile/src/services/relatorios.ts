import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import api, { BASE_URL, getAuthToken } from './api';

async function downloadPdfWeb(endpoint: string, filename: string): Promise<void> {
  const response = await api.get(`/relatorios/${endpoint}`, {
    responseType: 'blob',
    headers: {
      Accept: 'application/pdf, application/octet-stream, */*',
    },
  });
  const blob = response.data as Blob;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function downloadPdfNative(endpoint: string, filename: string): Promise<void> {
  const token = getAuthToken();
  const url = `${BASE_URL}/relatorios/${endpoint}`;
  const fileUri = (FileSystem.cacheDirectory ?? '') + filename;

  const result = await FileSystem.downloadAsync(url, fileUri, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (result.status !== 200) {
    throw new Error(`Erro ao baixar relatório (status ${result.status})`);
  }

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Compartilhamento não disponível neste dispositivo');
  }

  await Sharing.shareAsync(result.uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Abrir relatório',
    UTI: 'com.adobe.pdf',
  });
}

async function downloadPdf(endpoint: string, filename: string): Promise<void> {
  if (Platform.OS === 'web') {
    await downloadPdfWeb(endpoint, filename);
    return;
  }
  await downloadPdfNative(endpoint, filename);
}

export async function downloadRelatorioGeral(): Promise<void> {
  await downloadPdf('geral', 'relatorio_geral.pdf');
}

export async function downloadRelatorioSemestral(ano: number): Promise<void> {
  await downloadPdf(`semestral/${ano}`, `relatorio_semestral_${ano}.pdf`);
}
