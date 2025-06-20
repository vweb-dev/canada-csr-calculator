import React, { useState } from "react";
import { calculateCSR } from "./csrLogic";
import { TextField, Button, Box, Typography, Paper, MenuItem } from "@mui/material";

const defaultInputs = {
  familySize: "",
  province: "",
  annualIncome: "",
  loanAmount: ""
};

const provinces = [
  "Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador",
  "Nova Scotia","Ontario","Prince Edward Island","Quebec","Saskatchewan","Northwest Territories",
  "Nunavut","Yukon"
];

export default function CSRCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(calculateCSR(inputs));
  };

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3, boxShadow: "0 4px 32px #ff66008c" }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          label="Family Size"
          name="familySize"
          type="number"
          value={inputs.familySize}
          onChange={handleChange}
          required
          variant="outlined"
          InputLabelProps={{ style: { color: '#FF6600' } }}
        />
        <TextField
          label="Province"
          name="province"
          select
          value={inputs.province}
          onChange={handleChange}
          required
          variant="outlined"
          InputLabelProps={{ style: { color: '#FF6600' } }}
        >
          <MenuItem value="">Select</MenuItem>
          {provinces.map((prov) => (
            <MenuItem key={prov} value={prov}>{prov}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Annual Family Income (CAD)"
          name="annualIncome"
          type="number"
          value={inputs.annualIncome}
          onChange={handleChange}
          required
          variant="outlined"
          InputLabelProps={{ style: { color: '#FF6600' } }}
        />
        <TextField
          label="Student Loan Amount (CAD)"
          name="loanAmount"
          type="number"
          value={inputs.loanAmount}
          onChange={handleChange}
          required
          variant="outlined"
          InputLabelProps={{ style: { color: '#FF6600' } }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          sx={{ mt: 2, fontWeight: "bold", letterSpacing: 1 }}
        >
          Calculate
        </Button>
      </Box>
      {result && (
        <Box sx={{ mt: 5, p: 3, border: "1px solid #FF6600", borderRadius: 2, background: "#111" }}>
          <Typography variant="h6" sx={{ color: "primary.main" }}>Results</Typography>
          <Typography variant="body1" sx={{ mt: 2, color: "#fff" }}>
            <span style={{ color: "#FF6600" }}>Estimated Monthly Payment:</span> <strong>${result.monthlyPayment}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: "#fff" }}>
            <span style={{ color: "#FF6600" }}>Repayment Assistance:</span> <strong>{result.rapEligible ? "Eligible" : "Not Eligible"}</strong>
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
