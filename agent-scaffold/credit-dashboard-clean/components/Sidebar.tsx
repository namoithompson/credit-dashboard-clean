import Link from 'next/link'
import { Home, FileText, ClipboardList, User2, CreditCard } from 'lucide-react'
import clsx from 'classnames'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/credit-report', label: 'Credit Report', icon: FileText },
  { href: '/disputes', label: 'Disputes', icon: ClipboardList },
  { href: '/account', label: 'Account', icon: User2 },
  { href: '/billing', label: 'Billing', icon: CreditCard }
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col">
      <div className="text-2xl font-bold mb-6 px-2">
        apex
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary text-gray-700">
            <Icon className="h-5 w-5 text-primary" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}