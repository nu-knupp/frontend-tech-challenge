"use client";

import { Typography, Container, Button } from "@mui/material";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Ocorreu um erro
      </Typography>
      <Typography variant="body1" gutterBottom>
        Tente novamente mais tarde.
      </Typography>
      <Button variant="contained" onClick={reset}>
        Tentar Novamente
      </Button>
    </Container>
  );
}
