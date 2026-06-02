import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package, ClipboardList, KanbanSquare,
  Settings, LogOut, Shirt
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clientes' },
  { to: '/products', icon: Package, label: 'Produtos' },
  { to: '/orders', icon: ClipboardList, label: 'Ordens de Serviço' },
  { to: '/kanban', icon: KanbanSquare, label: 'Kanban' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
]

export function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-hover">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Shirt size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white">ConfecOS</h1>
          <p className="text-xs text-sidebar-text">Sistema de Produção</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-hover">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  )
}
