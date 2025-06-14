'use client'

export default function Hero() {
    return (
        <section className="min-h-screen bg-gradient-to-b from-red-700 to-red-900 text-white py-24 text-center px-4 flex flex-col justify-center items-center ">
            {/* Logo dan Judul di Kiri Atas */}
            <div className="absolute top-6 left-6 flex items-center space-x-3">
                <img src="/hero.png" alt="Logo HIMA" className="h-10 w-auto object-contain rounded-2xl" />
                <h1 className="font-semibold">
                    Innovation Funding Platform by HIMA Informatika
                </h1>
            </div>

            <h3 className="text-4xl md:text-6xl font-bold mb-6">
                Dukung Kampanye dan Wujudkan Perubahan<br className="mb-6"/>
                Bersama HIMA INFORMATIKA
            </h3>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Bersama kita bisa membantu mewujudkan ide-ide besar melalui donasi dan dukungan nyata.
            </p>
            <a
                href="/campaigns"
                className="inline-block bg-white text-red-800 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
            >
                Lihat Campaign
            </a>
        </section>
    )
}
