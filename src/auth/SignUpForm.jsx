"use client";
import * as React from "react";
import Swal from 'sweetalert2';
import {
  Box, Typography, TextField, Button, Link, Checkbox,
  FormControlLabel, Divider, Stack
} from "@mui/material";
import { Eye, EyeOff, Facebook, LogIn } from "lucide-react";

export default function SignUpForm() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [passwordVerifyError, setPasswordVerifyError] = React.useState(false);
  const [passwordVerifyErrorMessage, setPasswordVerifyErrorMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordVerify, setShowPasswordVerify] = React.useState(false);

  const validateInputs = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const passwordVerify = event.target.passwordVerify.value;

    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Masukan alamat email yang valid.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Kata sandi harus 8 karakter.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!passwordVerify || passwordVerify != password) {
      setPasswordVerifyError(true);
      setPasswordVerifyErrorMessage("Kata sandi tidak sesuai.");
      isValid = false;
    } else {
      setPasswordVerifyError(false);
      setPasswordVerifyErrorMessage("");
    }

    if (isValid) {
      try {
        const res = await fetch("https://malasnulis-api-production-016f.up.railway.app/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
      
        let data;
        try {
          const text = await res.text();
          try {
            data = JSON.parse(text); 
          } catch {
            console.error("Respon bukan JSON:\n", text);
            throw new Error("Server error: response bukan JSON");
          }
        } catch (e) {
          throw new Error("Gagal membaca respon dari server");
        }


        if (!res.ok) throw new Error(data.message || "Pendaftaran Gagal");

        console.log("Respon dari server", data);

         Swal.fire({
          title: 'Pendaftaran Berhasil!',
          text: 'Silakan melakukan login ke akun anda.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.href = `/verify-account?email=${encodeURIComponent(email)}`;
        });

        
      } catch (err) {
        console.error("Terjadi kesalahan: ", err.message);

        Swal.fire({
          title: 'Pendaftaran Gagal',
          text: err.message || 'Terjadi kesalahan saat mendaftar.',
          icon: 'error',
          confirmButtonText: 'Coba Lagi',
        });
      }
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
        Sign up
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
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                size="small"
                onClick={() => setShowPassword(!showPassword)}
                sx={{ minWidth: 0, p: 0.5, color: "white" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            ),
          }}
        />


        <TextField
          label="Ulangi Kata Sandi"
          id="passwordVerify"
          name="passwordVerify"
          type={showPasswordVerify ? "text" : "password"}
          required
          fullWidth
          error={passwordVerifyError}
          helperText={passwordVerifyErrorMessage}
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
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                size="small"
                onClick={() => setShowPasswordVerify(!showPasswordVerify)}
                sx={{ minWidth: 0, p: 0.5, color: "white" }}
              >
                {showPasswordVerify ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            ),
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <FormControlLabel
            control={<Checkbox name="remember" color="white" sx={{ color: 'white' }} />}
            label={<Typography sx={{ color: 'white' }}>Remember me</Typography>}
          />
        </Box>

        <Button
          aria-label="sign in"
          variant="contained"
          type="submit"
          fullWidth
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
          Sign up
        </Button>
      </Box>

      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>or</Typography>
      </Divider>

      

      <Typography
        variant="body2"
        sx={{ textAlign: "center", mt: 2, mb: 1, color: "rgba(255, 255, 255, 0.8)" }}
      >
        sudah memiliki akun?{" "}
        <Link href="/sign-in" underline="hover" sx={{ color: "white" }}>
          Sign in
        </Link>
      </Typography>
    </Box>
  );
}
