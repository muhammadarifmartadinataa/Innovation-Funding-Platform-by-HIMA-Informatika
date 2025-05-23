'use client';
import { useEffect, useState } from 'react';
import { UserCircle2 } from 'lucide-react';

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">👥 User List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
