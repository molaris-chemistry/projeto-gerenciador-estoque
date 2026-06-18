import { useCallback, useMemo, useState } from 'react';
import type { Reagente, ReagentePayload } from '@/types';

export type ReagenteFormValues = {
  nome: string;
  quantidade: string;
  unidade: string;
  dataValidade: string;
  quantidadeMinima: string;
};

const EMPTY_VALUES: ReagenteFormValues = {
  nome: '',
  quantidade: '',
  unidade: 'g',
  dataValidade: '',
  quantidadeMinima: '',
};

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = parseFloat(trimmed.replace(',', '.'));
  return Number.isNaN(parsed) ? null : parsed;
}

function isValidDateISO(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
}

export function reagenteToFormValues(reagente: Reagente): ReagenteFormValues {
  return {
    nome: reagente.nome,
    quantidade: String(reagente.quantidade),
    unidade: reagente.unidade,
    dataValidade: reagente.dataValidade ?? '',
    quantidadeMinima:
      reagente.quantidadeMinima != null ? String(reagente.quantidadeMinima) : '',
  };
}

export function useReagenteForm(initial?: Partial<ReagenteFormValues>) {
  const [values, setValues] = useState<ReagenteFormValues>({
    ...EMPTY_VALUES,
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = useCallback(
    (field: keyof ReagenteFormValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const validate = useCallback((): ReagentePayload | null => {
    const nextErrors: Record<string, string> = {};

    if (!values.nome.trim()) {
      nextErrors.nome = 'Nome é obrigatório';
    }

    if (!values.quantidade.trim()) {
      nextErrors.quantidade = 'Quantidade é obrigatória';
    } else {
      const quantidade = parseFloat(values.quantidade.replace(',', '.'));
      if (Number.isNaN(quantidade) || quantidade < 0) {
        nextErrors.quantidade = 'Quantidade deve ser zero ou maior';
      }
    }

    if (!values.unidade.trim()) {
      nextErrors.unidade = 'Unidade é obrigatória';
    }

    if (values.dataValidade.trim() && !isValidDateISO(values.dataValidade.trim())) {
      nextErrors.dataValidade = 'Use o formato AAAA-MM-DD';
    }

    if (values.quantidadeMinima.trim()) {
      const min = parseOptionalNumber(values.quantidadeMinima);
      if (min == null || min < 0) {
        nextErrors.quantidadeMinima = 'Quantidade mínima inválida';
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return null;

    const quantidade = parseFloat(values.quantidade.replace(',', '.'));
    const quantidadeMinima = parseOptionalNumber(values.quantidadeMinima);
    const dataValidade = values.dataValidade.trim() || null;

    return {
      nome: values.nome.trim(),
      quantidade,
      unidade: values.unidade.trim(),
      dataValidade,
      quantidadeMinima,
    };
  }, [values]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return {
    values,
    errors,
    setField,
    validate,
    isValid,
    setErrors,
  };
}
