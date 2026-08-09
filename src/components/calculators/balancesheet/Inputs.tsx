import React from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  Stack,
  Slider,
  Tooltip,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  useBalanceSheet,
  getScaleSuffix,
  ScaleUnit,
} from "./BalanceSheetContext";

export const Inputs: React.FC = () => {
  const {
    scaleUnit,
    setScaleUnit,
    cash,
    setCash,
    totalDebt,
    setTotalDebt,
    currentAssets,
    setCurrentAssets,
    currentLiabilities,
    setCurrentLiabilities,
    totalEquity,
    setTotalEquity,
    retainedEarnings,
    setRetainedEarnings,
    goodwillAndIntangibles,
    setGoodwillAndIntangibles,
    totalAssets,
    setTotalAssets,
    monthlyOpEx,
    setMonthlyOpEx,
  } = useBalanceSheet();

  const suffix = getScaleSuffix(scaleUnit);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Top Header & Radio Group Scale Selector */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        sx={{ mb: 3, pb: 2, borderBottom: "1px solid #f1f5f9" }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e293b" }}>
          Balance Sheet Figures & Scale Sliders
        </Typography>

        {/* Radio Button Group for Scale Units */}
        <FormControl component="fieldset">
          <Stack direction="row" spacing={1} alignItems="center">
            <FormLabel
              component="legend"
              sx={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#475569",
                mr: 1,
                textTransform: "uppercase",
              }}
            >
              Scale Unit:
            </FormLabel>
            <RadioGroup
              row
              name="scale-unit-radio-group"
              value={scaleUnit}
              onChange={(e) => setScaleUnit(e.target.value as ScaleUnit)}
            >
              <FormControlLabel
                value="thousands"
                control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Thousands ($1K)
                  </Typography>
                }
              />
              <FormControlLabel
                value="millions"
                control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Millions ($1M)
                  </Typography>
                }
              />
              <FormControlLabel
                value="billions"
                control={<Radio size="small" sx={{ color: "#0284c7" }} />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Billions ($1B)
                  </Typography>
                }
              />
            </RadioGroup>
          </Stack>
        </FormControl>
      </Stack>

      <Grid container spacing={3.5}>
        {/* 1. Cash & Equivalents */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  1. Cash & Equivalents
                </Typography>
                <Tooltip title="Liquid cash, money market funds, and short-term Treasuries.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${cash} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#e0f2fe",
                  color: "#0369a1",
                }}
              />
            </Stack>
            <Slider
              min={0}
              max={Math.max(500, cash * 1.2)}
              step={1}
              value={cash}
              onChange={(_, val) => setCash(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#0284c7" }}
            />
          </Box>
        </Grid>

        {/* 2. Total Debt */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  2. Total Debt (Short + Long)
                </Typography>
                <Tooltip title="Total interest-bearing debt including loans, bonds, and credit lines.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${totalDebt} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#fee2e2",
                  color: "#b91c1c",
                }}
              />
            </Stack>
            <Slider
              min={0}
              max={Math.max(500, totalDebt * 1.2)}
              step={1}
              value={totalDebt}
              onChange={(_, val) => setTotalDebt(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#dc2626" }}
            />
          </Box>
        </Grid>

        {/* 3. Current Assets */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  3. Current Assets
                </Typography>
                <Tooltip title="Assets expected to be converted into cash within 12 months (cash, receivables, inventory).">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${currentAssets} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#e0f2fe",
                  color: "#0369a1",
                }}
              />
            </Stack>
            <Slider
              min={0}
              max={Math.max(500, currentAssets * 1.2)}
              step={1}
              value={currentAssets}
              onChange={(_, val) => setCurrentAssets(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#0284c7" }}
            />
          </Box>
        </Grid>

        {/* 4. Current Liabilities */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  4. Current Liabilities
                </Typography>
                <Tooltip title="Short-term obligations due within 12 months (payables, short debt, accrued expenses).">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${currentLiabilities} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#fef3c7",
                  color: "#b45309",
                }}
              />
            </Stack>
            <Slider
              min={0}
              max={Math.max(300, currentLiabilities * 1.2)}
              step={1}
              value={currentLiabilities}
              onChange={(_, val) => setCurrentLiabilities(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#d97706" }}
            />
          </Box>
        </Grid>

        {/* 5. Total Equity */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  5. Shareholders' Equity
                </Typography>
                <Tooltip title="Net book value of the company (Total Assets - Total Liabilities).">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${totalEquity} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#dcfce7",
                  color: "#15803d",
                }}
              />
            </Stack>
            <Slider
              min={-100}
              max={Math.max(500, totalEquity * 1.2)}
              step={1}
              value={totalEquity}
              onChange={(_, val) => setTotalEquity(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#16a34a" }}
            />
          </Box>
        </Grid>

        {/* 6. Retained Earnings */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  6. Retained Earnings
                </Typography>
                <Tooltip title="Cumulative historical profits retained in the company since inception.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${retainedEarnings} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#f3e8ff",
                  color: "#6b21a8",
                }}
              />
            </Stack>
            <Slider
              min={-150}
              max={Math.max(500, retainedEarnings * 1.2)}
              step={1}
              value={retainedEarnings}
              onChange={(_, val) => setRetainedEarnings(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#7c3aed" }}
            />
          </Box>
        </Grid>

        {/* 7. Goodwill & Intangibles */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  7. Goodwill & Intangibles
                </Typography>
                <Tooltip title="Non-physical assets from acquisition premiums, patents, and trademarks.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${goodwillAndIntangibles} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#ffe4e6",
                  color: "#be123c",
                }}
              />
            </Stack>
            <Slider
              min={0}
              max={Math.max(300, goodwillAndIntangibles * 1.2)}
              step={1}
              value={goodwillAndIntangibles}
              onChange={(_, val) => setGoodwillAndIntangibles(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#e11d48" }}
            />
          </Box>
        </Grid>

        {/* 8. Total Assets */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  8. Total Assets
                </Typography>
                <Tooltip title="Total gross balance sheet assets.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${totalAssets} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#cff4fc",
                  color: "#087990",
                }}
              />
            </Stack>
            <Slider
              min={0}
              max={Math.max(1000, totalAssets * 1.2)}
              step={5}
              value={totalAssets}
              onChange={(_, val) => setTotalAssets(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#0891b2" }}
            />
          </Box>
        </Grid>

        {/* 9. Monthly Operating Expenses */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: 1.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  9. Monthly Cash OpEx
                </Typography>
                <Tooltip title="Average monthly cash operating costs (payroll, rent, SG&A) to compute cash runway.">
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "#64748b", cursor: "pointer", fontSize: 16 }}
                  />
                </Tooltip>
              </Stack>
              <Chip
                label={`$${monthlyOpEx} ${suffix}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#ffedd5",
                  color: "#c2410c",
                }}
              />
            </Stack>
            <Slider
              min={1}
              max={Math.max(100, monthlyOpEx * 1.2)}
              step={1}
              value={monthlyOpEx}
              onChange={(_, val) => setMonthlyOpEx(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `$${val} ${suffix}`}
              sx={{ color: "#ea580c" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Inputs;
