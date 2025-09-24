"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, logoutUser } from "@/lib/api"; 

export default function TokenLogin({ children }) {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken && !refreshToken) {
        router.push("/sign-in");
        return;
      }

      try {
        await getUserProfile(); 
        router.push("/studio/home");
      } catch (error) {
        await logoutUser();
        router.push("/sign-in");
      }
    }

    checkAuth();
  }, []);

  return <>{children}</>;
}
