import { supabase } from '../lib/supabase'

const LOGO_PATH = 'logo-empresa'

export const companyService = {
  async getSettings() {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async saveSettings(settings) {
    const existing = await companyService.getSettings()
    let result
    if (existing) {
      const { data, error } = await supabase
        .from('company_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      result = data
    } else {
      const { data, error } = await supabase
        .from('company_settings')
        .insert(settings)
        .select()
        .single()
      if (error) throw error
      result = data
    }
    return result
  },

  async uploadLogo(file) {
    const ext = file.name.split('.').pop()
    const filePath = `${LOGO_PATH}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      })
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath)

    return publicUrl
  },

  async removeLogo(logoUrl) {
    if (!logoUrl) return
    const path = logoUrl.split('/').pop()
    if (!path) return
    const { error } = await supabase.storage.from('logos').remove([path])
    if (error && error.statusCode !== '404' && !error.message?.includes('not found')) {
      console.error('Erro ao remover logo:', error)
    }
  },
}
