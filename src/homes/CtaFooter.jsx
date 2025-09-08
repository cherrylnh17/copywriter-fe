"use client";
import React from "react";
import Link from "next/link";

export default function CtaFooter() {
  const heading = "Mulai Buat Kontenmu Sekarang";
  const subheading = "Daftar gratis dan ciptakan konten berkualitas dengan AI Copywriter.";
  const cta = "Mulai Sekarang";

  return (
    <section id="cta" className="py-20 px-4 text-center relative overflow-hidden">

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6 relative z-10 bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 shadow-xl">
        <h2 className="text-3xl md:text-5xl font-bold text-white font-['Orbitron'] tracking-wide">
          {heading}
        </h2>
        <p className="text-lg md:text-xl text-gray-300">{subheading}</p>

        <Link
            href="/sign-in"
            className="inline-block px-8 py-3 text-lg font-semibold text-white rounded-full 
                      bg-white/10 backdrop-blur-md border border-white/20 
                      transition-all duration-300 hover:bg-white/20 hover:shadow-lg"
          >
            {cta}
        </Link>
      </div>
    </section>
  );
}
