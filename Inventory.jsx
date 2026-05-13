import { useState, useEffect } from 'react'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', category: 'General', qty: 0, cost: 0, price: 0, barcode: '' })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('products') || '[]')
    setProducts(saved)
  }, [])

  const handleSave = (e) => {
    e.preventDefault()
    const newProd = { ...form, qty: Number(form.qty), cost: Number(form.cost), price: Number(form.price), id: Date.now() }
    const updated = [newProd, ...products]
    setProducts(updated)
    localStorage.setItem('products', JSON.stringify(updated))
    setForm({ name: '', category: 'General', qty: 0, cost: 0, price: 0, barcode: '' })
  }

  const handleDelete = (id) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    localStorage.setItem('products', JSON.stringify(updated))
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || String(p.barcode).includes(search))
  const totalValue = products.reduce((sum, p) => sum + (p.cost * p.qty), 0)
  const lowStock = products.filter(p => p.qty < 5)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>

      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg flex items-center gap-2 text-orange-800 text-sm">
          ⚠️ Low Stock Alert: {lowStock.map(p => p.name).join(', ')}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
          <input className="input" placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option>General</option><option>Food</option><option>Electronics</option><option>Clothing</option><option>Services</option>
          </select>
          <input className="input" type="number" placeholder="Quantity" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} required />
          <input className="input" type="number" placeholder="Cost Price (AED)" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} required />
          <input className="input" type="number" placeholder="Selling Price (AED)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">Add Product</button>
        </div>
      </form>

      <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
        <input className="input w-full md:w-80" placeholder="🔍 Search by name or barcode..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="bg-emerald-50 px-4 py-2 rounded-lg text-sm text-emerald-800 font-medium">
          📦 Total Stock Value: AED {totalValue.toLocaleString()}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-600">Product</th>
              <th className="p-3 text-sm font-medium text-gray-600">Category</th>
              <th className="p-3 text-sm font-medium text-gray-600">Stock</th>
              <th className="p-3 text-sm font-medium text-gray-600">Cost</th>
              <th className="p-3 text-sm font-medium text-gray-600">Sell</th>
              <th className="p-3 text-sm font-medium text-gray-600">Margin</th>
              <th className="p-3 text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const margin = p.price > 0 ? (((p.price - p.cost) / p.price) * 100).toFixed(1) : '0'
              return (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 text-sm font-medium">{p.name}</td>
                  <td className="p-3 text-sm text-gray-500">{p.category}</td>
                  <td className={`p-3 text-sm font-bold ${p.qty < 5 ? 'text-red-600' : 'text-emerald-700'}`}>{p.qty}</td>
                  <td className="p-3 text-sm">AED {p.cost}</td>
                  <td className="p-3 text-sm">AED {p.price}</td>
                  <td className="p-3 text-sm text-green-600">{margin}%</td>
                  <td className="p-3 text-sm"><button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button></td>
                </tr>
              )
            })}
            {filtered.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-gray-400">No products found. Add your first item above.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}