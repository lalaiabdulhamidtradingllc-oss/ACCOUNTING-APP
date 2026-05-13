import { useState, useEffect } from 'react'

export default function Purchases() {
  const [records, setRecords] = useState([])
  const [form, setForm] = useState({ supplier: '', items: [{ name: '', qty: 1, cost: 0 }], status: 'Pending', totalPaid: 0 })

  useEffect(() => {
    setRecords(JSON.parse(localStorage.getItem('purchases') || '[]'))
  }, [])

  const updateItem = (idx, field, val) => {
    const newItems = [...form.items]
    newItems[idx][field] = val
    setForm({ ...form, items: newItems })
  }

  const addItemRow = () => setForm({ ...form, items: [...form.items, { name: '', qty: 1, cost: 0 }] })
  const removeItemRow = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })

  const calcTotal = () => form.items.reduce((sum, i) => sum + (Number(i.qty) * Number(i.cost)), 0)

  const handleSave = (e) => {
    e.preventDefault()
    const total = calcTotal()
    const newRec = { ...form, total, totalPaid: Number(form.totalPaid), id: Date.now(), date: new Date().toISOString() }
    const updated = [newRec, ...records]
    setRecords(updated)
    localStorage.setItem('purchases', JSON.stringify(updated))
    setForm({ supplier: '', items: [{ name: '', qty: 1, cost: 0 }], status: 'Pending', totalPaid: 0 })
  }

  const handleDelete = (id) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('purchases', JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Purchase Management</h2>

      <form onSubmit={handleSave} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="input" placeholder="Supplier Name" value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} required />
          <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="Pending">Pending</option>
            <option value="Received">Received</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
          </select>
          <input className="input" type="number" placeholder="Amount Paid (AED)" value={form.totalPaid} onChange={e => setForm({...form, totalPaid: e.target.value})} />
        </div>

        {form.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input className="input flex-1" placeholder="Item / Service" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} required />
            <input className="input w-16" type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(i, 'qty', Number(e.target.value))} />
            <input className="input w-24" type="number" placeholder="Cost" value={item.cost} onChange={e => updateItem(i, 'cost', Number(e.target.value))} />
            {form.items.length > 1 && <button type="button" onClick={() => removeItemRow(i)} className="text-red-500 hover:text-red-700 px-2">✕</button>}
          </div>
        ))}
        <button type="button" onClick={addItemRow} className="text-sm text-emerald-700 hover:underline font-medium">+ Add Item</button>

        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mt-2">
          <span className="text-sm text-gray-600">Subtotal: AED {calcTotal().toFixed(2)}</span>
          <span className="text-xl font-bold text-blue-800">Total: AED {calcTotal().toFixed(2)}</span>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setForm({ supplier: '', items: [{ name: '', qty: 1, cost: 0 }], status: 'Pending', totalPaid: 0 })} className="btn btn-secondary">Reset</button>
          <button type="submit" className="btn btn-primary">Save Purchase</button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-600">Date</th>
              <th className="p-3 text-sm font-medium text-gray-600">Supplier</th>
              <th className="p-3 text-sm font-medium text-gray-600">Items</th>
              <th className="p-3 text-sm font-medium text-gray-600">Total</th>
              <th className="p-3 text-sm font-medium text-gray-600">Paid</th>
              <th className="p-3 text-sm font-medium text-gray-600">Due</th>
              <th className="p-3 text-sm font-medium text-gray-600">Status</th>
              <th className="p-3 text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => (
              <tr key={rec.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-sm">{new Date(rec.date).toLocaleDateString()}</td>
                <td className="p-3 text-sm font-medium">{rec.supplier}</td>
                <td className="p-3 text-sm">{rec.items.length} item(s)</td>
                <td className="p-3 text-sm font-bold">AED {rec.total.toFixed(2)}</td>
                <td className="p-3 text-sm text-green-600">AED {(rec.totalPaid || 0).toFixed(2)}</td>
                <td className="p-3 text-sm text-red-600 font-medium">AED {(rec.total - (rec.totalPaid || 0)).toFixed(2)}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${rec.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{rec.status}</span>
                </td>
                <td className="p-3 text-sm"><button onClick={() => handleDelete(rec.id)} className="text-red-500 hover:text-red-700">Delete</button></td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan="8" className="p-6 text-center text-gray-400">No purchase records yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}