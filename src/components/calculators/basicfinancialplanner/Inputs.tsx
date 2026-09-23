import React from "react";
import {
  TextField,
  Box,
  Grid,
  InputAdornment,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useBasicFinancialPlanner } from "./BasicFinancialPlannerContext";

const CORPUS_PRESETS = [
  { label: "$500K", value: 500000 },
  { label: "$1M", value: 1000000 },
  { label: "$2.5M", value: 2500000 },
  { label: "$5M", value: 5000000 },
  { label: "$10M", value: 10000000 },
  { label: "$20M", value: 20000000 },
];

const YEARS_PRESETS = [
  { label: "15 yrs", value: 15 },
  { label: "20 yrs", value: 20 },
  { label: "25 yrs", value: 25 },
  { label: "30 yrs", value: 30 },
  { label: "35 yrs", value: 35 },
  { label: "40 yrs", value: 40 },
  { label: "50 yrs", value: 50 },
];

const EXPENSE_PRESETS = [
  { label: "$30K", value: 30000 },
  { label: "$50K", value: 50000 },
  { label: "$75K", value: 75000 },
  { label: "$100K", value: 100000 },
  { label: "$150K", value: 150000 },
  { label: "$200K", value: 200000 },
];

const INFLATION_PRESETS = [
  { label: "2%", value: 2 },
  { label: "3%", value: 3 },
  { label: "4%", value: 4 },
  { label: "6%", value: 6 },
  { label: "8%", value: 8 },
  { label: "10%", value: 10 },
];

const GROWTH_PRESETS = [
  { label: "5%", value: 5 },
  { label: "7%", value: 7 },
  { label: "8%", value: 8 },
  { label: "10%", value: 10 },
  { label: "12%", value: 12 },
  { label: "15%", value: 15 },
];

const TAX_PRESETS = [
  { label: "0% (Roth)", value: 0 },
  { label: "10%", value: 10 },
  { label: "15%", value: 15 },
  { label: "20%", value: 20 },
  { label: "25%", value: 25 },
  { label: "30%", value: 30 },
];

const SCENARIO_PRESETS = [
  {
    name: "Default Plan",
    values: {
      corpus: 5000000,
      years: 35,
      expense: 50000,
      inflation: 6,
      growth: 10,
      tax: 15,
    },
  },
  {
    name: "Conservative FIRE",
    values: {
      corpus: 3000000,
      years: 30,
      expense: 75000,
      inflation: 3,
      growth: 6,
      tax: 20,
    },
  },
  {
    name: "Fat FIRE",
    values: {
      corpus: 10000000,
      years: 40,
      expense: 150000,
      inflation: 4,
      growth: 10,
      tax: 25,
    },
  },
  {
    name: "Lean FIRE",
    values: {
      corpus: 1000000,
      years: 35,
      expense: 35000,
      inflation: 3,
      growth: 8,
      tax: 10,
    },
  },
  {
    name: "Tax-Free Roth",
    values: {
      corpus: 2500000,
      years: 30,
      expense: 60000,
      inflation: 3,
      growth: 9,
      tax: 0,
    },
  },
];

