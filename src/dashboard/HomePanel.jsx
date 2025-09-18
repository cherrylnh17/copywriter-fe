"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePanel() {
  const [totalKonten, setTotalKonten] = useState("-");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKonten = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Token tidak tersedia di localStorage");
          setIsLoading(false);
          return;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contents`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Response error:", text);
          return;
        }

        const result = await res.json();
        setTotalKonten(result?.data?.contents?.length || 0);
      } catch (error) {
        console.error("Gagal fetch konten:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKonten();
  }, []);

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 shadow-lg mb-8">
        <h2 className="text-4xl font-bold mb-3">
          Selamat Datang di AI Copywriter 🚀
        </h2>
        <p className="text-lg opacity-90 max-w-2xl">
          Buat deskripsi produk, postingan sosial media, dan konten kreatif
          lainnya dengan bantuan AI. Hemat waktu, tingkatkan produktivitas, dan
          biarkan AI membantu ide kreatifmu.
        </p>
        <div className="flex flex-wrap gap-4 mt-6 text-sm font-medium">
          <span className="bg-white/20 px-4 py-2 rounded-full">⚡ Cepat</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">🎯 Efisien</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">
            ✨ Siap Pakai
          </span>
        </div>
      </div>

      {/* Statistik Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Total Konten */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Konten Dibuat
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            {isLoading ? "Loading..." : totalKonten}
          </p>
        </div>

        {/* Card Penggunaan */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Riwayat Penggunaan
          </h3>
          <p className="text-gray-600">
            Lihat kembali konten yang pernah kamu buat dengan AI Copywriter.
          </p>
          <Link 
            href="/studio/history"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Lihat Riwayat
          </Link>
        </div>

        {/* Card Mulai Membuat */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Buat Konten Baru
          </h3>
          <p className="text-gray-600">
            Pilih template yang kamu butuhkan untuk mulai membuat konten.
          </p>
          <Link
            href="/studio/prompt"
            className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Buat Konten
          </Link>
        </div>
      </div>
    </div>
  );
}
