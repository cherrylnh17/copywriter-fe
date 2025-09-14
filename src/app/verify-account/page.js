import OtpWrapper from "@/auth/OtpWrapper";
import Navbar from "@/auth/Navbar";
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-pink-400/40 via-yellow-400/40 to-orange-400/40 text-white">
        <Suspense fallback={<div>Loading halaman OTP...</div>}>
          <Navbar />
          <OtpWrapper />
        </Suspense>
    </div>
  );
}
