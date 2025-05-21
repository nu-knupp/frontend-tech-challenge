"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountBalance } from "@mui/icons-material";

interface HeaderProps {
  onDrawerToggle: () => void;
}

export default function Header({ onDrawerToggle }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#ffffff",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={onDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Banco Simples
          </Typography>
          <AccountBalance sx={{ ml: 1 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
