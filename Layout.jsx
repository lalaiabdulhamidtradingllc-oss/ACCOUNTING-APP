import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Layout() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const logout = () => { localStorage.removeItem('auth_user'); navigate('/login') }

  const Nav = ({ to, label }) => (
    <button onClick={() => navigate(to)} className="w-full text-left px-4 py-2.5 rounded hover:bg-emerald-800 transition text-sm font-medium">
      {label}
    </button>
  )

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col bg-emerald-900 text-white w-64 p-4 space-y-1`}>
        <h1 className="text-xl font-bold mb-6 text-center tracking-wide">🌿 AccuBooks</h1>
        <Nav to="/" label="Dashboard" />
        <Nav to="/sales" label="Sales" />
        <Nav to="/purchases" label="Purchases" />
        <Nav to="/cashflow" label="Cash Flow" />
        <Nav to="/inventory" label="Inventory" />
        <Nav to="/reports" label="Reports" />
        <Nav to="/customers" label="Customers" />
        <div className="mt-auto pt-4 border-t border-emerald-700">
          <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-sm transition">Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl">☰</button>
          <h2 className="font-bold text-emerald-900">Professional Accounting System</h2>
          <div className="text-sm text-gray-500">Admin</div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}