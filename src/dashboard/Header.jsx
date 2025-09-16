"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { List } from "lucide-react";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';

export default function Header({ onToggleSidebar }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getInitials = (fullName) => {
    if (!fullName) return "ID";
    const nameParts = fullName.trim().split(" ");
    const initials = nameParts.slice(0, 2).map(n => n[0].toUpperCase()).join("");
    return initials;
  };


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
        const fullName = profile?.data?.user?.name || "";
        setName(getInitials(fullName));
      } catch (error) {
        console.error("Gagal parse profile:", error);
      }
    } else {
      console.log("Data userProfile tidak ditemukan di localStorage");
    }

    setIsLoading(false);
  }, [router]);

  


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
         <Stack direction="row" spacing={2}>
          <Avatar sx={{ bgcolor: deepOrange[500] }}>{name || "ID"}</Avatar>
        </Stack>
      </div>
    </header>
  );
}
