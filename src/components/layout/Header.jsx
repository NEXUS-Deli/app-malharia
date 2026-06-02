import { useEffect, useState } from 'react'
import { Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Avatar } from '../ui/avatar'
import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from '../ui/dropdown-menu'

export function Header({ title }) {
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card-bg px-6 lg:px-8">
      <div className="lg:hidden" /> {/* spacer for mobile menu button */}
      <h1 className="text-xl font-bold text-text-primary hidden lg:block">{title || 'Dashboard'}</h1>

      <div className="flex items-center gap-4">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <Bell size={18} className="text-text-secondary" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">3</span>
        </button>

        <DropdownMenu>
          {({ open, setOpen }) => (
            <>
              <DropdownTrigger open={open} setOpen={setOpen} className="flex items-center gap-3 rounded-xl hover:bg-gray-100 pl-2 pr-3 py-1.5 transition-colors">
                <Avatar name={userName || 'U'} size="sm" color="primary" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-text-primary leading-tight">{userName || 'Usuário'}</p>
                  <p className="text-xs text-text-muted">Admin</p>
                </div>
                <ChevronDown size={14} className="text-text-muted hidden sm:block" />
              </DropdownTrigger>
              <DropdownContent open={open}>
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">{userName || 'Usuário'}</p>
                  <p className="text-xs text-text-muted">admin@confeccao.com</p>
                </div>
                <DropdownItem onClick={() => navigate('/settings')}>
                  <User size={16} /> Meu Perfil
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/settings')}>
                  <Settings size={16} /> Configurações
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem onClick={handleLogout}>
                  <LogOut size={16} /> Sair
                </DropdownItem>
              </DropdownContent>
            </>
          )}
        </DropdownMenu>
      </div>
    </header>
  )
}
