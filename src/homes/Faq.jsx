"use client";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FAQ() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      id: "panel1",
      question: "Apa itu AI Copywriter?",
      answer:
        "AI Copywriter adalah aplikasi berbasis AI yang dapat menghasilkan caption, deskripsi produk, dan konten lainnya secara otomatis.",
    },
    {
      id: "panel2",
      question: "Apakah layanan ini gratis?",
      answer:
        "Ya! Layanan ini bisa digunakan secara gratis tanpa batas. Tidak ada biaya tersembunyi.",
    },
    {
      id: "panel3",
      question: "Apakah saya harus daftar dulu?",
      answer:
        "Ya, untuk menyimpan history dan menggunakan fitur penuh, kamu perlu mendaftar atau login.",
    },
    {
      id: "panel4",
      question: "Apakah saya bisa melihat riwayat konten yang sudah digenerate?",
      answer:
        "Tentu saja! Semua konten yang kamu generate akan tersimpan di halaman riwayat kamu.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white  tracking-wide">
          Pertanyaan Umum (FAQ)
        </h2>
      </div>

      {faqs.map((item) => (
        <Accordion
          key={item.id}
          expanded={expanded === item.id}
          onChange={handleChange(item.id)}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            mb: 2,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls={`${item.id}-content`}
            id={`${item.id}-header`}
          >
            <Typography sx={{ fontWeight: "bold" }}>{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </section>
  );
}
