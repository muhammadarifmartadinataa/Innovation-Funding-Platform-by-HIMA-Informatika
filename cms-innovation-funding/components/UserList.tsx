'use client';

import { useEffect, useState } from "react";
import { UserCircle2, Pencil, Trash2 } from "lucide-react";

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

export default function UserList() {
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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">👤 Authors Table</h1>
      <div className="overflow-auto rounded-xl shadow border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-4">Profile</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Occupation</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="bg-blue-100 p-2 rounded-full w-fit">
                    <UserCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.occupation || "-"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3 justify-center items-center">
                  <button className="text-blue-600 hover:text-blue-800 transition">
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800 transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
