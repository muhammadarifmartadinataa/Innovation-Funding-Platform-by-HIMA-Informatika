'use client'

export default function Hero() {
  return (
    <section className="bg-indigo-600 text-white py-24 text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Dukung Kampanye dan Wujudkan Perubahan
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        Bersama kita bisa membantu mewujudkan ide-ide besar melalui donasi dan dukungan nyata.
      </p>
      <a
        href="/campaigns"
        className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
      >
        Lihat Campaign
      </a>
    </section>
  )
}
