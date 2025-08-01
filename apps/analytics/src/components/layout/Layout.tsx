import { Box, useTheme } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";

interface LayoutContainerProps {
  children: React.ReactNode;
}

export default function LayoutContainer({ children }: LayoutContainerProps) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onDrawerClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          minHeight: "100vh",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
