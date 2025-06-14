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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/campaigns`);
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
}
