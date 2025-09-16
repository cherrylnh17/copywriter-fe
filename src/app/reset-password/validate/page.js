import { Suspense } from "react";
import Navbar from "@/auth/Navbar";
import ValidatePassword from "./ValidatePassword"; 

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-pink-400/40 via-yellow-400/40 to-orange-400/40 text-white">
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <ValidatePassword />
      </Suspense>
    </div>
  );
}
