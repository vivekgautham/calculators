import React from "react";
import {
  TextField,
  Stack,
  Paper,
  Typography,
  Slider,
  Grid,
  Box,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useCorporateDebtTaxSaver } from "./CorporateDebtTaxSaverContext";

const formatLargeNumber = (value: number) => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
};

const formatAbbreviated = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toFixed(2);
};

const parseInput = (str: string): number => {
  // Strip commas, dollar signs, and whitespace
  const cleanStr = str.replace(/[$,\s]/g, "").trim();
  if (cleanStr === "") return 0;

  // Check for abbreviations (K, M, B)
  const regex = /^([\d.]+)\s*([KMBkmb]?)$/;
  const match = cleanStr.match(regex);
  if (match) {
    const num = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    if (isNaN(num)) return NaN;
    if (unit === "K") return num * 1e3;
    if (unit === "M") return num * 1e6;
    if (unit === "B") return num * 1e9;
    return num;
  }

  return parseFloat(cleanStr);
};

const Inputs: React.FC = () => {
  const {
    debt,
    setDebt,
    taxRate,
    setTaxRate,
    interestRate,
    setInterestRate,
    ebit,
    setEbit,
  } = useCorporateDebtTaxSaver();

  // Local text input states to allow typing abbreviated values without cursor jumps
  const [debtInput, setDebtInput] = React.useState<string>(formatAbbreviated(debt));
  const [ebitInput, setEbitInput] = React.useState<string>(formatAbbreviated(ebit));
  const [isDebtFocused, setIsDebtFocused] = React.useState(false);
  const [isEbitFocused, setIsEbitFocused] = React.useState(false);

  // Sync state from context changes (e.g. Sliders) only when NOT currently typing in textfield
  React.useEffect(() => {
    if (!isDebtFocused) {
      setDebtInput(formatAbbreviated(debt));
    }
  }, [debt, isDebtFocused]);

  React.useEffect(() => {
    if (!isEbitFocused) {
      setEbitInput(formatAbbreviated(ebit));
    }
  }, [ebit, isEbitFocused]);

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        {/* Core Inputs Card */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1a2035" }}>
              Debt & Income Parameters
            </Typography>
            <Stack spacing={4} sx={{ mt: 2 }}>
              {/* Total Debt Slider & Input */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      Total Corporate Debt
                    </Typography>
                    <Tooltip title="The total principal amount of outstanding debt/loans. Supports abbreviations like M or B (e.g. 10B).">
                      <HelpOutlineIcon fontSize="small" sx={{ color: "text.secondary", cursor: "pointer" }} />
                    </Tooltip>
                  </Stack>
                  <TextField
                    size="small"
                    type="text"
                    value={debtInput}
                    onFocus={() => setIsDebtFocused(true)}
                    onBlur={() => {
                      setIsDebtFocused(false);
                      setDebtInput(formatAbbreviated(debt));
                    }}
                    onChange={(e) => {
                      const valStr = e.target.value;
                      setDebtInput(valStr);
                      const parsed = parseInput(valStr);
                      if (!isNaN(parsed) && parsed >= 0) {
                        setDebt(parsed);
                      }
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ width: 160 }}
                  />
                </Stack>
                <Slider
                  min={0}
                  max={50000000000}
                  step={100000000}
                  value={debt > 50000000000 ? 50000000000 : debt}
                  onChange={(_, val) => setDebt(val as number)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatLargeNumber}
                />
              </Box>

              {/* EBIT Slider & Input */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      Earnings Before Interest & Taxes (EBIT)
                    </Typography>
                    <Tooltip title="Annual operating profit of the corporation before deducting interest and taxes. Supports abbreviations like M or B (e.g. 2B).">
                      <HelpOutlineIcon fontSize="small" sx={{ color: "text.secondary", cursor: "pointer" }} />
                    </Tooltip>
                  </Stack>
                  <TextField
                    size="small"
                    type="text"
                    value={ebitInput}
                    onFocus={() => setIsEbitFocused(true)}
                    onBlur={() => {
                      setIsEbitFocused(false);
                      setEbitInput(formatAbbreviated(ebit));
                    }}
                    onChange={(e) => {
                      const valStr = e.target.value;
                      setEbitInput(valStr);
                      const parsed = parseInput(valStr);
                      if (!isNaN(parsed)) {
                        setEbit(parsed);
                      }
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ width: 160 }}
                  />
                </Stack>
                <Slider
                  min={0}
                  max={50000000000}
                  step={100000000}
                  value={ebit > 50000000000 ? 50000000000 : ebit}
                  onChange={(_, val) => setEbit(val as number)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatLargeNumber}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Rate Settings Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1a2035" }}>
              Rate Parameters
            </Typography>
            <Stack spacing={4} sx={{ mt: 2 }}>
              {/* Interest Rate */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      Interest Rate on Debt
                    </Typography>
                    <Tooltip title="The stated annual interest rate on the debt principal.">
                      <HelpOutlineIcon fontSize="small" sx={{ color: "text.secondary", cursor: "pointer" }} />
                    </Tooltip>
                  </Stack>
                  <TextField
                    size="small"
                    type="number"
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    value={interestRate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 100) setInterestRate(val);
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    sx={{ width: 100 }}
                  />
                </Stack>
                <Slider
                  min={0}
                  max={30}
                  step={0.1}
                  value={interestRate > 30 ? 30 : interestRate}
                  onChange={(_, val) => setInterestRate(val as number)}
                  valueLabelDisplay="auto"
                />
              </Box>

              {/* Marginal Tax Rate */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      Marginal Corporate Tax Rate
                    </Typography>
                    <Tooltip title="The statutory tax rate applied to the last dollar of income (federal + state combined).">
                      <HelpOutlineIcon fontSize="small" sx={{ color: "text.secondary", cursor: "pointer" }} />
                    </Tooltip>
                  </Stack>
                  <TextField
                    size="small"
                    type="number"
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    value={taxRate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 100) setTaxRate(val);
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    sx={{ width: 100 }}
                  />
                </Stack>
                <Slider
                  min={0}
                  max={60}
                  step={0.5}
                  value={taxRate > 60 ? 60 : taxRate}
                  onChange={(_, val) => setTaxRate(val as number)}
                  valueLabelDisplay="auto"
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inputs;
