import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    // Simple secure session for now (Firebase will replace this later)
    localStorage.setItem('auth_user', JSON.stringify({ email, role: 'admin' }))
    setUser({ email, role: 'admin' })
    navigate('/', { replace: true })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center text-emerald-800">AccuBooks Login</h2>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input className="input" type="email" placeholder="admin@shop.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input className="input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-full py-3 text-lg mt-2">Login to Dashboard</button>
        <p className="text-xs text-gray-400 text-center mt-2">💡 Demo mode: Enter any email & password to continue</p>
      </form>
    </div>
  )
}