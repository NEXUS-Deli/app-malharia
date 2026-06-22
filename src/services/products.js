import { supabase } from '../lib/supabase'

export const productsService = {
  async list({ page = 1, pageSize = 25, search = '' } = {}) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('products').select('*', { count: 'exact' })
    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,category.ilike.%${search}%`)
    }
    query = query.order('name').range(from, to)

    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], count: count || 0 }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(product) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, created_by: user.id })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, product) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
