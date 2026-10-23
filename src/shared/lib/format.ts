export function formatNumber(value: number, language: string): string {
  return new Intl.NumberFormat(language, { maximumFractionDigits: 0 }).format(value);
}

export function formatDate(value: string | Date, language: string): string {
  return new Intl.DateTimeFormat(language, { dateStyle: 'medium' }).format(new Date(value));
}

export function formatPercent(ratio: number, language: string): string {
  return new Intl.NumberFormat(language, {
    style: 'percent',
    maximumFractionDigits: ratio < 0.1 ? 2 : 1,
  }).format(ratio);
}

export function formatCompact(value: number, language: string): string {
  return new Intl.NumberFormat(language, { notation: 'compact' }).format(value);
}

export function formatShortDate(value: string, language: string): string {
  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function formatTime(value: number | Date, language: string): string {
  return new Intl.DateTimeFormat(language, { timeStyle: 'short' }).format(value);
}
