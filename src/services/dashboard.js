import { supabase } from '../lib/supabase'

export const dashboardService = {
  async getMetrics() {
    const now = new Date().toISOString()

    const { count: openCount } = await supabase
      .from('production_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'aberta')

    const { count: inProductionCount } = await supabase
      .from('production_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'em_producao')

    const { count: finishedCount } = await supabase
      .from('production_orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['finalizada', 'entregue'])

    const { count: delayedCount } = await supabase
      .from('production_orders')
      .select('*', { count: 'exact', head: true })
      .lt('delivery_date', now)
      .not('status', 'in', ['finalizada', 'entregue', 'cancelada'])

    return {
      open: openCount || 0,
      inProduction: inProductionCount || 0,
      finished: finishedCount || 0,
      delayed: delayedCount || 0,
    }
  },

  async getProductionByStage() {
    const { data: stages } = await supabase
      .from('production_stages')
      .select('*')
      .order('position')

    if (!stages) return []

    const result = []
    for (const stage of stages) {
      const { count } = await supabase
        .from('production_orders')
        .select('*', { count: 'exact', head: true })
        .eq('current_stage', stage.name)
        .in('status', ['aberta', 'em_producao', 'pausada'])

      result.push({ name: stage.name, value: count || 0 })
    }

    return result
  },

  async getLatestOrders(limit = 5) {
    const { data, error } = await supabase
      .from('production_orders')
      .select('*, clients(name), products(name)')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  },
}
