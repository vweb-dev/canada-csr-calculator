import React from "react";
import { ThemeProvider, CssBaseline, Container, Typography, Box } from "@mui/material";
import theme from "./theme";
import CRSCalculator from "./CRSCalculator";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box sx={{ mt: 6, mb: 2 }}>
          <Typography variant="h3" align="center" sx={{ fontWeight: "bold", color: "primary.main" }}>
            CRS Calculator
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ color: "#fff", mt: 1 }}>
            Comprehensive Ranking System (CRS) score calculator for Canadian Immigration.
          </Typography>
        </Box>
        <CRSCalculator />
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#FF6600" }}>
            Made by <a href="https://vweb.dev" style={{ color: "#FF6600", textDecoration: "underline" }}>vweb.dev</a>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
