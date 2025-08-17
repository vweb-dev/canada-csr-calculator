import React, { useState } from "react";
import { calculateCRS } from "./crsLogic";
import {
  TextField, Button, Box, Typography, Paper, MenuItem, FormControl, InputLabel, Select,
  RadioGroup, FormControlLabel, Radio, Checkbox, Grid,
} from "@mui/material";

const educationLevels = [
  { value: "none", label: "None" },
  { value: "secondary", label: "Secondary school" },
  { value: "postSecondary1", label: "1-year post-secondary" },
  { value: "postSecondary2", label: "2-year post-secondary" },
  { value: "bachelors", label: "Bachelor's degree" },
  { value: "twoPostSecondary", label: "2+ post-secondary degrees" },
  { value: "masters", label: "Master's degree" },
  { value: "phd", label: "Doctorate / PhD" },
];

const workExpLevels = [
  { value: 0, label: "0-1 year" },
  { value: 1, label: "1 year" },
  { value: 2, label: "2 years" },
  { value: 3, label: "3 years" },
  { value: 4, label: "4 years" },
  { value: 5, label: "5+ years" },
];

const clbLevels = [
  { value: 4, label: "CLB 4" }, { value: 5, label: "CLB 5" }, { value: 6, label: "CLB 6" },
  { value: 7, label: "CLB 7" }, { value: 8, label: "CLB 8" }, { value: 9, label: "CLB 9" },
  { value: 10, label: "CLB 10+" },
];

const defaultInputs = {
  maritalStatus: "single",
  age: 29,
  education: "masters",
  canadianWorkExp: 1,
  firstLang: { reading: 7, writing: 7, speaking: 7, listening: 7 },
  secondLang: { reading: 0, writing: 0, speaking: 0, listening: 0 },
  spouseEducation: "none",
  spouseFirstLang: { reading: 0, writing: 0, speaking: 0, listening: 0 },
  spouseWorkExp: 0,
  foreignWorkExp: 0,
  certificate: false,
  provincialNomination: false,
  canadianEducation: "none",
  siblingInCanada: false,
};

export default function CRSCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs({ ...inputs, [name]: type === "checkbox" ? checked : value });
  };

  const handleLangChange = (lang, ability, value) => {
    setInputs({ ...inputs, [lang]: { ...inputs[lang], [ability]: value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(calculateCRS(inputs));
  };

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3, boxShadow: "0 4px 32px #ff66008c" }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Personal Info */}
        <Typography variant="h5" sx={{ color: "primary.main" }}>Personal Information</Typography>
        <FormControl fullWidth>
          <InputLabel>Marital Status</InputLabel>
          <Select name="maritalStatus" value={inputs.maritalStatus} onChange={handleChange}>
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="married">Married / Common-law</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Age" name="age" type="number" value={inputs.age} onChange={handleChange} />

        {/* Education */}
        <Typography variant="h5" sx={{ color: "primary.main" }}>Education</Typography>
        <TextField label="Highest Education" name="education" select value={inputs.education} onChange={handleChange}>
          {educationLevels.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </TextField>

        {/* Language */}
        <Typography variant="h5" sx={{ color: "primary.main" }}>Language Proficiency</Typography>
        <Typography variant="h6">First Language (English/French)</Typography>
        <Grid container spacing={2}>
          {['reading', 'writing', 'speaking', 'listening'].map(ability => (
            <Grid item xs={6} sm={3} key={ability}>
              <TextField label={ability.charAt(0).toUpperCase() + ability.slice(1)} select value={inputs.firstLang[ability]} onChange={e => handleLangChange('firstLang', ability, e.target.value)}>
                {clbLevels.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </TextField>
            </Grid>
          ))}
        </Grid>

        {/* Work Experience */}
        <Typography variant="h5" sx={{ color: "primary.main" }}>Work Experience</Typography>
        <TextField label="Canadian Work Experience" name="canadianWorkExp" select value={inputs.canadianWorkExp} onChange={handleChange}>
          {workExpLevels.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </TextField>
        <TextField label="Foreign Work Experience" name="foreignWorkExp" select value={inputs.foreignWorkExp} onChange={handleChange}>
            {workExpLevels.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </TextField>

        {/* Spouse Section */}
        {inputs.maritalStatus === 'married' && (
          <>
            <Typography variant="h5" sx={{ color: "primary.main" }}>Spouse's Information</Typography>
            <TextField label="Spouse's Highest Education" name="spouseEducation" select value={inputs.spouseEducation} onChange={handleChange}>
              {educationLevels.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <Typography variant="h6">Spouse's Language Proficiency</Typography>
            <Grid container spacing={2}>
                {['reading', 'writing', 'speaking', 'listening'].map(ability => (
                    <Grid item xs={6} sm={3} key={ability}>
                        <TextField label={ability.charAt(0).toUpperCase() + ability.slice(1)} select value={inputs.spouseFirstLang[ability]} onChange={e => handleLangChange('spouseFirstLang', ability, e.target.value)}>
                            {clbLevels.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                ))}
            </Grid>
            <TextField label="Spouse's Canadian Work Experience" name="spouseWorkExp" select value={inputs.spouseWorkExp} onChange={handleChange}>
              {workExpLevels.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          </>
        )}

        {/* Additional Points */}
        <Typography variant="h5" sx={{ color: "primary.main" }}>Additional Points</Typography>
        <FormControlLabel control={<Checkbox name="certificate" checked={inputs.certificate} onChange={handleChange} />} label="Certificate of Qualification from a Canadian province or territory" />
        <FormControlLabel control={<Checkbox name="provincialNomination" checked={inputs.provincialNomination} onChange={handleChange} />} label="Provincial Nomination" />
        <FormControlLabel control={<Checkbox name="siblingInCanada" checked={inputs.siblingInCanada} onChange={handleChange} />} label="Sibling in Canada (citizen or PR)" />
        <FormControl fullWidth>
            <InputLabel>Post-secondary education in Canada</InputLabel>
            <Select name="canadianEducation" value={inputs.canadianEducation} onChange={handleChange}>
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="1-2">1 or 2 years</MenuItem>
                <MenuItem value="3+">3 years or more</MenuItem>
            </Select>
        </FormControl>

        <Button variant="contained" color="primary" type="submit" size="large" sx={{ mt: 2 }}>
          Calculate CRS Score
        </Button>
      </Box>

      {result && (
        <Box sx={{ mt: 5, p: 3, border: "1px solid #FF6600", borderRadius: 2, background: "#111" }}>
          <Typography variant="h4" sx={{ color: "primary.main" }}>Total CRS Score: {result.totalScore}</Typography>
          <Box sx={{mt: 2}}>
            <Typography variant="h6">Score Breakdown:</Typography>
            <Typography>Core Human Capital: {result.breakdown.coreHumanCapital}</Typography>
            <Typography>Spouse Factors: {result.breakdown.spouse}</Typography>
            <Typography>Skill Transferability: {result.breakdown.skillTransferability}</Typography>
            <Typography>Additional Points: {result.breakdown.additional}</Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
