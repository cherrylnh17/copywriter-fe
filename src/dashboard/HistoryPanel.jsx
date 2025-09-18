"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function HistoryPanel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("DESC");

  const [platformFilter, setPlatformFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [toneFilter, setToneFilter] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const abortControllerRef = useRef(null);

  const fetchHistory = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Token tidak tersedia. Silakan login kembali.");
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      sort,
      order,
    });

    if (platformFilter) params.append("platform", platformFilter);
    if (typeFilter) params.append("type", typeFilter);
    if (toneFilter) params.append("tone", toneFilter);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contents?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: abortControllerRef.current.signal,
        }
      );

      const result = await res.json();
      // console.log("LIST RESPONSE:", result);

      if (!res.ok) {
        throw new Error(result.message || "Gagal mengambil data");
      }

      setData(Array.isArray(result.data?.contents) ? result.data.contents : []);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [page, sort, order, platformFilter, typeFilter, toneFilter]);

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contents/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      // console.log("DETAIL RESPONSE:", result);

      if (res.ok) {
        let detail = result.data?.detailContent;

        if (Array.isArray(detail.generated_content)) {
          detail.generated_content = detail.generated_content[0]; // ambil isi pertama
        }

        setSelected(detail);
        setOpenDialog(true);
      } else {
        Swal.fire(
          "Gagal!",
          result.message || "Konten tidak ditemukan.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error!", "Gagal mengambil detail konten.", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Konten?",
      text: "Konten yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contents/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        Swal.fire("Terhapus!", "Konten berhasil dihapus.", "success");

        // hapus langsung di state biar realtime
        setData((prev) => prev.filter((item) => item.id !== id));
      } else {
        const result = await res.json();
        Swal.fire(
          "Gagal!",
          result.message || "Gagal menghapus konten.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error!", "Terjadi kesalahan saat menghapus konten.", "error");
    }
  };

  return (
    <Box p={3} maxWidth={1100} margin="auto">
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Riwayat Konten
      </Typography>
      <Typography color="textSecondary" mb={3}>
        Semua konten yang kamu generate akan tersimpan di sini.
      </Typography>

      {/* Data Table */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }} elevation={2}>
        {loading ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
            <Typography mt={2} color="textSecondary">
              Memuat data...
            </Typography>
          </Box>
        ) : error ? (
          <Box p={4} textAlign="center">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : data.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography color="textSecondary" fontStyle="italic">
              Riwayat masih kosong. Belum ada konten yang tersimpan.
            </Typography>
          </Box>
        ) : (
          <table
            className="min-w-full"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f9fafb",
                  color: "#374151",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  Platform
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  Tipe
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  Nada
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  Bahasa
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  Prompt Input
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center" }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#fff" : "#f3f4f6",
                  }}
                >
                  <td style={{ padding: "12px 16px" }}>{item.platform}</td>
                  <td style={{ padding: "12px 16px" }}>{item.type}</td>
                  <td style={{ padding: "12px 16px" }}>{item.tone}</td>
                  <td style={{ padding: "12px 16px" }}>{item.language}</td>
                  <td
                    style={{
                      padding: "12px 16px",
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={item.input_prompt}
                  >
                    {item.input_prompt}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleView(item.id)}
                    >
                      <Eye size={18} />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Paper>

      {/* Dialog Detail */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detail Konten</DialogTitle>
        <DialogContent dividers>
          {selected ? (
            <Box>
              <Typography fontWeight="bold" mb={2}>
                {selected.platform} - {selected.type} - {selected.tone} -{" "}
                {selected.language}
              </Typography>

              <Typography mb={2}>
                <strong>Prompt:</strong> {selected.input_prompt}
              </Typography>

              {selected.generated_content && (
                <Box
                  sx={{
                    background: "#f9fafb",
                    p: 2,
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    whiteSpace: "pre-line",
                  }}
                >
                  {selected.generated_content.caption || "-"}
                  {"\n"}
                  {selected.generated_content.description || "-"}
                  {"\n"}
                  {selected.generated_content.hashtags || ""}
                </Box>
              )}
            </Box>
          ) : (
            <Typography>Memuat...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
