"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountBalance } from "@mui/icons-material";

interface HeaderProps {
  onDrawerToggle?: () => void;
  title?: string;
  actions?: React.ReactNode;
}

export default function Header({ onDrawerToggle, title = "Banco Simples", actions }: HeaderProps) {
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
        {actions && (
          <Box>
            {actions}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
