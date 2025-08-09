'use client'
import { useState } from 'react'

export default function DisputesPage() {
  const [active, setActive] = useState<'current' | 'completed'>('current')
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Disputes</h1>
      <div className="flex gap-4">
        <button
          onClick={() => setActive('current')}
          className={`px-6 py-2 rounded-full ${active === 'current' ? 'bg-yellow-400 text-white' : 'bg-muted text-gray-600'}`}
        >
          Current
        </button>
        <button
          onClick={() => setActive('completed')}
          className={`px-6 py-2 rounded-full ${active === 'completed' ? 'bg-green-400 text-white' : 'bg-muted text-gray-600'}`}
        >
          Completed
        </button>
      </div>
      <div className="bg-card p-6 rounded-md shadow-sm">
        <p className="text-muted-foreground">No disputes found.</p>
      </div>
    </div>
  )
}