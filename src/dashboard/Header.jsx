"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { List } from "lucide-react";

export default function Header({ onToggleSidebar }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const profileString = localStorage.getItem("userProfile");

    if (!accessToken) {
      router.push("/sign-in");
      return;
    }

    setToken(accessToken);

    if (profileString) {
      try {
        const profile = JSON.parse(profileString);
        const email = profile?.data?.user?.email;
        setEmail(email);
      } catch (error) {
        console.error("Gagal parse profile:", error);
      }
    } else {
      console.log("Data userProfile tidak ditemukan di localStorage");
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      // fallback kalau gak ada refreshToken, langsung logout
      localStorage.removeItem("user");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/sign-in");
      return;
    }

    try {
      const response = await fetch("https://malasnulis-api-production-016f.up.railway.app/api/authentications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      console.log("Logout response:", data);

      // hapus token di localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redirect
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);

      // tetep apus walaupun error
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/sign-in");
    }
  };


  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-700 bg-gray-100 rounded-md shadow-md md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Sidebar"
        >
          <List />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600">
          {isLoading ? "Loading..." : email || "Users"}
        </span>
        <button
          onClick={handleLogout}
          className="cursor-pointer text-sm px-4 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}
