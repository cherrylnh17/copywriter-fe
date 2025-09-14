"use client";
import * as React from "react";

export default function HomePanel() {
  return (
    <div className="p-6">
        <h2 className="text-3xl font-bold mb-4">Selamat Datang di AI Copywriter</h2>
        <p className="text-gray-700">Buat deskripsi produk, postingan sosial media, dan konten kreatif lainnya dengan bantuan AI.</p>
        <div className="flex items-center space-x-4 mt-2 mb-6 text-indigo-600 font-semibold">
          <span className="text-lg">🎯 Cepat</span>
          <span className="text-lg">|</span>
          <span className="text-lg">Efisien</span>
          <span className="text-lg">|</span>
          <span className="text-lg">Siap Pakai</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Total Konten Dibuat</h3>
              <p className="text-2xl font-bold text-indigo-600">-</p>
            </div>
        </div>
    </div>
  );
}
