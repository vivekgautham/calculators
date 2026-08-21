import React from "react";
import { Paper, Typography, Grid, Stack, Chip, Box } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { usePEValuation } from "./PEValuationContext";

export const SummaryCards: React.FC = () => {
  const {
    effectiveTtmEps,
    ttmPe,
    forwardPe,
    impliedEpsGrowthPct,
    ttmEarningsYieldPct,
    forwardEarningsYieldPct,
    pegRatio,
    peMultipleDiff,
    peMultipleDiffBps,
    benchmarkPe,
  } = usePEValuation();

  const isExpanding = peMultipleDiff < 0; // Forward PE > TTM PE (earnings declining)
  const isContracting = peMultipleDiff > 0; // Forward PE < TTM PE (earnings growing)

  // Premium vs Benchmark
  const premiumVsBenchmarkPct =
    benchmarkPe > 0 ? (forwardPe / benchmarkPe - 1) * 100 : 0;

  return (
    <Grid container spacing={3} sx={{ my: 0.5 }}>
      {/* 1. TTM P/E Ratio Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #cbd5e1",
            borderTop: "4px solid #d97706",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Trailing P/E Ratio (TTM)
              </Typography>
              <AccountBalanceIcon sx={{ color: "#d97706" }} />
            </Stack>

            <Typography
              variant="h3"
              sx={{ fontWeight: "800", color: "#1e293b", my: 1 }}
            >
              {ttmPe > 0 ? `${ttmPe.toFixed(2)}x` : "N/A"}
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            gap={1}
            sx={{ mt: 2 }}
          >
            <Chip
              label={`TTM Yield: ${ttmEarningsYieldPct.toFixed(2)}%`}
              size="small"
              sx={{
                fontWeight: "bold",
                bgcolor: "#fef3c7",
                color: "#b45309",
              }}
            />
            <Chip
              label={`TTM EPS: $${effectiveTtmEps.toFixed(2)}`}
              size="small"
              sx={{
                fontWeight: "bold",
                bgcolor: "#f1f5f9",
                color: "#475569",
              }}
            />
          </Stack>
        </Paper>
      </Grid>

      {/* 2. Forward P/E Ratio Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #cbd5e1",
            borderTop: "4px solid #16a34a",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Forward P/E Ratio (NTM)
              </Typography>
              <ShowChartIcon sx={{ color: "#16a34a" }} />
            </Stack>

            <Typography
              variant="h3"
              sx={{ fontWeight: "800", color: "#1e293b", my: 1 }}
            >
              {forwardPe > 0 ? `${forwardPe.toFixed(2)}x` : "N/A"}
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            gap={1}
            sx={{ mt: 2 }}
          >
            <Chip
              label={`Forward Yield: ${forwardEarningsYieldPct.toFixed(2)}%`}
              size="small"
              sx={{
                fontWeight: "bold",
                bgcolor: "#dcfce7",
                color: "#15803d",
              }}
            />
            <Chip
              label={`Implied Growth: ${impliedEpsGrowthPct >= 0 ? "+" : ""}${impliedEpsGrowthPct.toFixed(1)}%`}
              size="small"
              sx={{
                fontWeight: "bold",
                bgcolor: impliedEpsGrowthPct >= 0 ? "#e0f2fe" : "#fee2e2",
                color: impliedEpsGrowthPct >= 0 ? "#0369a1" : "#b91c1c",
              }}
            />
          </Stack>
        </Paper>
      </Grid>

      {/* 3. Valuation Differential & PEG Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #cbd5e1",
            borderTop: `4px solid ${isContracting ? "#0284c7" : isExpanding ? "#dc2626" : "#64748b"}`,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Multiple Delta (TTM vs Forward)
              </Typography>
              {isContracting ? (
                <TrendingDownIcon sx={{ color: "#0284c7" }} />
              ) : (
                <TrendingUpIcon sx={{ color: "#dc2626" }} />
              )}
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: "800",
                color: isContracting
                  ? "#0284c7"
                  : isExpanding
                    ? "#dc2626"
                    : "#1e293b",
                my: 1,
              }}
            >
              {peMultipleDiff > 0
                ? `-${peMultipleDiff.toFixed(2)}x`
                : `+${Math.abs(peMultipleDiff).toFixed(2)}x`}
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            gap={1}
            sx={{ mt: 2 }}
          >
            <Chip
              label={
                isContracting
                  ? `Contraction (-${Math.abs(peMultipleDiffBps).toFixed(0)} bps)`
                  : isExpanding
                    ? `Expansion (+${Math.abs(peMultipleDiffBps).toFixed(0)} bps)`
                    : "Flat"
              }
              size="small"
              sx={{
                fontWeight: "bold",
                bgcolor: isContracting ? "#e0f2fe" : "#fee2e2",
                color: isContracting ? "#0369a1" : "#b91c1c",
              }}
            />
            <Chip
              label={`PEG Ratio: ${pegRatio > 0 ? pegRatio.toFixed(2) : "N/A"}`}
              size="small"
              sx={{
                fontWeight: "bold",
                bgcolor:
                  pegRatio <= 1.0 && pegRatio > 0 ? "#dcfce7" : "#f3e8ff",
                color: pegRatio <= 1.0 && pegRatio > 0 ? "#15803d" : "#6b21a8",
              }}
            />
            <Chip
              label={`vs Sector: ${premiumVsBenchmarkPct >= 0 ? "+" : ""}${premiumVsBenchmarkPct.toFixed(1)}%`}
              size="small"
              sx={{
                fontWeight: "bold",
                bgcolor: "#f1f5f9",
                color: "#334155",
              }}
            />
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
