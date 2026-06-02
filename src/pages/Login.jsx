import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Gem, Eye, EyeOff } from 'lucide-react'
import { authService } from '../services/auth'
import { companyService } from '../services/company'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [companyLogo, setCompanyLogo] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    companyService.getSettings().then(data => {
      if (data) {
        setCompanyName(data.trade_name || data.company_name || 'ConfecOS')
        setCompanyLogo(data.logo_url || '')
      }
    }).catch(() => {
      setCompanyName('ConfecOS')
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.login(email, password)
      const from = location.state?.from || '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Email ou senha inválidos' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-bg-main">
      {/* Left side - gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white" />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="flex justify-center mb-8">
            {companyLogo ? (
              <img src={companyLogo} alt={companyName} className="h-20 w-20 object-contain rounded-2xl bg-white/20 backdrop-blur-sm p-2" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Gem size={40} className="text-white" />
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{companyName}</h1>
          <p className="text-lg text-white/80 max-w-md mx-auto">
            Sistema de Ordem de Serviço para Confecções
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {['Controle Total', 'Kanban Visual', 'Sem Atrasos'].map((item) => (
              <div key={item} className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 text-sm text-white/90">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex justify-center mb-8">
            {companyLogo ? (
              <img src={companyLogo} alt={companyName} className="h-14 w-14 object-contain rounded-2xl bg-primary p-2" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                <Gem size={28} className="text-white" />
              </div>
            )}
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Acessar o sistema</h2>
            <p className="text-sm text-text-muted mt-2">Faça login para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-danger-bg border border-danger/20 p-4 text-sm text-danger">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="text-xs text-text-muted text-center mt-8">
            {companyName} &mdash; Controle de Produção
          </p>
        </div>
      </div>
    </div>
  )
}
