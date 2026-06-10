import { supabase } from '../lib/supabase'

async function getCompanyFilter() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, role')
    .eq('id', user.id)
    .single()

  if (!profile) return null
  if (profile.role === 'super_admin') return null
  return profile.company_id
}

export const dashboardService = {
  async getMetrics() {
    const now = new Date().toISOString()
    const companyId = await getCompanyFilter()

    const buildQuery = (q) => {
      if (companyId) q = q.eq('company_id', companyId)
      return q
    }

    const [{ count: openCount }, { count: inProductionCount }, { count: finishedCount }] = await Promise.all([
      buildQuery(supabase.from('production_orders').select('*', { count: 'exact', head: true })).eq('status', 'aberta'),
      buildQuery(supabase.from('production_orders').select('*', { count: 'exact', head: true })).eq('status', 'em_producao'),
      buildQuery(supabase.from('production_orders').select('*', { count: 'exact', head: true })).in('status', ['finalizada', 'entregue']),
    ])

    let delayedQuery = supabase
      .from('production_orders')
      .select('*', { count: 'exact', head: true })
      .lt('delivery_date', now)
      .filter('status', 'not.in', '(finalizada,entregue,cancelada)')
    if (companyId) delayedQuery = delayedQuery.eq('company_id', companyId)
    const { count: delayedCount } = await delayedQuery

    let monthQuery = supabase
      .from('production_orders')
      .select('total_price, entry_amount, payment_status')
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    if (companyId) monthQuery = monthQuery.eq('company_id', companyId)
    const { data: monthOrders } = await monthQuery

    const totalMonthValue = monthOrders?.reduce((s, o) => s + Number(o.total_price || 0), 0) || 0
    const totalReceived = monthOrders?.reduce((s, o) => s + Number(o.entry_amount || 0), 0) || 0
    const totalPending = monthOrders?.filter(o => o.payment_status !== 'pago').reduce((s, o) => s + Number(o.remaining_amount || 0), 0) || 0

    return {
      open: openCount || 0,
      inProduction: inProductionCount || 0,
      finished: finishedCount || 0,
      delayed: delayedCount || 0,
      monthValue: totalMonthValue,
      totalReceived,
      totalPending,
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
      let query = supabase
        .from('production_orders')
        .select('*', { count: 'exact', head: true })
        .eq('current_stage', stage.name)
        .in('status', ['aberta', 'em_producao', 'pausada'])

      const companyId = await getCompanyFilter()
      if (companyId) query = query.eq('company_id', companyId)

      const { count } = await query
      result.push({ name: stage.name, value: count || 0 })
    }

    return result
  },

  async getLatestOrders(limit = 5) {
    let query = supabase
      .from('production_orders')
      .select('*, clients(name), products(name)')
      .order('created_at', { ascending: false })
      .limit(limit)

    const companyId = await getCompanyFilter()
    if (companyId) query = query.eq('company_id', companyId)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getUpcomingDeadlines(limit = 5) {
    const now = new Date().toISOString()
    const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()

    let query = supabase
      .from('production_orders')
      .select('*, clients(name), products(name)')
      .gte('delivery_date', now)
      .lte('delivery_date', threeDaysLater)
      .filter('status', 'not.in', '(finalizada,entregue,cancelada)')
      .order('delivery_date', { ascending: true })
      .limit(limit)

    const companyId = await getCompanyFilter()
    if (companyId) query = query.eq('company_id', companyId)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getDelayedOrders(limit = 5) {
    const now = new Date().toISOString()

    let query = supabase
      .from('production_orders')
      .select('*, clients(name), products(name)')
      .lt('delivery_date', now)
      .filter('status', 'not.in', '(finalizada,entregue,cancelada)')
      .order('delivery_date', { ascending: true })
      .limit(limit)

    const companyId = await getCompanyFilter()
    if (companyId) query = query.eq('company_id', companyId)

    const { data, error } = await query
    if (error) throw error
    return data
  },
}
