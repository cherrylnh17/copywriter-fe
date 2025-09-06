"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from '@mui/material/Button';

export default function Hero() {
  const heading = "AI Copywriter - Generate Caption & Deskripsi dalam Sekejap";
  const subheading =
    "Buat deskripsi produk, postingan sosial media, dan konten kreatif lainnya dengan bantuan AI.";
  const subheading2 = "🎯 Cepat - Efisien - Siap Pakai";
  const cta = "Coba Sekarang";
  const MotionButton = motion(Button);

  return (
    <header id="home" className="relative w-full min-h-screen flex items-center justify-center text-center p-6 overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-4xl mx-auto p-4 md:p-8 space-y-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl md:text-6xl font-extrabold text-gray-100 drop-shadow-[0_0_10px_rgba(0,0,0,0.7)] leading-tight"
        >
          {heading}
        </motion.h1>

        <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="text-sm md:text-xl text-gray-300 drop-shadow-[0_0_6px_rgba(0,0,0,0.5)] leading-relaxed max-w-3xl mx-auto"
        >
          {subheading}
        </motion.p>

        <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="text-sm md:text-xl text-gray-300 drop-shadow-[0_0_6px_rgba(0,0,0,0.5)] leading-relaxed max-w-3xl mx-auto"
        >
          {subheading2}
        </motion.p>

        <MotionButton
          variant="contained"
          component={Link}
          href="/login"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          sx={{
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            paddingX: 2,
            paddingY: 1,
            fontWeight: '600',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          }}
          >
            {cta}
          </MotionButton>


      </motion.div>
    </header>
  );
}
