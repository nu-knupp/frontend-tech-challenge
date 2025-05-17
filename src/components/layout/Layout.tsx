"use client";

import { Box, useTheme } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutContainerProps {
  children: React.ReactNode;
}

export default function LayoutContainer({ children }: LayoutContainerProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: "80px",
          height: "100vh",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
