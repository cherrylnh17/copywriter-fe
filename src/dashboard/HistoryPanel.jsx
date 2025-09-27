"use client";

import React, { useEffect, useState, useRef } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
  Fade,
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

  const [copied, setCopied] = useState(false);

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
     // Platform
      facebook: "bg-blue-600",
      instagram: "bg-purple-600",
      linkedIn: "bg-indigo-600",
      twitter: "bg-sky-500",

      // Tipe
      caption: "bg-teal-600",
      full: "bg-emerald-600",
      tweet: "bg-cyan-600",

      // Tone
      kasual: "bg-slate-500",
      formal: "bg-slate-700",
      persuasif: "bg-blue-600",

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
      maxWidth={2400}
      margin="auto"
    >
      <Box
      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 shadow-lg mb-3"
      >
        <Typography variant="h4" fontWeight="bold" mb={1} align="center" sx={{ color: '#000' }}>
          History
        </Typography>
        <Typography color="textSecondary" mb={3} fontWeight={600} align="center" className="text-slate-800">
          Jelajahi dan kelola konten yang Anda buat sebelumnya
        </Typography>
      </Box>

      <Box
      className="bg-gradient-to-r from-indigo-500/50 to-purple-600/50 text-white rounded-xl p-8 shadow-lg mb-8"
      >
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
              label="Platfrom"
              value={platformFilter}
              onChange={(e) => {
                setPage(1);
                setPlatformFilter(e.target.value);
              }}
              sx={{
                minWidth: 130,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(6px)', 
                color: '#000',

                "& .MuiOutlinedInput-root": {
                  color: "#000",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.6)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },

                "& .MuiInputBase-input": {
                  color: "#000",
                },
                "& label": {
                  color: "#333300",
                },
                "& label.Mui-focused": {
                  color: "#000",
                },
                ".MuiSelect-icon": {
                  color: "#000",
                },
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
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(6px)', 
                color: '#000',

                "& .MuiOutlinedInput-root": {
                  color: "#000",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.6)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },

                "& .MuiInputBase-input": {
                  color: "#000",
                },
                "& label": {
                  color: "#333300",
                },
                "& label.Mui-focused": {
                  color: "#000",
                },
                ".MuiSelect-icon": {
                  color: "#000",
                },
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
        ) : !loading && data.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography
              color="textSecondary"
              fontStyle="italic"
              className="text-gray-500"
            >
              History masih kosong, silahkan generate prompt
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
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 0 10px rgba(99, 102, 241, 0.6)',
                  backdropFilter: 'blur(6px)',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 0 14px rgba(99, 102, 241, 0.6)',
                  },
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
                    className="mb-1 cursor-default text-slate-600"
                    fontWeight="bold"
                  >
                    {item.input_prompt}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 line-clamp-2">
                    {item.generated_content.caption ||
                      item.generated_content.description}
                  </Typography>
                </Box>
                <Box className="flex justify-between items-center mt-2 pt-2 border-t border-gray-400">
                  {/* Noted */}
                  
                  <Typography variant="caption" className="text-black">
                    Language | {item.language}
                  </Typography>

                  <Box className="flex gap-1">
                    <IconButton
                      size="small"
                      onClick={() => handleView(item.id)}
                      aria-label="View details"
                      sx={{ color: '#fff', '&:hover': { color: '#fff' } }}
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
      </Box>

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
                Platform : {selected.platform}
              </Typography>
              <Typography fontWeight="bold" mb={1} className="text-gray-300 text-sm">
                Tipe : {selected.type}
              </Typography>
              <Typography fontWeight="bold" mb={1} className="text-gray-300 text-sm">
                Tone :{" "} {selected.tone}
              </Typography>
              <Typography fontWeight="bold" mb={1} className="text-gray-300 text-sm">
                Language : {selected.language}
              </Typography>
              <Typography mb={2} className="text-gray-400 text-sm">
                <strong>Prompt :</strong> {selected.input_prompt}
              </Typography>
              {selected.generated_content && (
                <Box
                  sx={{
                    background: "#1e1e1e",
                    p: 2,
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    whiteSpace: "pre-line",
                    position: "relative",
                  }}
                >
                  {/* Tombol Copy */}
                  <IconButton
                    size="small"
                    onClick={() => {
                      const textToCopy = `${selected.generated_content.caption || selected.generated_content.description || "-"}\n\n${selected.generated_content.hashtags || ""}`;
                      navigator.clipboard.writeText(textToCopy).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000); // reset setelah 2 detik
                      });
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "#aaa",
                      "&:hover": { color: "#fff" },
                    }}
                  >
                    <Fade in={copied}>
                      <Box display={copied ? "flex" : "none"} alignItems="center" gap={0.5}>
                        <CheckCircleIcon fontSize="small" color="success" />
                        <Typography variant="caption" sx={{ color: "green" }}>
                          Disalin
                        </Typography>
                      </Box>
                    </Fade>

                    <Fade in={!copied}>
                      <Box display={!copied ? "flex" : "none"}>
                        <ContentCopyIcon fontSize="small" />
                      </Box>
                    </Fade>
                  </IconButton>

                  {/* Konten hasil AI */}
                  <Typography className="text-white text-sm" sx={{ textAlign: 'left' }}>
                    {selected.generated_content.caption || selected.generated_content.description || "-"}
                  </Typography>
                  <Typography className="text-purple-400 mt-2 text-sm" sx={{ textAlign: 'left' }}>
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