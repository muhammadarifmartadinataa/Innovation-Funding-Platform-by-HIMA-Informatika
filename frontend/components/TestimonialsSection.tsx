'use client'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Risma Cihuy",
      role: "Pemilik Campaign",
      message:
        "Platform ini sangat membantu saya dalam menggalang dana untuk saya beli Iphone 16. Terima kasih!",
      image: "/testimoni1.jpg",
    },
    {
      name: "Adew Kecew",
      role: "Donatur",
      message:
        "Saya merasa aman dan mudah berdonasi di sini. Informasi yang ditampilkan transparan dan jelas.",
      image: "/testimoni2.jpg",
    },
    {
      name: "Arif aja",
      role: "Pemilik Campaign",
      message:
        "Dana terkumpul dalam waktu singkat! Proses verifikasi dan pencairannya juga cepat.",
      image: "/testimoni3.jpg",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-12">
          Apa Kata Mereka?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((testi, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center"
            >
              <img
                src={testi.image}
                alt={testi.name}
                className="w-20 h-20 rounded-full mb-4 object-cover"
              />
              <p className="text-gray-600 italic">"{testi.message}"</p>
              <h3 className="mt-4 text-lg font-bold text-red-800">{testi.name}</h3>
              <span className="text-sm text-gray-500">{testi.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
