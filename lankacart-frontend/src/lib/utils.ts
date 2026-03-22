export const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ')

// Handle both ISO string and LocalDateTime array from Spring Boot
export const parseDate = (val: string | number[] | undefined | null): Date | null => {
  if (!val) return null
  if (Array.isArray(val)) {
    return new Date(val[0], val[1] - 1, val[2], val[3] ?? 0, val[4] ?? 0, val[5] ?? 0)
  }
  return new Date(val)
}

export const formatDate = (val: string | number[] | undefined | null): string => {
  const d = parseDate(val)
  if (!d) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatDateTime = (val: string | number[] | undefined | null): string => {
  const d = parseDate(val)
  if (!d) return '—'
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return 'LKR —'
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 2,
  }).format(amount)
}

export const orderStatusColor: Record<string, string> = {
  PENDING:   'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED:   'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-brand-100 text-brand-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export const inventoryStatusColor: Record<string, string> = {
  IN_STOCK:     'bg-brand-100 text-brand-800',
  LOW_STOCK:    'bg-amber-100 text-amber-800',
  OUT_OF_STOCK: 'bg-red-100 text-red-800',
}

export const truncate = (str: string | undefined, len = 60): string => {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}
