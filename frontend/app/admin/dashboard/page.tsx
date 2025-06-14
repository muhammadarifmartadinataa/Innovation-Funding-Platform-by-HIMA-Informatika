'use client'

import { useEffect, useState } from 'react'
import { LogOut, Users, FolderKanban, HandCoins, Wallet } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalCampaigns: number
  totalTransactions: number
  totalAmount: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Gagal ambil data dashboard')
        setStats(data.data)
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchStats()
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      {error && <p className="text-red-500">{error}</p>}

      {stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Total Users" value={stats.totalUsers} icon={<Users className="text-blue-600" />} />
          <Card title="Total Campaigns" value={stats.totalCampaigns} icon={<FolderKanban className="text-green-600" />} />
          <Card title="Total Transactions" value={stats.totalTransactions} icon={<HandCoins className="text-yellow-600" />} />
          <Card title="Total Raised" value={`Rp${stats.totalAmount.toLocaleString('id-ID')}`} icon={<Wallet className="text-purple-600" />} />
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </main>
  )
}

function Card({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center space-x-4">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <h2 className="text-sm text-gray-500">{title}</h2>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  )
}
