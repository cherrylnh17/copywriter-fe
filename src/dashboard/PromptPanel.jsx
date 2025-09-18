"use client";
import React, { useState, useEffect } from "react";
import { Clipboard } from "lucide-react";
import Swal from "sweetalert2";

export default function PromptPanel() {
  const [platform, setPlatform] = useState("facebook");
  const [type, setType] = useState("full");
  const [tone, setTone] = useState("formal");
  const [language, setLanguage] = useState("indonesia");
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [latest, setLatest] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire("Disalin!", "Teks berhasil disalin ke clipboard ", "success");
  };


  const fetchLatest = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contents?limit=1&sort=created_at&order=DESC`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (res.ok && result.data?.contents?.length > 0) {
        setLatest(result.data.contents[0]);
      }
    } catch (error) {
      console.error("Gagal ambil konten terbaru:", error);
    }
  };

  const handleSubmit = async () => {
    if (!inputPrompt.trim()) {
      Swal.fire("Oops!", "Prompt tidak boleh kosong!", "warning");
      return;
    }

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            platform,
            type,
            tone,
            language,
            input_prompt: inputPrompt,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        const content = data.data.addedContent;
        setLatest(content);
        Swal.fire("Berhasil!", "Konten berhasil dibuat!", "success");
        setInputPrompt("");
      } else {
        Swal.fire("Gagal!", data.message || "Terjadi kesalahan.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Terjadi kesalahan jaringan.", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Hasilkan Konten Baru</h2>
      <p className="text-gray-700 mb-4">
        Tuliskan instruksi atau prompt Anda untuk menghasilkan konten.
      </p>

      {/* Form Input */}
      <div className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="p-3 w-full rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-3 w-full rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="full">Full</option>
            <option value="caption">Caption</option>
            <option value="tweet">Tweet</option>
          </select>

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="p-3 w-full rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="formal">Formal</option>
            <option value="kasual">Kasual</option>
            <option value="persuasif">Persuasif</option>
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-3 w-full rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="indonesia">Indonesia</option>
            <option value="english">Inggris</option>
          </select>
        </div>

        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          rows="6"
          placeholder="Tuliskan ide atau prompt Anda di sini..."
        ></textarea>

        <button
          disabled={loading}
          className="w-full mt-6 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 hover:scale-105 transform transition duration-300 disabled:opacity-50"
          onClick={handleSubmit}
        >
          {loading ? "Mengirim..." : "Generate Konten ✨"}
        </button>
      </div>

      {/* Hasil Terbaru */}
      {latest && latest.generated_content && latest.generated_content.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4">✨ Hasil Terbaru</h3>
          <div className="text-sm text-gray-500 mb-3">
            {latest.platform} • {latest.type} • {latest.tone} • {latest.language}
          </div>

          {(() => {
            const content = latest.generated_content[0];

            // Format teks jadi blok gabungan
            const fullText = `🚀 ${content.caption}\n📌 ${content.description}\n${content.hashtags}`;

            return (
              <div className="flex items-start justify-between">
                <pre className="text-gray-800 whitespace-pre-line flex-1">
                  {fullText}
                </pre>
                <button
                  onClick={() => handleCopy(fullText)}
                  className="ml-4 p-2 text-gray-500 hover:text-indigo-600"
                >
                  <Clipboard size={20} />
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
