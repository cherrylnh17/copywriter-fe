"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Reviews() {
  const testimonials = [
    {
      name: "Rina W.",
      feedback: "AI Copywriter sangat membantu mempercepat pekerjaan konten saya!",
      rating: 5,
    },
    {
      name: "Andi P.",
      feedback: "Deskripsinya selalu keren bangett dan sesuai dengan target audiens.",
      rating: 4,
    },
    {
      name: "Salsa A.",
      feedback: "Saya tidak perlu mikir lama untuk bikin caption, tinggal klik!",
      rating: 5,
    },
    {
      name: "Dimas R.",
      feedback: "Cocok banget buat jualan di marketplace. Sangat memudahkan.",
      rating: 4,
    },
    {
      name: "Laras M.",
      feedback: "Keren! Sudah kayak punya tim copywriter sendiri.",
      rating: 1,
    },
  ];

  return (
    <section id="review" className="py-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-wide">
          Apa Kata Pengguna
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="
                  p-8 rounded-3xl shadow-xl text-center
                  bg-white/20 backdrop-blur-md border border-white/40
                  transition-all duration-300
                "
              >
                <p className="text-xl italic text-gray-200 mb-4">"{t.feedback}"</p>
                <p className="font-semibold text-white text-lg">{t.name}</p>
                <div className="text-yellow-400 mt-1">
                  {"⭐".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
