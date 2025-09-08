"use client";
import * as React from "react";
import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

import SitemarkContent from "./SitemarkContent";
import SignInForm from "./SignInForm";

const GlassPaper = styled(Paper)(({ theme }) => ({
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  borderRadius: "24px",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "500px",
  },
  [theme.breakpoints.up("md")]: {
    width: "1000px",
    flexDirection: "row",
  },
}));

export default function SignIn() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        p: 2,
        color: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <GlassPaper elevation={3} sx={{ p: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", md: "row" },
              width: "100%",
            }}
          >
            <Box sx={{ flex: { xs: "none", md: 1 } }}>
              <SitemarkContent />
            </Box>
            <Box sx={{ flex: { xs: "none", md: 1 } }}>
              <SignInForm />
            </Box>
          </Box>
        </GlassPaper>
      </motion.div>
    </Box>
  );
}
