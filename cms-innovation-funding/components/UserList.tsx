'use client';
import { useEffect, useState } from 'react';
import { UserCircle2, Home } from 'lucide-react';

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-10">📊 MyCMS</h2>
        <nav className="flex flex-col gap-4 text-gray-700">
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium hover:text-blue-600"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </a>
          {/* Tambahkan menu lain di sini jika perlu */}
        </nav>
        <div className="mt-auto pt-10 border-t text-xs text-gray-400">
          © 2025 MyCMS
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">👥 User List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 transition hover:shadow-lg border border-gray-100"
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <UserCircle2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.occupation}</p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
