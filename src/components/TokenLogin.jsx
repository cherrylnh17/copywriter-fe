"use client";

import React, { useEffect } from "react";
import { logoutUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export default function TokenLogin({ children }) {
  const router = useRouter();

  useEffect(() => {
    function checkToken() {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return handleSessionExpired("Token tidak ditemukan, silakan login ulang.");
      }

      try {
        const decoded = jwtDecode(accessToken);
        const now = Math.floor(Date.now() / 1000);

        if (!decoded.exp || decoded.exp < now) {
          console.warn("Access token expired. Akan di-refresh saat request berikutnya.");
        } else {
          console.log("Access token valid.");
        }
      } catch (err) {
        console.error("Token rusak atau invalid:", err);
        return handleSessionExpired("Token tidak valid, silakan login ulang.");
      }
    }

    function handleSessionExpired(message) {
      Swal.fire({
        icon: "warning",
        title: "Session Berakhir",
        text: message,
        confirmButtonText: "OK",
      }).then(() => {
        logoutUser();
        router.push("/sign-in");
      });
    }

    checkToken();
  }, [router]);

  return <>{children}</>;
}
