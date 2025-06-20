import React from "react";
import { ThemeProvider, CssBaseline, Container, Typography, Box } from "@mui/material";
import theme from "./theme";
import CSRCalculator from "./CSRCalculator";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box sx={{ mt: 6, mb: 2 }}>
          <Typography variant="h3" align="center" sx={{ fontWeight: "bold", color: "primary.main" }}>
            CSR Calculator
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ color: "#fff", mt: 1 }}>
            Clean, modern, and branded for <span style={{ color: "#FF6600", fontWeight: "bold" }}>vweb.dev</span>
          </Typography>
        </Box>
        <CSRCalculator />
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
