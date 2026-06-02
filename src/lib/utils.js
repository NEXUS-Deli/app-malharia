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
  aberta: 'bg-primary-bg text-primary',
  em_producao: 'bg-warning-bg text-warning',
  pausada: 'bg-gray-100 text-text-muted',
  finalizada: 'bg-success-bg text-success',
  entregue: 'bg-success-bg text-success',
  cancelada: 'bg-danger-bg text-danger',
  pendente: 'bg-gray-100 text-text-muted',
  em_andamento: 'bg-info-bg text-info',
  concluida: 'bg-success-bg text-success',
  pulada: 'bg-gray-100 text-text-muted',
}

export const priorityLabels = {
  baixa: 'Baixa',
  normal: 'Normal',
  alta: 'Alta',
  urgente: 'Urgente',
}

export const priorityColors = {
  baixa: 'bg-gray-100 text-text-muted',
  normal: 'bg-primary-bg text-primary',
  alta: 'bg-warning-bg text-warning',
  urgente: 'bg-danger-bg text-danger',
}

export function getDeadlineStatus(deliveryDate) {
  if (!deliveryDate) return 'normal'
  const daysDiff = Math.ceil((new Date(deliveryDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (daysDiff < 0) return 'overdue'
  if (daysDiff <= 3) return 'warning'
  return 'normal'
}

export const deadlineStyles = {
  overdue: 'text-danger',
  warning: 'text-warning',
  normal: 'text-success',
}

export const deadlineLabels = {
  overdue: 'Atrasado',
  warning: 'Próximo ao vencimento',
  normal: 'No prazo',
}
