'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
    const router = useRouter()
    const [isRegistering, setIsRegistering] = useState(false)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [occupation, setOccupation] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Login gagal')

            localStorage.setItem('token', data.token)

            // Redirect berdasarkan role
            if (data.role === 'admin') {
                router.push('/admin/dashboard')
            } else {
                router.push('/user/dashboard')
            }
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, occupation }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Registrasi gagal')

            alert('Registrasi berhasil, silakan login')
            setIsRegistering(false)
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <main className="flex items-center justify-center min-h-screen bg-red-900">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-red-900">
                    {isRegistering ? 'User Register' : 'Login'}
                </h1>

                {error && <p className="mb-4 text-red-600">{error}</p>}

                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                    {isRegistering && (
                        <>
                            <input
                                type="text"
                                placeholder="Nama Lengkap"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-900 text-gray-800"
                            />
                            <input
                                type="text"
                                placeholder="Pekerjaan"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-900 text-gray-800"
                            />
                        </>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-900 text-gray-800"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-900 text-gray-800"
                    />

                    <button
                        type="submit"
                        className="w-full bg-red-900 text-white py-2 rounded-lg font-semibold hover:bg-red-900 transition"
                    >
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-800">
                    {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-red-900  font-semibold hover:underline"
                    >
                        {isRegistering ? 'Login di sini' : 'Register di sini'}
                    </button>
                </p>
            </div>
        </main>
    )
}
