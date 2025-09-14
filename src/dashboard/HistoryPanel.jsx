"use client";
import * as React from "react";

export default function HistoryPanel() {
    const historyData = [
        {
        "id": 1,
        "platform": "Facebook",
        "type": "Postingan",
        "tone": "Formal",
        "language": "ID",
        "input_prompt": "Deskripsi produk baru tentang sepatu lari yang ringan dan nyaman.",
        },
        {
        "id": 2,
        "platform": "Instagram",
        "type": "Caption",
        "tone": "Kasual",
        "language": "ID",
        "input_prompt": "Caption untuk foto liburan di pantai yang cerah dan indah.",
        },
        {
        "id": 3,
        "platform": "Email",
        "type": "Deskripsi",
        "tone": "Persuasif",
        "language": "EN",
        "input_prompt": "Email promosi untuk diskon 50% produk baru yang sangat terbatas.",
        },
        {
        "id": 4,
        "platform": "Twitter",
        "type": "Tweet",
        "tone": "Informal",
        "language": "ID",
        "input_prompt": "Informasi singkat tentang pembaruan aplikasi terbaru."
        }
    ];
    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Riwayat Konten</h2>
            <p className="text-gray-700">Semua konten yang kamu generate akan tersimpan di sini. Ini adalah halaman untuk melihat riwayat konten yang sudah dibuat.</p>
            <div className="bg-white p-6 rounded-lg shadow-md mt-4 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Platform</th>
                    <th className="py-3 px-6 text-left">Tipe</th>
                    <th className="py-3 px-6 text-left">Nada</th>
                    <th className="py-3 px-6 text-left">Bahasa</th>
                    <th className="py-3 px-6 text-left">Prompt Input</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {historyData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{item.platform}</td>
                      <td className="py-3 px-6 text-left">{item.type}</td>
                      <td className="py-3 px-6 text-left">{item.tone}</td>
                      <td className="py-3 px-6 text-left">{item.language}</td>
                      <td className="py-3 px-6 text-left truncate max-w-xs">{item.input_prompt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
    );
}
