'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal");
      } else {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        router.push("/");  // nanti kita buat halaman dashboard yang render UserList
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } fina lly {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login CMS</h2>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <label htmlFor="email" className="block mb-2 font-medium">Email</label>
        <input
          id="email"
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="block mb-2 font-medium">Password</label>
        <input
          id="password"
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
