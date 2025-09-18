"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { List } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";

export default function Header({ onToggleSidebar }) {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getInitials = (fullName) => {
    if (!fullName) return "ID";
    const nameParts = fullName.trim().split(" ");
    return nameParts.slice(0, 2).map((n) => n[0].toUpperCase()).join("");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const profileString = localStorage.getItem("userProfile");

    if (!accessToken) {
      router.push("/sign-in");
      return;
    }

    if (profileString) {
      try {
        const profile = JSON.parse(profileString);
        setEmail(profile?.data?.user?.email);
        const fullName = profile?.data?.user?.name || "";
        setName(getInitials(fullName));
      } catch (error) {
        console.error("Gagal parse profile:", error);
      }
    }

    setIsLoading(false);
  }, [router]);

  return (
    <header className="bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between sticky top-0 z-20">

      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 bg-neutral-800 rounded-lg text-gray-300 hover:text-white hover:bg-neutral-700 transition md:hidden"
          aria-label="Toggle Sidebar"
        >
          <List size={20} />
        </button>
        <h1 className="text-white text-lg font-bold hidden md:block">AI Copywriter</h1>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-400 text-sm">
          {isLoading ? "Loading..." : email || "Users"}
        </span>
        <Avatar sx={{ bgcolor: deepPurple[500], width: 36, height: 36 }}>
          {name || "ID"}
        </Avatar>
      </div>
    </header>
  );
}
