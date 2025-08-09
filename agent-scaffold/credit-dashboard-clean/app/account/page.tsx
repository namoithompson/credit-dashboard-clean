'use client'
import { useState } from 'react'

export default function AccountPage() {
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    address: '',
    email: '',
    phone: '',
    password: '',
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    alert('Saved!')
  }
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Account Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Middle Name</label>
            <input
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md"
            required
          />
        </div>
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md">
          Save Changes
        </button>
      </form>
    </div>
  )
}