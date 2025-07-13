"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountBalance } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";
import Link from "next/link";

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
        backgroundColor: "background.paper",
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
          <Typography sx={{ color: 'primary.main' }} variant="h6" noWrap component="div">
            Banco Simples
          </Typography>
          <AccountBalance sx={{ ml: 1, color: 'primary.main' }} />
        </Box>
        <Box>
          <Link href="/login" passHref legacyBehavior>
            <IconButton color="primary" sx={{ ml: 2 }}>
              <AccountCircle sx={{ fontSize: 38 }} />
            </IconButton>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