const Inputs: React.FC = () => {
  const {
    corpusAmount,
    setCorpusAmount,
    yearsToGo,
    setYearsToGo,
    annualExpense,
    setAnnualExpense,
    inflationRate,
    setInflationRate,
    corpusGrowthRate,
    setCorpusGrowthRate,
    withdrawalTaxRate,
    setWithdrawalTaxRate,
  } = useBasicFinancialPlanner();

  const handleApplyScenario = (scenario: (typeof SCENARIO_PRESETS)[0]) => {
    setCorpusAmount(scenario.values.corpus);
    setYearsToGo(scenario.values.years);
    setAnnualExpense(scenario.values.expense);
    setInflationRate(scenario.values.inflation);
    setCorpusGrowthRate(scenario.values.growth);
    setWithdrawalTaxRate(scenario.values.tax);
  };

  const isScenarioActive = (scenario: (typeof SCENARIO_PRESETS)[0]) =>
    corpusAmount === scenario.values.corpus &&
    yearsToGo === scenario.values.years &&
    annualExpense === scenario.values.expense &&
    inflationRate === scenario.values.inflation &&
    corpusGrowthRate === scenario.values.growth &&
    withdrawalTaxRate === scenario.values.tax;

  return (
    <Box sx={{ p: 2 }}>
      {/* Top Scenario Presets Bar */}
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{ mb: 2 }}
      >
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ mr: 0.5 }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 18, color: "#0284c7" }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Scenario Presets:
          </Typography>
        </Stack>
        {SCENARIO_PRESETS.map((scenario) => {
          const isActive = isScenarioActive(scenario);
          return (
            <Chip
              key={scenario.name}
              label={scenario.name}
              size="small"
              clickable
              onClick={() => handleApplyScenario(scenario)}
              sx={{
                fontWeight: 700,
                fontSize: "12px",
                height: 26,
                cursor: "pointer",
                bgcolor: isActive ? "#0284c7" : "#f1f5f9",
                color: isActive ? "#ffffff" : "#334155",
                border: isActive ? "1px solid #0284c7" : "1px solid #cbd5e1",
                "&:hover": {
                  bgcolor: isActive ? "#0369a1" : "#e2e8f0",
                },
              }}
            />
          );
        })}
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      {/* 6 Input Cards with Dedicated Preset Chips */}
      <Grid container spacing={2}>
        {/* 1. Corpus Amount */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              height: "100%",
            }}
          >
            <TextField
              label="Corpus Amount"
              type="number"
              value={corpusAmount}
              onChange={(e) =>
                setCorpusAmount(Math.max(0, Number(e.target.value)))
              }
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
              sx={{ bgcolor: "#ffffff", borderRadius: 1 }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "11px",
                  display: "block",
                  mb: 0.6,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Presets:
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 0.6 }}
              >
                {CORPUS_PRESETS.map((preset) => {
                  const isSelected = corpusAmount === preset.value;
                  return (
                    <Chip
                      key={preset.value}
                      label={preset.label}
                      size="small"
                      clickable
                      onClick={() => setCorpusAmount(preset.value)}
                      sx={{
                        fontWeight: 600,
                        fontSize: "11px",
                        height: 24,
                        cursor: "pointer",
                        bgcolor: isSelected ? "#0284c7" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#334155",
                        border: isSelected
                          ? "1px solid #0284c7"
                          : "1px solid #cbd5e1",
                        "&:hover": {
                          bgcolor: isSelected ? "#0369a1" : "#e2e8f0",
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Grid>

        {/* 2. Years To Go */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              height: "100%",
            }}
          >
            <TextField
              label="Years To Go"
              type="number"
              value={yearsToGo}
              onChange={(e) =>
                setYearsToGo(Math.max(1, Number(e.target.value)))
              }
              fullWidth
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">yrs</InputAdornment>
                  ),
                },
              }}
              sx={{ bgcolor: "#ffffff", borderRadius: 1 }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "11px",
                  display: "block",
                  mb: 0.6,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Presets:
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 0.6 }}
              >
                {YEARS_PRESETS.map((preset) => {
                  const isSelected = yearsToGo === preset.value;
                  return (
                    <Chip
                      key={preset.value}
                      label={preset.label}
                      size="small"
                      clickable
                      onClick={() => setYearsToGo(preset.value)}
                      sx={{
                        fontWeight: 600,
                        fontSize: "11px",
                        height: 24,
                        cursor: "pointer",
                        bgcolor: isSelected ? "#0284c7" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#334155",
                        border: isSelected
                          ? "1px solid #0284c7"
                          : "1px solid #cbd5e1",
                        "&:hover": {
                          bgcolor: isSelected ? "#0369a1" : "#e2e8f0",
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Grid>

        {/* 3. Annual Living Expense */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              height: "100%",
            }}
          >
            <TextField
              label="Annual Living Expense"
              type="number"
              value={annualExpense}
              onChange={(e) =>
                setAnnualExpense(Math.max(0, Number(e.target.value)))
              }
              fullWidth
              size="small"
              helperText="Net living expenses needed per year"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
              sx={{ bgcolor: "#ffffff", borderRadius: 1 }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "11px",
                  display: "block",
                  mb: 0.6,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Presets:
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 0.6 }}
              >
                {EXPENSE_PRESETS.map((preset) => {
                  const isSelected = annualExpense === preset.value;
                  return (
                    <Chip
                      key={preset.value}
                      label={preset.label}
                      size="small"
                      clickable
                      onClick={() => setAnnualExpense(preset.value)}
                      sx={{
                        fontWeight: 600,
                        fontSize: "11px",
                        height: 24,
                        cursor: "pointer",
                        bgcolor: isSelected ? "#0284c7" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#334155",
                        border: isSelected
                          ? "1px solid #0284c7"
                          : "1px solid #cbd5e1",
                        "&:hover": {
                          bgcolor: isSelected ? "#0369a1" : "#e2e8f0",
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Grid>

        {/* 4. Inflation Rate */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              height: "100%",
            }}
          >
            <TextField
              label="Inflation Rate"
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              fullWidth
              size="small"
              helperText="Annual expected inflation rate"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                },
              }}
              sx={{ bgcolor: "#ffffff", borderRadius: 1 }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "11px",
                  display: "block",
                  mb: 0.6,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Presets:
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 0.6 }}
              >
                {INFLATION_PRESETS.map((preset) => {
                  const isSelected = inflationRate === preset.value;
                  return (
                    <Chip
                      key={preset.value}
                      label={preset.label}
                      size="small"
                      clickable
                      onClick={() => setInflationRate(preset.value)}
                      sx={{
                        fontWeight: 600,
                        fontSize: "11px",
                        height: 24,
                        cursor: "pointer",
                        bgcolor: isSelected ? "#0284c7" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#334155",
                        border: isSelected
                          ? "1px solid #0284c7"
                          : "1px solid #cbd5e1",
                        "&:hover": {
                          bgcolor: isSelected ? "#0369a1" : "#e2e8f0",
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Grid>

        {/* 5. Corpus Growth Rate */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              height: "100%",
            }}
          >
            <TextField
              label="Corpus Growth Rate"
              type="number"
              value={corpusGrowthRate}
              onChange={(e) => setCorpusGrowthRate(Number(e.target.value))}
              fullWidth
              size="small"
              helperText="Annual nominal portfolio return"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                },
              }}
              sx={{ bgcolor: "#ffffff", borderRadius: 1 }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "11px",
                  display: "block",
                  mb: 0.6,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Presets:
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 0.6 }}
              >
                {GROWTH_PRESETS.map((preset) => {
                  const isSelected = corpusGrowthRate === preset.value;
                  return (
                    <Chip
                      key={preset.value}
                      label={preset.label}
                      size="small"
                      clickable
                      onClick={() => setCorpusGrowthRate(preset.value)}
                      sx={{
                        fontWeight: 600,
                        fontSize: "11px",
                        height: 24,
                        cursor: "pointer",
                        bgcolor: isSelected ? "#0284c7" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#334155",
                        border: isSelected
                          ? "1px solid #0284c7"
                          : "1px solid #cbd5e1",
                        "&:hover": {
                          bgcolor: isSelected ? "#0369a1" : "#e2e8f0",
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Grid>

        {/* 6. Withdrawal Tax Rate */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              height: "100%",
            }}
          >
            <TextField
              label="Withdrawal Tax Rate"
              type="number"
              value={withdrawalTaxRate}
              onChange={(e) =>
                setWithdrawalTaxRate(
                  Math.min(90, Math.max(0, Number(e.target.value))),
                )
              }
              fullWidth
              size="small"
              helperText="Tax deducted upon withdrawal"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                },
              }}
              sx={{ bgcolor: "#ffffff", borderRadius: 1 }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "11px",
                  display: "block",
                  mb: 0.6,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Presets:
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 0.6 }}
              >
                {TAX_PRESETS.map((preset) => {
                  const isSelected = withdrawalTaxRate === preset.value;
                  return (
                    <Chip
                      key={preset.value}
                      label={preset.label}
                      size="small"
                      clickable
                      onClick={() => setWithdrawalTaxRate(preset.value)}
                      sx={{
                        fontWeight: 600,
                        fontSize: "11px",
                        height: 24,
                        cursor: "pointer",
                        bgcolor: isSelected ? "#0284c7" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#334155",
                        border: isSelected
                          ? "1px solid #0284c7"
                          : "1px solid #cbd5e1",
                        "&:hover": {
                          bgcolor: isSelected ? "#0369a1" : "#e2e8f0",
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inputs;
