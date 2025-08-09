import { User } from 'lucide-react'
import Link from 'next/link'

export default function TopNav() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <input
        type="text"
        placeholder="Search here"
        className="w-1/2 px-3 py-2 rounded-md border border-border focus:outline-none"
      />
      <div className="flex items-center gap-4">
        <Link href="/login" className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" /> My Account
        </Link>
      </div>
    </header>
  )
}