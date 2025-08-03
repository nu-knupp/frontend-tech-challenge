"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, useMediaQuery, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountBalance, AccountCircle } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@banking/shared-hooks";

interface HeaderProps {
  onDrawerToggle?: () => void;
  title?: string;
  actions?: React.ReactNode;
}

export default function Header({ onDrawerToggle, title = "Banco Simples", actions }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, userName, logout } = useAuthContext();
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
    await logout(); // Usa o método logout do AuthContext que já faz tudo
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
          {isMobile && onDrawerToggle && (
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
            {title}
          </Typography>
          <AccountBalance sx={{ ml: 1, color: 'primary.main' }} />
        </Box>
        <Box>
          {actions}
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
            {isAuthenticated ? [
              <MenuItem key="username" disabled>
                <Typography variant="body2" color="text.secondary">
                  Olá, {userName || "Usuário"}!
                </Typography>
              </MenuItem>,
              <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
            ] : (
              <MenuItem onClick={() => router.push("/login")}>Login</MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
