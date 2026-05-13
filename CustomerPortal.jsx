import { useState, useEffect } from 'react'

export default function CustomerPortal() {
  const [sales, setSales] = useState([])
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('sales') || '[]')
    setSales(data)

    // Extract and aggregate customer data automatically
    const grouped = data.reduce((acc, inv) => {
      const name = inv.customer || 'Unknown'
      if (!acc[name]) {
        acc[name] = { name, invoices: [], total: 0, paid: 0 }
      }
      acc[name].invoices.push(inv)
      acc[name].total += inv.total || 0
      acc[name].paid += inv.paid || 0
      return acc
    }, {})

    setCustomers(Object.values(grouped))
  }, [])

  const sendReminder = (cust) => {
    const balance = cust.total - cust.paid
    if (balance <= 0) return alert('This customer has no balance due.')
    const msg = `Dear ${cust.name},\n\nThis is a friendly reminder regarding your outstanding balance of AED ${balance.toFixed(2)}.\n\nPlease arrange payment at your earliest convenience.\n\nThank you.`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Customer Statements</h2>
        <input
          className="input w-full md:w-80"
          placeholder="🔍 Search customer name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Customer List */}
      {!selected && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(cust => {
            const balance = cust.total - cust.paid
            return (
              <div key={cust.name} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer" onClick={() => setSelected(cust)}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{cust.name}</h3>
                    <p className="text-sm text-gray-500">{cust.invoices.length} Invoice(s)</p>
                  </div>
                  {balance > 0 && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Due</span>}
                  {balance <= 0 && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Clear</span>}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Total Billed:</span><span>AED {cust.total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Total Paid:</span><span>AED {cust.paid.toFixed(2)}</span></div>
                  <div className={`flex justify-between pt-2 border-t font-bold text-base ${balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    <span>Balance:</span><span>AED {balance.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); sendReminder(cust) }} className="btn btn-secondary flex-1 text-xs">📱 WhatsApp</button>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && <p className="text-gray-400 col-span-3 text-center py-10">No customers found. Add a Sale with a customer name first.</p>}
        </div>
      )}

      {/* Selected Customer Detail / Statement */}
      {selected && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-emerald-800">Statement: {selected.name}</h3>
            <button onClick={() => setSelected(null)} className="text-sm text-emerald-700 hover:underline">← Back to List</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-sm text-gray-600">Date</th>
                <th className="p-3 text-sm text-gray-600">Invoice #</th>
                <th className="p-3 text-sm text-gray-600 text-right">Total</th>
                <th className="p-3 text-sm text-gray-600 text-right">Paid</th>
                <th className="p-3 text-sm text-gray-600 text-right">Due</th>
              </tr>
            </thead>
            <tbody>
              {selected.invoices.map(inv => (
                <tr key={inv.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 text-sm">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="p-3 text-sm font-medium">{inv.id}</td>
                  <td className="p-3 text-sm text-right">AED {inv.total.toFixed(2)}</td>
                  <td className="p-3 text-sm text-right text-green-600">-AED {(inv.paid || 0).toFixed(2)}</td>
                  <td className="p-3 text-sm text-right font-bold text-red-600">AED {(inv.total - (inv.paid || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}