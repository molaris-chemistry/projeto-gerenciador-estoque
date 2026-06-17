const UNIT_CONVERSIONS: Record<string, { threshold: number; toUnit: string; factor: number }> = {
  g: { threshold: 1000, toUnit: 'kg', factor: 0.001 },
  mL: { threshold: 1000, toUnit: 'L', factor: 0.001 },
  mg: { threshold: 1000, toUnit: 'g', factor: 0.001 },
};

export function formatQuantidade(quantidade: number, unidade: string): string {
  const conversion = UNIT_CONVERSIONS[unidade];
  if (conversion && quantidade >= conversion.threshold) {
    const converted = quantidade * conversion.factor;
    return `${converted.toFixed(2)} ${conversion.toUnit}`;
  }
  const fixed = parseFloat(quantidade.toFixed(3));
  const display = fixed % 1 === 0 ? fixed.toFixed(0) : fixed.toFixed(2);
  return `${display} ${unidade}`;
}

export function parseLocalDateTime(dateStr: string): Date {
  if (!dateStr) return new Date(0);
  const normalized = dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`;
  return new Date(normalized);
}

export function formatDataMovimentacao(dateStr: string): string {
  if (!dateStr) return '—';
  const date = parseLocalDateTime(dateStr);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}` +
    ` às ${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export function getRelativeTime(dateStr: string): string {
  if (!dateStr) return '—';
  const date = parseLocalDateTime(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'agora mesmo';
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays === 1) return 'ontem';
  if (diffDays < 30) return `há ${diffDays} dias`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `há ${diffMonths} mês${diffMonths > 1 ? 'es' : ''}`;
  const diffYears = Math.floor(diffDays / 365);
  return `há ${diffYears} ano${diffYears > 1 ? 's' : ''}`;
}

const DEFAULT_LOW_STOCK_THRESHOLD = 5.0;

export function isLowStock(
  quantidade: number,
  threshold: number = DEFAULT_LOW_STOCK_THRESHOLD,
): boolean {
  return quantidade <= threshold;
}

export function isExpiringSoon(dataValidade?: string, daysAhead: number = 90): boolean {
  if (!dataValidade) return false;
  const expiry = new Date(dataValidade);
  const now = new Date();
  const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= daysAhead; // expired or expiring within daysAhead days
}

export function toPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function formatNumberBR(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
