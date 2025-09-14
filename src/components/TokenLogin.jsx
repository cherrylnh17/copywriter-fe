"use client";

import React, { useEffect } from "react";
import { refreshToken, logoutUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";


export default function TokenLogin({ children }) {
  const router = useRouter();

  useEffect(() => {
    async function validateToken() {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        return handleSessionExpired("Access token tidak ditemukan.");
      }

      try {
        const decoded = jwtDecode(accessToken);
        // console.log(decoded.exp);
        const now = Math.floor(Date.now() / 1000);

        // console.log("Decoded token:", decoded);
        // console.log("Now:", now, "Exp:", decoded.exp);

        if (!decoded.exp || decoded.exp < now) {
          // console.log("Access token kadaluarsa, proses refres...");
          await refreshToken();
        } else {
          // console.log("Access token valid.");
        }
      } catch (error) {
        console.error("Gagal decode token:", error);
        return handleSessionExpired("Token tidak valid atau rusak.");
      }
    }

    function handleSessionExpired(message) {
      Swal.fire({
        icon: "warning",
        title: "Session Berakhir",
        text: message || "Silakan login ulang.",
        confirmButtonText: "OK",
      }).then(() => {
        logoutUser();
        router.push("/sign-in");
      });
    }

    validateToken();

    const interval = setInterval(validateToken, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [router]);



  return <>{children}</>;
}
