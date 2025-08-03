"use client";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Home,
  Receipt,
  Analytics,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  onDrawerClose: () => void;
}

export default function Sidebar({ mobileOpen, onDrawerClose }: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      text: "Home",
      path: "/",
      icon: <Home />,
    },
    ...(isAuthenticated
      ? [
        {
          text: "Transações",
          path: "/transactions",
          icon: <Receipt />,
        },
        {
          text: "Análises",
          path: "/analytics",
          icon: <Analytics />,
        },
      ]
      : []),
  ];

  const drawerContent = (
    <Box sx={{ mt: 8 }}>
      <List sx={{ py: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton
              sx={{
                borderRadius: 3,
                bgcolor: isActive(item.path)
                  ? theme.palette.primary.main
                  : theme.palette.background.default,
                color: isActive(item.path)
                  ? theme.palette.primary.contrastText
                  : "inherit",
                "&:hover": {
                  bgcolor: isActive(item.path)
                    ? theme.palette.primary.dark
                    : theme.palette.action.hover,
                },
              }}
              component={Link}
              href={item.path}
              onClick={isMobile ? onDrawerClose : undefined}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path)
                    ? theme.palette.primary.contrastText
                    : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "background.paper",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
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
