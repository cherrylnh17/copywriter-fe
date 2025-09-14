'use client';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import Swal from 'sweetalert2';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';

export default function OtpForm() {
  const [code, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60); //timer kirim ulang OTP
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Email tidak ditemukan',
        text: 'Silakan daftar ulang untuk mendapatkan OTP.',
        confirmButtonText: 'Daftar',
      }).then(() => {
        window.location.href = '/sign-up';
      });
    }
  }, [email]);

  // Countdown tombol kirim ulang
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (value) => {
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (code.length !== 6) {
      setMessage('Kode OTP harus 6 digit.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://malasnulis-api-production-016f.up.railway.app/api/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          email, 
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Verifikasi gagal.');

      await Swal.fire({
        icon: 'success',
        title: 'Verifikasi Berhasil!',
        text: 'Anda akan diarahkan ke Dashboard.',
        confirmButtonText: 'Lanjut',
      });
      window.location.href = '/sign-in';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Verifikasi Gagal',
        text: error.message || 'OTP salah atau sudah kedaluwarsa.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setMessage('');

    try {
      const res = await fetch('https://malasnulis-api-production-016f.up.railway.app/api/users/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }) 
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Gagal mengirim ulang OTP.');

      Swal.fire({
        icon: 'success',
        title: 'OTP Terkirim',
        text: 'Kode OTP baru telah dikirim ke email Anda.',
      });
      setResendCooldown(60); // Reset timer
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim Ulang OTP',
        text: error.message || 'Terjadi kesalahan saat mengirim OTP.',
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ maxWidth: 400, mx: 'auto', mt: 6 }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Verifikasi OTP
      </Typography>

      <Typography variant="body2" mb={2} textAlign="center" color="text.secondary">
        Masukkan 6 digit kode OTP yang dikirim ke email Anda.
      </Typography>

      <OtpInput
        value={code}
        onChange={handleChange}
        numInputs={6}
        renderInput={(props) => (
          <input
            {...props}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            style={{
              width: '3rem',
              height: '3rem',
              fontSize: '1.5rem',
              borderRadius: 8,
              border: '1px solid #ccc',
              margin: '0 0.25rem',
              textAlign: 'center',
            }}
          />
        )}
      />


      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 3, width: '100%' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Verifikasi'}
      </Button>

      <Button
        variant="text"
        color="secondary"
        onClick={handleResend}
        disabled={resendLoading || resendCooldown > 0}
        sx={{ mt: 2 }}
      >
        {resendLoading
          ? 'Mengirim...'
          : resendCooldown > 0
          ? `Kirim ulang OTP (${resendCooldown}s)`
          : 'Kirim ulang OTP'}
      </Button>
    </Box>
  );
}
