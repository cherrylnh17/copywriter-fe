"use client";

import React, { useEffect, useState, useRef } from "react";
import { Select, MenuItem, FormControl, InputLabel, Button, Typography, Box } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

const platforms = ["facebook", "twitter", "instagram"];
const types = ["full", "summary", "short"];
const tones = ["formal", "informal", "friendly"];

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

  const abortControllerRef = useRef(null);

  const fetchHistory = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // cancel previous request
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

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("Response dari server tidak valid");
      }

      if (!res.ok) {
        if (result.message && result.message.toLowerCase().includes("belum ada konten")) {
          setData([]);
          setError(null);
          setLoading(false);
          return;
        }
        throw new Error(result.message || `Gagal mengambil data: ${text}`);
      }

      if (Array.isArray(result.data?.contents)) {
        setData(result.data.contents);
      } else {
        setData([]);
      }
    } catch (err) {
      if (err.name === "AbortError") return; // fetch aborted, ignore error
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [page, sort, order, platformFilter, typeFilter, toneFilter]);

  // Pagination handler with loading state
  const handlePageChange = (newPage) => {
    setLoading(true);
    setPage(newPage);
  };

  return (
    <Box p={3} maxWidth={900} margin="auto">
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Riwayat Konten
      </Typography>
      <Typography color="textSecondary" mb={3}>
        Semua konten yang kamu generate akan tersimpan di sini.
      </Typography>

      {/* Filters */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={4} justifyContent="space-between" alignItems="center">
        {/* Platform Filter */}
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="platform-label">Platform</InputLabel>
          <Select
            labelId="platform-label"
            value={platformFilter}
            label="Platform"
            onChange={(e) => {
              setPage(1);
              setPlatformFilter(e.target.value);
            }}
            size="small"
            aria-label="Filter Platform"
          >
            <MenuItem value="">
              <em>Semua Platform</em>
            </MenuItem>
            {platforms.map((p) => (
              <MenuItem key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Type Filter */}
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="type-label">Tipe</InputLabel>
          <Select
            labelId="type-label"
            value={typeFilter}
            label="Tipe"
            onChange={(e) => {
              setPage(1);
              setTypeFilter(e.target.value);
            }}
            size="small"
            aria-label="Filter Tipe"
          >
            <MenuItem value="">
              <em>Semua Tipe</em>
            </MenuItem>
            {types.map((t) => (
              <MenuItem key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tone Filter */}
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="tone-label">Nada</InputLabel>
          <Select
            labelId="tone-label"
            value={toneFilter}
            label="Nada"
            onChange={(e) => {
              setPage(1);
              setToneFilter(e.target.value);
            }}
            size="small"
            aria-label="Filter Nada"
          >
            <MenuItem value="">
              <em>Semua Nada</em>
            </MenuItem>
            {tones.map((t) => (
              <MenuItem key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={sort}
            label="Sort By"
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            size="small"
            aria-label="Sort By"
          >
            <MenuItem value="created_at">Tanggal dibuat</MenuItem>
            <MenuItem value="platform">Platform</MenuItem>
            <MenuItem value="type">Tipe</MenuItem>
            <MenuItem value="tone">Nada</MenuItem>
            <MenuItem value="language">Bahasa</MenuItem>
          </Select>
        </FormControl>

        {/* Order */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="order-label">Urutan</InputLabel>
          <Select
            labelId="order-label"
            value={order}
            label="Urutan"
            onChange={(e) => {
              setPage(1);
              setOrder(e.target.value);
            }}
            size="small"
            aria-label="Urutan"
          >
            <MenuItem value="DESC">Desc</MenuItem>
            <MenuItem value="ASC">Asc</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Data Table */}
      <Box bgcolor="background.paper" p={3} borderRadius={2} boxShadow={3} overflow="auto">
        {loading ? (
          <Typography color="textSecondary">Memuat data...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : data.length === 0 ? (
          <Typography color="textSecondary" fontStyle="italic">
            Riwayat masih kosong. Belum ada konten yang tersimpan.
          </Typography>
        ) : (
          <table
            className="min-w-full table-auto"
            style={{ width: "100%", borderCollapse: "collapse" }}
            aria-label="Tabel Riwayat Konten"
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#e5e7eb",
                  color: "#4b5563",
                  textTransform: "uppercase",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  lineHeight: "1.25rem",
                }}
              >
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left" }}>Platform</th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left" }}>Tipe</th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left" }}>Nada</th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left" }}>Bahasa</th>
                <th
                  style={{
                    padding: "0.75rem 1.5rem",
                    textAlign: "left",
                    maxWidth: 300,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Prompt Input
                </th>
              </tr>
            </thead>
            <tbody style={{ color: "#4b5563", fontSize: "0.875rem", fontWeight: "400" }}>
              {data.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    cursor: "default",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "0.75rem 1.5rem", textTransform: "capitalize" }}>{item.platform}</td>
                  <td style={{ padding: "0.75rem 1.5rem", textTransform: "capitalize" }}>{item.type}</td>
                  <td style={{ padding: "0.75rem 1.5rem", textTransform: "capitalize" }}>{item.tone}</td>
                  <td style={{ padding: "0.75rem 1.5rem", textTransform: "capitalize" }}>{item.language}</td>
                  <td
                    style={{
                      padding: "0.75rem 1.5rem",
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={item.input_prompt}
                  >
                    {item.input_prompt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Box>

      <Box display="flex" justifyContent="center" mt={4} gap={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ChevronLeft />}
          disabled={page <= 1 || loading}
          onClick={() => handlePageChange(Math.max(page - 1, 1))}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <Typography
          variant="button"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            px: 2,
            borderRadius: 1,
            backgroundColor: "#e0e0e0",
            minWidth: 40,
            userSelect: "none",
          }}
          aria-label="Current page"
        >
          {page}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ChevronRight />}
          disabled={data.length < limit || loading}
          onClick={() => handlePageChange(page + 1)}
          aria-label="Next page"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
