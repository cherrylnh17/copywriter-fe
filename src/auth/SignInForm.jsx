"use client";
import * as React from "react";
import Swal from "sweetalert2";
import {
  Box, Typography, TextField, Button, Link, Checkbox,
  FormControlLabel, Divider,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";

import { loginUser, getUserProfile } from "@/lib/api";

export default function SignInForm() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const validateInputs = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const { tokens, profile } = await loginUser({ email, password });

      localStorage.setItem("user", JSON.stringify(profile));

      Swal.fire({
        title: "Login Berhasil!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/studio/home";
      });
    } catch (err) {
      console.error("Login error:", err.message);

      if (err.message === "akun anda belum diverifikasi") {
        Swal.fire({
          title: "Akun Belum Diverifikasi",
          text: "Silakan verifikasi akun kamu sebelum login.",
          icon: "warning",
          confirmButtonText: "Verifikasi Sekarang",
        }).then(() => {
          window.location.href = `/verify-account?email=${encodeURIComponent(email)}`;
        });
      } else {
        Swal.fire({
          title: "Login Gagal",
          text: "Terjadi kesalahan saat login.",
          icon: "error",
          confirmButtonText: "Coba Lagi",
        });
      }
    } finally {
      setIsLoading(false);
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
        Sign in
      </Typography>

      <Box component="form" noValidate onSubmit={validateInputs} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Email"
          id="email"
          name="email"
          type="email"
          required
          fullWidth
          error={emailError}
          helperText={emailErrorMessage}
          autoComplete="email"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: '#fff' },
              '&.Mui-focused fieldset': { borderColor: '#fff' },
            },
            '& .MuiInputBase-input': { color: '#fff' },
            '& .MuiInputLabel-root': { color: '#fff' },
          }}
        />

        <TextField
          label="Password"
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          fullWidth
          error={passwordError}
          helperText={passwordErrorMessage}
          autoComplete="current-password"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: '#fff' },
              '&.Mui-focused fieldset': { borderColor: '#fff' },
            },
            '& .MuiInputBase-input': { color: '#fff' },
            '& .MuiInputLabel-root': { color: '#fff' },
          }}
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
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <FormControlLabel
            control={<Checkbox name="remember" color="white" sx={{ color: 'white' }} />}
            label={<Typography sx={{ color: 'white' }}>Remember me</Typography>}
          />
          <Link href="/reset-password" underline="hover" variant="body2" sx={{ color: 'white' }}>
            Forgot password?
          </Link>
        </Box>

        <Button
          aria-label="login"
          variant="contained"
          type="submit"
          fullWidth
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
            }
          }}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </Box>

      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>or</Typography>
      </Divider>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", mt: 2, mb: 1, color: "rgba(255, 255, 255, 0.8)" }}
      >
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" underline="hover" sx={{ color: "white" }}>
          Sign up
        </Link>
      </Typography>
    </Box>
  );
}
