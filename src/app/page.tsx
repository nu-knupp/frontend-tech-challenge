"use client";
import BalanceCard from "@/components/home/BalanceCard";
import NewTransactionForm from "@/components/home/NewTransactionForm";
import RecentTransactions from "@/components/home/RecentTransactions";
import LayoutContainer from "@/components/layout/Layout";
import Box from "@mui/material/Box";
import { useState } from "react";

export default function Home() {
  const [reload, setReload] = useState(0);

  return (
    <LayoutContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "stretch",
            maxWidth: "1200px",
            width: "100%",
          }}
        >
          <Box
            sx={{ 
              flex: { md: 3 }, 
              display: "flex", 
              flexDirection: "column", 
              gap: 3,
              width: "100%" 
            }}
          >
            <BalanceCard />
            <NewTransactionForm onAdd={() => setReload((prev) => prev + 1)} />
          </Box>
          <Box sx={{ 
            flex: { md: 2 }, 
            display: "flex", 
            flexDirection: "column",
            width: "100%",
            pb: { xs: 8 }, 
          }}>
            <RecentTransactions reload={reload} />
          </Box>
        </Box>
      </Box>
    </LayoutContainer>
  );
}
