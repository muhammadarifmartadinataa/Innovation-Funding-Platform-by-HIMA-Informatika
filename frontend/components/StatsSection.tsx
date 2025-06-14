'use client'

export default function StatsSection() {
  const stats = [
    { label: "Total Donasi Terkumpul", value: "Rp 1.200.000.000" },
    { label: "Campaign Aktif", value: "135+" },
    { label: "Donatur Terdaftar", value: "8.500+" },
    { label: "Proyek Terselesaikan", value: "92" },
  ]

  return (
    <section className="py-20 bg-red-800 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-white mb-12">
          Kami Telah Membantu Banyak Orang
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <p className="text-4xl font-extrabold text-white">{stat.value}</p>
              <p className="text-white-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
