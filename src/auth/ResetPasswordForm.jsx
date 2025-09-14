"use client";
import * as React from "react";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
} from "@mui/material";

export default function ResetPasswordForm() {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [timer, setTimer] = React.useState(0);
    React.useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);



    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.email.value.trim();

    // Validasi email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Masukan alamat email yang valid.");
      return;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (timer > 0) {
      // ada timer jan submit
      return;
    }


    setLoading(true);

    try {
      const res = await fetch(
        "https://malasnulis-api-production-016f.up.railway.app/api/reset-password/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mengirimkan link.");

      Swal.fire({
        title: "Success!",
        text:
          "Link Reset Password Telah Dikirim Ke Email Anda.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // blum kepikiran redirect mana
      });
      setTimer(300);

    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Ada yang tidak beres.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
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
          background: "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
        }}
      >
        Reset Password
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
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
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
              "&.Mui-focused fieldset": { borderColor: "#fff" },
            },
            "& .MuiInputBase-input": { 
                color: "#fff",
                paddingLeft: '10px',
             },
            "& .MuiInputLabel-root": { 
                color: "#fff", 
                fontWeight: 'bold' 
            },
          }}
        />

        <Button
            aria-label="reset-password"
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading || timer > 0}
            sx={{
                background: timer > 0
                ? "grey"
                : "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                boxShadow: timer > 0
                ? "none"
                : "0 3px 5px 2px rgba(255, 105, 135, .3)",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                background: timer > 0
                    ? "grey"
                    : "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
                },
                "&.Mui-disabled": {
                    color: "white",
                }

            }}
            >
            {loading
                ? "Mengirim..."
                : timer > 0
                ? `Kirim ulang dalam ${timer}s`
                : "Kirim Link Reset"}
            </Button>
      </Box>

      <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.3)" }}>
        <Typography sx={{ color: "rgba(255, 255, 255, 0.6)" }}>or</Typography>
      </Divider>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", mt: 2, mb: 1, color: "rgba(255, 255, 255, 0.8)" }}
      >
        Remember your password?{" "}
        <Link href="/sign-in" underline="hover" sx={{ color: "white" }}>
          Sign in
        </Link>
      </Typography>
    </Box>
  );
}
