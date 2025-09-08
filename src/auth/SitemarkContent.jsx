"use client";
import * as React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CheckSquare, Settings, Hammer, ThumbsUp, Wand } from "lucide-react";

export default function SitemarkContent() {
  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 4, md: 6 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 3,
        color: "white",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <CheckSquare size={28} />
        <Typography variant="h6" fontWeight="bold">
          Kenapa Memilih Kami?
        </Typography>
      </Stack>

      {[{
        icon: <Settings size={20} />,
        title: "Akses Mudah dan Cepat",
        desc: "Masuk dengan mudah tanpa ribet.",
      }, {
        icon: <Hammer size={20} />,
        title: "Keamanan Terjamin",
        desc: "Data kamu aman dengan sistem kami.",
      }, {
        icon: <ThumbsUp size={20} />,
        title: "Mendukung Produktivitas",
        desc: "Fitur yang membantu kamu bekerja lebih efektif.",
      }, {
        icon: <Wand size={20} />,
        title: "Layanan Pelanggan Siap Membantu",
        desc: "Dukungan penuh kapan saja kamu butuh.",
      }].map(({ icon, title, desc }) => (
        <Box key={title} sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ mt: "4px" }}>{icon}</Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>{desc}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
