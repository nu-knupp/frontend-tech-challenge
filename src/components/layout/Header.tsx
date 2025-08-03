"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, useMediaQuery, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountBalance } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext as useAuth } from "@banking/shared-hooks";

interface HeaderProps {
  onDrawerToggle: () => void;
}

export default function Header({ onDrawerToggle }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, setIsAuthenticated, setUserName } = useAuth();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await fetch("/api/logout");
    setIsAuthenticated(false);
    setUserName("");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    router.push("/");
    handleClose();
  };


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
          <IconButton
            color="primary"
            sx={{ ml: 2 }}
            onClick={handleMenu}
          >
            <AccountCircle sx={{ fontSize: 38 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {isAuthenticated ? (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            ) : (
              <MenuItem onClick={() => router.push("/login")}>Login</MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
