import { useEffect, useState, useCallback } from 'react'
import { History, FileText, Table } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { cn, formatDate } from '../lib/utils'
import { reportsService } from '../services/reports'
import { Button } from '../components/ui/button'

function exportCSV(data, headers, filename) {
  const headerRow = headers.map(h => `"${h.label}"`).join(',')
  const rows = data.map(row =>
    headers.map(h => `"${String(h.accessor(row) ?? '')}"`).join(',')
  )
  const csv = [headerRow, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function exportPrint() {
  window.print()
}

export function Reports() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await reportsService.getFullHistory()
      setData(result || [])
    } catch (err) {
      toast.error(`Erro ao carregar: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleExportCSV = () => {
    const headers = [
      { label: 'Data', accessor: r => formatDate(r.created_at) },
      { label: 'OS', accessor: r => r.production_orders?.order_number || '' },
      { label: 'Usuário', accessor: r => r.profiles?.name || '' },
      { label: 'Ação', accessor: r => r.action },
      { label: 'Descrição', accessor: r => r.description || '' },
    ]
    exportCSV(data, headers, 'historico-completo')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Histórico</h1>
          <p className="text-sm text-text-muted mt-1">Relatórios e análises da produção</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportPrint}>
            <FileText size={16} /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Table size={16} /> CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm text-text-muted">Carregando histórico...</p>
          </div>
        </div>
      ) : data.length > 0 ? (
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-text-muted">Data</th>
                  <th className="text-left py-3 px-2 font-medium text-text-muted">OS</th>
                  <th className="text-left py-3 px-2 font-medium text-text-muted">Usuário</th>
                  <th className="text-left py-3 px-2 font-medium text-text-muted">Ação</th>
                  <th className="text-left py-3 px-2 font-medium text-text-muted">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {data.map(h => (
                  <tr key={h.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 text-text-secondary whitespace-nowrap">{formatDate(h.created_at)}</td>
                    <td className="py-3 px-2 text-text-primary font-medium">{h.production_orders?.order_number || '—'}</td>
                    <td className="py-3 px-2 text-text-primary">{h.profiles?.name || '—'}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline">{h.action}</Badge>
                    </td>
                    <td className="py-3 px-2 text-text-secondary max-w-xs truncate">{h.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-text-muted py-8 text-center">Nenhum histórico disponível.</p>
      )}
    </div>
  )
}
