"use client";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  onDrawerClose: () => void;
}

export default function Sidebar({ mobileOpen, onDrawerClose }: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path: string) => pathname === path;

  const drawerContent = (
    <Box sx={{ mt: 8 }}>
      <List sx={{ py: 2 }}>
        <ListItem>
          <ListItemButton
            sx={{
              borderRadius: 3,
              bgcolor: isActive('/') ? theme.palette.primary.main : theme.palette.background.default,
              color: isActive('/') ? theme.palette.primary.contrastText : 'inherit',
              '&:hover': {
                bgcolor: isActive('/') ? theme.palette.primary.dark : theme.palette.action.hover,
              },
            }}
            component={Link}
            href="/"
            onClick={isMobile ? onDrawerClose : undefined}
          >
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            sx={{
              borderRadius: 3,
              bgcolor: isActive('/transactions') ? theme.palette.primary.main : theme.palette.background.default,
              color: isActive('/transactions') ? theme.palette.primary.contrastText : 'inherit',
              '&:hover': {
                bgcolor: isActive('/transactions') ? theme.palette.primary.dark : theme.palette.action.hover,
              },
            }}
            component={Link}
            href="/transactions"
            onClick={isMobile ? onDrawerClose : undefined}
          >
            <ListItemText primary="Transações" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: "background.paper",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
