import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { supabase } from '../lib/supabase'

export function Settings() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*, companies(name)')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Configurações</h1>
        <p className="text-sm text-text-muted mt-1">Informações da empresa e do usuário</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.companies ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-text-muted">Nome</p>
                  <p className="font-medium text-text-primary">{profile.companies.name}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">Nenhuma empresa vinculada</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-text-muted">Nome</p>
                  <p className="font-medium text-text-primary">{profile.name}</p>
                </div>
                <div>
                  <p className="text-text-muted">Email</p>
                  <p className="font-medium text-text-primary">{profile.email}</p>
                </div>
                <div>
                  <p className="text-text-muted">Função</p>
                  <p className="font-medium text-text-primary">{profile.role || '—'}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">Carregando...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
