import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({ sales: 0, purchases: 0, cashIn: 0, cashOut: 0, profit: 0 })

  useEffect(() => {
    // Load data from local storage (works immediately, Firebase will connect later)
    const s = JSON.parse(localStorage.getItem('sales') || '[]')
    const p = JSON.parse(localStorage.getItem('purchases') || '[]')
    const tx = JSON.parse(localStorage.getItem('transactions') || '[]')

    const totalSales = s.reduce((sum, i) => sum + (Number(i.total) || 0), 0)
    const totalPurchases = p.reduce((sum, i) => sum + (Number(i.total) || 0), 0)
    const cashIn = tx.filter(t => t.type === 'in').reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
    const cashOut = tx.filter(t => t.type === 'out').reduce((sum, i) => sum + (Number(i.amount) || 0), 0)

    setStats({
      sales: totalSales,
      purchases: totalPurchases,
      cashIn,
      cashOut,
      profit: totalSales - totalPurchases - cashOut
    })
  }, [])

  const StatCard = ({ title, value, color }) => (
    <div className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${color} hover:shadow-md transition`}>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-2 text-gray-800">AED {value.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Financial Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Total Sales" value={stats.sales} color="border-emerald-500" />
        <StatCard title="Total Purchases" value={stats.purchases} color="border-blue-500" />
        <StatCard title="Cash In" value={stats.cashIn} color="border-green-400" />
        <StatCard title="Cash Out" value={stats.cashOut} color="border-red-500" />
        <StatCard title="Net Profit" value={stats.profit} color={stats.profit >= 0 ? 'border-purple-500' : 'border-orange-500'} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-3">Quick Start</h3>
        <p className="text-gray-500 text-sm mb-4">Your accounting data will appear here as you add sales, purchases, and cash flow entries.</p>
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <p className="text-emerald-800 font-medium text-sm">💡 Next Steps:</p>
          <ul className="text-emerald-700 text-sm mt-2 list-disc list-inside space-y-1">
            <li>Click <strong>Sales</strong> in the sidebar to create your first invoice</li>
            <li>Use <strong>Cash Flow</strong> to record daily expenses or income</li>
            <li>All data saves automatically to your browser</li>
          </ul>
        </div>
      </div>
    </div>
  )
}