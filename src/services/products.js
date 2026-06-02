import { supabase } from '../lib/supabase'

export const productsService = {
  async list() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
    if (error) throw error
    return data
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
