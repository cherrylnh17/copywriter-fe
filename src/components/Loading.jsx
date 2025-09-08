"use client";
import { useState, useEffect } from "react";
import { Atom } from 'react-loading-indicators';

export default function Loading({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // cek udah pernah di load belum
    const hasLoaded = localStorage.getItem("hasLoaded");

    if (hasLoaded) {
      setLoading(false);
      return;
    }

    // kalau udah pernah gausah di load
    const timer = setTimeout(() => {
      setLoading(false);
      localStorage.setItem("hasLoaded", "true"); 
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white transition-opacity duration-500">
        <Atom color="#a2ff00" size="large" speedPlus="-2" text="Loading..." />
      </div>
    );
  }

  return children;
}
