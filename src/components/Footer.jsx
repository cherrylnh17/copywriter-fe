"use client"
import React from 'react';
import { Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1c1c2e]/40 backdrop-blur-xl border border-white/40 rounded-lg text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="md:flex md:justify-between md:items-center text-center md:text-left">

          <div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white">
              Malas Nulis
            </h2>
            <p className="mt-2 text-sm max-w-sm">
              AI Copywriter untuk bantu kamu buat caption, deskripsi, dan konten menarik dengan mudah dan cepat.
            </p>
          </div>

          <div className="flex justify-center md:justify-end space-x-8 text-2xl">
            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="Youtube" className=" hover:text-red-500 transition-colors duration-300">
              <Mail />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/30 text-center text-sm">
          <p>&copy; {currentYear} copywriter.my.id. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
