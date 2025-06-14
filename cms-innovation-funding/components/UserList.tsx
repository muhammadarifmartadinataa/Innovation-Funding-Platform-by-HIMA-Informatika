'use client';

import { useEffect, useState } from "react";
import { UserCircle2, Home, Users, Settings } from "lucide-react";
import Image from "next/image";

// Tipe Data
interface User {
  id: number;
  name: string;
  email: string;
  occupation: string;
  role: string;
}

interface ApiResponse {
  message: string;
  status: number;
  data: {
    users: User[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalUsers: number;
  };
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`);
        const data: ApiResponse = await res.json();
        if (!res.ok) throw new Error(data.message || "Gagal ambil data user");
        setUsers(data.data.users);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-10">Argon Dashboard 2 PRO</h2>
        <nav className="flex flex-col gap-4 text-gray-700">
          <a href="#" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
            <Home className="w-5 h-5" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-2 text-sm font-medium text-blue-600">
            <Users className="w-5 h-5" /> Tables
          </a>
          <a href="#" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
            <Settings className="w-5 h-5" /> Billing
          </a>
        </nav>
        <div className="mt-auto pt-10 border-t text-xs text-gray-400">© 2025 Argon</div>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Authors table</h1>
        <div className="overflow-auto rounded-lg shadow">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">username</th>
                <th scope="col" className="px-6 py-3">Function</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Employed</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <UserCircle2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{user.name}</div>
                      <div className="text-gray-500 text-sm">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">{user.occupation}</div>
                    <div className="text-xs text-gray-500">{user.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-200 text-gray-600">
                      OFFLINE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-blue-600 hover:underline cursor-pointer">Edit</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
