"use client";
import React from "react";

export default function Feature() {
    const features = [
    {
      title: "Generate Caption & Deskripsi Otomatis",
      description:
        "Buat deskripsi produk, caption sosial media, dan konten kreatif lainnya dengan cepat dan mudah hanya dengan beberapa kata kunci.",
      icon: "🤖",
    },
    {
      title: "Login dan Simpan Riwayat",
      description:
        "User dapat login dan menyimpan semua hasil generate di riwayat untuk digunakan kembali kapan saja.",
      icon: "🔐",
    },
    {
      title: "Input Sederhana, Output Berkualitas",
      description:
        "Masukkan ide atau kata kunci sederhana, AI kami akan menghasilkan deskripsi yang siap pakai dan menarik.",
      icon: "✍️",
    },
    {
      title: "Cepat & Efisien",
      description:
        "Proses generate cepat tanpa menunggu lama, sehingga kamu bisa langsung gunakan hasilnya untuk jualan atau promosi.",
      icon: "⚡",
    },
    {
      title: "Dukungan Beragam Gaya Bahasa",
      description:
        "Pilih gaya bahasa yang cocok untuk target pasar: formal, casual, friendly, marketing, dan lainnya.",
      icon: "🎨",
    },
    {
      title: "Free & Tanpa Batas",
      description:
        "Gunakan layanan ini sepuasnya tanpa batasan, gratis untuk semua pengguna.",
      icon: "🆓",
    },
  ];


  return (
    <section id="fitur" className="py-20 px-4 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-xl md:text-4xl font-bold text-white tracking-wide drop-shadow-lg">
          Fitur Unggulan
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="
              p-6 rounded-2xl bg-pink-600/30 bg-opacity-20 backdrop-blur-md border border-pink-600
              shadow-lg shadow-yellow-700/40 text-center cursor-pointer
              transform transition duration-300 ease-in-out
              hover:scale-105 hover:shadow-yellow-400/70 hover:border-yellow-400
              hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.7)]
            "
          >
            <div className="text-6xl mb-6 inline-flex justify-center items-center w-20 h-20 mx-auto rounded-full bg-yellow-500 bg-opacity-70 text-yellow-900 shadow-md shadow-yellow-800/50">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
            <p className="text-yellow-200 text-sm md:text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
