"use client";

import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#ffffff",
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Banco Simples
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
