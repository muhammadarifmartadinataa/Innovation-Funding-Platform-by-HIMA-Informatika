'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Campaigns', href: '/admin/campaigns' },
  { label: 'Users', href: '/admin/users' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [active, setActive] = useState(pathname)

  useEffect(() => {
    setActive(pathname)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/auth') // arahkan ke halaman login
  }

  return (
    <aside className="w-64 bg-indigo-800 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-indigo-600">
        Admin Panel
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-lg transition ${
              active === item.href
                ? 'bg-indigo-600'
                : 'hover:bg-indigo-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 p-4 bg-red-600 hover:bg-red-700 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )
}
