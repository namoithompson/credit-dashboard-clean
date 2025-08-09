'use client'
import { useState, useEffect } from 'react'

type PaymentMethod = {
  id: string
  name: string
  last4: string
  expMonth: number
  expYear: number
}

export default function BillingPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [form, setForm] = useState({ name: '', card: '', exp: '', cvv: '' })
  useEffect(() => {
    // load saved methods
    fetch('/api/payment-methods').then((res) => res.json()).then(setMethods).catch(() => {})
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Save locally – no gateway integration
    const [expMonth, expYear] = form.exp.split('/')
    await fetch('/api/payment-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        cardNumber: form.card,
        expMonth: Number(expMonth),
        expYear: Number(expYear),
        cvv: form.cvv,
      }),
    })
    setForm({ name: '', card: '', exp: '', cvv: '' })
    // reload list
    const res = await fetch('/api/payment-methods')
    setMethods(await res.json())
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing and Payments</h1>
      <div className="bg-card p-6 rounded-md shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Payment Methods</h2>
        {methods.length === 0 ? (
          <p className="text-muted-foreground">No payment methods saved.</p>
        ) : (
          <ul className="space-y-2">
            {methods.map((m) => (
              <li key={m.id} className="border border-border p-3 rounded-md flex justify-between items-center">
                <span>{m.name} ending in {m.last4}</span>
                <span className="text-sm text-gray-500">Expires {m.expMonth.toString().padStart(2, '0')}/{m.expYear}</span>
              </li>
            ))}
          </ul>
        )}
        <hr />
        <h3 className="text-md font-semibold">Add Payment Method</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm">Name on Card</label>
            <input
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Card Number</label>
            <input
              name="card"
              value={form.card}
              onChange={(e) => setForm({ ...form, card: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Expiry (MM/YYYY)</label>
            <input
              name="exp"
              value={form.exp}
              onChange={(e) => setForm({ ...form, exp: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">CVV</label>
            <input
              name="cvv"
              value={form.cvv}
              onChange={(e) => setForm({ ...form, cvv: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md"
              required
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md">Save Card</button>
          </div>
        </form>
      </div>
    </div>
  )
}