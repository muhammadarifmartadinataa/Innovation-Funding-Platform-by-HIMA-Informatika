'use client'

import { ReactNode } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import AdminNavbar from '@/components/AdminNavbar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminNavbar />
        <main className="p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
