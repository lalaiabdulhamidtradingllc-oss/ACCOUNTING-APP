import { useState, useEffect } from 'react'

export default function Reports() {
  const [sales, setSales] = useState([])
  const [purchases, setPurchases] = useState([])
  const [transactions, setTransactions] = useState([])
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('pnl')

  useEffect(() => {
    setSales(JSON.parse(localStorage.getItem('sales') || '[]'))
    setPurchases(JSON.parse(localStorage.getItem('purchases') || '[]'))
    setTransactions(JSON.parse(localStorage.getItem('transactions') || '[]'))
    setProducts(JSON.parse(localStorage.getItem('products') || '[]'))
  }, [])

  const totalRevenue = sales.reduce((sum, inv) => sum + (inv.total || 0), 0)
  const totalCOGS = purchases.reduce((sum, p) => sum + (p.total || 0), 0)
  const totalExpenses = transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + (t.amount || 0), 0)
  const netProfit = totalRevenue - totalCOGS - totalExpenses
  const inventoryValue = products.reduce((sum, p) => sum + (p.cost * p.qty || 0), 0)
  const cashIn = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + (t.amount || 0), 0)
  const receivables = sales.filter(s => s.status !== 'Paid').reduce((sum, s) => sum + ((s.total - s.paid) || 0), 0)

  const handleExport = () => {
    const rows = [
      ['Metric', 'Amount (AED)'],
      ['Total Sales Revenue', totalRevenue.toFixed(2)],
      ['Cost of Goods (Purchases)', totalCOGS.toFixed(2)],
      ['Operating Expenses', totalExpenses.toFixed(2)],
      ['Net Profit', netProfit.toFixed(2)],
      ['Inventory Value', inventoryValue.toFixed(2)],
      ['Accounts Receivable (Due)', receivables.toFixed(2)]
    ]
    const csv = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n")
    const link = document.createElement("a")
    link.href = encodeURI(csv)
    link.download = `financial_report_${new Date().toISOString().slice(0,10)}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Financial Reports</h2>
        <div className="flex gap-2">
          {['pnl', 'balance'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
              {tab === 'pnl' ? 'Profit & Loss' : 'Balance Sheet'}
            </button>
          ))}
          <button onClick={handleExport} className="btn btn-secondary">📥 Export CSV</button>
        </div>
      </div>

      {activeTab === 'pnl' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Income Statement (Profit & Loss)</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium text-gray-600">Total Revenue (Sales)</span>
              <span className="font-bold text-green-700">AED {totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium text-gray-600">Less: Cost of Goods (Purchases)</span>
              <span className="font-bold text-red-600">- AED {totalCOGS.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium text-gray-600">Less: Operating Expenses</span>
              <span className="font-bold text-red-600">- AED {totalExpenses.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between items-center p-4 rounded text-base font-bold ${netProfit >= 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              <span>Net Profit / (Loss)</span>
              <span>AED {netProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'balance' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Balance Sheet Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-600">Assets</h4>
              <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Cash In</span><span className="font-bold">AED {cashIn.toFixed(2)}</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Inventory Value</span><span className="font-bold">AED {inventoryValue.toFixed(2)}</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Receivables (Due from Customers)</span><span className="font-bold">AED {receivables.toFixed(2)}</span></div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-600">Liabilities & Equity</h4>
              <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Payables (Due to Suppliers)</span><span className="font-bold">AED 0.00</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Retained Earnings (Profit)</span><span className="font-bold">AED {netProfit.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}