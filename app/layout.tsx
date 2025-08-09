import '@/app/globals.css'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Credit Dashboard',
  description: 'Manage your credit score and disputes',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <TopNav />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}