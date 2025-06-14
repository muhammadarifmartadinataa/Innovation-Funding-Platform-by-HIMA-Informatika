'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  userId: string
  email: string
  role: string
}

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/auth')
      return
    }

    try {
      const decoded: DecodedToken = jwtDecode(token)

      if (decoded.role !== 'admin') {
        router.push('/user/dashboard')
        return
      }

      setAdminName(decoded.email) 
    } catch (error) {
      localStorage.removeItem('token')
      router.push('/auth')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/auth')
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
        <p className="mb-4 text-gray-700">Selamat datang, <strong>{adminName}</strong>!</p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </main>
  )
}
