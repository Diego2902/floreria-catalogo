// Utilidades compartidas por los módulos del panel admin

export function formatMoney(n) {
  const num = Number(n || 0)
  return `S/ ${num.toFixed(2)}`
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}