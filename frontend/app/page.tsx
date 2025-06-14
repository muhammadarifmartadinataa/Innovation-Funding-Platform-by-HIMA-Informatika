'use client'

import Hero from '@/components/Hero'
import CampaignCard from '@/components/CampaignSection'
import Stats from '@/components/StatsSection'
import TestimonialsSection from "@/components/TestimonialsSection"

export default function HomePage() {
  // Dummy data
  const campaigns = [
    {
      id: 1,
      name: 'Bantu Renovasi Mushola Nurul Iman',
      image: '/images/mushola.jpg',
      short_description: 'Penggalangan dana untuk perbaikan atap dan fasilitas mushola.',
      current_amount: 3500000,
      goal_amount: 10000000,
    },
    {
      id: 2,
      name: 'Bantu Biaya Sekolah Anak Yatim',
      image: '/images/sekolah.jpg',
      short_description: 'Donasi untuk kebutuhan pendidikan anak-anak yatim.',
      current_amount: 7200000,
      goal_amount: 15000000,
    },
    {
      id: 3,
      name: 'Pengadaan Air Bersih di Desa Tertinggal',
      image: '/images/air-bersih.jpg',
      short_description: 'Membantu penyediaan air bersih untuk warga desa.',
      current_amount: 5100000,
      goal_amount: 20000000,
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Hero />

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-red-800 mb-10">Campaign Unggulan</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </section>

      <Stats />
      <TestimonialsSection />

    </main>
  )
}
