import { supabase } from '../lib/supabase'

export const referenceImageService = {
  async upload(orderId, file) {
    const ext = file.name.split('.').pop()
    const filePath = `${orderId}/reference.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('order-images')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      })
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('order-images')
      .getPublicUrl(filePath)

    await supabase
      .from('production_orders')
      .update({ reference_image_url: publicUrl })
      .eq('id', orderId)

    return publicUrl
  },

  async remove(orderId) {
    const { data: order } = await supabase
      .from('production_orders')
      .select('reference_image_url')
      .eq('id', orderId)
      .single()

    if (order?.reference_image_url) {
      const url = new URL(order.reference_image_url)
      const path = url.pathname.split('/').pop()
      if (path) {
        await supabase.storage.from('order-images').remove([path])
      }
    }

    await supabase
      .from('production_orders')
      .update({ reference_image_url: null })
      .eq('id', orderId)
  },
}
