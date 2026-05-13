import { useState, useEffect } from 'react'

export default function Sales() {
  const [invoices, setInvoices] = useState([])
  const [form, setForm] = useState({ customer: '', items: [{ name: '', qty: 1, price: 0 }], vat: true, paid: 0 })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sales') || '[]')
    setInvoices(saved)
  }, [])

  const updateItem = (idx, field, val) => {
    const newItems = [...form.items]
    newItems[idx][field] = val
    setForm({ ...form, items: newItems })
  }

  const addItem = () => setForm({ ...form, items: [...form.items, { name: '', qty: 1, price: 0 }] })
  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })

  const calcTotals = () => {
    const sub = form.items.reduce((sum, i) => sum + (i.qty * i.price), 0)
    const vat = form.vat ? sub * 0.05 : 0
    const total = sub + vat
    return { sub, vat, total }
  }

  const handleSave = (e) => {
    e.preventDefault()
    const { sub, vat, total } = calcTotals()
    const newInv = { 
      ...form, 
      sub, vat, total, 
      id: Date.now(), 
      date: new Date().toISOString(), 
      status: form.paid >= total ? 'Paid' : 'Due' 
    }
    const updated = [newInv, ...invoices]
    setInvoices(updated)
    localStorage.setItem('sales', JSON.stringify(updated))
    // Reset form
    setForm({ customer: '', items: [{ name: '', qty: 1, price: 0 }], vat: true, paid: 0 })
  }

  const sendWhatsapp = (inv) => {
    const due = inv.total - inv.paid
    const msg = `Dear ${inv.customer},\n\nInvoice: INV-${inv.id}\nTotal: AED ${inv.total.toFixed(2)}\nPaid: AED ${inv.paid.toFixed(2)}\nRemaining: AED ${due.toFixed(2)}\n\nThank you for your business!`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const printInvoice = (inv) => {
    const { sub, vat, total } = inv
    const content = `
      <h2 style="text-align:center;">Invoice #${inv.id}</h2>
      <p><strong>Customer:</strong> ${inv.customer} | <strong>Date:</strong> ${new Date(inv.date).toLocaleDateString()}</p>
      <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
        <tr><th style="border:1px solid #ddd; padding:8px; background:#f8f9fa;">Item</th><th style="border:1px solid #ddd; padding:8px;">Qty</th><th style="border:1px solid #ddd; padding:8px;">Price</th></tr>
        ${inv.items.map(i => `<tr><td style="border:1px solid #ddd; padding:8px;">${i.name}</td><td style="border:1px solid #ddd; padding:8px; text-align:center;">${i.qty}</td><td style="border:1px solid #ddd; padding:8px; text-align:right;">${i.price}</td></tr>`).join('')}
      </table>
      <div style="text-align:right; font-size:14px; line-height:1.6;">
        <p>Subtotal: AED ${sub.toFixed(2)}</p>
        <p>VAT (5%): AED ${vat.toFixed(2)}</p>
        <h3>Total Due: AED ${total.toFixed(2)}</h3>
      </div>
    `
    const win = window.open('', '_blank')
    win.document.write(content)
    win.document.close()
    win.print()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sales & Invoices</h2>

      {/* Invoice Form */}
      <form onSubmit={handleSave} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" placeholder="Customer Name" value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} required />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" checked={form.vat} onChange={e => setForm({...form, vat: e.target.checked})} className="rounded" /> Apply 5% VAT
            </label>
            <input className="input w-32" type="number" placeholder="Paid (AED)" value={form.paid} onChange={e => setForm({...form, paid: Number(e.target.value)})} />
          </div>
        </div>

        {form.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input className="input flex-1" placeholder="Item Name" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} required />
            <input className="input w-16" type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(i, 'qty', Number(e.target.value))} />
            <input className="input w-24" type="number" placeholder="Price" value={item.price} onChange={e => updateItem(i, 'price', Number(e.target.value))} />
            {form.items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 px-2">✕</button>}
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-sm text-emerald-700 hover:underline font-medium">+ Add Another Item</button>

        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mt-2">
          <div className="text-sm text-gray-600">Sub: AED {calcTotals().sub.toFixed(2)} | VAT: AED {calcTotals().vat.toFixed(2)}</div>
          <div className="text-xl font-bold text-emerald-800">Total: AED {calcTotals().total.toFixed(2)}</div>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setForm({ customer: '', items: [{ name: '', qty: 1, price: 0 }], vat: true, paid: 0 })} className="btn btn-secondary">Reset</button>
          <button type="submit" className="btn btn-primary">Save Invoice</button>
        </div>
      </form>

      {/* Invoice List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-600">Invoice</th>
              <th className="p-3 text-sm font-medium text-gray-600">Customer</th>
              <th className="p-3 text-sm font-medium text-gray-600">Total</th>
              <th className="p-3 text-sm font-medium text-gray-600">Status</th>
              <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-sm">INV-{inv.id}</td>
                <td className="p-3 text-sm">{inv.customer}</td>
                <td className="p-3 text-sm font-bold">AED {inv.total.toFixed(2)}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{inv.status}</span>
                </td>
                <td className="p-3 text-sm flex gap-2">
                  <button onClick={() => sendWhatsapp(inv)} className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">WhatsApp</button>
                  <button onClick={() => printInvoice(inv)} className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700">Print</button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">No invoices yet. Create your first one above.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}