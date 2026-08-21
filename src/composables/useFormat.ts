export function formatPrice(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

export function formatDate(value?: string): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function useFormat() {
  return { formatPrice, formatDate }
}
