'use client';

import { useEffect, useState } from "react";
import { UserCircle2 } from "lucide-react";

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
    <>
      <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">Authors Table</h1>
      <div className="overflow-auto rounded-lg shadow">
        <table className="w-full text-sm text-center text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">Profile</th>
              <th scope="col" className="px-6 py-3">Username</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Occupation</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3 text-left">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <UserCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{user.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{user.occupation}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{user.role}</div>
                </td>
                <td className="px-6 py-4 space-y-1">
                  <div className="font-medium text-blue-600 cursor-pointer">Edit</div>
                  <div className="font-medium text-red-600 cursor-pointer">Hapus</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
