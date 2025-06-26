'use client'

import Link from 'next/link'

export default function JoinUsSection() {
  return (
    <section className="py-20 bg-red-800 text-white text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Mulai Perubahan Hari Ini</h1>
        <p className="text-lg mb-12">
          Bergabunglah sebagai donatur atau buat campaign untuk bantu mereka yang membutuhkan.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/daftar-campaign"
            className="bg-white text-red-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Lihat Campaign
          </Link>
          <Link
            href="/buat-campaign"
            className="bg-red-800 px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-red-800 transition"
          >
            Buat Campaign
          </Link>
        </div>
      </div>
    </section>
  )
}
