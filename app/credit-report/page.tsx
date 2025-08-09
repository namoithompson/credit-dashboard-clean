'use client'
import { useState } from 'react'

const tabs = ['Overview', 'Accounts', 'Defaults', 'Judgements']

export default function CreditReportPage() {
  const [active, setActive] = useState('Overview')
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Credit Report</h1>
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 -mb-px border-b-2 ${active === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      {active === 'Overview' && (
        <div className="bg-card p-6 rounded-md shadow-sm">
          <p className="text-muted-foreground">No credit report available yet.</p>
        </div>
      )}
      {active !== 'Overview' && (
        <div className="bg-card p-6 rounded-md shadow-sm">
          <p className="text-muted-foreground">This section is under construction.</p>
        </div>
      )}
    </div>
  )
}