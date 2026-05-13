import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Sales from './pages/Sales'
import Purchases from './pages/Purchases'
import CashFlow from './pages/CashFlow'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import CustomerPortal from './pages/CustomerPortal'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('auth_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/*" element={user ? <Layout /> : <Navigate to="/login" replace />} >
          <Route index element={<Dashboard />} />
          <Route path="sales" element={<Sales />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="cashflow" element={<CashFlow />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reports" element={<Reports />} />
          <Route path="customers" element={<CustomerPortal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App