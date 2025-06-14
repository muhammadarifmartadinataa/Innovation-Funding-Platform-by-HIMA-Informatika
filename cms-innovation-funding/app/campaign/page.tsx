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
