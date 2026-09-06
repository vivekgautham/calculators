import React from "react";
import { Paper, Typography, Grid, Stack, Chip, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import GavelIcon from "@mui/icons-material/Gavel";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShieldIcon from "@mui/icons-material/Shield";
import { useDutchAuction } from "./DutchAuctionContext";

export const AuctionMetrics: React.FC = () => {
  const { auctionResults, formatCurrency, formatYield, whenIssuedYield } =
    useDutchAuction();

  const {
    stopOutYield,
    lowYield,
    medianYield,
    bidToCoverRatio,
    tailBps,
    allotmentAtHighPct,
    amountAwardedAtHigh,
    totalBidsAtHigh,
    targetOfferingAmount,
    totalTenderedAmount,
    nonCompetitiveAmount,
    isFullyCovered,
  } = auctionResults;

  const isStoppedThrough = tailBps !== null && tailBps < -0.01;
  const isTailed = tailBps !== null && tailBps > 0.01;
  const isOnScrews = tailBps !== null && Math.abs(tailBps) <= 0.01;

  const btcStatusColor =
    bidToCoverRatio >= 2.7
      ? "#16a34a"
      : bidToCoverRatio >= 2.3
        ? "#d97706"
        : "#dc2626";

  return (
    <Grid container spacing={2.5}>
      {/* 1. Stop-Out Yield (High Clearing Yield) */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #cbd5e1",
            borderTop: "4px solid #2563eb",
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
                variant="caption"
                sx={{
                  fontWeight: "800",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Stop-Out (High) Yield
              </Typography>
              <GavelIcon sx={{ color: "#2563eb", fontSize: 22 }} />
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: "800",
                color: "#1e293b",
                my: 0.5,
                fontFamily: "monospace",
              }}
            >
              {stopOutYield > 0 ? formatYield(stopOutYield) : "N/A"}
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Single-price clearing yield awarded to all accepted bids
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            <Chip
              label={`Low: ${formatYield(lowYield)}`}
              size="small"
              sx={{ fontWeight: "700", bgcolor: "#eff6ff", color: "#1d4ed8" }}
            />
            <Chip
              label={`Median: ${formatYield(medianYield)}`}
              size="small"
              sx={{ fontWeight: "700", bgcolor: "#f1f5f9", color: "#475569" }}
            />
          </Stack>
        </Paper>
      </Grid>

      {/* 2. Bid-to-Cover (BTC) Demand Metric */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #cbd5e1",
            borderTop: `4px solid ${btcStatusColor}`,
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
                variant="caption"
                sx={{
                  fontWeight: "800",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Bid-to-Cover Ratio
              </Typography>
              <ShieldIcon sx={{ color: btcStatusColor, fontSize: 22 }} />
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: "800",
                color: btcStatusColor,
                my: 0.5,
                fontFamily: "monospace",
              }}
            >
              {bidToCoverRatio.toFixed(2)}x
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b" }}>
              {isFullyCovered
                ? `${formatCurrency(totalTenderedAmount)} tendered for ${formatCurrency(targetOfferingAmount)} offering`
                : "Auction Under-Subscribed (Tendered < Target)"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            <Chip
              label={
                bidToCoverRatio >= 2.7
                  ? "Strong Demand"
                  : bidToCoverRatio >= 2.3
                    ? "Normal Demand"
                    : "Soft Demand"
              }
              size="small"
              sx={{
                fontWeight: "800",
                bgcolor:
                  bidToCoverRatio >= 2.7
                    ? "#dcfce7"
                    : bidToCoverRatio >= 2.3
                      ? "#fef3c7"
                      : "#fee2e2",
                color:
                  bidToCoverRatio >= 2.7
                    ? "#15803d"
                    : bidToCoverRatio >= 2.3
                      ? "#b45309"
                      : "#b91c1c",
              }}
            />
            <Chip
              label={`Non-Comp: ${formatCurrency(nonCompetitiveAmount)}`}
              size="small"
              sx={{ fontWeight: "700", bgcolor: "#f1f5f9", color: "#475569" }}
            />
          </Stack>
        </Paper>
      </Grid>

      {/* 3. Auction Tail / Stop-Through (vs When-Issued) */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #cbd5e1",
            borderTop: `4px solid ${
              isStoppedThrough ? "#16a34a" : isTailed ? "#dc2626" : "#0284c7"
            }`,
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
                variant="caption"
                sx={{
                  fontWeight: "800",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Auction Tail (vs WI Yield)
              </Typography>
              {isStoppedThrough ? (
                <TrendingDownIcon sx={{ color: "#16a34a", fontSize: 22 }} />
              ) : isTailed ? (
                <TrendingUpIcon sx={{ color: "#dc2626", fontSize: 22 }} />
              ) : (
                <AccountBalanceIcon sx={{ color: "#0284c7", fontSize: 22 }} />
              )}
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: "800",
                color: isStoppedThrough
                  ? "#16a34a"
                  : isTailed
                    ? "#dc2626"
                    : "#0284c7",
                my: 0.5,
                fontFamily: "monospace",
              }}
            >
              {tailBps !== null
                ? `${tailBps >= 0 ? "+" : ""}${tailBps.toFixed(1)} bps`
                : "N/A"}
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b" }}>
              {whenIssuedYield !== null
                ? `When-Issued Benchmark Yield: ${formatYield(whenIssuedYield)}`
                : "No WI Yield specified"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            <Chip
              label={
                isStoppedThrough
                  ? "Stopped Through (Aggressive)"
                  : isTailed
                    ? "Tailed (Weak Concession)"
                    : isOnScrews
                      ? "On the Screws (In-Line)"
                      : "No WI Set"
              }
              size="small"
              sx={{
                fontWeight: "800",
                bgcolor: isStoppedThrough
                  ? "#dcfce7"
                  : isTailed
                    ? "#fee2e2"
                    : "#e0f2fe",
                color: isStoppedThrough
                  ? "#15803d"
                  : isTailed
                    ? "#b91c1c"
                    : "#0369a1",
              }}
            />
          </Stack>
        </Paper>
      </Grid>

      {/* 4. High Yield Allotment % (Cutoff Pro-Rata) */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #cbd5e1",
            borderTop: "4px solid #8b5cf6",
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
                variant="caption"
                sx={{
                  fontWeight: "800",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Allotment % at Stop-Out
              </Typography>
              <PieChartIcon sx={{ color: "#8b5cf6", fontSize: 22 }} />
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: "800",
                color: "#1e293b",
                my: 0.5,
                fontFamily: "monospace",
              }}
            >
              {allotmentAtHighPct.toFixed(2)}%
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Pro-rata award for dealers bidding at {formatYield(stopOutYield)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            <Chip
              label={`Awarded: ${formatCurrency(amountAwardedAtHigh)}`}
              size="small"
              sx={{ fontWeight: "700", bgcolor: "#f5f3ff", color: "#6d28d9" }}
            />
            <Chip
              label={`Bid: ${formatCurrency(totalBidsAtHigh)}`}
              size="small"
              sx={{ fontWeight: "700", bgcolor: "#f1f5f9", color: "#475569" }}
            />
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AuctionMetrics;
