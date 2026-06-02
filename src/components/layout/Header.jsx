import { User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export function Header() {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single()
        if (data) setUserName(data.name)
      }
    }
    getUser()
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-border-light bg-card-bg px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
          <User size={18} className="text-text-secondary" />
        </div>
        <span className="text-sm font-medium text-text-primary">{userName || 'Usuário'}</span>
      </div>
    </header>
  )
}
