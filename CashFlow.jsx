import { useState, useEffect } from 'react'

export default function CashFlow() {
  const [transactions, setTransactions] = useState([])
  const [form, setForm] = useState({ type: 'in', desc: '', amount: '' })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('transactions') || '[]')
    setTransactions(saved)
  }, [])

  const addTransaction = (e) => {
    e.preventDefault()
    if (!form.desc || !form.amount) return
    const newTx = { 
      ...form, 
      amount: Number(form.amount), 
      id: Date.now(), 
      date: new Date().toISOString() 
    }
    const updated = [newTx, ...transactions]
    setTransactions(updated)
    localStorage.setItem('transactions', JSON.stringify(updated))
    setForm({ type: 'in', desc: '', amount: '' })
  }

  const totalIn = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0)
  const totalOut = transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIn - totalOut

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter)

  const handleExport = () => {
    const csv = transactions.map(t => `${new Date(t.date).toLocaleDateString()},${t.type},${t.desc},${t.amount}`).join('\n')
    const blob = new Blob([`Date,Type,Description,Amount\n${csv}`], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cashflow_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Cash Flow & Daily Book</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-green-200">
          <p className="text-gray-500 text-sm">Total Cash In</p>
          <p className="text-2xl font-bold text-green-700 mt-1">AED {totalIn.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-red-200">
          <p className="text-gray-500 text-sm">Total Cash Out</p>
          <p className="text-2xl font-bold text-red-700 mt-1">AED {totalOut.toLocaleString()}</p>
        </div>
        <div className={`bg-white p-5 rounded-xl shadow-sm border ${balance >= 0 ? 'border-purple-300' : 'border-orange-300'}`}>
          <p className="text-gray-500 text-sm">Current Balance</p>
          <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-purple-700' : 'text-orange-600'}`}>
            AED {Math.abs(balance).toLocaleString()}{balance < 0 ? ' (Deficit)' : ''}
          </p>
        </div>
      </div>

      {/* Add Transaction Form */}
      <form onSubmit={addTransaction} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="in">💵 Cash In</option>
            <option value="out">💸 Cash Out</option>
          </select>
          <input className="input md:col-span-2" placeholder="Description (e.g. Rent, Supplier Payment, Sale)" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} required />
          <input className="input" type="number" placeholder="Amount (AED)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <button type="submit" className="btn btn-primary">Add Transaction</button>
        </div>
      </form>

      {/* Filter & Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg shadow-sm">
        <div className="flex gap-2">
          {['all', 'in', 'out'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded text-sm font-medium ${filter === f ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
              {f === 'all' ? 'All' : f === 'in' ? 'Cash In' : 'Cash Out'}
            </button>
          ))}
        </div>
        <button onClick={handleExport} className="btn btn-secondary">📥 Export CSV</button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-600">Date</th>
              <th className="p-3 text-sm font-medium text-gray-600">Type</th>
              <th className="p-3 text-sm font-medium text-gray-600">Description</th>
              <th className="p-3 text-sm font-medium text-gray-600 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => (
              <tr key={tx.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${tx.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {tx.type === 'in' ? 'Cash In' : 'Cash Out'}
                  </span>
                </td>
                <td className="p-3 text-sm">{tx.desc}</td>
                <td className={`p-3 text-sm text-right font-bold ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'in' ? '+' : '-'}AED {tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-gray-400">No transactions found for this filter.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}