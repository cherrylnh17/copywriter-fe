"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordValidatePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Token Tidak Ditemukan",
        text: "Token tidak valid atau tidak tersedia.",
        icon: "error",
        confirmButtonText: "Kembali ke Login",
      }).then(() => {
        window.location.href = "/sign-in";
      });
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reset-password/validate?token=${token}`
        );
        const data = await res.json();

        if (!res.ok || data.status !== "success") {
          throw new Error(data.message || "Token tidak valid.");
        }

      } catch (err) {
        Swal.fire({
          title: "Token telah kadaluarsa",
          text: err.message || "Token tidak valid atau sudah kedaluwarsa.",
          icon: "error",
          confirmButtonText: "Reset Ulang",
        }).then(() => {
          window.location.href = "/reset-password";
        });
      }
    };

    validateToken();
  }, [token]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset error
    setPasswordError("");
    setConfirmError("");

    // Validasi
    if (!password || password.length < 6) {
      setPasswordError("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reset-password/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword: password }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mereset password.");

      Swal.fire({
        title: "Berhasil!",
        text: "Password berhasil direset.",
        icon: "success",
        confirmButtonText: "Login",
      }).then(() => {
        window.location.href = "/sign-in";
      });
    } catch (err) {
      Swal.fire({
        title: "Gagal",
        text: err.message || "Terjadi kesalahan.",
        icon: "error",
        confirmButtonText: "Coba Lagi",
      });
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 4, md: 6 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
        }}
      >
        Atur Ulang Password
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Password Baru */}
        <TextField
          label="Password Baru"
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <Button
                size="small"
                onClick={() => setShowPassword(!showPassword)}
                sx={{ minWidth: 0, p: 0.5, color: "white" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
              "&.Mui-focused fieldset": { borderColor: "#fff" },
            },
            "& .MuiInputBase-input": {
              color: "#fff",
            },
            "& .MuiInputLabel-root": {
              color: "#fff",
              fontWeight: "bold",
            },
            "& .MuiFormHelperText-root": {
              color: "#fff",
            },
          }}
        />

        {/* Konfirmasi Password */}
        <TextField
          label="Konfirmasi Password"
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          required
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!confirmError}
          helperText={confirmError}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <Button
                size="small"
                onClick={() => setShowPassword(!showPassword)}
                sx={{ minWidth: 0, p: 0.5, color: "white" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
              "&.Mui-focused fieldset": { borderColor: "#fff" },
            },
            "& .MuiInputBase-input": {
              color: "#fff",
            },
            "& .MuiInputLabel-root": {
              color: "#fff",
              fontWeight: "bold",
            },
            "& .MuiFormHelperText-root": {
              color: "#fff",
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
            color: "white",
            fontWeight: "bold",
            "&:hover": {
              background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
            },
          }}
        >
          Reset Password
        </Button>
      </Box>
    </Box>
  );
}
