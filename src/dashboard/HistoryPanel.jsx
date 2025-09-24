"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const PLATFORMS = ["All Platforms", "Instagram", "LinkedIn", "Twitter"];
const TYPES = ["All Types", "Caption", "Article", "Thread", "Story"];
const TONES = ["All Tones", "Casual", "Professional", "Informative", "Engaging"];

export default function HistoryPanel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("DESC");

  const [platformFilter, setPlatformFilter] = useState("All Platforms");
  const [typeFilter, setTypeFilter] = useState("All Types");

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

    if (platformFilter !== "All Platforms")
      params.append("platform", platformFilter);
    if (typeFilter !== "All Types") params.append("type", typeFilter);

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

      if (!res.ok) {
        throw new Error(result.message || "Gagal mengambil data");
      }

      if (result.meta && result.meta.totalCount) {
        setTotalPages(Math.ceil(result.meta.totalCount / limit));
      } else {
        if (result.data.contents.length < limit) {
          setTotalPages(page);
        } else {
          setTotalPages(page + 1);
        }
      }
      
      setData(Array.isArray(result.data.contents) ? result.data.contents : []);
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
  }, [page, sort, order, platformFilter, typeFilter]);

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

      if (res.ok) {
        let detail = result.data?.detailContent;

        if (Array.isArray(detail.generated_content)) {
          detail.generated_content = detail.generated_content[0];
        }

        setSelected(detail);
        setOpenDialog(true);
      } else {
        Swal.fire("Gagal!", result.message || "Konten tidak ditemukan.", "error");
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
      customClass: {
        popup: 'bg-[#1e1e1e] text-white',
        title: 'text-white',
        htmlContainer: 'text-gray-300',
        confirmButton: 'bg-red-600 hover:bg-red-700',
        cancelButton: 'bg-gray-600 hover:bg-gray-700'
      }
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
        setData((prev) => prev.filter((item) => item.id !== id));
      } else {
        const result = await res.json();
        Swal.fire("Gagal!", result.message || "Gagal menghapus konten.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Terjadi kesalahan saat menghapus konten.", "error");
    }
  };

  // --- PERUBAHAN WARNA DI SINI ---
  const renderChip = (label) => {
    const colors = {
      // Palet Platform
      Instagram: "bg-purple-600",
      LinkedIn: "bg-indigo-600",
      Twitter: "bg-sky-500",
      // Palet Tipe Konten
      Caption: "bg-teal-600",
      Article: "bg-emerald-600",
      Thread: "bg-cyan-600",
      Story: "bg-fuchsia-600",
      // Palet Tone
      Casual: "bg-slate-500",
      Professional: "bg-slate-700",
      Informative: "bg-blue-600",
      Engaging: "bg-rose-600",
    };
    const className = colors[label] || "bg-gray-600";

    return (
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mr-2 mb-1 text-white ${className}`}
      >
        {label}
      </span>
    );
  };

  return (
    <Box
      p={3}
      maxWidth={1100}
      margin="auto"
      className="bg-gray-200 rounded-xl text-gray-100 min-h-screen"
    >
      <Typography variant="h4" fontWeight="bold" mb={1} sx={{ color: '#8b5cf6' }}>
        History
      </Typography>
      <Typography color="textSecondary" mb={3} className="text-gray-400">
        Browse and manage your previously generated content
      </Typography>

      {/* Filters */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={4}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Stack
          direction="row"
          spacing={2}
          className="flex-wrap"
          sx={{ mt: { xs: 1, sm: 0 } }}
        >
          <TextField
            select
            size="small"
            label="Filter by Platform"
            value={platformFilter}
            onChange={(e) => {
              setPage(1);
              setPlatformFilter(e.target.value);
            }}
            sx={{
              minWidth: 130,
              backgroundColor: "#1c1c1c",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                color: "#eee",
                "& fieldset": { borderColor: "#333" },
                "&:hover fieldset": { borderColor: "#555" },
                "&.Mui-focused fieldset": { borderColor: "#6366f1" },
              },
              "& label.Mui-focused": { color: '#6366f1' },
              "& .MuiInputBase-input": { color: "#eee" },
              ".MuiSelect-icon": { color: "#eee" },
            }}
          >
            {PLATFORMS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Filter by Type"
            value={typeFilter}
            onChange={(e) => {
              setPage(1);
              setTypeFilter(e.target.value);
            }}
            sx={{
              minWidth: 130,
              backgroundColor: "#1c1c1c",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                color: "#eee",
                "& fieldset": { borderColor: "#333" },
                "&:hover fieldset": { borderColor: "#555" },
                "&.Mui-focused fieldset": { borderColor: "#6366f1" },
              },
              "& label.Mui-focused": { color: '#6366f1' },
              "& .MuiInputBase-input": { color: "#eee" },
              ".MuiSelect-icon": { color: "#eee" },
            }}
          >
            {TYPES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Stack>

      {/* Content list */}
      {loading ? (
        <Box p={4} textAlign="center">
          <CircularProgress sx={{ color: "#6366f1" }} />
          <Typography mt={2} color="textSecondary" className="text-gray-400">
            Loading data...
          </Typography>
        </Box>
      ) : error ? (
        <Box p={4} textAlign="center">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : data.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography
            color="textSecondary"
            fontStyle="italic"
            className="text-gray-500"
          >
            History is empty. No saved content yet.
          </Typography>
        </Box>
      ) : (
        <Box
          className="grid gap-4 sm:grid-cols-1"
          sx={{ maxHeight: 600, overflowY: "auto", paddingRight: 1 }}
        >
          {data.map((item) => (
            <Box
              key={item.id}
              className="rounded-lg p-4 flex flex-col justify-between"
              sx={{
                boxShadow: "0 0 8px rgb(99 102 241 / 0.4)",
                transition: "box-shadow 0.3s",
                "&:hover": {
                  boxShadow: "0 0 12px rgb(99 102 241 / 0.7)",
                },
                backgroundColor: "#1c1c1c",
                border: "1px solid #333",
              }}
            >
              <Box mb={2}>
                <Box className="flex flex-wrap mb-2">
                  {renderChip(item.platform)}
                  {renderChip(item.type)}
                  {renderChip(item.tone)}
                </Box>
                <Typography
                  variant="subtitle1"
                  className="mb-1 cursor-default text-gray-100"
                  fontWeight="bold"
                >
                  {item.input_prompt}
                </Typography>
                <Typography variant="body2" className="text-gray-400 line-clamp-2">
                  {item.generated_content.caption ||
                    item.generated_content.description}
                </Typography>
              </Box>
              <Box className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700">
                <Typography variant="caption" className="text-gray-500">
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}{" "} at {" "}
                  {new Date(item.created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit", minute: "2-digit", hour12: true,
                  })}{" "} | {item.language}
                </Typography>
                <Box className="flex gap-1">
                  <IconButton
                    size="small"
                    onClick={() => handleView(item.id)}
                    aria-label="View details"
                    sx={{ color: '#a78bfa', '&:hover': { color: '#8b5cf6' } }}
                  >
                    <Eye size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                    aria-label="Delete content"
                    sx={{ '&:hover': { color: '#ef4444' } }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Pagination */}
{!loading && data.length > 0 && totalPages > 1 && (
  <Box display="flex" justifyContent="center" mt={4}>
    <Pagination
      count={totalPages}
      page={page}
      onChange={(event, value) => setPage(value)}
      color="primary"
      sx={{
        "& .MuiPaginationItem-root": {
          color: "#9ca3af",
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.1)",
          },
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          backgroundColor: "#6366f1",
          color: "#fff", 
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#4f46e5",
          },
        },
      }}
    />
  </Box>
)}

      {/* Dialog Detail  */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { bgcolor: "#121212", color: "#eee", borderRadius: "8px" },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid #333" }}>
          Content Detail
        </DialogTitle>
        <DialogContent dividers sx={{ borderBottom: "1px solid #333" }}>
          {selected ? (
            <Box>
              <Typography fontWeight="bold" mb={1} className="text-gray-300 text-sm">
                Platform: {selected.platform} | Type: {selected.type} | Tone:{" "}
                {selected.tone} | Language: {selected.language}
              </Typography>
              <Typography mb={2} className="text-gray-400 text-sm">
                <strong>Prompt:</strong> {selected.input_prompt}
              </Typography>
              {selected.generated_content && (
                <Box
                  sx={{
                    background: "#1e1e1e", p: 2, borderRadius: "8px",
                    fontSize: "0.9rem", whiteSpace: "pre-line",
                  }}
                >
                  <Typography className="text-white text-sm">
                    {selected.generated_content.caption ||
                      selected.generated_content.description || "-"}
                  </Typography>
                  <Typography className="text-purple-400 mt-2 text-sm">
                    {selected.generated_content.hashtags || ""}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : ( <Typography>Loading...</Typography> )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#121212", py: 2, px: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            sx={{
              color: "#6366f1", textTransform: "none", fontWeight: "bold",
              "&:hover": { bgcolor: "rgba(99, 102, 241, 0.1)" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}