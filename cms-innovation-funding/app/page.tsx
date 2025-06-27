'use client';

import { Users, FileText, CreditCard } from "lucide-react";

export default function HomePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Title and Welcome Message */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎉 Selamat Datang di Dashboard
        </h1>
        <p className="text-gray-500">
          Pantau data pengguna, campaign, dan transaksi secara real-time
        </p>
      </div>

      {/* Statistik Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Users */}
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h2 className="text-2xl font-semibold text-gray-800">124</h2>
            </div>
          </div>
        </div>

        {/* Total Campaigns */}
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <h2 className="text-2xl font-semibold text-gray-800">15</h2>
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <CreditCard className="text-yellow-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>
              <h2 className="text-2xl font-semibold text-gray-800">85</h2>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
</div>