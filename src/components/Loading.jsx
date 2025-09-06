"use client";
import { useState, useEffect } from "react";
import { Atom } from 'react-loading-indicators';


export default function Loading({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white transition-opacity duration-500">
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <Atom color="#a2ff00" size="large" speedPlus="-2" text="Loading..." textColor="" />
        </div>
      </div>
    );
  }

  return children;
}
