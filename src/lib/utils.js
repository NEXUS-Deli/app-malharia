import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export function formatDateInput(date) {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

export const statusLabels = {
  aberta: 'Aberta',
  em_producao: 'Em Produção',
  pausada: 'Pausada',
  finalizada: 'Finalizada',
  entregue: 'Entregue',
  cancelada: 'Cancelada',
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  concluida: 'Concluída',
  pulada: 'Pulada',
}

export const statusColors = {
  aberta: 'bg-blue-100 text-blue-800',
  em_producao: 'bg-yellow-100 text-yellow-800',
  pausada: 'bg-gray-100 text-gray-800',
  finalizada: 'bg-green-100 text-green-800',
  entregue: 'bg-emerald-100 text-emerald-800',
  cancelada: 'bg-red-100 text-red-800',
  pendente: 'bg-gray-100 text-gray-600',
  em_andamento: 'bg-blue-100 text-blue-800',
  concluida: 'bg-green-100 text-green-800',
  pulada: 'bg-purple-100 text-purple-800',
}

export const priorityLabels = {
  baixa: 'Baixa',
  normal: 'Normal',
  alta: 'Alta',
  urgente: 'Urgente',
}

export const priorityColors = {
  baixa: 'bg-gray-100 text-gray-600',
  normal: 'bg-blue-100 text-blue-800',
  alta: 'bg-yellow-100 text-yellow-800',
  urgente: 'bg-red-100 text-red-800',
}
