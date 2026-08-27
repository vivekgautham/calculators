import React from "react";
import {
  TextField,
  Stack,
  Paper,
  Typography,
  Box,
  Slider,
  Grid,
  Chip,
  Tooltip,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useGrowthTarget } from "./GrowthTargetContext";

const formatCompactCurrency = (val: number): string => {
  if (val >= 1e9) {
    return `$${(val / 1e9).toFixed(val % 1e9 === 0 ? 0 : 1)}B`;
  }
  if (val >= 1e6) {
    return `$${(val / 1e6).toFixed(val % 1e6 === 0 ? 0 : 1)}M`;
  }
  if (val >= 1e3) {
    return `$${(val / 1e3).toFixed(val % 1e3 === 0 ? 0 : 1)}K`;
  }
  return `$${val.toLocaleString()}`;
};

const CURRENT_PRESETS = [
  { label: "$100K", value: 100000 },
  { label: "$500K", value: 500000 },
  { label: "$1M", value: 1000000 },
  { label: "$2M", value: 2000000 },
  { label: "$5M", value: 5000000 },
  { label: "$10M", value: 10000000 },
];

const YEAR_PRESETS = [1, 3, 5, 10, 15, 20, 30];

const Inputs: React.FC = () => {
  const {
    currentAmount,
    setCurrentAmount,
    targetAmount,
    setTargetAmount,
    years,
    setYears,
    requiredRate,
  } = useGrowthTarget();

  // Dynamic slider ranges to accommodate both small and large values
  const currentMax = Math.max(
    10000000,
    Math.ceil((currentAmount * 1.5) / 100000) * 100000,
  );
  const targetMax = Math.max(
    20000000,
    Math.ceil((targetAmount * 1.5) / 500000) * 500000,
  );

  const multiple = currentAmount > 0 ? targetAmount / currentAmount : 0;
  const growthAmount = targetAmount - currentAmount;
  const growthPercentage =
    currentAmount > 0 ? (growthAmount / currentAmount) * 100 : 0;

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#1a2035" }}>
            Growth Parameters & Sliders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adjust initial capital, financial target, and investment timeframe
          </Typography>
        </Box>

        {/* Live Growth Summary Pill */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: { xs: 1.5, sm: 0 }, flexWrap: "wrap", gap: 1 }}
        >
          <Chip
            icon={<TrendingUpIcon />}
            label={`${multiple.toFixed(2)}x Target Multiple`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: "bold" }}
          />
          <Chip
            label={`CAGR: ${requiredRate.toFixed(2)}%/yr`}
            color={
              requiredRate > 50
                ? "warning"
                : requiredRate < 0
                  ? "error"
                  : "success"
            }
            sx={{ fontWeight: "bold" }}
          />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Parameter 1: Current Amount */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccountBalanceWalletIcon color="primary" fontSize="small" />
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ color: "#1a2035" }}
                  >
                    Current Amount (N₀)
                  </Typography>
                </Stack>
                <Tooltip title="Your starting balance or current portfolio capital.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "text.secondary", cursor: "pointer" }}
                  />
                </Tooltip>
              </Stack>

              <TextField
                size="small"
                type="number"
                fullWidth
                value={currentAmount || ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentAmount(isNaN(val) || val < 0 ? 0 : val);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, step: 10000 }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ px: 1 }}>
                <Slider
                  min={0}
                  max={currentMax}
                  step={currentMax <= 1000000 ? 10000 : 50000}
                  value={Math.min(currentAmount, currentMax)}
                  onChange={(_, val) => setCurrentAmount(val as number)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatCompactCurrency}
                />
              </Box>

              {/* Quick Presets */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5, mt: 1 }}
              >
                Quick Presets:
              </Typography>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.5 }}>
                {CURRENT_PRESETS.map((p) => (
                  <Chip
                    key={p.value}
                    label={p.label}
                    size="small"
                    clickable
                    color={currentAmount === p.value ? "primary" : "default"}
                    variant={currentAmount === p.value ? "filled" : "outlined"}
                    onClick={() => setCurrentAmount(p.value)}
                    sx={{ fontSize: "11px", height: 24 }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Parameter 2: Target Amount */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrackChangesIcon color="secondary" fontSize="small" />
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ color: "#1a2035" }}
                  >
                    Target Amount (Nₜ)
                  </Typography>
                </Stack>
                <Tooltip title="Your desired ending capital target amount.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "text.secondary", cursor: "pointer" }}
                  />
                </Tooltip>
              </Stack>

              <TextField
                size="small"
                type="number"
                fullWidth
                value={targetAmount || ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTargetAmount(isNaN(val) || val < 0 ? 0 : val);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, step: 50000 }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ px: 1 }}>
                <Slider
                  min={0}
                  max={targetMax}
                  step={targetMax <= 5000000 ? 50000 : 100000}
                  value={Math.min(targetAmount, targetMax)}
                  onChange={(_, val) => setTargetAmount(val as number)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatCompactCurrency}
                />
              </Box>

              {/* Quick Multiplier Presets */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5, mt: 1 }}
              >
                Target Multiples:
              </Typography>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.5 }}>
                {[2, 3, 5, 10].map((mult) => {
                  const targetVal = currentAmount * mult;
                  return (
                    <Chip
                      key={mult}
                      label={`${mult}x (${formatCompactCurrency(targetVal)})`}
                      size="small"
                      clickable
                      color={
                        targetAmount === targetVal ? "secondary" : "default"
                      }
                      variant={
                        targetAmount === targetVal ? "filled" : "outlined"
                      }
                      onClick={() => setTargetAmount(targetVal)}
                      sx={{ fontSize: "11px", height: 24 }}
                    />
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Parameter 3: Time Period (Years) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon color="info" fontSize="small" />
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ color: "#1a2035" }}
                  >
                    Time Horizon
                  </Typography>
                </Stack>
                <Tooltip title="Number of years available to reach your target balance.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "text.secondary", cursor: "pointer" }}
                  />
                </Tooltip>
              </Stack>

              <TextField
                size="small"
                type="number"
                fullWidth
                value={years || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setYears(isNaN(val) || val < 1 ? 1 : val);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {years === 1 ? "Year" : "Years"}
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 1, max: 50, step: 1 }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ px: 1 }}>
                <Slider
                  min={1}
                  max={50}
                  step={1}
                  value={Math.min(years, 50)}
                  onChange={(_, val) => setYears(val as number)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(val) => `${val}Y`}
                />
              </Box>

              {/* Quick Year Presets */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5, mt: 1 }}
              >
                Common Horizons:
              </Typography>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.5 }}>
                {YEAR_PRESETS.map((y) => (
                  <Chip
                    key={y}
                    label={`${y}Y`}
                    size="small"
                    clickable
                    color={years === y ? "info" : "default"}
                    variant={years === y ? "filled" : "outlined"}
                    onClick={() => setYears(y)}
                    sx={{ fontSize: "11px", height: 24 }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Target Progress / Growth Breakdown Footer */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: "#f8f9fa",
          borderRadius: 1.5,
          border: "1px solid #e2e8f0",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-around"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Initial Capital:
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold">
              ${currentAmount.toLocaleString()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Total Growth Required:
            </Typography>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ color: growthAmount >= 0 ? "success.main" : "error.main" }}
            >
              {growthAmount >= 0 ? "+" : ""}${growthAmount.toLocaleString()} (
              {growthPercentage >= 0 ? "+" : ""}
              {growthPercentage.toFixed(1)}%)
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Target Goal:
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold">
              ${targetAmount.toLocaleString()} in {years}{" "}
              {years === 1 ? "year" : "years"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Annual Compounding Rate (CAGR):
            </Typography>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ color: requiredRate >= 0 ? "primary.main" : "error.main" }}
            >
              {requiredRate.toFixed(2)}% / year
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default Inputs;
