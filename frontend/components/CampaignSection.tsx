'use client'

type Campaign = {
  id: number
  name: string
  short_description: string
  goal_amount: number
  current_amount: number
  slug: string
  image_url: string
}

const dummyCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Air Bersih untuk Desa Pelosok",
    short_description: "Bantu bangun sumur untuk masyarakat yang kesulitan air bersih.",
    goal_amount: 10000000,
    current_amount: 3500000,
    slug: "air-bersih-desa",
    image_url: "https://source.unsplash.com/600x400/?village,water",
  },
  {
    id: 2,
    name: "Beasiswa Anak Yatim",
    short_description: "Ayo bantu anak yatim tetap sekolah dan meraih cita-citanya.",
    goal_amount: 15000000,
    current_amount: 8000000,
    slug: "beasiswa-anak-yatim",
    image_url: "https://source.unsplash.com/600x400/?education,children",
  },
]

export default function CampaignSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-12">
          Campaign Unggulan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={campaign.image_url}
                alt={campaign.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-red-800">{campaign.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{campaign.short_description}</p>

                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-1">
                    {campaign.current_amount.toLocaleString()} / {campaign.goal_amount.toLocaleString()} IDR
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-800 h-2 rounded-full"
                      style={{
                        width: `${Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <a
                  href={`/campaigns/${campaign.slug}`}
                  className="inline-block mt-4 text-red-800 font-medium hover:underline"
                >
                  Lihat Detail
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
