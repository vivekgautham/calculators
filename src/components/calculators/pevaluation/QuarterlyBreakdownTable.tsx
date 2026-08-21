import React from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { usePEValuation } from "./PEValuationContext";

const formatCurrency = (val: number) =>
  "$" +
  val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const QuarterlyBreakdownTable: React.FC = () => {
  const {
    mode,
    effectivePrice,
    effectiveTtmEps,
    effectiveForwardEps,
    ttmPe,
    forwardPe,
    impliedEpsGrowthPct,
    ttmEarningsYieldPct,
    forwardEarningsYieldPct,
    pegRatio,
    peMultipleDiff,
    peMultipleDiffBps,
    benchmarkPe,
    ttmNetIncome,
    forwardNetIncome,
  } = usePEValuation();

  const rows = [
    {
      metric: "Per-Share Price / Capitalization",
      ttm: formatCurrency(effectivePrice),
      forward: formatCurrency(effectivePrice),
      delta: "0.0%",
      status: "Flat",
    },
    {
      metric: "Earnings Per Share (EPS)",
      ttm: formatCurrency(effectiveTtmEps),
      forward: formatCurrency(effectiveForwardEps),
      delta: `${impliedEpsGrowthPct >= 0 ? "+" : ""}${impliedEpsGrowthPct.toFixed(2)}%`,
      status: impliedEpsGrowthPct >= 0 ? "Growth" : "Decline",
    },
    ...(mode === "corporate"
      ? [
          {
            metric: "Net Income Total ($)",
            ttm: formatCurrency(ttmNetIncome),
            forward: formatCurrency(forwardNetIncome),
            delta: `${((forwardNetIncome / ttmNetIncome - 1) * 100).toFixed(2)}%`,
            status: forwardNetIncome >= ttmNetIncome ? "Growth" : "Decline",
          },
        ]
      : []),
    {
      metric: "P/E Valuation Multiple",
      ttm: `${ttmPe.toFixed(2)}x`,
      forward: `${forwardPe.toFixed(2)}x`,
      delta: `${peMultipleDiff > 0 ? "-" : "+"}${Math.abs(peMultipleDiff).toFixed(2)}x (${Math.abs(peMultipleDiffBps).toFixed(0)} bps)`,
      status: peMultipleDiff > 0 ? "Contraction" : "Expansion",
    },
    {
      metric: "Earnings Yield (1 / PE %)",
      ttm: `${ttmEarningsYieldPct.toFixed(2)}%`,
      forward: `${forwardEarningsYieldPct.toFixed(2)}%`,
      delta: `+${(forwardEarningsYieldPct - ttmEarningsYieldPct).toFixed(2)}%`,
      status:
        forwardEarningsYieldPct >= ttmEarningsYieldPct
          ? "Accretive"
          : "Dilutive",
    },
    {
      metric: "PEG Ratio (PE / Growth)",
      ttm: "N/A",
      forward: `${pegRatio > 0 ? pegRatio.toFixed(2) : "N/A"}`,
      delta:
        pegRatio <= 1.0 && pegRatio > 0
          ? "Undervalued (<1.0)"
          : "Premium (>1.0)",
      status: pegRatio <= 1.0 && pegRatio > 0 ? "Attractive" : "Full Value",
    },
    {
      metric: "Benchmark Comparison (vs Sector)",
      ttm: `${benchmarkPe.toFixed(1)}x`,
      forward: `${benchmarkPe.toFixed(1)}x`,
      delta: `${forwardPe >= benchmarkPe ? "+" : ""}${((forwardPe / benchmarkPe - 1) * 100).toFixed(1)}%`,
      status: forwardPe >= benchmarkPe ? "Premium" : "Discount",
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        mb: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#1e293b", mb: 2 }}
      >
        Valuation Metrics & Multiple Expansion Matrix
      </Typography>

      <TableContainer component={Box} sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                Financial Metric / Valuation Indicator
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
              >
                Trailing (TTM)
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
              >
                Forward (NTM)
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
              >
                Variance / Delta
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
              >
                Valuation Impact
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isPositive =
                row.status === "Growth" ||
                row.status === "Contraction" ||
                row.status === "Accretive" ||
                row.status === "Attractive" ||
                row.status === "Discount";

              return (
                <TableRow key={row.metric} hover>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e293b" }}>
                    {row.metric}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "#b45309" }}
                  >
                    {row.ttm}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "#15803d" }}
                  >
                    {row.forward}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: isPositive ? "#0284c7" : "#b91c1c",
                    }}
                  >
                    {row.delta}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        bgcolor: isPositive ? "#dcfce7" : "#fee2e2",
                        color: isPositive ? "#15803d" : "#b91c1c",
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default QuarterlyBreakdownTable;
