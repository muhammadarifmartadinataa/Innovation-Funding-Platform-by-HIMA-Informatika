// src/app/layout.tsx
'use client';

import "../styles/globals.css";
import Link from "next/link";
import { Home, Users, Settings } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-gray-100">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-10">Hima Informatika Funding</h2>
            <nav className="flex flex-col gap-4 text-gray-700">
              <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
                <Home className="w-5 h-5" /> Dashboard
              </Link>
              <Link href="/users" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
                <Users className="w-5 h-5" /> Users
              </Link>
              <Link href="/campaign" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
                <Settings className="w-5 h-5" /> Campaign
              </Link>
              <Link href="/transaction" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
                <Settings className="w-5 h-5" /> Transaction
              </Link>
            </nav>
            <div className="mt-auto pt-10 border-t text-xs text-gray-400">© 2025 Hima Informatika</div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
