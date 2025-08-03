"use client";
import { BalanceCard, NewTransactionForm, RecentTransactions, Layout as LayoutContainer } from "@banking/shared-components";
import { useTransactionStore } from "@banking/shared-hooks";
import Box from "@mui/material/Box";
import { useEffect } from "react";

export default function Transactions() {
  const { fetchTransactions, fetchBalance } = useTransactionStore();

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <NewTransactionForm />
          </Box>
          <Box sx={{ flex: 2, display: "flex", flexDirection: "column" }}>
            <RecentTransactions />
          </Box>
        </Box>
      </Box>
    </LayoutContainer>
  );
}