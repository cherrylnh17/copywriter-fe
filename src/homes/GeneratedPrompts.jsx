"use client";
import React from "react";

export default function GeneratedPrompts() {
  const prompts = [
  {
    title: "Oka Wijaya",
    example: `Mulai bisnis onlinemu sekarang! 🚀🛒
              Oka mengandalkan AI Copywriter untuk buat caption produk yang menarik dan langsung ngejual.
              Kamu juga bisa! Gunakan AI untuk tingkatkan penjualan tanpa ribet. 💡✨
              Ayo coba sekarang dan rasakan perbedaannya!`,
    tag: "#Ecommerce #AIcopywriter #BisnisOnline",
  },
  {
    title: "Dewi Lestari",
    example: `Caption yang pas bikin produk makin laku! 🎯📈
              Dewi sukses menarik perhatian pelanggan dengan deskripsi produk yang dibuat AI.
              Jangan sampai kalah saing, manfaatkan teknologi sekarang juga!`,
    tag: "#Marketing #AI #CaptionKreatif",
  },
  {
    title: "Budi Santoso",
    example: `Buat postingan sosial media jadi lebih mudah dan efektif! ✍️🔥
              Budi pakai AI untuk generate caption keren yang bikin engagement naik.
              Mulai sekarang, hemat waktu dan hasil maksimal.`,
    tag: "#SocialMedia #AI #Engagement",
  },
];


  return (
    <section id="result" className="py-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-wide">
          Contoh Hasil AI Copywriter
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {prompts.map((card, index) => (
          <div
            key={index}
            className="p-8 rounded-3xl bg-yellow-800/50 bg-opacity-30 backdrop-blur-md shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:bg-opacity-50 cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-white mb-4 text-center">{card.title}</h3>
            <p className="text-yellow-200 mb-3">{card.example}</p>
            <div className="text-sm text-yellow-300 font-mono">{card.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
