import { supabase } from '../lib/supabase'

export const clientsService = {
  async list({ page = 1, pageSize = 25, search = '' } = {}) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('clients').select('*', { count: 'exact' })
    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,whatsapp.ilike.%${search}%,email.ilike.%${search}%,city.ilike.%${search}%`)
    }
    query = query.order('name').range(from, to)

    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], count: count || 0 }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(client) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('clients')
      .insert({ ...client, created_by: user.id })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, client) {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async search(query) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')
    if (error) throw error
    return data
  },
}
