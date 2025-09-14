"use client";
import Otp from "../../auth/Otp";
import Navbar from "../../auth/Navbar";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-pink-400/40 via-yellow-400/40 to-orange-400/40 text-white">
        <Navbar />
        <Otp />
    </div>
  );
}
