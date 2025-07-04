'use client';

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  short_description: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  perks: string;
  slug: string;
  backer_count: number;
  user_id: number;
}

interface ApiResponse {
  message: string;
  status: number;
  data: {
    campaigns: Campaign[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalCampaigns: number;
  };
}

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function fetchCampaigns() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/campaigns`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal ambil data campaign");
      setCampaigns(data.data.campaigns);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  fetchCampaigns();
}, []);


  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <>
      {/* Header dengan ikon */}
      <div className="flex flex-col items-center mb-4">
        <div className="bg-green-100 p-3 rounded-full mb-2">
          <FileText className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-700">Campaign Table</h1>
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="w-full text-sm text-center text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">Campaign</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Goal</th>
              <th scope="col" className="px-6 py-3">Current</th>
              <th scope="col" className="px-6 py-3">Backers</th>
              <th scope="col" className="px-6 py-3">Slug</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(campaign => (
              <tr key={campaign.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3 text-left">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="font-medium text-gray-800">{campaign.name}</div>
                </td>
                <td className="px-6 py-4">{campaign.short_description}</td>
                <td className="px-6 py-4">Rp{campaign.goal_amount.toLocaleString()}</td>
                <td className="px-6 py-4">Rp{campaign.current_amount.toLocaleString()}</td>
                <td className="px-6 py-4">{campaign.backer_count}</td>
                <td className="px-6 py-4">{campaign.slug}</td>
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
