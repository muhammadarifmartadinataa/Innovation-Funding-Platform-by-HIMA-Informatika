'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();

    //   state form
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [occupation, setOccupation] = useState("");
    const [role, setRole] = useState("user");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // state UI
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        // Validasi Password
        if (password !== confirmPassword) {
            setError("Password dan konfirmasi password tidak sama");
            return;
        }

        // request ke API
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, occupation, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registrasi gagal");
            } else {
                setSuccessMsg("Registrasi berhasil, silakan login");

                // Redirect Setelah Sukses 
                setTimeout(() => router.push("/login"), 2000);
            }
        } catch {
            setError("Terjadi kesalahan jaringan");
        } finally {
            setLoading(false);
        }

        // UI Form
     return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register CMS</h2>

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        {successMsg && <p className="mb-4 text-green-600 text-center">{successMsg}</p>}

        {/* Input Fields  */}
        <label className="block mb-2 font-medium" htmlFor="name">Nama Lengkap</label>
        <input
          id="name"
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium" htmlFor="occupation">Pekerjaan (opsional)</label>
        <input
          id="occupation"
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
        />

        <label className="block mb-2 font-medium" htmlFor="role">Role</label>
        <select
          id="role"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <label className="block mb-2 font-medium" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium" htmlFor="confirmPassword">Konfirmasi Password</label>
        <input
          id="confirmPassword"
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
}}