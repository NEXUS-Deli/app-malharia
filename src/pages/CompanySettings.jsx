import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Trash2, Save, Building2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { companyService } from '../services/company'

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

function Field({ label, value, onChange, placeholder, type, required }) {
  const fieldId = `field-${label}`
  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId}>{label}{required && ' *'}</Label>
      {type === 'select' ? (
        <select
          id={fieldId}
          className="flex h-10 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          value={value || ''}
          onChange={onChange}
        >
          <option value="">Selecione</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      ) : (
        <Input
          id={fieldId}
          type={type || 'text'}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  )
}

export function CompanySettings() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    logo_url: '',
    company_name: '',
    trade_name: '',
    cnpj: '',
    state_registration: '',
    municipal_registration: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    address: '',
    number: '',
    district: '',
    city: '',
    state: '',
    zip_code: '',
    responsible_name: '',
    responsible_position: '',
    notes: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const data = await companyService.getSettings()
        if (data) setForm(prev => ({ ...prev, ...data }))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo deve ter no máximo 5MB')
      return
    }
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      toast.error('Formatos permitidos: PNG, JPG, SVG')
      return
    }

    setUploading(true)
    try {
      if (form.logo_url) await companyService.removeLogo(form.logo_url)
      const url = await companyService.uploadLogo(file)
      setForm(prev => ({ ...prev, logo_url: url }))
      toast.success('Logo enviada com sucesso!')
    } catch (err) {
      toast.error(`Erro ao enviar logo: ${err.message}`)
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleRemoveLogo = async () => {
    try {
      if (form.logo_url) await companyService.removeLogo(form.logo_url)
      setForm(prev => ({ ...prev, logo_url: '' }))
      toast.success('Logo removida')
    } catch (err) {
      toast.error(`Erro ao remover: ${err.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await companyService.saveSettings(form)
      toast.success('Dados da empresa salvos com sucesso!')
    } catch (err) {
      toast.error(`Erro ao salvar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12hz" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/settings')}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} className="text-text-secondary" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Minha Empresa</h1>
          <p className="text-sm text-text-muted mt-1">Informações institucionais utilizadas em OS, PDF e relatórios</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon size={18} className="text-primary" />
              Logo da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {form.logo_url ? (
                  <div className="relative w-32 h-32 rounded-2xl border border-border overflow-hidden bg-gray-50">
                    <img src={form.logo_url} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-32 h-32 rounded-2xl border-2 border-dashed border-border bg-gray-50">
                    <Building2 size={32} className="text-text-muted" />
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-text-primary font-medium">Logo da empresa</p>
                  <p className="text-xs text-text-muted">PNG, JPG ou SVG. Máx 5MB.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    {uploading ? 'Enviando...' : form.logo_url ? 'Substituir' : 'Enviar Logo'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {form.logo_url && (
                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveLogo}>
                      <Trash2 size={14} /> Remover
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              Dados da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Razão Social" value={form.company_name} onChange={handleChange('company_name')} placeholder="Razão social da empresa" required />
              <Field label="Nome Fantasia" value={form.trade_name} onChange={handleChange('trade_name')} placeholder="Nome fantasia" />
              <Field label="CNPJ" value={form.cnpj} onChange={handleChange('cnpj')} placeholder="00.000.000/0001-00" />
              <Field label="Inscrição Estadual" value={form.state_registration} onChange={handleChange('state_registration')} placeholder="Inscrição estadual" />
              <Field label="Inscrição Municipal" value={form.municipal_registration} onChange={handleChange('municipal_registration')} placeholder="Inscrição municipal" />
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Telefone" value={form.phone} onChange={handleChange('phone')} placeholder="(99) 9999-9999" />
              <Field label="WhatsApp" value={form.whatsapp} onChange={handleChange('whatsapp')} placeholder="(99) 99999-9999" />
              <Field label="Email" value={form.email} onChange={handleChange('email')} type="email" placeholder="contato@empresa.com" />
              <Field label="Site" value={form.website} onChange={handleChange('website')} placeholder="https://www.empresa.com" />
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Endereço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="CEP" value={form.zip_code} onChange={handleChange('zip_code')} placeholder="00000-000" />
              <Field label="Endereço" value={form.address} onChange={handleChange('address')} placeholder="Rua, Avenida..." />
              <Field label="Número" value={form.number} onChange={handleChange('number')} placeholder="123" />
              <Field label="Bairro" value={form.district} onChange={handleChange('district')} placeholder="Bairro" />
              <Field label="Cidade" value={form.city} onChange={handleChange('city')} placeholder="Cidade" />
              <Field label="Estado" value={form.state} onChange={handleChange('state')} type="select" />
            </div>
          </CardContent>
        </Card>

        {/* Responsável */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Responsável</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nome" value={form.responsible_name} onChange={handleChange('responsible_name')} placeholder="Nome completo" />
              <Field label="Cargo/Função" value={form.responsible_position} onChange={handleChange('responsible_position')} placeholder="Ex: Diretor, Gerente de Produção" />
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.notes || ''}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Informações adicionais..."
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/settings')}>Cancelar</Button>
          <Button type="submit" disabled={saving}>
            <Save size={16} />
            {saving ? 'Salvando...' : 'Salvar Empresa'}
          </Button>
        </div>
      </form>
    </div>
  )
}
